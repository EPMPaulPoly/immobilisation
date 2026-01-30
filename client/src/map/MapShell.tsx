import { ReactNode } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { utiliserContexte } from "../contexte/ContexteImmobilisation";
import MapEvents from "./MapEvents";
import { MapShellProps } from "../types/MapTypes";
import { latLng, LatLng } from "leaflet";



const MapShell = ({
    children,
    onViewportChange,
    center ,
    zoom ,
}: MapShellProps) => {
    const contexte = utiliserContexte();
    const optionCartoChoisie = contexte?.optionCartoChoisie ?? "";
    const optionsCartos = contexte?.optionsCartos ?? [];
    const optionCentreChoisie = contexte?.optionCentreChoisie??"";
    const optionsCentres = contexte?.optionsCentres??[];


    const urlCarto = optionsCartos.find((entree) => entree.id === optionCartoChoisie)?.URL ?? "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    const attributionCarto = optionsCartos.find((entree) => entree.id === optionCartoChoisie)?.attribution ?? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    const zoomCarto = optionsCartos.find((entree) => entree.id === optionCartoChoisie)?.zoomMax ?? 18

    const DEFAULT_CENTER: LatLng = optionsCentres.find((entree)=>entree.idLieu === optionCentreChoisie)?.centreDebut ??latLng([45.5017, -73.5673])
    const DEFAULT_ZOOM:number = optionsCentres.find((entree)=>entree.idLieu===optionCentreChoisie)?.zoomDebut ?? 12;
    if (!DEFAULT_CENTER || !DEFAULT_ZOOM) {
        return <div>Loading map...</div>;
    }
    
    const mapCenter = center ?? DEFAULT_CENTER;
    const mapZoom = zoom ?? DEFAULT_ZOOM;
    return (
        <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            style={{ height: "100%", width: "100%" }}
            preferCanvas
        >
            <TileLayer
                url={urlCarto}
                attribution={attributionCarto}
            />

            {onViewportChange && (
                <MapEvents onViewportChange={onViewportChange} />
            )}

            {children}
        </MapContainer>
    );
};

export default MapShell;