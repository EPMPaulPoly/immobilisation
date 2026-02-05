import { useViewportData } from "./useViewPortData";
import { serviceCadastre } from "../../services";
import { Feature, FeatureCollection, Geometry } from "geojson";
import { lotCadastralGeoJsonProperties } from "../../types/DataTypes";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { BoundsToArray } from "../utils/LatLngBndsToBounds";
import { ODGeomTypes } from "../../types/EnumTypes";

export function useEnqueteODViewPort(
    setData:Dispatch<SetStateAction<FeatureCollection<Geometry,lotCadastralGeoJsonProperties>|null>>,
    view:ODGeomTypes,
    minZoom:number
) {
    const { handleViewportChange } = useViewportData({
        minZoom: minZoom,
        onFetch: async ({ bounds }) => {
            try{
                const response = await serviceCadastre.chercheCadastreQuery({
                    bbox: BoundsToArray(bounds),
                });
                const out = response.data as FeatureCollection<Geometry,lotCadastralGeoJsonProperties>
                setData(out);
            } catch(err:any){
                console.log(err)
                setData(null); // fallback
            }
        },
        onClear: () => {
            try{
                setData(null);
            }catch(err:any){
                console.log(err)
                setData(null)
            }  
        },
    });
    return handleViewportChange;
}
