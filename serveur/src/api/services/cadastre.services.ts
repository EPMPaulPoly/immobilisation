import { Client, Pool, PoolClient } from "pg";
import { handleTempUpload } from "./geojson.services";
import { insertGeojsonFile, TMP_DIR } from "../repositories/geojsonTemp.repositories";
import path from "path";
import fs from "fs";

// wrappers for each data type
export async function handleCadastreUpload(filePath: string) {
    const columns = await handleTempUpload(filePath);
    return { columns, dataType: "cadastre" };
}


export async function importFile(pool:Pool,fileId:string,Mapping:Record<string,string>){
    let client:PoolClient;
    const tmpDir = TMP_DIR;
    const tempFilePath = path.join(tmpDir, fileId);
    client = await pool.connect()
    // DEBUG: check for duplicates
    const geojson = JSON.parse(fs.readFileSync(tempFilePath, "utf-8"));
    console.log("Total features:", geojson.features.length);
    console.log("Unique IDs:", new Set(geojson.features.map((f:any) => f.properties?.g_no_lot)).size);
    const insertCount = await insertGeojsonFile(tempFilePath,Mapping,'cadastre',client)
    return insertCount
}
export async function handleRoleFoncierUpload(filePath: string) {
    const columns = await handleTempUpload(filePath);
    return { columns, dataType: "role_foncier" };
}