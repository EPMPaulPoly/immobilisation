import { Request } from 'express'
import * as repo from '../repositories/territoire.repositories'
import { Pool } from 'pg'
import { DbTerritoire, RepoResponse } from '../../types/database'

export const serviceMetAJourTerritoiresPeriodes = async (
    pool:Pool,
    id_periode:number,
    data:Omit<DbTerritoire,'id_periode_geo'>[] 
):Promise<RepoResponse> =>{
    const objetRequete = repo.ConstruitRequeteMAJTerritoiresPeriode(id_periode,data);
    const result = await repo.rouleRequeteSQLMAJTerritoiresPeriode(pool,objetRequete);
    return result
}