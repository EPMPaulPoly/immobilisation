import { RequestHandler, Router } from "express";
import { Pool } from "pg";
import { gereCreationAssocParDefaut, gereRequeteAssociation, menageRequeteAssoc } from "../services/assocCadRole.services";


export const creationRouteurAssocCadRole = (pool: Pool): Router => {
    const router = Router();
    // Get all lines
    // Get all lines
    const creeAssocationsParDefaut: RequestHandler = async (req, res): Promise<void> => {

        try {
            const result = await gereCreationAssocParDefaut(pool)
            res.json(result);
        } catch (err) {
            res.status(500).json({sucess:false,message:'Erreur Serveur'});
        }
    };

    const obtiensAssocations:RequestHandler = async(req,res):Promise<void>=>{
        try{
            const paramsRequete = menageRequeteAssoc(req.query)
            const donnees = await gereRequeteAssociation(pool,paramsRequete)
            res.status(200).json({success:true,data:donnees})
        } catch(err){

            res.status(500).json({sucess:false,message:'Erreur Serveur'});
        }
    }
    
    // Routes
    router.get('/',obtiensAssocations)
    router.get('/bulk-auto', creeAssocationsParDefaut)
    
    return router;
};