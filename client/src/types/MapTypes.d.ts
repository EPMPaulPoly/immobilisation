import { Dispatch, ReactNode, SetStateAction } from "react";
import { lotCadastralGeoJsonProperties, ODFeatureCollection, recensementGeoJsonProperties, roleFoncierGeoJsonProps } from "./DataTypes";
import { FeatureCollection, Geometry } from "geojson";
import { LatLngBounds } from "leaflet";
import { ODGeomTypes } from "./EnumTypes";

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
    minZoom?:number;
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
  lotSelect?: Feature<Geometry,lotCadastralGeoJsonProperties>|null;
  defLotSelect?: Dispatch<SetStateAction<Feature<Geometry,lotCadastralGeoJsonProperties>|null>>
  roleSelect?:FeatureCollection<Geometry,roleFoncierGeoJsonProps>|null
  defRoleSelect?:Dispatch<SetStateAction<FeatureCollection<Geometry,roleFoncierGeoJsonProps>|null >>
  defRoleRegard?:Dispatch<SetStateAction<string>>
};

export type RoleLayerProps = {
  data: FeatureCollection<Geometry, roleFoncierGeoJsonProps>;
  lotSelect?: Feature<Geometry,lotCadastralGeoJsonProperties>|null;
  defLotSelect?: Dispatch<SetStateAction<Feature<Geometry,lotCadastralGeoJsonProperties>|null>>
  roleSelect?:FeatureCollection<Geometry,roleFoncierGeoJsonProps>|null
  defRoleSelect?:Dispatch<SetStateAction<FeatureCollection<Geometry,roleFoncierGeoJsonProps>|null>>
  roleRegard?:string
  defRoleRegard?:Dispatch<SetStateAction<string>>
}

export type RecensementLayerProps={
  data: FeatureCollection<Geometry,recensementGeoJsonProperties>
}

export type ODLayerProps={
  data:ODFeatureCollection
  vue:ODGeomTypes
}

export interface MapToURLProps{
    
}