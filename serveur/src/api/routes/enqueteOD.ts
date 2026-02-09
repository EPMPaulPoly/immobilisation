import { RequestHandler, Router } from "express";
import { Pool } from "pg";
import { 
    nettoyageParametresRequeteDepOD,
    nettoyageParametresRequeteMenageOD, 
    nettoyageParametresRequetePersOD, 
    RequeteObtiensDepOd, 
    RequeteObtiensMenagesOd,
    RequeteObtiensPersOd,  
} from "../services/enqueteOD.services";


export const creationRouteurEnqueteOD = (pool: Pool): Router => {
    const router = Router();
    const obtiensMenages: RequestHandler<{}> = async (req,res,next):Promise<void>=>{
        try {
            console.log('Obtention ménage zone')
            const params = nettoyageParametresRequeteMenageOD(req.query)
            const response = await RequeteObtiensMenagesOd(pool,params)
            res.json({ success: true, data: response.data});
        } catch (err) {
            res.status(500).json({ success: false, error: 'Database error' });
        }
    }
    const obtiensPersonnes: RequestHandler<{}> = async (req,res,next):Promise<void>=>{
        try {
            console.log('Obtention Personnes zones')
            const params = nettoyageParametresRequetePersOD(req.query)
            const response = await RequeteObtiensPersOd(pool,params)
            res.json({ success: true, data: response.data});
        } catch (err) {
            res.status(500).json({ success: false, error: 'Database error' });
        }
    }
    const obtiensDeplacements: RequestHandler<{}> = async (req,res,next):Promise<void>=>{
        try {

            console.log('Obtention depl zone')
            const params = nettoyageParametresRequeteDepOD(req.query)
            const response = await RequeteObtiensDepOd(pool,params)
            res.json({ success: true, data: response.data});
        } catch (err) {
            res.    status(500).json({ success: false, error: 'Database error' });
        }
    }
    router.get('/mena', obtiensMenages)
    router.get('/pers',obtiensPersonnes)
    router.get('/depl',obtiensDeplacements)
    return router;
}