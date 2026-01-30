import { useState, useEffect } from 'react';
import L from 'leaflet';
import { FeatureCollection, Geometry } from 'geojson';

export function useGeoJSONKeyFromBounds(geojsonData: FeatureCollection<Geometry, any>) {
    const [key, setKey] = useState(() => JSON.stringify(L.geoJSON(geojsonData).getBounds()));

    useEffect(() => {
        if (!geojsonData?.features?.length) return;

        const newBounds = L.geoJSON(geojsonData).getBounds();
        const newKey = JSON.stringify(newBounds);

        if (newKey !== key) {
            setKey(newKey); // update only if bounds changed
        }
    }, [geojsonData, key]);

    return key;
}