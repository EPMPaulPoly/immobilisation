import { useMapEvents } from "react-leaflet";
import { useEffect, useRef } from "react";
import { MapEventsProps } from "../types/MapTypes";

const MapEvents = ({ onViewportChange }: MapEventsProps) => {
    const prevBounds = useRef<string | null>(null);
    const map = useMapEvents({
        moveend: () => triggerViewportChange(),
        zoomend: () => triggerViewportChange(),
    });

    const triggerViewportChange = () => {
        if (!onViewportChange) return;
        const bounds = map.getBounds();
        const viewport = {
            zoom: map.getZoom(),
            bounds: {
                minx: bounds.getWest(),
                miny: bounds.getSouth(),
                maxx: bounds.getEast(),
                maxy: bounds.getNorth(),
            },
        };
        const boundsKey = JSON.stringify(viewport.bounds);

        // Only call if bounds actually changed
        if (prevBounds.current !== boundsKey) {
            prevBounds.current = boundsKey;
            onViewportChange(viewport);
        }
    };

    // Trigger initial viewport once
    useEffect(() => {
        triggerViewportChange();
    }, []); // <-- empty so only fires once

    return null;
};

export default MapEvents;