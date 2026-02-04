import { useViewportData } from "./useViewPortData";
import { serviceCadastre } from "../../services";
import { Bounds } from '../../types/MapTypes';
import { Feature, FeatureCollection, Geometry } from "geojson";
import { lotCadastralGeoJsonProperties, recensementGeoJsonProperties } from "../../types/DataTypes";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { serviceRecensement } from "../../services/serviceRecensement";

export function useRecensementViewPort(
    setData:Dispatch<SetStateAction<FeatureCollection<Geometry,recensementGeoJsonProperties>|null>>,
    annee:2016|2021,
    data?:FeatureCollection<Geometry,recensementGeoJsonProperties>|null,
) {
    const { handleViewportChange } = useViewportData({
        minZoom: 16,
        onFetch: async ({ bounds }) => {
            try{
                const response = await serviceRecensement.chercheRecensementQuery({
                    annee:annee,   
                    bbox: [bounds.minx, bounds.miny, bounds.maxx, bounds.maxy],
                });
                const out = response.data as unknown as FeatureCollection<Geometry,recensementGeoJsonProperties>
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
