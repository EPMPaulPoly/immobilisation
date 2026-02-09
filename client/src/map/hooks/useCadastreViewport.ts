import { useViewportData } from "./useViewPortData";
import { serviceCadastre } from "../../services";
import { Bounds } from '../../types/MapTypes';
import { Feature, FeatureCollection, Geometry } from "geojson";
import { lotCadastralGeoJsonProperties } from "../../types/DataTypes";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { BoundsToArray } from "../utils/LatLngBndsToBounds";

export function useCadastreViewport(
    setData:Dispatch<SetStateAction<FeatureCollection<Geometry,lotCadastralGeoJsonProperties>|null>>,
    data?:FeatureCollection<Geometry,lotCadastralGeoJsonProperties>|null,
    setCadaSelect?:Dispatch<SetStateAction<FeatureCollection<Geometry,lotCadastralGeoJsonProperties>|null>>,
) {
    const { handleViewportChange } = useViewportData({
        minZoom: 16,
        onFetch: async ({ bounds }) => {
            try{
                const response = await serviceCadastre.chercheCadastreQuery({
                    bbox: BoundsToArray(bounds),
                });
                const out = response.data as FeatureCollection<Geometry,lotCadastralGeoJsonProperties>
                setData(out);
                if (setCadaSelect){
                    setCadaSelect({type:'FeatureCollection',features:[]})
                }
            } catch(err:any){
                console.log(err)
                setData(null); // fallback
                if (setCadaSelect){
                    setCadaSelect({type:'FeatureCollection',features:[]})
                }
            }
        },
        onClear: () => {
            try{
                setData(null);
                if (setCadaSelect){
                    setCadaSelect({type:'FeatureCollection',features:[]})
                }
            }catch(err:any){
                console.log(err)
                setData(null)
                if (setCadaSelect){
                    setCadaSelect({type:'FeatureCollection',features:[]})
                }
            }  
        },
    });
    return handleViewportChange;
}
