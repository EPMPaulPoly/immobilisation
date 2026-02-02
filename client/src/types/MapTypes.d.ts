import { ReactNode } from "react";
import { roleFoncierGeoJsonProps } from "./DataTypes";

export interface MapShellProps {
    children?: ReactNode;
    onViewportChange?: ((viewport: {
        zoom: number;
        bounds: {
            minx: number;
            miny: number;
            maxx: number;
            maxy: number;
        };
    }) => void)[];
    center?: LatLng;
    zoom?: number;
};
export interface Bounds {
    minx: number;
    miny: number;
    maxx: number;
    maxy: number;
};
export interface MapEventsProps {
    onViewportChange?: ((viewport: { zoom: number; bounds: Bounds }) => void)[];
};


export interface Viewport{
  zoom: number;
  bounds: Bounds;
};


export type UseViewportDataOptions<T> = {
  minZoom?: number; // ignore events below this zoom
  debounceMs?: number; // default 300ms
  onFetch: (viewport: Viewport) => Promise<T>;
  onClear?: () => void; // optional clearing when zoom < minZoom
};

export type CadastreLayerProps = {
  data: FeatureCollection<Geometry, lotCadastralGeoJsonProperties>;
};

export type RoleLayerProps = {
  data: FeatureCollection<Geometry, roleFoncierGeoJsonProps>;
}

export interface MapToURLProps{
    
}