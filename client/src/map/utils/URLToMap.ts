import { useEffect } from "react";
import { useMap } from "react-leaflet";

// Hook to set map view from URL
export function URLToMap() {
  const map = useMap();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const lat = parseFloat(params.get("lat") || "");
    const lng = parseFloat(params.get("lng") || "");
    const zoom = parseInt(params.get("zoom") || "", 10);

    // Only set if values are valid
    if (!isNaN(lat) && !isNaN(lng) && !isNaN(zoom)) {
      map.setView([lat, lng], zoom, { animate: false });
    }
    // No dependency on map changing → runs only once
  }, [map]);

  return null;
}
