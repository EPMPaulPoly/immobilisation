import { Feature } from "geojson";
import fs from "fs";
import path from "path";
import { parser,} from "stream-json";
import{pick} from "stream-json/filters/Pick";
import { streamArray } from "stream-json/streamers/StreamArray";
import { PoolClient} from 'pg';
import { TMP_DIR } from "./fileOptions.repositories";

import csvParser from "csv-parser";

export type MulterRequest = Request & {
  file?: Express.Multer.File;
};

export type ColumnMapping = Record<string, string>;
if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR, { recursive: true });



export async function peekCSVColumns(filePath: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
        const stream = fs
            .createReadStream(filePath)
            .pipe(csvParser());

        stream
            .on("data", (row: Record<string, string>) => {
                // csv-parser already used the header row
                const columns = Object.keys(row);

                if (columns.length === 0) {
                    return; // skip empty rows just in case
                }

                stream.destroy(); // stop reading immediately
                resolve(columns);
            })
            .on("end", () => {
                reject("Pas trouvé entête");
            })
            .on("error", (err:any) => {
                console.error("CSV parsing error:", err);
                reject(err);
            });
    });
}

export async function insertCSVFile(
    filePath: string,
    mapping: Record<string, string>,
    tableName: string,
    dbClient: PoolClient,
    geomMapping?:Record<string,any>
): Promise<number> {
    let fileStream:fs.ReadStream|null=null;
    try {
        const BATCH_SIZE = 500;
        let insertedCount = 0;
        let batch: Record<string, any>[] = [];

        await dbClient.query(`DELETE from ${tableName}`);
        fileStream = fs.createReadStream(filePath);

        // Use async iterator to avoid overlapping inserts
        const pipeline = fileStream.pipe(csvParser());
        for await (const value of pipeline) {

            const row: Record<string, any> = {};

            // Map columns from user mapping
            for (const [dbCol, fileCol] of Object.entries(mapping)) {
                const raw = value[fileCol];
                if (raw ===""){
                    row[dbCol]=null
                }else{
                    row[dbCol]= raw
                }
                
            }

            // Add geometry as GeoJSON string
            if (geomMapping){
                for (const [dbCol,fileData] of Object.entries(geomMapping)){
                    if (fileData.type==='Ligne'){
                        if(
                            value[fileData.data[0][0]] !== undefined &&
                            value[fileData.data[0][0]] !== '' && 
                            value[fileData.data[0][1]] !== undefined&& 
                            value[fileData.data[0][1]] !== ''  &&
                            value[fileData.data[1][0]] !== undefined &&
                            value[fileData.data[1][0]] !== '' &&
                            value[fileData.data[1][1]] !== undefined&&
                            value[fileData.data[1][1]] !== ''
                        ){
                            row[dbCol] ={type:'Ligne',data:[
                                    [
                                        value[fileData.data[0][0]],
                                        value[fileData.data[0][1]]
                                    ],[
                                        value[fileData.data[1][0]],
                                        value[fileData.data[1][1]]
                                    ]
                                ]}
                        }else{
                            row[dbCol] = null
                        }
                        console.log(dbCol,row[dbCol])
                    }else{
                        if(value[fileData.data[0]]!== undefined && value[fileData.data[0]]!== '' && value[fileData.data[1]]!==undefined&& value[fileData.data[1]]!==''){
                            row[dbCol] ={type:'Point',data:[value[fileData.data[0]],value[fileData.data[1]]]}
                        }else{
                            row[dbCol] =null
                        }
                        console.log(dbCol,row[dbCol])
                    }
                }

            }
            
            batch.push(row);

            // Insert batch if full
            if (batch.length >= BATCH_SIZE) {
                await insertBatch(batch, tableName, dbClient);
                insertedCount += batch.length;
                batch = [];
                console.log(`Inserted ${insertedCount} so far`)
            }
        }

        // Insert any remaining rows
        if (batch.length > 0) {
            await insertBatch(batch, tableName, dbClient);
            insertedCount += batch.length;
            console.log(`Inserted${insertedCount} total`)
        }

        return insertedCount;
    } catch(err:any){
        console.log('error')
        throw err
    }finally {
        if( fileStream){
            fileStream.close();
        }
    }
}


// Helper: insert a batch of rows
async function insertBatch(
    batch: Record<string, any>[],
    tableName: string,
    dbClient: PoolClient
) {
    try{
        const columns = Object.keys(batch[0]);
        const colNames = columns.map((c) => `"${c}"`).join(",");
        let replaceCount = 1;
        let values:any[]=[]
        const placeholders = batch
            .map((row, i) =>
                `(${columns
                    .map((col, j) =>{
                        if (row[col] && typeof row[col] ==='object' && row[col].type==='Point'){
                            const repCountLocal = replaceCount
                            replaceCount+=2
                            row[col].data.map((item:any)=>values.push(item))
                            return `ST_SetSRID(ST_Point($${repCountLocal}, $${repCountLocal+1}), 4326)`
                        } else if( row[col] && typeof row[col] ==='object' && row[col].type==='Ligne'){
                            const repCountLocal = replaceCount
                            row[col].data.map((item:any)=>item.map((inner_item:any)=>values.push(inner_item)))
                            replaceCount+=4
                            return `ST_SetSRID(ST_MakeLine(ST_MakePoint($${repCountLocal}, $${repCountLocal+1}),ST_MakePoint($${repCountLocal+2}, $${repCountLocal+3})),4326)`
                        } else{
                            const repCountLocal=replaceCount
                            replaceCount++
                            values.push(row[col])
                            return `$${repCountLocal}`
                        }
                    }
                        
                    )
                    .join(",")})`
            )
            .join(",");

        // If geom column exists, wrap it in ST_GeomFromGeoJSON
        let query = `INSERT INTO ${tableName} (${colNames}) VALUES ${placeholders}`;


        await dbClient.query(query, values);
    }catch(err:any){
        console.log(err)
        throw err
    }
    
}