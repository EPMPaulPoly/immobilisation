import { ParamsDictionary } from "express-serve-static-core";

export interface DbQuartierAnalyse{
    id_quartier:number,
    nom_quartier:string,
    superf_quartier:number,
    peri_quartier:number,
    geometry: GeoJSON.GeoJSON;  // Geometry(Geometry,4326)
}


export interface ParamsQuartier extends ParamsDictionary {
    id: string;
}