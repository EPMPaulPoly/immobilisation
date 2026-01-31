import { Client, Pool, PoolClient } from "pg";
import { handleTempUpload, importFile } from "./geojsonGest.services";
import { insertGeojsonFile, TMP_DIR } from "../repositories/geojsonTemp.repositories";


// wrappers for each data type
export async function handleCadastreUpload(filePath: string) {
    const columns = await handleTempUpload(filePath);
    return { columns, dataType: "cadastre" };
}
export async function importFileCadastre(pool:Pool,fileId:string,Mapping:Record<string,string>){
    const insertCount = await importFile(pool,fileId,Mapping,'cadastre')
    return insertCount
}


export async function handleRoleFoncierUpload(filePath: string) {
    const columns = await handleTempUpload(filePath);
    return { columns, dataType: "role_foncier" };
}