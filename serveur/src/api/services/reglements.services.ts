import { Request } from 'express'
import * as repo from '../repositories/reglements.repositories'
import { Pool } from 'pg'

export interface rowCountWSucces{
    success:boolean,
    rowCount: number
}

export const serviceGetReg = async (
    pool:Pool,
    params:{
        reg_complet:boolean,
        annee_debut_avant?: number|null,
        annee_debut_apres?: number,
        annee_fin_avant?: number,
        annee_fin_apres?: number|null,
        description?: string,
        ville?:string,
        texte?:string,
        paragraphe?:string,
        unite?:number|number[],
        id_er?: number|number[],
        id_periode_geo?:number|number[],
        id_periode?:number|number[],
        cubf?: number|number[],
        id_reg_stat?:number|number[]
    }
) =>{
    
    const sql_data:repo.GetReglementsQueries = repo.construitRequetesGetReglements(params)
    const [head,def,units] = await repo.rouleRequetesSQLGet(pool,sql_data,params.reg_complet) as [repo.ruleHeader[], repo.ruleDef[], repo.unitDef[]]
    const output = formatRulesOutput(head,def,units,params.reg_complet)
    return output
} 

export const serviceCreeOperations = async (pool:Pool):Promise<rowCountWSucces>=>{
    const requete: string = repo.construitRequeteCreeOperationsDefaut()
    const valeur = await repo.rouleRequeteCreationAuto(pool,requete)
    if (valeur === 4){
        return {success: true, rowCount:4}
    }else{
        return{success:false,rowCount:0}
    }
}

const formatRulesOutput=(head:repo.ruleHeader[],def:repo.ruleDef[],units:repo.unitDef[],complete:boolean)=>{
    if (complete === true){
        return head.map((TeteUnReg)=> ({
            entete: TeteUnReg,
            definition: def.filter((defin)=>defin.id_reg_stat ===TeteUnReg.id_reg_stat),
            unite: units.filter(unite =>def.filter((defin)=>defin.id_reg_stat ===TeteUnReg.id_reg_stat).map(item => item.unite).includes(unite.id_unite)
)
        }))
    }else{
        return head
    }
}