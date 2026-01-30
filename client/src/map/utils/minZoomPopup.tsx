import { useMap, Marker, Popup } from 'react-leaflet';
import L, { LatLng } from 'leaflet';
import { useEffect, useState } from 'react';

export function ZoomHint({ minZoom = 12, center }: { minZoom: number, center: LatLng }) {
    const map = useMap();
  const [show, setShow] = useState(map.getZoom() < minZoom);

  useEffect(() => {
  const onZoom = () => {
    setShow(map.getZoom() < minZoom);
  };

  map.on('zoomend', onZoom);

  return () => {
    map.off('zoomend', onZoom); // cleanup returns void
  };
}, [map, minZoom]);

  if (!show) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: '5%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        padding: '12px 16px',
        background: 'rgba(0,0,0,0.75)',
        color: '#fff',
        borderRadius: '6px',
        zIndex: 1000,
        pointerEvents: 'none', // lets user interact with map
        fontSize:20
      }}
    >
      Zoomez pour voir les données
    </div>
  );
}