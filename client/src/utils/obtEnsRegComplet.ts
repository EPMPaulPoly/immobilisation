import { serviceEnsemblesReglements } from '../services/serviceEnsemblesReglements.js';
import { ensemble_reglements_stationnement, reglement_complet } from "../types/DataTypes.js";
import {Dispatch,SetStateAction} from 'react';
const obtEnsRegComplet =async (id_reg:number|number[],setRegState:Dispatch<SetStateAction<ensemble_reglements_stationnement>>)=>{
    const reglementAObtenir = await serviceEnsemblesReglements.chercheEnsembleReglementParId(id_reg)
    setRegState(reglementAObtenir.data[0])
}

export default obtEnsRegComplet