import { useEffect } from "react";
import { useMap } from "react-leaflet";

export function URLToMap() {
  const map = useMap();

  useEffect(() => {
    const applyFromURL = () => {
      const params = new URLSearchParams(window.location.search);
      const lat = parseFloat(params.get("lat") || "");
      const lng = parseFloat(params.get("lng") || "");
      const zoom = parseInt(params.get("zoom") || "", 10);

      if (!isNaN(lat) && !isNaN(lng) && !isNaN(zoom)) {
        map.setView([lat, lng], zoom, { animate: false });
      }
    };

    // Apply once on mount
    applyFromURL();

    // Apply again on browser back/forward
    window.addEventListener("popstate", applyFromURL);

 
  }, [map]);

  return null;
}