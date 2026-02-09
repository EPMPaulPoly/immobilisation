import { useViewportData } from "./useViewPortData";
import { serviceCadastre } from "../../services";
import { Bounds } from '../../types/MapTypes';
import { Feature, FeatureCollection, Geometry } from "geojson";
import { lotCadastralGeoJsonProperties, roleFoncierGeoJsonProps } from "../../types/DataTypes";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { serviceRole } from "../../services/serviceRoleFoncier";
import { BoundsToArray } from "../utils/LatLngBndsToBounds";

export function useRoleViewport(
    setData:Dispatch<SetStateAction<FeatureCollection<Geometry,roleFoncierGeoJsonProps>|null>>,
    data?:FeatureCollection<Geometry,roleFoncierGeoJsonProps>|null,
    setRoleSelect?:Dispatch<SetStateAction<FeatureCollection<Geometry,roleFoncierGeoJsonProps>|null>>,
    setRoleRegard?:Dispatch<SetStateAction<string>>
) {
    const { handleViewportChange } = useViewportData({
        minZoom: 16,
        onFetch: async ({ bounds }) => {
            try{
                const response = await serviceRole.obtiensRoleFonciers({
                    bbox: BoundsToArray(bounds),
                });
                const out = response.data as FeatureCollection<Geometry,roleFoncierGeoJsonProps>
                
                setData(out);
                if (setRoleSelect && setRoleRegard){
                    setRoleSelect({type:'FeatureCollection',features:[]})
                    setRoleRegard('')
                }
            } catch(err:any){
                console.log(err)
                setData(null); // fallback
                if (setRoleSelect && setRoleRegard){
                    setRoleSelect({type:'FeatureCollection',features:[]})
                    setRoleRegard('')
                }
            }
        },
        onClear: () => {
            try{
                setData(null);
                if (setRoleSelect && setRoleRegard){
                    setRoleSelect({type:'FeatureCollection',features:[]})
                    setRoleRegard('')
                }
            }catch(err:any){
                console.log(err)
                setData(null)
                if (setRoleSelect && setRoleRegard){
                    setRoleSelect({type:'FeatureCollection',features:[]})
                    setRoleRegard('')
                }
            }
            
        },
    });

    return handleViewportChange;
}