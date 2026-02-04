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

export type QueryRequeteAssoc={
    g_no_lot?:string[],
    id_provinc?:string[]
}

export type ObjetRequeteAssoc={
    requete:string,
    valeurs: any[]
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

export const genereRequeteObtention = (params: QueryRequeteAssoc)=>{
    
    const base_query = `SELECT id_provinc, g_no_lot FROM association_cadastre_role WHERE g_no_lot IN (SELECT g_no_lot FROM lot_search)`
    const conditions:string[]=[];
    const values:string[]=[];
    let lastPH = 1
    if (typeof params.g_no_lot !== 'undefined'){
        const placeholders:string[]=[]
        params.g_no_lot.map((value)=>{
            values.push(value)
            placeholders.push(`$${lastPH}`)
            lastPH++
        })
        conditions.push(`g_no_lot IN (${placeholders.join(', ')})`)
    }
    if (typeof params.id_provinc !=='undefined'){
        const placeholders:string[]=[]
        params.id_provinc.map((value)=>{
            values.push(value)
            placeholders.push(`$${lastPH}`)
            lastPH++
        })
        conditions.push(`id_provinc IN (${placeholders.join(', ')})`)
    }
    let finalQuery:string;
    let cte:string;
    if(values.length>0){
        cte = 'WITH lot_search AS(SELECT DISTINCT g_no_lot FROM association_cadastre_role WHERE ' + conditions.join(' OR ') + ')'
        finalQuery = cte+ base_query
    }else{
        cte = 'WITH lot_search AS(SELECT DISTINCT g_no_lot FROM association_cadastre_role)'
        finalQuery = cte + base_query
    }
    return{requete: finalQuery,valeurs:values}
}


export const rouleRequeteUniqueAssoc = async(pool:Pool, requete: ObjetRequeteAssoc)=>{
    let client
    try{
        client = await pool.connect()
        const result= await client.query(requete.requete,requete.valeurs)
        return result.rows
    }finally{
        if (client){
            client.release()
        }
    }
}