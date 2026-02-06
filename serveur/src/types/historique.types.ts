import { ParamsDictionary } from "express-serve-static-core";


// territoires historique
export interface DbTerritoire{
    id_periode_geo:number,
    ville:string,
    secteur:number,
    id_periode:number,
    geometry: GeoJSON.GeoJSON;  // Geometry(Geometry,4326)
}

export interface DbHistoriqueGeopol{
    id_periode:number,
    nom_periode:string,
    date_debut_periode:number,
    date_fin_periode:number
}


export interface ParamsPeriode extends ParamsDictionary {
    id: string;
}

export interface ParamsTerritoire extends ParamsDictionary{
    id:string;
}