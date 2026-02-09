// Ensemvle Reglement

import { ParamsDictionary } from "express-serve-static-core"

export interface DbEnteteEnsembleReglement{
    id_er:number,
    date_debut_er:number,
    date_fin_er:number,
    description_er:string,
}

export interface DbCountAssoc{
    count_assoc_lines:number,
}

export interface DbAssociationReglementUtilSol{
    id_assoc_er_reg:number,
    cubf:number,
    id_reg_stat:number,
    id_er:number
}

export interface ParamsEnsReg extends ParamsDictionary{
    id:string
}

export interface ParamsAssocEnsReg extends ParamsDictionary{
    id:string
}

export interface ParamsAssocEnsRegTerr extends ParamsDictionary{
    id:string
}