import { Pool } from "pg";
import { handleTempUpload, importFile } from "./geojsonGest.services";
import { genereRequetesSQLGetRecensement, requeteRecense, rouleRequeteSQLSimpleRecensment } from "../repositories/recensement.repositories";


// wrappers for each data type
export async function handleCadastreUpload(filePath: string) {
    const columns = await handleTempUpload(filePath);
    return { columns, dataType: "cadastre" };
}
export async function importFileCadastre(pool:Pool,fileId:string,Mapping:Record<string,string>){
    const insertCount = await importFile(pool,fileId,Mapping,'cadastre')
    return insertCount
}

export function nettoieParametresRequete(req:any):requeteRecense{
    const {annee} = req.params;
    const {bbox} = req.query;
    let annee_out:2016|2021
    if (typeof annee ==='string'){
        if (Number(annee)===2016 || Number(annee)===2021){
            annee_out = Number(annee) as 2016|2021
        }else{
            throw new Error('Doit fournir année valide: 2016 ou 2016')
        }
    } else {
        throw new Error('Doit fournir une année')
    }
    let bbox_out:number[]=[]
    if (typeof bbox === 'string'){
        bbox_out = bbox.split(',').map((item)=>Number(item))
    }else{
        throw new Error('Doit inclure une boite englobante pour les donnnées')
    }
    return {annee:annee_out,bbox: bbox_out}
}

export async function gereRequeteRecensement(pool:Pool,requete:requeteRecense){
    const requetesSQL = genereRequetesSQLGetRecensement(requete)
    const resultat =await  rouleRequeteSQLSimpleRecensment(pool,requetesSQL)
    return resultat
}