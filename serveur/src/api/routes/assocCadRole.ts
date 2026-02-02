import { RequestHandler, Router } from "express";
import { Pool } from "pg";
import { gereCreationAssocParDefaut } from "../services/assocCadRole.services";


export const creationRouteurAssocCadRole = (pool: Pool): Router => {
    const router = Router();
    // Get all lines
    // Get all lines
    const creeAssocationsParDefaut: RequestHandler = async (req, res): Promise<void> => {

        try {
            const result = await gereCreationAssocParDefaut(pool)
            res.json(result);
        } catch (err) {
            res.status(500).json({sucess:false});
        }
    };
    
    // Routes
    router.get('/bulk-auto', creeAssocationsParDefaut)
    
    return router;
};