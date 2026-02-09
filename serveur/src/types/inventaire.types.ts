import { ParamsDictionary } from "express-serve-static-core"

export interface DbInventaire{
    g_no_lot:string,
    n_places_min:number,
    n_places_max:number,
    n_places_est:number,
    n_places_mes:number,
    methode_estime:number,
    id_er:string,
    id_reg_stat:string,
    cubf:number,
    geometry: GeoJSON.GeoJSON
}

export interface CorpsRequeteInventaire{
    g_no_lot:string,
    n_places_min:number,
    n_places_max:number,
    n_places_mesure:number,
    n_places_estime:number,
    id_er:string,
    id_reg_stat:string,
    commentaire:string,
    methode_estime:number,
    cubf:string,
}
export interface CorpsRequeteInventaireGros{
    data: CorpsRequeteInventaire[]
}

export interface RequeteInventaire{
    g_no_lot:string,
    n_places_ge:string,
    dens_places_ge:string,
    cubf:string,
    methode_estime:string,
    id_inv:string
}

export interface RequeteInventaireGrosItem{
    id_inv:number,
    g_no_lot:string,
    n_places_min:number,
    n_places_max:number,
    n_places_mesure:number,
    n_places_estime:number,
    id_er:string,
    id_reg_stat:string,
    commentaire:string,
    methode_estime:number,
    cubf:string,
}

export interface RequeteInventaireGros{
    data: RequeteInventaireGrosItem[]
}

// Calcul semi automatique

export interface RequeteCalculeInventaireRegMan{
    cubf:number,
    id_reg_stat:number,
    unite:number,
    valeur:number
}

export interface DbDonneesRequetesCalculValeursManuelles{
    rl0105a:string,
    rl0307a:string,
    id_er:number,
    description_er:string,
    id_periode_geo:number,
    ville_sec:string,
    id_provincial_list:string,
    rl0308a_somme:number,
    rl0311a_somme:number,
    rl0312a_somme:number,
    id_reg_stat:number,
    description_reg_stat:string,
    unite:number,
    desc_unite:string
}

export interface ParamsInventaire extends ParamsDictionary{
    id_inv:string;
}


export interface unit_reg_reg_set_land_use_query{
    id_er:number,
    id_reg_stat:number,
    unite:number[]
}
export interface unit_reg_reg_set_land_use_output extends unit_reg_reg_set_land_use_query{
    desc_er:string,
    desc_reg_stat:string,
    desc_unite:string[]
}
