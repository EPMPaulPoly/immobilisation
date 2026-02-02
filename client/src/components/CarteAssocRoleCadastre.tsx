import { useState, useEffect } from "react";
import MapShell from "../map/MapShell";
import CadastreLayer from "../map/layers/CadastreLayers";
import { useCadastreViewport } from "../map/hooks/useCadastreViewport";
import type { FeatureCollection, Geometry } from "geojson";
import type { lotCadastralGeoJsonProperties, roleFoncierGeoJsonProps } from "../types/DataTypes";
import { useMap } from "react-leaflet";
import { useRoleViewport } from "../map/hooks/useRoleViewport";

import { MapPanes } from "../map/utils/MapPanes";

import RoleLayers from "../map/layers/RoleLayers";
import { LayersControl } from "react-leaflet";
import { LatLng } from "leaflet";

const CarteAssocRoleCadastre = () => {
    const [cadastre, defCadastre] = useState<FeatureCollection<Geometry, lotCadastralGeoJsonProperties> | null>(null);
    const [role,defRole] = useState<FeatureCollection<Geometry, roleFoncierGeoJsonProps> | null>(null);
    const [voirCadastre, defVoirCadastre] = useState(true);
    const [voirRole, defVoirRole] = useState(false);    
    const { Overlay } = LayersControl;
    // Returns a debounced, zoom-gated handler
    const handleViewportChange = useCadastreViewport(defCadastre);
    const handleRoleViewportChange = useRoleViewport(defRole)
    return (
        <div className="map-container">
            <MapShell 
                onViewportChange={[handleViewportChange,handleRoleViewportChange]} 
            >
                {cadastre && role && <>
                    <MapPanes/>
                    <LayersControl>
                        <Overlay name={"Role"} checked>
                            <RoleLayers data={role}/>
                        </Overlay>
                        <Overlay name={"Cadastre"} checked>
                            <CadastreLayer data={cadastre} />
                        </Overlay>
                    </LayersControl>
                    
                    </>
                }
                
            </MapShell>
        </div>
    );
};

export default CarteAssocRoleCadastre;