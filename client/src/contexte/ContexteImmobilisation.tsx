import { createContext, useState, ReactNode, Dispatch, SetStateAction, useContext } from 'react';
import { CentreDeCarte, ContexteImmobilisationType, donneesCarteDeFond, FournisseurContexteProps } from '../types/ContextTypes';
import { latLng } from 'leaflet';


const ContexteImmobilisation = createContext<ContexteImmobilisationType | undefined>(undefined);



const FournisseurContexte = ({ children }: FournisseurContexteProps) => {
    const cartoPossibles: donneesCarteDeFond[] = [
        {
            id: 0,
            description: 'OSM',
            URL: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            zoomMax:19
        },
        {
            id: 1,
            description: 'Géodésie Québec',
            URL: 'https://geoegl.msp.gouv.qc.ca/carto/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=orthos&STYLE=default&TILEMATRIXSET=EPSG_3857&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=image/png',
            attribution: '&copy; Géodésie Québec',
            zoomMax:19
        },
        {
            id: 2,
            description: 'ESRI',
            URL: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            attribution: 'Tiles © Esri — Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community',
            zoomMax:19
        }
    ];
    const [optionsCartos, defOptionsCarto] = useState<donneesCarteDeFond[]>(cartoPossibles);
    const [optionCartoChoisie, defOptionCartoChoisie] = useState<number>(0);

    const changerCarto = (idAUtiliser: number) => {
        defOptionCartoChoisie(idAUtiliser)
    }

    const lieuxPossibles: CentreDeCarte[] =[
        {
            idLieu:1,
            nomLieu: 'Montréal',
            zoomDebut:12,
            centreDebut:latLng([45.5017, -73.5673])
        },
        {
            idLieu:2,
            nomLieu:'Québec',
            zoomDebut:12,
            centreDebut:latLng([46.839438,-71.243762])
        }
    ]
    const [optionsCentres,defOptionCentre] = useState<CentreDeCarte[]>(lieuxPossibles)
    const [optionCentreChoisie,defOptionCentreChoisie] = useState<number>(1);
    const changerCentre = (idAUtiliser:number)=>{
        defOptionCentreChoisie(idAUtiliser)
    }

    return (
        <ContexteImmobilisation.Provider 
            value={{ 
                optionCartoChoisie, 
                changerCarto, 
                optionsCartos,
                optionCentreChoisie,
                changerCentre,
                optionsCentres
             }}
        >
            {children}
        </ContexteImmobilisation.Provider>
    );
};
const utiliserContexte = () => {
    return useContext(ContexteImmobilisation)
};


export { FournisseurContexte, utiliserContexte };