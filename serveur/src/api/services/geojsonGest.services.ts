import multer from "multer";
import { peekGeojsonColumns,  insertGeojsonFile,MulterRequest } from "../repositories/geojsonTemp.repositories";
import { 
    cleanupOldTempFiles,
    TMP_DIR
} from '../repositories/fileOptions.repositories'
import { PoolClient,Pool } from "pg";
import path from "path";
import {Request,Response} from 'express';
import fs from "fs";

const storage = multer.diskStorage({
    destination: TMP_DIR,
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

export const upload = multer({ storage });

export async function handleTempUpload(filePath: string) {
    // peek columns
    const columns = await peekGeojsonColumns(filePath);
    // cleanup old files
    await cleanupOldTempFiles();
    return columns;
}


export async function importFile(pool:Pool,fileId:string,Mapping:Record<string,string>,table:string){
    let client:PoolClient;
    const tmpDir = TMP_DIR;
    const tempFilePath = path.join(tmpDir, fileId);
    client = await pool.connect()
    // DEBUG: check for duplicates
    const geojson = JSON.parse(fs.readFileSync(tempFilePath, "utf-8"));
    console.log("Total features:", geojson.features.length);
    console.log("Unique IDs:", new Set(geojson.features.map((f:any) => f.properties?.g_no_lot)).size);
    const insertCount = await insertGeojsonFile(tempFilePath,Mapping,table,client)
    return insertCount
}


export const  runFileUpload=async(req:Request<any>,res:Response)=>{
    upload.single("file")(req, res, async (err:any) => {
        if (err) return res.status(500).json({ error: err.message });

        const r = req as unknown as MulterRequest;
        if (!r.file) return res.status(400).json({ error: "No file uploaded" });

        const tempFileId = r.file.filename;
        const tempPath = r.file.path;

        console.log("Temp file saved at:", tempPath);

        try {
            const  columns  = await handleTempUpload(tempPath);
            res.json({ tempFileId, columns });
        } catch (err) {
            console.error("Upload error:", err);
            res.status(500).json({ error: "Failed to process file" });
        }
    });
}
