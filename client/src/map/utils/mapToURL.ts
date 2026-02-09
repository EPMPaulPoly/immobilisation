import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";

export function MapToUrl() {
    const map = useMap();
    const isProgrammatic = useRef(false);

    useEffect(() => {
        let lastPush = 0;

        const updateUrl = () => {
            const now = Date.now();
            if (now - lastPush < 1000) return; // skip small changes
            lastPush = now;

            const center = map.getCenter();
            const zoom = map.getZoom();

            const params = new URLSearchParams();
            params.set("lat", center.lat.toFixed(5));
            params.set("lng", center.lng.toFixed(5));
            params.set("zoom", zoom.toString());

            window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}`);
        };
        map.on("moveend", updateUrl);
        return () => {
            map.off("moveend", updateUrl);
        };
    }, [map]);

    // Helper to programmatically set view
    const setViewProgrammatic = (lat: number, lng: number, zoom: number) => {
        isProgrammatic.current = true;
        map.setView([lat, lng], zoom, { animate: false });
    };

    // Expose globally if needed, or via context, but still render nothing
    return null;
}