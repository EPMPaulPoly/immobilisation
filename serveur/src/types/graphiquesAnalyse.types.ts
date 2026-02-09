import { ParamsDictionary } from "express-serve-static-core"

export type XYVariableInfo = {
    expression: (ordre?: string) => string;
    aggregateExpression: (ordre?:string)=>string;
    joins: string[];
    groupbys:string[];
    ctes:(ordre?: string) => string[],
    description: string;
    requiresOrdre: boolean;
};


export type variableInfo = {
    expression: (ordre?: string) => string;
    aggregateExpression: (ordre?:string)=>string;
    joins: string[];
    groupbys:string[];
    ctes:(ordre?: string) => string[],
    description: string;
    requiresOrdre: boolean;
};

// graphqiques
export interface donneesHisto{
    valeurVille:number,
    description:'',
    donnees:barChartData[]
}

export interface barChartData{
    id_quartier:number,
    nom_quartier:string,
    valeurs:number
}

export interface ParamsAnaQuartierTot extends ParamsDictionary{
    ordreEstime:string
}
