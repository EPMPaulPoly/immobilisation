import { Router, Request, Response, RequestHandler } from 'express';
import { Pool } from 'pg';
import { DbQuartierAnalyse } from '../../types/database';
// Types pour les requêtes
import { Polygon, MultiPolygon } from 'geojson';
interface GeometryBody {
    geometry: Polygon | MultiPolygon;
}

export const creationRouteurRecensement = (pool: Pool): Router => {
    const router = Router();
    // Get all lines
    // Get all lines
    const obtiensSecteursRecensement: RequestHandler = async (_req, res): Promise<void> => {
        console.log('Serveur - obtentions secteurs recensement')
        try {

            res.json({ success: true, data: [] });
        } catch (err) {
            res.status(500).json({ success: false, error: 'Database error' });
        } 
    };

    // Routes
    router.get('/:annee', obtiensSecteursRecensement);
    return router;
};