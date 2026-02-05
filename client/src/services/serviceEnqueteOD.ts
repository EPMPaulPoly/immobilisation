import { FeatureCollection, Geometry } from "geojson";
import { depGeoJSONProperties, ODFeatureCollection } from "../types/DataTypes";
import { ODGeomTypes } from "../types/EnumTypes";
import axios, { AxiosResponse } from "axios";
import { LatLngBounds } from "leaflet";
import api from "./api";
import { ReponseODDB } from "../types/serviceTypes";


export const ServiceEnqueteOD ={
    obtiensDonneesEnquete: async (type:ODGeomTypes,bbox:LatLngBounds):Promise<ODFeatureCollection>=>{
        try{
            let queries:string[]=[];
            if (type){
                queries.push(`type=${type}`)
            }
            if (bbox){
                
            }
            const query = '/enqueteOD'
            const response: AxiosResponse<ReponseODDB> = await api.get(`/enqueteOD?`);
            const out = {type:'FeatureCollection',features:[]} as FeatureCollection<Geometry,depGeoJSONProperties>
            return out
        }catch (error: any) {
            if (axios.isAxiosError(error)) {
                console.error('Axios Error:', error.response?.data);
                console.error('Axios Error Status:', error.response?.status);
                console.error('Axios Error Data:', error.response?.data);
            } else {
                console.error('Unexpected Error:', error);
            }
            throw error; // Re-throw if necessary
        }
    }
}