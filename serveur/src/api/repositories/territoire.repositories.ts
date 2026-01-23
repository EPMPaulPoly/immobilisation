import { DbTerritoire } from "database"
import { Pool,PoolClient } from 'pg'
import { RepoResponse } from "database"

export interface objetRequeteMAJTotaleSecteursPeriode{
    requeteCommence: string,
    requeteSuppression: string,
    donneeSuppression: number[]
    requeteInsertion: string,
    donneesInsertion: any[],
    requeteConfirmation: string
}


export const ConstruitRequeteMAJTerritoiresPeriode = (id_periode:number,data: Omit<DbTerritoire,'id_periode_geo'>[]):objetRequeteMAJTotaleSecteursPeriode=> {
    const requete1 = 'BEGIN;'
    const requeteSuppression = 'DELETE FROM cartographie_secteurs WHERE id_periode = $1'
    const idSuppression = [id_periode]
    const valueData: any[] = []
    const placeholders = data.map((item:any, idx:number) => {
                const startIdx = idx * 5 + 1;
                valueData.push(
                    id_periode,
                    item.ville,
                    item.secteur,
                    `${item.ville} - ${item.secteur}`,
                    item.geometry
                );
                return `($${startIdx}, $${startIdx + 1}, $${startIdx + 2}, $${startIdx + 3}, ST_SetSRID(ST_GeomFromGeoJSON($${startIdx + 4}), 4326))`;
            }).join(', ');
    const requeteAddition = `INSERT INTO cartographie_secteurs (id_periode,ville,secteur,ville_sec,geometry) VALUES ${placeholders} RETURNING id_periode_geo,ville,secteur,ville_sec,ST_AsGeoJSON(geometry)as geometry;`;
    const output: objetRequeteMAJTotaleSecteursPeriode = {
        requeteCommence: requete1,
        requeteSuppression: requeteSuppression,
        donneeSuppression: idSuppression,
        requeteInsertion: requeteAddition,
        donneesInsertion: valueData,
        requeteConfirmation: 'COMMIT;'}
    return output
}


export const rouleRequeteSQLMAJTerritoiresPeriode = async (
    pool:Pool,
    objetsRequetes:objetRequeteMAJTotaleSecteursPeriode
):Promise<RepoResponse> =>{
    let client: PoolClient | undefined;
    try{
        client = await pool.connect()
        await client.query(objetsRequetes.requeteCommence)
        await client.query(objetsRequetes.requeteSuppression,objetsRequetes.donneeSuppression)
        const result = await client.query(objetsRequetes.requeteInsertion,objetsRequetes.donneesInsertion)
        await client.query(objetsRequetes.requeteConfirmation)
        const output = result.rows.map((item:any)=>({
            ...item,
            geometry: JSON.parse(item.geometry)
        }
        ))
        return {
            success:true,
            data:output
        }
    }catch(err){
        if (client){
            await client.query('ROLLBACK')
        }
        return {success: false, data:[]}
    }finally{
        
        if (client){

            client.release()
        }
    }
}