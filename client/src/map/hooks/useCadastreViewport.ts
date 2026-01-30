import { useViewportData } from "./useViewPortData";
import { serviceCadastre } from "../../services";
import { Bounds } from '../../types/MapTypes';
import { Feature, FeatureCollection, Geometry } from "geojson";
import { lotCadastralGeoJsonProperties } from "../../types/DataTypes";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";

export function useCadastreViewport(setData:Dispatch<SetStateAction<FeatureCollection<Geometry,lotCadastralGeoJsonProperties>|null>>,data?:FeatureCollection<Geometry,lotCadastralGeoJsonProperties>|null) {
  
    
    
    
    const { handleViewportChange } = useViewportData({
        minZoom: 16,
        onFetch: async ({ bounds }) => {
            try{
                
                const response = await serviceCadastre.chercheCadastreQuery({
                    bbox: [bounds.minx, bounds.miny, bounds.maxx, bounds.maxy],
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
