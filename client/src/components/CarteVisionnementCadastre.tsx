import { useState, useEffect } from "react";
import MapShell from "../map/MapShell";
import CadastreLayer from "../map/layers/CadastreLayers";
import { useCadastreViewport } from "../map/hooks/useCadastreViewport";
import type { FeatureCollection, Geometry } from "geojson";
import type { lotCadastralGeoJsonProperties } from "../types/DataTypes";
import { useMap } from "react-leaflet";

const CarteVisionnementCadastre = () => {
    const [data, setData] = useState<FeatureCollection<Geometry, lotCadastralGeoJsonProperties> | null>(null);

    // Returns a debounced, zoom-gated handler
    const handleViewportChange = useCadastreViewport(setData);
    
    return (
        <div className="map-container">
            <MapShell 
                onViewportChange={handleViewportChange} 
                zoom={16}>
                {data && <CadastreLayer data={data} />}
            </MapShell>
        </div>
    );
};

export default CarteVisionnementCadastre;