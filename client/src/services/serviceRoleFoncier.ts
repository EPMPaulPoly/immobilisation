import axios, { AxiosResponse } from "axios";
import { ReponseDBCadastreBoolInv, ReponseDBRole } from "../types/serviceTypes";
import { FeatureCollection, Geometry } from "geojson";
import { lotCadastralAvecBoolInvGeoJsonProperties, roleFoncierGeoJsonProps } from "../types/DataTypes";
import api from "./api";


class ServiceRole {
    async obtiensRoleFonciers(params
        :{
            id_provinc?:string,
            g_no_lot?:string,
            cubf?:number
            bbox?:number[]
        }
    ){
        try{
            let queries:string[]=[]
            if(params.id_provinc!==undefined){
                queries.push(`id_province=${params.id_provinc}`)
            }
            if (params.g_no_lot!==undefined){
                queries.push(`g_no_lot=${params.g_no_lot}`)
            }
            if (params.bbox!==undefined){
                queries.push(`bbox=${params.bbox.join(',')}`)
            }
            if (params.cubf!==undefined){
                queries.push(`cubf=${params.cubf}`)
            }
            let final_query = '/role-foncier'
            if (queries.length>0){
                final_query+='?'+queries.join('&')
            } 
            const response: AxiosResponse<ReponseDBRole> = await api.get(final_query);
            const data_res = response.data.data;
            const featureCollection: FeatureCollection<Geometry, roleFoncierGeoJsonProps> = {
                type: "FeatureCollection",
                features: data_res.map((item) => ({
                    type: "Feature",
                    geometry: item.geometry??JSON.parse(item.geojson_geometry),
                    properties: {
                        id_provinc:item.id_provinc,
                        rl0101a:item.rl0101a,
                        rl0101e:item.rl0101e,
                        rl0101g:item.rl0101g,
                        rl0105a:item.rl0105a,
                        rl0306a:item.rl0306a,
                        rl0307a:item.rl0307a,
                        rl0307b:item.rl0307b, 
                        rl0308a:item.rl0308a, 
                        rl0311a:item.rl0311a, 
                        rl0312a:item.rl0312a, 
                        rl0404a:item.rl0404a
                    }
                }))
            };
            return {success:response.data.success,data:featureCollection};
        }catch(error: any) {
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

export const serviceRole = new ServiceRole