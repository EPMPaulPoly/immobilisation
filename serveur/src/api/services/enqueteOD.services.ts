import { Pool } from "pg";
import { paramsRequeteOD } from "../repositories/enqueteOD.repositories";
import { ApiResponse } from "api.types";


export function nettoyageParametresRequeteOD(req:any):paramsRequeteOD{ 
    return{
        type:'dep'
    }
}

export async function RequeteObtiensEnqueteOD(pool:Pool,params:any):Promise<ApiResponse<boolean>>{
    return{success:true,data: false}
}