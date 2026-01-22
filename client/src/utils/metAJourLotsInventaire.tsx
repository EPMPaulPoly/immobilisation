import { MAJLotsInventaireProps } from "../types/utilTypes.js";
import { serviceInventaire } from "../services/serviceInventaire.js";
import { serviceCadastre } from "../services/serviceCadastre.js";

const metAJourLotsInventaire = async(quartier_selection:number, props:MAJLotsInventaireProps)=>{
    const inventaire = await serviceInventaire.obtientInventaireParQuartier(quartier_selection)
    const lots = await serviceCadastre.obtiensCadastreParQuartier(quartier_selection)
    if (lots.success && inventaire.success){
        props.defLotsDuQuartier(lots.data)
        props.defInventaire(inventaire.data)
        return true
    } else{
        return false
    }
}

export default metAJourLotsInventaire;