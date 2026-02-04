import { useState, useEffect } from "react";
import MapShell from "../map/MapShell";
import CadastreLayer from "../map/layers/CadastreLayer";
import { useCadastreViewport } from "../map/hooks/useCadastreViewport";
import type { FeatureCollection, Geometry } from "geojson";
import type { lotCadastralGeoJsonProperties, recensementGeoJsonProperties } from "../types/DataTypes";
import { useMap } from "react-leaflet";
import RecensementLayer from "../map/layers/RecensementLayer";
import { useRecensementViewPort } from "../map/hooks/useRecensementViewport";

const CarteVisionnementRecensement = (props:{annee:2016|2021}) => {
    const [data, setData] = useState<FeatureCollection<Geometry, recensementGeoJsonProperties> | null>(null);

    // Returns a debounced, zoom-gated handler
    const handleViewportChange = useRecensementViewPort(setData,props.annee);
    
    return (
        <div className="map-container">
            <MapShell 
                onViewportChange={[handleViewportChange]} 
            >
                {data && 
                    <RecensementLayer data={data} />
                }
                
            </MapShell>
        </div>
    );
};

export default CarteVisionnementRecensement;