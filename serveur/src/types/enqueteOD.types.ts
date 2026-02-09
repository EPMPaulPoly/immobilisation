import { Geometry } from "geojson"

export type menageOD={
    nolog:string,
    tlog:boolean,
    nbper:number,
    nbveh:number,
    facmen:number,
}

export type menageODDB=menageOD&{
    geom_logis:string
}

export type menageODOut = menageOD &{
    geom_logis:Geometry
}

export type persOD={
    clepersonne:string,
    tper:boolean,
    sexe:number,
    age:number,
    grpage:number,
    percond:number,
    occper:number,
    mobil:number,
    facper:number,
    facpermc:number,
    nolog:string,
}

export type persODDB=persOD&{
    geometry:string
}

export type persODOut = persOD &{
    geometry:Geometry
}


export type depOD={
    cledeplacement:string,
    nodep:number,
    hredep:string,
    heure:number,
    motif:number,
    motif_gr:number,
    mode1:number,
    mode2:number,
    mode3:number,
    mode4:number,
    stat:number,
    cout_stat:number,
    term_stat:number,
    clepersonne:string,
}

export type depODDB=depOD&{
    geometry:string
}

export type depODOut = depOD &{
    geometry:Geometry
}


export type requestRespOut = depODOut[]|persODOut[]|menageODOut[]