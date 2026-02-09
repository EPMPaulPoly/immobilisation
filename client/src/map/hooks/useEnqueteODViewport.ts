import { useViewportData } from "./useViewPortData";
import { serviceCadastre } from "../../services";
import { Feature, FeatureCollection, Geometry } from "geojson";
import { lotCadastralGeoJsonProperties, ODFeatureCollection } from "../../types/DataTypes";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { BoundsToArray } from "../utils/LatLngBndsToBounds";
import { ODGeomTypes } from "../../types/EnumTypes";
import { ServiceEnqueteOD } from "../../services/serviceEnqueteOD";
import { LatLngBounds } from "leaflet";

export function useEnqueteODViewPort(
    setData:Dispatch<SetStateAction<ODFeatureCollection>>,
    view:ODGeomTypes,
    minZoom:number,
    defLimites:Dispatch<SetStateAction<LatLngBounds|null>>,
    mode?:number[]|null,
    motif?:number[]|null,
    heure?:number[]|null
) {
    const { handleViewportChange } = useViewportData({
        minZoom: minZoom,
        onFetch: async ({ bounds }) => {
            try{
                defLimites(
                    new LatLngBounds(
                        [bounds.miny, bounds.minx], // southWest
                        [bounds.maxy, bounds.maxx]  // northEast
                    )
                );
                if (view==='men'){
                    const response = await ServiceEnqueteOD.obtiensMenagesEnquete(
                        BoundsToArray(bounds));
                    const out = response.data as ODFeatureCollection
                    setData(out);
                }
                if (view==='pers'){
                    const response = await ServiceEnqueteOD.obtiensPersEnquete(
                        BoundsToArray(bounds));
                    const out = response.data as ODFeatureCollection
                    setData(out);
                }
                if(view ==='dep'){
                    const response = await ServiceEnqueteOD.obtiensDepEnquete(
                        BoundsToArray(bounds),heure,mode,motif);
                    const out = response.data as ODFeatureCollection
                    setData(out);
                }
                
            } catch(err:any){
                console.log(err)
                setData(null); // fallback
            }
        },
        onClear: () => {
            try{
                defLimites(null)
                setData(null);
            }catch(err:any){
                console.log(err)
                setData(null)
            }  
        },
    });
    return handleViewportChange;
}
