import { Pool } from "pg";
export type sommaireDonnees={
    table:string,
    nombre_entrees:number
}

export type sommaireDonneesExplique = sommaireDonnees&{description:string}
export function creeRequeteSommaire():string{
    const query = `
        WITH    tbl AS (
            SELECT Table_Schema, Table_Name
            FROM   information_schema.Tables
            WHERE  
                Table_Name IN (
                    'role_foncier',
                    'cadastre',
                    'association_cadastre_role',
                    'census_population',
                    'census_population_2016',
                    'sec_analyse',
                    'od_data',
                    'multiplicateur_facteurs_colonnes',
                    'cubf'
                ) AND Table_Schema IN ('public')
        )
        SELECT  
            Table_Name as table,
            (xpath('/row/c/text()', query_to_xml(format(
                'SELECT count(*) AS c FROM %I.%I', Table_Schema, Table_Name
                ), FALSE, TRUE, '')))[1]::text::int AS nombre_entrees
        FROM    tbl
        ORDER   BY nombre_entrees DESC;
    `
    return query
}

const mapItemDescriptions = (items: sommaireDonnees[]):sommaireDonneesExplique[]=>{
    const out = items.map((item)=>{
            let item_out:sommaireDonneesExplique
            switch (item.table) {
                case "role_foncier":
                    item_out ={
                        ...item,
                        description:'Entrées du rôle foncier: Données de taxe foncière'
                    }
                    break;
                case "cadastre":
                    item_out ={
                        ...item,
                        description:'Entrées du cadastre: délimitation de lots'
                    }
                    break;
                case "association_cadastre_role":
                    item_out={
                        ...item,
                        description: 'Associations spatiales entre rôle et cadastre'
                    }
                    break;
                case "census_population":
                    item_out={
                        ...item,
                        description: 'Données de population issues du recensement de 2021'
                    }
                    break;
                case "census_population_2016":
                    item_out={
                        ...item,
                        description: 'Données de population issues du recensement de 2016'
                    }
                    break;
                case "sec_analyse":
                    item_out={
                        ...item,
                        description: `Secteurs utilisés pour le calcul et l'analyse`
                    }
                    break;
                case "od_data":
                    item_out={
                        ...item,
                        description: `Données de l'enquête OD spécifiée`
                    }
                    break;
                case "multiplicateur_facteurs_colonnes":
                    item_out={
                        ...item,
                        description: `Conversion d'unités spécifiées par l'utilisateur`
                    }
                    break;
                default:
                    item_out={...item,description:''}
            }
            return item_out
        })
        return out
}

export async function rouleRequeteSommaireDonnees(pool:Pool,requete:string):Promise<sommaireDonneesExplique[]>{
    let client;
    try{
        client = await pool.connect()
        const  resultat = await client.query<sommaireDonnees>(requete)
        const out = mapItemDescriptions(resultat.rows)
        return out
    }catch(err:any){
        console.log('error')
        throw err
    }finally{
        if (client){
            client.release()
        }
    }
}