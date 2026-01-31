import { RequestHandler, Router } from "express";
import { Pool } from "pg";

import { runFileUpload } from "../services/geojsonGest.services";
export const creationRouteurDonnees = (pool: Pool): Router => {
    const router = Router();
    // main upload handler
    const versementTemp: RequestHandler = async(req, res) => {
        console.log('Entering file upload')
        // run multer
        try{
            runFileUpload(req,res)
        } catch{
            res.status(500).json({ error: "Failed to process file" });
        }
    };


    router.post('/temp-upload',versementTemp)
    return router
}