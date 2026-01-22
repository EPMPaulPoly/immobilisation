import { serviceEnsemblesReglements } from "../services/serviceEnsemblesReglements.js";


const ObtRegLots =(ids:string[]) =>{
    const ensRegReduit = serviceEnsemblesReglements.chercheEnsRegPourRole(ids);
    return ensRegReduit
}

export default ObtRegLots;