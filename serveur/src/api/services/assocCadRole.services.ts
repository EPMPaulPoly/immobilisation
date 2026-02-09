import { Pool } from "pg"
import { 
    autoCreationResult, 
    genereRequeteCreationAutomatique, 
    genereRequeteObtention, 
    QueryRequeteAssoc, 
    rouleRequeteCreationAutomatique, 
    rouleRequeteUniqueAssoc
} from "../repositories/assocCadastreRole.repositories"


export const  gereCreationAssocParDefaut=async(pool:Pool):Promise<autoCreationResult>=>{
    const requetes = genereRequeteCreationAutomatique()
    const resultat = await rouleRequeteCreationAutomatique(pool,requetes)
    return {success:resultat.success,insert_rows:resultat.insert_rows}
}

export const menageRequeteAssoc = (query:any):QueryRequeteAssoc=>{
    const {id_provinc,g_no_lot} = query
    let idProvOut
    if (typeof id_provinc !=='undefined'){
        idProvOut =id_provinc.split(',')
    }
    let noLotOut
    if (typeof g_no_lot !=='undefined'){
        noLotOut =g_no_lot.split(',')
    }
    return{
        id_provinc:idProvOut,
        g_no_lot:noLotOut
    }
}

export const gereRequeteAssociation = async(pool:Pool,params:QueryRequeteAssoc)=>{
    const requete = genereRequeteObtention(params)
    const donnees = await rouleRequeteUniqueAssoc(pool,requete)
    return donnees
}