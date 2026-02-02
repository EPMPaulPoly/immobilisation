import { GeoJSON as LGeoJson, useMap, Popup, CircleMarker } from "react-leaflet";
import { CadastreLayerProps, RoleLayerProps } from "../../types/MapTypes";
import L, { Bounds, LatLng, Layer, } from "leaflet";
import { lotCadastralGeoJsonProperties } from "../../types/DataTypes";
import { useGeoJSONKeyFromBounds } from "../utils/useGeoJSONKeyFromBounds";
import { Button } from "@mui/material";
import ReactDOM from 'react-dom';
import { Feature, Point } from "geojson";
import { createRoot } from 'react-dom/client';
const RoleLayer = (props: RoleLayerProps) => {
    const map = useMap();
    // Style function
    const style = () => ({
        color: "#d90000",
        weight: 1,
        fillOpacity: 0.4,
    });
    const onEachFeature = (feature: Feature<any, any>, layer: Layer) => {
        if (feature.properties) {
            // Create a div for React to render into
            const popupDiv = document.createElement('div');

            // Create a React root and render your popup content
            const root = createRoot(popupDiv);
            root.render(
                <div>
                    <div><strong>ID:</strong> {feature.properties.id_provinc}</div>
                    <div><strong>Valeur:</strong> {feature.properties.rl0404a || "N/A"}</div>
                    <div><strong>CUBF:</strong> {feature.properties.rl0105a || "N/A"}</div>
                    <div><strong>Aire étages:</strong> {feature.properties.rl0308a || "N/A"}</div>
                    <div><strong>Nombre de logements:</strong> {feature.properties.rl0311a || "N/A"}</div>
                    {props.lotSelect && props.defLotSelect && props.defRoleSelect && props.defLotSelect && props.defRoleRegard?
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => alert(`Clicked ${feature.properties.id_provinc}`)}
                    >
                        Voir détails
                    </Button>:<>
                    
                    </>}
                    
                </div>
            );

            // Bind the div as popup content
            layer.bindPopup(popupDiv);
        }
    };

    if (!props.data) return null;
    const key = useGeoJSONKeyFromBounds(props.data);
    return <LGeoJson
        data={props.data}
        pointToLayer={(feature: Feature<Point>, latlng: LatLng) => L.circleMarker(latlng)}
        style={style}
        onEachFeature={onEachFeature}
    />
};

export default RoleLayer;
