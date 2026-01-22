import { Request } from 'express'
import * as repo from '../repositories/territoire.repositories'
import { Pool } from 'pg'
import { DbTerritoire } from '../../types/database'

export const serviceMetAJourTerritoiresPeriodes = async (
    pool:Pool,
    id_periode:number,
    data:Omit<DbTerritoire,'id_periode_geo'>[] 
) =>{
    const {requeteSQLText,vecteur} = repo.ConstruitRequeteMAJTerritoiresPeriode(id_periode,data);
    const result = await repo.rouleRequeteSQLMAJTerritoiresPeriode(pool,requeteSQLText,vecteur);
    return result
}