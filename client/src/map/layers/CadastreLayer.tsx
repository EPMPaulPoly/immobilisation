import { GeoJSON as LGeoJson, useMap,  } from "react-leaflet";
import { GeoJSON,FeatureCollection,Geometry, Feature } from "geojson";
import { CadastreLayerProps } from "../../types/MapTypes";
import L, { Bounds, Layer } from "leaflet";
import { lotCadastralGeoJsonProperties } from "../../types/DataTypes";
import { useGeoJSONKeyFromBounds } from "../utils/useGeoJSONKeyFromBounds";
import { createRoot } from "react-dom/client";
import { Button } from "@mui/material";

const CadastreLayer = (props: CadastreLayerProps) => {
    const map = useMap();
    // Style function
    const style = () => ({
        color: "#0074D9",
        weight: 1,
        fillOpacity: 0.4,
    });

    // Popups
    const onEachFeature = (feature: Feature<Geometry, lotCadastralGeoJsonProperties>, layer: Layer) => {
        if (feature.properties) {
            // Create a div for React to render into
            const popupDiv = document.createElement('div');

            // Create a React root and render your popup content
            const root = createRoot(popupDiv);
            root.render(
                <div>
                    <div><strong>G No Lot:</strong> {feature.properties.g_no_lot}</div>
                    <div><strong>Superficie:</strong> {feature.properties.g_va_suprf || "N/A"}</div>
                    <div><strong>Longitude:</strong> {feature.properties.g_nb_coord || "N/A"}</div>
                    <div><strong>Latitude:</strong> {feature.properties.g_nb_coo_1 || "N/A"}</div>
                    {props.lotSelect!==undefined && 
                    props.defLotSelect!==undefined && 
                    props.defRoleSelect!==undefined && 
                    props.defLotSelect!==undefined && props.defRoleRegard!==undefined?
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => alert(`Clicked ${feature.properties.g_no_lot}`)}
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
    return <LGeoJson key={key}data={props.data} style={style} onEachFeature={onEachFeature} />;
};

export default CadastreLayer;
