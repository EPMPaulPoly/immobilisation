import { Pool } from "pg";

export type requeteRecense={
    annee:2016|2021,
    bbox:number[]
}

export type requeteSQL={
    requete:string,
    valeurs:any[]
}

export function genereRequetesSQLGetRecensement(params:requeteRecense):requeteSQL{
    let query: string = '';
    let conditions = [];
    let values = [];
    let replaceCount = 1;
    if (typeof params.bbox !== 'undefined') {
        conditions.push(`rec.geometry && ST_MakeEnvelope($${replaceCount}, $${replaceCount + 1},  $${replaceCount + 2}, $${replaceCount + 3}, 4326)`)
        values.push(params.bbox[0])
        values.push(params.bbox[1])
        values.push(params.bbox[2])
        values.push(params.bbox[3])
        replaceCount += 4
    }else {
        throw new Error('Doit fournir une enveloppe pour les odnnées')
    }
    if(params.annee===2016){
        query = `SELECT "ADIDU",pop_2016,habitats_2016,habitats_occup_2016,ST_AsGeoJSON(geometry) as geometry from census_population_2016 rec` 
    } else if (params.annee===2021){
        query = `SELECT "ADIDU",pop_2021,habitats_2021,habitats_occup_2021,ST_AsGeoJSON(geometry) as geometry  from census_population rec` 
    }else{
        throw new Error('Doit fournir année valide')
    }
    const final_query = query +' WHERE ' + conditions.join(' AND ')
    return{requete:final_query,valeurs:values}
}

export async function  rouleRequeteSQLSimpleRecensment(pool:Pool,requete:requeteSQL){
    let client;
    try{
        client = await pool.connect()
        const data = await client.query(requete.requete,requete.valeurs)
        const output = data.rows
        const formattedOutput = output.map((item)=>{return{...item,geometry:JSON.parse(item.geometry)}})
        return formattedOutput
    }finally{
        if (client){
            client.release()
        }
    }
}