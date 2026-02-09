import { Router,  RequestHandler } from 'express';
import { Pool } from 'pg';
import { Polygon, MultiPolygon } from 'geojson';
import { obtiensLotRequete, processRequestConversions } from '../services/roleFoncier.services';

interface GeometryBody {
    geometry: Polygon | MultiPolygon;
}

export  const creationRouteurRoleFoncier= (pool: Pool): Router => {
    const router = Router();
    // Get all lines
    const obtiensRoleFoncier: RequestHandler<{}> = async (req, res, next): Promise<void> => {
        try {
            const params = processRequestConversions(req.query)
            const response = await obtiensLotRequete(pool,params)
            res.json({ success: true, data: response.data});
        } catch (err) {
            res.status(500).json({ success: false, error: 'Database error' });
        }
    }

    router.get('', obtiensRoleFoncier)
    return router;
};