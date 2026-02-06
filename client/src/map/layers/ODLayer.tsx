import { GeoJSON as LGeoJson, useMap,  } from "react-leaflet";
import { Geometry, Feature } from "geojson";
import { ODLayerProps } from "../../types/MapTypes";
import L, { Bounds, Layer, PathOptions } from "leaflet";
import { lotCadastralGeoJsonProperties, ODFeature } from "../../types/DataTypes";
import { useGeoJSONKeyFromBounds } from "../utils/useGeoJSONKeyFromBounds";
import { createRoot } from "react-dom/client";
import { Button } from "@mui/material";
import selectLotRole from "../../utils/selectLotRole";

const ODLayer = (props: ODLayerProps) => {
    const map = useMap();
    // Style function
    const style = (feature?: Feature<any, any>): PathOptions => ({
            color: "#0074D9",
            weight: 1,
            fillOpacity: 0.4,
        });
    // Popups

    const onEachFeature = (feature: ODFeature, layer: Layer) => {
        if (feature.properties) {
            // Create a div for React to render into
            const popupDiv = document.createElement('div');

            // Create a React root and render your popup content
            const root = createRoot(popupDiv);
            root.render(
                props.vue ==='men'?
                <div>
                    <div><strong>Identifiant:</strong> {feature.properties.nolog}</div>
                    <div><strong>Nb Personnes:</strong> {feature.properties.nbper || "N/A"}</div>
                    <div><strong>Nb Veh:</strong> {feature.properties.nbveh || "N/A"}</div>
                    <div><strong>Facteur Ménage:</strong> {feature.properties.facmen || "N/A"}</div>
                </div>:props.vue ==='dep'?<div>
                    <div><strong>Identifiant:</strong> {feature.properties.cledeplacement}</div>
                    <div><strong>Déplacement de la personne:</strong> {feature.properties.nodep || "N/A"}</div>
                    <div><strong>Motif:</strong> {feature.properties.motif || "N/A"}</div>
                    <div><strong>Mode 1:</strong> {feature.properties.mode1 || "N/A"}</div>
                    <div><strong>Mode 2:</strong> {feature.properties.mode2 || "N/A"}</div>
                </div>:<></>
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

export default ODLayer;
