import { useState } from "react";
import MapShell from "../map/MapShell";
import { useCadastreViewport } from "../map/hooks/useCadastreViewport";
import type { FeatureCollection, Geometry } from "geojson";
import type { lotCadastralGeoJsonProperties, ODFeatureCollection, } from "../types/DataTypes";
import ODLayer from "../map/layers/ODLayer";
import { useEnqueteODViewPort } from "../map/hooks/useEnqueteODViewport";
import {ODGeomTypes} from'../types/EnumTypes';

const CarteVerseEnqueteOD = (
    {
        vue
    }:{
        vue:ODGeomTypes
    }
) => {
    const [data, setData] = useState<ODFeatureCollection>(null);

    // Returns a debounced, zoom-gated handler
    const handleViewportChange = useEnqueteODViewPort(setData,vue,16);
    
    return (
        <div className="map-container">
            <MapShell 
                onViewportChange={[handleViewportChange]} 
            >
                {data && 
                    <ODLayer 
                        data={data} 
                        vue={vue}
                    />
                }
            </MapShell>
        </div>
    );
};

export default CarteVerseEnqueteOD;