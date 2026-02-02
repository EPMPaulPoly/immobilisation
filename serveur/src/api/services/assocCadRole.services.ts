import { Pool } from "pg"
import { autoCreationResult, genereRequeteCreationAutomatique, rouleRequeteCreationAutomatique } from "../repositories/assocCadastreRole.repositories"


export const  gereCreationAssocParDefaut=async(pool:Pool):Promise<autoCreationResult>=>{
    const requetes = genereRequeteCreationAutomatique()
    const resultat = await rouleRequeteCreationAutomatique(pool,requetes)
    return {success:resultat.success,insert_rows:resultat.insert_rows}
}