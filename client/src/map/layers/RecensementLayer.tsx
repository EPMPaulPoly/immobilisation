import { GeoJSON as LGeoJson, useMap,  } from "react-leaflet";
import { GeoJSON,FeatureCollection,Geometry, Feature } from "geojson";
import { CadastreLayerProps, RecensementLayerProps } from "../../types/MapTypes";
import L, { Bounds, Layer, PathOptions } from "leaflet";
import { lotCadastralGeoJsonProperties, recensementGeoJsonProperties } from "../../types/DataTypes";
import { useGeoJSONKeyFromBounds } from "../utils/useGeoJSONKeyFromBounds";
import { createRoot } from "react-dom/client";
import { Button } from "@mui/material";
import selectLotRole from "../../utils/selectLotRole";

const RecensementLayer = (props: RecensementLayerProps) => {
    const map = useMap();
    // Style function
    const style = (feature?: Feature<any, any>): PathOptions => ({
            color:  "#0074D9",
            weight: 1,
            fillOpacity: 0.4,
        });
    // Popups
    const onEachFeature = (feature: Feature<Geometry, recensementGeoJsonProperties>, layer: Layer) => {
        if (feature.properties) {
            // Create a div for React to render into
            const popupDiv = document.createElement('div');

            // Create a React root and render your popup content
            const root = createRoot(popupDiv);
            root.render(
                <div>
                    <div><strong>ADIDU:</strong> {feature.properties.ADIDU}</div>
                    <div><strong>Pop 2021:</strong> {feature.properties.pop_2021 || "N/A"}</div>
                    <div><strong>Pop 2016:</strong> {feature.properties.pop_2016 || "N/A"}</div>
                    <div><strong>Habitats 2021:</strong> {feature.properties.habitats_2021 || "N/A"}</div>
                    <div><strong>Habitats 2016:</strong> {feature.properties.habitats_2016 || "N/A"}</div>
                </div>
            );

            // Bind the div as popup content
            layer.bindPopup(popupDiv);
        }
    };

    if (!props.data) return null;
    const key = useGeoJSONKeyFromBounds(props.data);
    return <LGeoJson 
        key={key}
        data={props.data} 
        style={style} 
        onEachFeature={onEachFeature} 
        />;
};

export default RecensementLayer;
