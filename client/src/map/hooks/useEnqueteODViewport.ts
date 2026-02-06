import { useViewportData } from "./useViewPortData";
import { serviceCadastre } from "../../services";
import { Feature, FeatureCollection, Geometry } from "geojson";
import { lotCadastralGeoJsonProperties, ODFeatureCollection } from "../../types/DataTypes";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { BoundsToArray } from "../utils/LatLngBndsToBounds";
import { ODGeomTypes } from "../../types/EnumTypes";
import { ServiceEnqueteOD } from "../../services/serviceEnqueteOD";

export function useEnqueteODViewPort(
    setData:Dispatch<SetStateAction<ODFeatureCollection>>,
    view:ODGeomTypes,
    minZoom:number
) {
    const { handleViewportChange } = useViewportData({
        minZoom: minZoom,
        onFetch: async ({ bounds }) => {
            try{
                const response = await ServiceEnqueteOD.obtiensDonneesEnquete(view,
                    BoundsToArray(bounds));
                const out = response.data as ODFeatureCollection
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
