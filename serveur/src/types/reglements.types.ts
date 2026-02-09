// Règlement

export interface DbEnteteReglement{
    id_reg_stat:number,
    description:string,
    annee_debut_reg: number,
    annee_fin_reg:number,
    texte_loi:string,
    article_loi:string,
    paragraphe_loi:string,
    ville:string
}

export interface DbDefReglement{
    id_reg_stat_emp:number,
    id_reg_stat:number,
    ss_ensemble:number,
    seuil:number,
    oper:number,
    cases_fix_min:number,
    cases_fix_max:number,
    pente_min:number,
    pente_max:number,
    unite:number
}


export interface DbReglementComplet{
    entete: DbEnteteReglement,
    definition:DbDefReglement[]
}