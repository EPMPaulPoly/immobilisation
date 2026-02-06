import { ParamsDictionary } from "express-serve-static-core";

export interface RequeteResValide{
    g_no_lot:string,
    id_strate:string,
    fond_tuile:string,
    id_val:number
}
export interface CorpsValide extends RequeteResValide{
    n_places:number
}


export type condition_strate =
  | { condition_type: "equals"; condition_valeur: string | number}
  | { condition_type: "range"; condition_min: number|null; condition_max: number|null };

// Recursive Strata definition
export interface strate extends strate_db{
    subStrata?: strate[]; // recursion
    condition?: condition_strate;
}

export interface strate_db{
    id_strate:number,
    nom_strate:string,
    nom_table: string;
    nom_colonne: string;
    ids_enfants:number[]|null,
    est_racine:boolean|null,
    index_ordre:number,
    logements_valides:boolean|null,
    date_valide:boolean|null,
    superf_valide:boolean|null,
    condition_type:"equals"|"range";
    condition_min:number|null;
    condition_max:number|null;
    condition_valeur:number|null;
    n_sample?:number|null;
}

export interface RequeteModifStrate extends ParamsDictionary{
    id_strate:string
}

export interface condition_echantillonage{
    condition:string,
    id_strate:number,
    colonnes_pertinentes:string[]
    desc_concat:string,
    n_sample:number| null | undefined
}

export interface RequeteGraphiqueValidation{
    id_strate:string,
    type:"pred_par_reel"|"reel_par_pred"|"stationnement"
    x_max:string
}


