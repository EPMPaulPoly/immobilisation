import { useViewportData } from "./useViewPortData";
import { serviceCadastre } from "../../services";
import { Bounds } from '../../types/MapTypes';
import { Feature, FeatureCollection, Geometry } from "geojson";
import { lotCadastralGeoJsonProperties } from "../../types/DataTypes";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { BoundsToArray } from "../utils/LatLngBndsToBounds";

export function useAssocRoleCadastreViewport(
    setCadastre:Dispatch<SetStateAction<FeatureCollection<Geometry,lotCadastralGeoJsonProperties>|null>>,
    data?:FeatureCollection<Geometry,lotCadastralGeoJsonProperties>|null
) {
    const { handleViewportChange } = useViewportData({
        minZoom: 16,
        onFetch: async ({ bounds }) => {
            try{
                const response = await serviceCadastre.chercheCadastreQuery({
                    bbox: BoundsToArray(bounds),
                });
                const out = response.data as FeatureCollection<Geometry,lotCadastralGeoJsonProperties>
                setCadastre(out);
            } catch(err:any){
                console.log(err)
                setCadastre(null); // fallback
            }
        },
        onClear: () => {
            try{
                setCadastre(null);
            }catch(err:any){
                console.log(err)
                setCadastre(null)
            }
        },
    });
    return handleViewportChange;
}
