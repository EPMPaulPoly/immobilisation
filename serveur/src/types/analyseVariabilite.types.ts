// Analyse variabilité

export interface RequeteAnalyseVariabilite{
    id_er: string;
    cubf_n1:string;
    id_ref:string;
    voir_inv:boolean;
}

export interface RequeteHistoVariabilite{
    id_er:string,
    cubf_n1:string,
    ratio_inv_act:boolean,
    echelle:string
}
export interface RequeteAnalyseFacteurEchelle{
    id_er:string,
    cubf_n1:string
}
export interface dataHistogrammeVariabilite{
    labels:string[],
    datasets:serieHistogrammeVariabilite[]
}
export interface serieHistogrammeVariabilite{
    label:string,
    data:number[],
    cubf?:number
}

export interface dataBoxPlotVariabilite{
    labels:string[],
    datasets:serieBoxplotVariabilite[]
}
export interface serieBoxplotVariabilite{
    label?:string,
    data: number[][]
}

export interface RetourBDAnalyseVariabilite{
    cubf:number,
    valeur:number,
    id_er:number,
    description_er:string,
    n_lots:number,
    desc_cubf:string,
    facteur_echelle?:number
}

export interface RetourBDHistoVariabilite{
    cubf: number,
    desc_cubf: string,
    interval_pred: string,
    frequence: number
}
