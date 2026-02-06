import { FeatureCollection, Geometry } from "geojson";
import { depGeoJSONProperties, depPropertiesDesDB, depPropertiesLigDB, depPropertiesOriDB, menGeoJSONProperties, menPropertiesDB, ODDBType, ODFeatureCollection, persGeoJSONProperties, persPropertiesDB } from "../types/DataTypes";
import { ODGeomTypes } from "../types/EnumTypes";
import axios, { AxiosResponse } from "axios";
import { LatLngBounds } from "leaflet";
import api from "./api";
import { ReponseDepOD, ReponseDepODDB, ReponseMenOD, ReponseMenODDB, ReponseOD, ReponseODDB } from "../types/serviceTypes";
import { Bounds } from "../types/MapTypes";


export const ServiceEnqueteOD ={
    obtiensMenagesEnquete: async (bbox:number[]):Promise<ReponseOD>=>{
        try{
            let queries:string[]=[];
            if (bbox){
                queries.push(`bbox=${bbox.join(',')}`)
            }
            let out:ODFeatureCollection
            if (queries.length>0){
                const query = '/enqueteOD/menage?' + queries.join('&')
                const response: AxiosResponse<ReponseMenODDB> = await api.get(query);
                let features;
                features = response.data.data.map((item:menPropertiesDB)=>{
                    const properties:menGeoJSONProperties = {
                        nolog:item.nolog,
                        nbper:item.nbper,
                        nbveh:item.nbveh,
                        tlog:item.tlog,
                        facmen:item.facmen
                    }
                    const geometry =item.geom_logis
                    return {properties:properties,geometry:geometry}
                })
                out = {type:'FeatureCollection',features:features} as FeatureCollection<Geometry,menGeoJSONProperties>
            }else{
                throw new Error('Fournir au moins un critère de bbox')
            }

            return {success:true,data:out}
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
    },
    obtiensPersEnquete: async (bbox:number[],heure?:number,mode1?:number,motif_gr?:number):Promise<ReponseOD>=>{
        try{
            let queries:string[]=[];
            if (bbox){
                queries.push(`bbox=${bbox.join(',')}`)
            }
            let out:ODFeatureCollection
            if (queries.length>0){
                const query = '/enqueteOD/pers?' + queries.join('&')
                const response: AxiosResponse<ReponseODDB> = await api.get(query);
                let features;
                features = response.data.data.map((item:persPropertiesDB)=>{
                    const properties:persGeoJSONProperties = {
                        clepersonne:item.clepersonne,
                        tper:item.tper,
                        sexe:item.sexe,
                        age:item.age,
                        facper:item.facper,
                        facpermc: item.facpermc,
                        grpage:item.grpage,
                        percond:item.percond,
                        occper:item.occper,
                        mobil:item.mobil
                    }
                    const geometry =item.geom_occ
                    return {properties:properties,geometry:geometry}
                })

                out = {type:'FeatureCollection',features:features}
            }else{
                throw new Error('Fournir au moins un critère de bbox')
            }

            return {success:true,data:out}
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
    },
    obtiensDepEnquete: async (bbox:number[],heure?:number,mode1?:number,motif_gr?:number):Promise<ReponseDepOD>=>{
        try{
            let queries:string[]=[];
            if (bbox){
                queries.push(`bbox=${bbox.join(',')}`)
            }
            if (heure){
                queries.push(`heure=${heure}`)
            }
            if (mode1){
                queries.push(`mode1=${mode1}`)
            }
            if (motif_gr){
                queries.push(`motif_gr=${motif_gr}`)
            }
            let out:ODFeatureCollection
            if (queries.length>0){
                const query = '/enqueteOD?' + queries.join('&')
                const response: AxiosResponse<ReponseDepODDB> = await api.get(query);
                let features;
                features = response.data.data.map((item:depPropertiesLigDB)=>{
                    const properties:depGeoJSONProperties = {
                        cledeplacement:item.cledeplacement,
                        nodep:item.nodep,
                        hredep:item.hredep,
                        heure:item.heure,
                        mode1:item.mode1,
                        mode2:item.mode2,
                        mode3:item.mode3,
                        mode4:item.mode4,
                        motif:item.motif,
                        motif_gr:item.motif_gr,
                        stat:item.stat,
                        cout_stat:item.cout_stat,
                        term_stat:item.term_stat,
                        clepersonne:item.clepersonne
                    }
                    const geometry =item.trip_lines
                    return {properties:properties,geometry:geometry}
                })

                out = {type:'FeatureCollection',features:features} as FeatureCollection<Geometry,depGeoJSONProperties>
            }else{
                throw new Error('Fournir au moins un critère de bbox')
            }

            return {success:true,data:out}
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