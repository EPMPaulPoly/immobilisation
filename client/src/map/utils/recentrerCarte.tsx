import { LatLng } from "leaflet";
import { useEffect } from "react";
import { useMap } from "react-leaflet";

function RecentrerCarte({ center, zoom }: { center: LatLng, zoom: number }) {
    const map = useMap();

    useEffect(() => {
        if (!center) return;

        //map.setView(center, zoom ?? map.getZoom());
        // or smooth:
        map.flyTo(center, zoom ?? map.getZoom(), { duration: 0.8 });

    }, [center, zoom, map]);

    return null;
}

export default RecentrerCarte;