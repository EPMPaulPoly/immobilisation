import { DbTerritoire } from "database"
import { Pool } from 'pg'

export const ConstruitRequeteMAJTerritoiresPeriode = (id_periode:number,data: Omit<DbTerritoire,'id_periode_geo'>[])=> {
    
    return {
        requeteSQLText: '',
        vecteur: []
    }
}


export const rouleRequeteSQLMAJTerritoiresPeriode = async (
    pool:Pool,
    requeteSQLText:string,
    data:[]
) =>{
    return []
}