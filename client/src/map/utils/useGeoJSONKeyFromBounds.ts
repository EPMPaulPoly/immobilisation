import { useState, useEffect } from 'react';
import L from 'leaflet';
import { FeatureCollection, Geometry } from 'geojson';

export function useGeoJSONKeyFromBounds(geojsonData: FeatureCollection<Geometry, any>,selected?:string) {
    const [key, setKey] = useState(
        () => JSON.stringify({
            bounds: L.geoJSON(geojsonData).getBounds(),
            selected: selected ?? null,
        })
    );

    useEffect(() => {
        if (!geojsonData?.features?.length) return;

        const newKey = JSON.stringify({
            bounds: L.geoJSON(geojsonData).getBounds(),
            selected: selected ?? null,
        });

        if (newKey !== key) {
            setKey(newKey); // update only if bounds changed
        }
    }, [geojsonData, selected, key]);

    return key;
}