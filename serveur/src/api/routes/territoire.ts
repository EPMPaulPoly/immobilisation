import { Router, Request, Response, RequestHandler } from 'express';
import { Pool } from 'pg';
import { DbTerritoire, ParamsPeriode } from '../../types/database';
// Types pour les requêtes
import { Polygon, MultiPolygon } from 'geojson';
import { serviceMetAJourTerritoiresPeriodes } from '../services/territoire.service';
interface GeometryBody {
    geometry: Polygon | MultiPolygon;
}

export const creationRouteurTerritoires = (pool: Pool): Router => {
    const router = Router();
    // Get all lines
    // Get all lines
    const obtiensTerritoiresParPeriode: RequestHandler<ParamsPeriode> = async (req, res): Promise<void> => {
        console.log('obtention territoire')
        let client;
        try {
            const { id } = req.params;
            client = await pool.connect();
            const query = `
        SELECT 
          id_periode_geo,
          ville,
          secteur,
          id_periode,
          ST_AsGeoJSON(geometry) AS geojson_geometry
        FROM public.cartographie_secteurs
        WHERE id_periode = $1
      `;

            const result = await client.query<DbTerritoire>(query, [id]);
            res.json({ success: true, data: result.rows });
        } catch (err) {
            res.status(500).json({ success: false, error: 'Database error' });
        } finally {
            if (client) {
                client.release()
            }
        }
    };

    const obtiensTerritoiresParId: RequestHandler<ParamsPeriode> = async (req, res): Promise<void> => {
        console.log('obtention territoire')
        let client;
        try {
            const { id } = req.params;
            client = await pool.connect();
            const query = `
        SELECT 
          id_periode_geo,
          ville,
          secteur,
          id_periode,
          ST_AsGeoJSON(geometry) AS geojson_geometry
        FROM public.cartographie_secteurs
        WHERE id_periode_geo = $1
      `;

            const result = await client.query<DbTerritoire>(query, [id]);
            res.json({ success: true, data: result.rows });
        } catch (err) {
            res.status(500).json({ success: false, error: 'Database error' });
        } finally {
            if (client) {
                client.release()
            }
        }
    };
    const metAJourTerritoiresPeriode: RequestHandler<ParamsPeriode> = async (req, res): Promise<void> => {
        console.log('obtention territoire')
        let client;
        try{
            const {id_periode} = req.params
            const territoire: Omit<DbTerritoire,'id_periode_geo'>[] = req.body
            const result = await serviceMetAJourTerritoiresPeriodes(pool,Number(id_periode),territoire)
            if (result.success === true){
                res.status(200).json({success:true, data: result.data})
            }else{
                throw Error('Erreur dans la mise à jour des territoire')
            }
        }catch (err) {
            res.status(500).json({ success: false, error: 'Database error' });
        } 
    }
    // Routes
    router.get('/periode/:id', obtiensTerritoiresParPeriode)
    router.get('/periode-geo/:id', obtiensTerritoiresParId)
    router.post('/bulk-replace/:id_periode',metAJourTerritoiresPeriode)
    return router;
};