import { ParamsDictionary } from "express-serve-static-core";

// Cadastre
export interface DbCadastre{
    g_no_lot:string,
    g_nb_coord:number,
    g_nb_coo_1:number,
    g_va_suprf:number,
    geojson_geometry?:string,
    bool_inv?:boolean,
    estime?:number|null
    inv?:number|null
}

export interface DbCadastreGeomIdOnly{
    g_no_lot:string,
    geometry:string
}

export interface ParamsCadastre extends ParamsDictionary{
    id:string;
}

