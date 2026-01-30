import { GeoJSON as LGeoJson, useMap,  } from "react-leaflet";
import { GeoJSON,FeatureCollection,Geometry } from "geojson";
import { CadastreLayerProps } from "../../types/MapTypes";
import L, { Bounds } from "leaflet";
import { lotCadastralGeoJsonProperties } from "../../types/DataTypes";
import { useGeoJSONKeyFromBounds } from "../utils/useGeoJSONKeyFromBounds";

const CadastreLayer = ({ data }: CadastreLayerProps) => {
    const map = useMap();
    // Style function
    const style = () => ({
        color: "#0074D9",
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
          <strong>Lot ID:</strong> ${feature.properties.g_no_lot}<br/>
          <strong>Superficie:</strong> ${feature.properties.g_va_suprf || "N/A"}
        </div>`
            );
        }
    };

    if (!data) return null;
    const key = useGeoJSONKeyFromBounds(data);
    return <LGeoJson key={key}data={data} style={style} onEachFeature={onEachFeature} />;
};

export default CadastreLayer;
