import { GeoJSON as LGeoJson, useMap,  } from "react-leaflet";
import { GeoJSON,FeatureCollection,Geometry } from "geojson";
import { CadastreLayerProps, RoleLayerProps } from "../../types/MapTypes";
import L, { Bounds } from "leaflet";
import { lotCadastralGeoJsonProperties } from "../../types/DataTypes";
import { useGeoJSONKeyFromBounds } from "../utils/useGeoJSONKeyFromBounds";

const RoleLayer = ({ data }: RoleLayerProps) => {
    const map = useMap();
    // Style function
    const style = () => ({
        color: "#d90000",
        weight: 1,
        fillOpacity: 0.4,
    });

    // Popups
    const onEachFeature = (
        feature: any,
        layer: L.Layer & { bindPopup: any }
    ) => {
        if (feature.properties) {
            layer.bindPopup(
                `<div>
          <strong>ID:</strong> ${feature.properties.id_provinc}<br/>
          <strong>Valeur:</strong> ${feature.properties.rl0404a || "N/A"}<br/>
          <strong>CUBF:</strong> ${feature.properties.rl0105a || "N/A"}<br/>
          <strong>Aire étages:</strong> ${feature.properties.rl0308a|| "N/A"}<br/>
          <strong>Nombre de logements:</strong> ${feature.properties.rl0311a||"N/A"}
        </div>`
            );
        }
    };

    if (!data) return null;
    const key = useGeoJSONKeyFromBounds(data);
    return <LGeoJson 
                key={key}
                data={data} 
                pointToLayer={(feature, latlng) => L.circleMarker(latlng)} 
                onEachFeature={onEachFeature} 
                style={style}
            />;
};

export default RoleLayer;
