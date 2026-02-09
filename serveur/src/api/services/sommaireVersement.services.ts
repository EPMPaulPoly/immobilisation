import { Pool } from "pg";
import { creeRequeteSommaire, rouleRequeteSommaireDonnees } from "../repositories/sommaireDonnees.repositories";


export async function obtiensSommaireDonnees(pool:Pool){
    const requete = creeRequeteSommaire()
    const resultat = rouleRequeteSommaireDonnees(pool,requete)
    return resultat
}