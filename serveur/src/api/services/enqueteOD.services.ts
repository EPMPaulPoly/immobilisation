import { Pool } from "pg";
import { 
    construitRequeteDep,
    construitRequeteMenage,
    construitRequetePers,
    paramsRequeteDepOD, 
    paramsRequeteMenageOD, 
    paramsRequetePersOD,
    rouleRequeteOD
} from "../repositories/enqueteOD.repositories";
import { ApiResponse } from "api.types";
import { depODOut, menageODOut, persODOut } from "enqueteOD.types";


export function nettoyageParametresRequeteMenageOD(query:any):paramsRequeteMenageOD{ 
    const{bbox} = query
    let bboxLimitsNum = undefined;
    if (typeof bbox === 'string') {
        const bboxLimitsString = bbox.split(',')
        bboxLimitsNum = bboxLimitsString.map((item) => Number(item))
    }
    return{
        bbox:bboxLimitsNum
    }
}

export function nettoyageParametresRequetePersOD(req:any):paramsRequetePersOD{
    return{
        bbox:[0,0,0,0]
    }
}

export function nettoyageParametresRequeteDepOD(req:any):paramsRequeteDepOD{
    return{
        bbox:[0,0,0,0]
    }
}

export async function RequeteObtiensMenagesOd(pool:Pool,params:paramsRequeteMenageOD):Promise<ApiResponse<menageODOut>>{
    const requete = construitRequeteMenage(params)
    const resultat = await rouleRequeteOD(pool,requete) 
    return{success:true,data: resultat as unknown as menageODOut}
}

export async function RequeteObtiensPersOd(pool:Pool,params:paramsRequetePersOD):Promise<ApiResponse<persODOut>>{
    const requete = construitRequetePers(params)
    const resultat = await rouleRequeteOD(pool,requete) 
    return{success:true,data: resultat as unknown as persODOut}
}

export async function RequeteObtiensDepOd(pool:Pool,params:paramsRequeteDepOD):Promise<ApiResponse<depODOut>>{
    const requete = construitRequeteDep(params)
    const resultat = await rouleRequeteOD(pool,requete) 
    return{success:true,data: resultat as unknown as depODOut}
}