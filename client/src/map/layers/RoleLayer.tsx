import { GeoJSON as LGeoJson, useMap, Popup, CircleMarker } from "react-leaflet";
import { CadastreLayerProps, RoleLayerProps } from "../../types/MapTypes";
import L, { Bounds, LatLng, Layer, PathOptions, } from "leaflet";
import { lotCadastralGeoJsonProperties, roleFoncierGeoJsonProps } from "../../types/DataTypes";
import { useGeoJSONKeyFromBounds } from "../utils/useGeoJSONKeyFromBounds";
import { Button } from "@mui/material";
import ReactDOM from 'react-dom';
import { Feature, FeatureCollection, Geometry, Point } from "geojson";
import { createRoot } from 'react-dom/client';
import selectLotRole from "../../utils/selectLotRole";
const RoleLayer = (props: RoleLayerProps) => {
    const map = useMap();
    // Style function
    const style = (feature?: Feature<any, any>): PathOptions => ({
        color: feature?.properties?.id_provinc === props.roleRegard ? "#efe011" : "#d90000",
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
                    {props.defLotSelect && 
                    props.defRoleSelect && 
                    props.defRoleRegard?
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {selectLotRole({
                                    id_provinc:feature.properties.id_provinc??'',
                                    defLotSelect:props.defLotSelect,
                                    defRoleSelect:props.defRoleSelect,
                                    defRoleRegard:props.defRoleRegard
                                })
                                layer.closePopup();
                            }
                            }
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
    const key = useGeoJSONKeyFromBounds(props.data,props.roleRegard);
    const sortedFeatures = [
    ...props.data.features.filter(f => f.properties.id_provinc !== props.roleRegard),
    ...props.data.features.filter(f => f.properties.id_provinc === props.roleRegard)
    ] as unknown as FeatureCollection<Geometry,roleFoncierGeoJsonProps>

    return <LGeoJson
        data={sortedFeatures}
        key={key}
        pointToLayer={(feature: Feature<Point>, latlng: LatLng) => {
            const isSelected = feature.properties?.id_provinc === props.roleRegard;
            return L.circleMarker(latlng, {
                radius: isSelected ? 10 : 6,          // selected points are bigger
                color: isSelected ? "#efe011" : "#d90000",
                weight: 2,
                fillOpacity: isSelected ? 0.6 : 0.4,
            });
        }}
        onEachFeature={onEachFeature}
    />
};

export default RoleLayer;
