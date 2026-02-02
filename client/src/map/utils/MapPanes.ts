import { useMap } from "react-leaflet";
import { useEffect } from "react";

export function MapPanes() {
  const map = useMap();

  useEffect(() => {
    const panes = [
      { name: "lots", z: 400 },
      { name: "role", z: 450 },
    ];

    panes.forEach(({ name, z }) => {
      if (!map.getPane(name)) {
        map.createPane(name);
        map.getPane(name)!.style.zIndex = String(z);
      }
    });
  }, [map]);

  return null;
}