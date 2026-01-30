import { LatLng } from "leaflet";

export interface donneesCarteDeFond{
    id:number,
    description:string,
    URL:string,
    attribution:string;
    zoomMax:number
}

export type ContexteImmobilisationType = {
    optionCartoChoisie: number;
    changerCarto: (idAUtiliser: number) => void;
    optionsCartos: donneesCarteDeFond[],
    optionCentreChoisie:number;
    changerCentre: (idAUtiliser:number)=>void;
    optionsCentres: CentreDeCarte[]
};

export type FournisseurContexteProps = {
    children: ReactNode;
};

export interface CentreDeCarte{
    idLieu:number,
    nomLieu:string,
    zoomDebut:number,
    centreDebut:LatLng
}