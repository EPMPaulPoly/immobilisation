// Role

import { ParamsDictionary } from "express-serve-static-core";

export interface DbRole{
    id_provinc:string,
    rl0101a:string,
    rl0101e:string,
    rl0101g:string,
    rl0105a:string,
    rl0301a:string,
    rl0306a:number,
    rl0307a:string,
    rl0307b:string,
    rl0308a:number,
    rl0311a:number,
    rl0312a:number,
    rl0313a:number,
    rl0402a:number,
    rl0404a:number,
    geometry: GeoJSON.GeoJSON|string
}

export interface ParamsRole extends ParamsDictionary{
    id_role:string;
}