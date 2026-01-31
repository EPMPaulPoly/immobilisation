import { Router, Request, Response, RequestHandler } from 'express';
import { Pool } from 'pg';
import { DbTerritoire, ParamsCadastre, ParamsPeriode, DbRole, DbCadastre, ParamsQuartier, DbCadastreGeomIdOnly } from '../../types/database';
// Types pour les requêtes
import { Polygon, MultiPolygon } from 'geojson';
import { validateBboxQuery } from '../validators/cadastreValidator';
import multer from "multer";
import path from "path";
import fs from "fs";
import { obtiensLotRequete, processRequestConversions } from '../services/roleFoncier.services';
import { importFile } from '../services/geojsonGest.services';

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