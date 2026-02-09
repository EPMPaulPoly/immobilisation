import { Router, Request, Response, RequestHandler } from 'express';
import { Pool } from 'pg';
// Types pour les requêtes
import { gereRequeteRecensement, nettoieParametresRequete } from '../services/recensement.services';


export const creationRouteurRecensement = (pool: Pool): Router => {
    const router = Router();
    // Get all lines
    // Get all lines
    const obtiensSecteursRecensement: RequestHandler = async (req, res): Promise<void> => {
        console.log('Serveur - obtentions secteurs recensement')
        try {
            const requete = nettoieParametresRequete(req)
            const resultat = await gereRequeteRecensement(pool,requete)
            res.json({ success: true, data: resultat});
        } catch (err) {
            res.status(500).json({ success: false, error: 'Database error' });
        } 
    };

    // Routes
    router.get('/:annee', obtiensSecteursRecensement);
    return router;
};