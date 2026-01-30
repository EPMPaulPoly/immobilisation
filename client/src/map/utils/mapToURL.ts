import { useMap } from "react-leaflet";
import { useEffect } from "react";
export function MapToUrl() {
  const map = useMap(); // map: L.Map

  useEffect(() => {
    const updateUrl = () => {
      const center = map.getCenter();
      const zoom = map.getZoom();

      // Build query string
      const params = new URLSearchParams();
      params.set("lat", center.lat.toFixed(5));
      params.set("lng", center.lng.toFixed(5));
      params.set("zoom", zoom.toString());

      // Update browser URL without reloading
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState(null, "", newUrl); 
    };

    map.on("moveend", updateUrl);

    // Cleanup on unmount
    return () => {
      map.off("moveend", updateUrl);
    };
  }, [map]); // only run once after map is ready

  return null;
}