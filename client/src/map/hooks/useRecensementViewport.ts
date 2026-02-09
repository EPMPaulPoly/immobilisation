import { useViewportData } from "./useViewPortData";
import { Feature, FeatureCollection, Geometry } from "geojson";
import { lotCadastralGeoJsonProperties, recensementGeoJsonProperties } from "../../types/DataTypes";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { serviceRecensement } from "../../services/serviceRecensement";
import { LatLngBounds } from "leaflet";
import { BoundsToArray } from "../utils/LatLngBndsToBounds";

export function useRecensementViewPort(
    setData:Dispatch<SetStateAction<FeatureCollection<Geometry,recensementGeoJsonProperties>|null>>,
    annee:2016|2021,
    defLimites:Dispatch<SetStateAction<LatLngBounds|null>>,
    minZoom?:number
) {
    const { handleViewportChange } = useViewportData({
        minZoom: minZoom?minZoom:16,
        onFetch: async ({ bounds }) => {
            try{
                defLimites(
                    new LatLngBounds(
                        [bounds.miny, bounds.minx], // southWest
                        [bounds.maxy, bounds.maxx]  // northEast
                    )
                );
                const response = await serviceRecensement.chercheRecensementQuery({
                    annee:annee,   
                    bbox: BoundsToArray(bounds),
                });
                const out = response.data as unknown as FeatureCollection<Geometry,recensementGeoJsonProperties>
                setData(out);
            } catch(err:any){
                console.log(err)
                setData(null); // fallback
                defLimites(null)
            }
        },
        onClear: () => {
            try{
                setData(null);
                defLimites(null)
            }catch(err:any){
                console.log(err)
                setData(null)
                defLimites(null)
            }  
        },
    });
    return handleViewportChange;
}
