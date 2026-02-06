import { RequestHandler, Router } from "express";
import { Pool } from "pg";
import { nettoyageParametresRequeteOD, RequeteObtiensEnqueteOD } from "../services/enqueteOD.services";


export const creationRouteurCadastre = (pool: Pool): Router => {
    const router = Router();
    const obtiensMenages: RequestHandler<{}> = async (req,res,next):Promise<void>=>{
        try {
                    const params = nettoyageParametresRequeteOD(req.query)
                    const response = await RequeteObtiensEnqueteOD(pool,params)
                    res.json({ success: true, data: response.data});
                } catch (err) {
                    res.status(500).json({ success: false, error: 'Database error' });
                }
    }
    router.get('/menages', obtiensMenages)
    router.get('/personnes',obtiensMenages)
    router.get('/deplacements',obtiensMenages)
    return router;
}