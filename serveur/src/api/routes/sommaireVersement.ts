import { Router, Request, Response, RequestHandler } from 'express';
import { Pool } from 'pg';
import { obtiensSommaireDonnees } from '../services/sommaireVersement.services';
// Types pour les requêtes



export const CreationRouteurSommaireDonnee = (pool: Pool): Router => {
    const router = Router();
    // Get all lines
    // Get all lines
    const obtiensSommaireVersement: RequestHandler = async (req, res): Promise<void> => {
        console.log('Serveur - obtentions sommaire données')
        try {
            const resultat = await obtiensSommaireDonnees(pool)
            res.json({ success: true, data: resultat});
        } catch (err) {
            res.status(500).json({ success: false, error: 'Database error' });
        } 
    };

    // Routes
    router.get('', obtiensSommaireVersement);
    return router;
};