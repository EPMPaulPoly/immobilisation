import { LatLngBounds } from "leaflet";
import { Bounds } from "../../types/MapTypes";


export function LatLngBoundsToBounds (limites:LatLngBounds|null){
    const bbox = limites ? (() => {
                const sw =limites.getSouthWest();
                const ne = limites.getNorthEast();
                return { minx: sw.lng, miny: sw.lat, maxx: ne.lng, maxy: ne.lat };
                })()
            : null;
    return bbox
}

export function BoundsToArray (bounds:Bounds){
    return [bounds.minx, bounds.miny, bounds.maxx, bounds.maxy]
}