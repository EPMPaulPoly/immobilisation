import { Pool, PoolClient } from "pg"

export type RequeteCreationAutomatique={
    requeteDebut:string,
    requeteSuppression:string,
    requeteCreation:string,
    requeteConfirmation:string,
}

export type autoCreationResult={
    success:boolean,
    insert_rows:number
}

export const genereRequeteCreationAutomatique=():RequeteCreationAutomatique=>{
    const requeteSuppressionOut = 'DELETE FROM association_cadastre_role;'
    const requeteInsersiontOut =`
        INSERT INTO association_cadastre_role (g_no_lot, id_provinc)
        SELECT cad.g_no_lot, rf.id_provinc
        FROM cadastre cad
        JOIN role_foncier rf
        ON cad.geometry && rf.geometry
            AND ST_Contains(cad.geometry, rf.geometry)
        RETURNING *;

    `
    return {
        requeteDebut:'BEGIN;',
        requeteSuppression:requeteSuppressionOut,
        requeteCreation:requeteInsersiontOut,
        requeteConfirmation:'COMMIT;'
    }
}

export const rouleRequeteCreationAutomatique = async(pool:Pool,requetes:RequeteCreationAutomatique):Promise<autoCreationResult>=>{
    let client: PoolClient|null=null
    try{
        client = await pool.connect()
        await client.query(requetes.requeteDebut)
        await client.query(requetes.requeteSuppression)
        const results =  await client.query(requetes.requeteCreation)
        await client.query(requetes.requeteConfirmation)
        if (results.rows.length>0){
            return {success:true,insert_rows:results.rows.length}
        }else{
            return {success:false,insert_rows:0}
        }
    }catch(err:any){
        console.log(err)
        return {success:false,insert_rows:0}
    }finally{
        if (client){
            client.release()
        }
    }
}