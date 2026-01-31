import { useViewportData } from "./useViewPortData";
import { serviceCadastre } from "../../services";
import { Bounds } from '../../types/MapTypes';
import { Feature, FeatureCollection, Geometry } from "geojson";
import { lotCadastralGeoJsonProperties, roleFoncierGeoJsonProps } from "../../types/DataTypes";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { serviceRole } from "../../services/serviceRoleFoncier";

export function useRoleViewport(setData:Dispatch<SetStateAction<FeatureCollection<Geometry,roleFoncierGeoJsonProps>|null>>,data?:FeatureCollection<Geometry,lotCadastralGeoJsonProperties>|null) {
  
    
    
    
    const { handleViewportChange } = useViewportData({
        minZoom: 16,
        onFetch: async ({ bounds }) => {
            try{
                
                const response = await serviceRole.obtiensRoleFonciers({
                    bbox: [bounds.minx, bounds.miny, bounds.maxx, bounds.maxy],
                });
                const out = response.data as FeatureCollection<Geometry,roleFoncierGeoJsonProps>
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