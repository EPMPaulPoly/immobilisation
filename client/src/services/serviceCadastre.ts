import axios,{ AxiosResponse } from 'axios';
import { lotCadastralGeoJsonProperties, quartiers_analyse, roleFoncierGeoJsonProps,lotCadastralAvecBoolInvGeoJsonProperties } from '../types/DataTypes';
import { ReponseCadastre, ReponseRole,ReponseDBCadastre,ReponseDBRole, ReponseDBCadastreBoolInv,ReponseCadastreBoolInv, RequeteApiStrate, RequeteApiCadastre } from '../types/serviceTypes';
import api from './api';
import {FeatureCollection, Geometry } from 'geojson';
import { Dispatch,SetStateAction } from 'react';

class ServiceCadastre {
    async chercheTousCadastres():Promise<ReponseCadastre> {
        try {
            const response: AxiosResponse<ReponseDBCadastreBoolInv> = await api.get(`/cadastre`);
            const data_res = response.data.data;
            const featureCollection: FeatureCollection<Geometry, lotCadastralAvecBoolInvGeoJsonProperties> = {
                type: "FeatureCollection",
                features: data_res.map((item) => ({
                    type: "Feature",
                    geometry: JSON.parse(item.geojson_geometry),
                    properties: {
                        g_no_lot:item.g_no_lot,
                        g_va_suprf:item.g_va_suprf,
                        g_nb_coo_1:item.g_nb_coo_1,
                        g_nb_coord:item.g_nb_coord,
                        bool_inv:item.bool_inv
                    }
                }))
            };
            return {success:response.data.success,data:featureCollection};
        } catch (error: any) {
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
    async chercheCadastreQuery(requete:RequeteApiCadastre):Promise<ReponseCadastreBoolInv>{
        try{
            let queries:string[]=[]
            if(requete.id_strate!==undefined){
                queries.push(`id_strate=${requete.id_strate}`)
            }
            if (requete.id_quartier!==undefined){
                queries.push(`id_quartier=${requete.id_quartier}`)
            }
            if (requete.bbox!==undefined){
                queries.push(`bbox=${requete.bbox.join(',')}`)
            }
            if (requete.estime!==undefined){
                queries.push(`estime=${requete.estime}`)
            }
            if (requete.inv_surf_plus_grand!==undefined){
                queries.push(`inv_surf_plus_grand=${requete.inv_surf_plus_grand}`)
            }
            if (requete.inv_plus_grand!==undefined){
                queries.push(`inv_plus_grand=${requete.inv_plus_grand}`)
            }
            if (requete.superf_plus_grand!==undefined){
                queries.push(`superf_plus_grand=${requete.superf_plus_grand}`)
            }
            if (requete.g_no_lot!==undefined){
                queries.push(`g_no_lot=${requete.g_no_lot.replace(" ","_")}`)
            }
            let final_query = '/cadastre/lot-query'
            if (queries.length>0){
                final_query+='?'+queries.join('&')
            } 
            const response: AxiosResponse<ReponseDBCadastreBoolInv> = await api.get(final_query);
            const data_res = response.data.data;
            const featureCollection: FeatureCollection<Geometry, lotCadastralAvecBoolInvGeoJsonProperties> = {
                type: "FeatureCollection",
                features: data_res.map((item) => ({
                    type: "Feature",
                    geometry: JSON.parse(item.geojson_geometry),
                    properties: {
                        g_no_lot:item.g_no_lot,
                        g_va_suprf:item.g_va_suprf,
                        g_nb_coo_1:item.g_nb_coo_1,
                        g_nb_coord:item.g_nb_coord,
                        bool_inv:item.bool_inv
                    }
                }))
            };
            return {success:response.data.success,data:featureCollection};
        }catch(error:any){
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
    async obtiensCadastreParId(id:string):Promise<ReponseCadastre> {
        try{
            const formattedId = id.replace(/ /g, "_");
            const response: AxiosResponse<ReponseDBCadastreBoolInv> = await api.get(`/cadastre/lot/${formattedId}`);
            const data_res = response.data.data;
            const featureCollection: FeatureCollection<Geometry, lotCadastralAvecBoolInvGeoJsonProperties> = {
                type: "FeatureCollection",
                features: data_res.map((item) => ({
                    type: "Feature",
                    geometry: JSON.parse(item.geojson_geometry),
                    properties: {
                        g_no_lot:item.g_no_lot,
                        g_va_suprf:item.g_va_suprf,
                        g_nb_coo_1:item.g_nb_coo_1,
                        g_nb_coord:item.g_nb_coord,
                        bool_inv:item.bool_inv
                    }
                }))
            };
            return {success:response.data.success,data:featureCollection};
        }catch(error:any){
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
    async chercheRoleAssocieParId(ids:string):Promise<ReponseRole>{
        try {
            const formattedId = ids.replace(/ /g, "_");
            const response: AxiosResponse<ReponseDBRole> = await api.get(`/cadastre/role-associe/${formattedId}`);
            const data_res = response.data.data;
            const featureCollection: FeatureCollection<Geometry, roleFoncierGeoJsonProps> = {
                type: "FeatureCollection",
                features: data_res.map((item) => ({
                    type: "Feature",
                    geometry: JSON.parse(item.geojson_geometry),
                    properties: {
                        id_provinc:item.id_provinc,
                        rl0105a:item.rl0105a,
                        rl0306a:item.rl0306a,
                        rl0307a:item.rl0307a,
                        rl0307b:item.rl0307b,
                        rl0308a:item.rl0308a,
                        rl0311a:item.rl0311a,
                        rl0312a:item.rl0312a,
                        rl0404a:item.rl0404a,
                        rl0101a:item.rl0101a,
                        rl0101e:item.rl0101e,
                        rl0101g:item.rl0101g
                    }
                }))
            };
            return {success:response.data.success,data:featureCollection};
        } catch (error: any) {
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

    async obtiensCadastreParQuartier(id:number):Promise<ReponseCadastreBoolInv>{
        try {
            const response: AxiosResponse<ReponseDBCadastreBoolInv> = await api.get(`/cadastre/lot/quartier-ana/${id}`);
            const data_res = response.data.data;
            const featureCollection: FeatureCollection<Geometry, lotCadastralAvecBoolInvGeoJsonProperties> = {
                type: "FeatureCollection",
                features: data_res.map((item) => ({
                    type: "Feature",
                    geometry: JSON.parse(item.geojson_geometry),
                    properties: {
                        g_no_lot:item.g_no_lot,
                        g_va_suprf:item.g_va_suprf,
                        g_nb_coo_1:item.g_nb_coo_1,
                        g_nb_coord:item.g_nb_coord,
                        bool_inv:item.bool_inv
                    }
                }))
            };
            return {success:response.data.success,data:featureCollection};
        } catch (error: any) {
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
    async verseCadastreFlux(
        fichier:File,
        onProgress?: Dispatch<SetStateAction<number>>
    ):Promise<{ tempFileId: string, columns:string[] }>{
        const formData = new FormData();
        formData.append("file", fichier);

        const response = await api.post("/cadastre/temp-upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress: (e) => {
                if (!e.total) return;
                const percent = Math.round((e.loaded / e.total) * 100);
                onProgress?.(percent); // call the callback if provided
            },
        });
        return response.data; // { tempFileId: "xyz123.tmp" ,['colonne_1','colonne_2']}   
    }
    async confirmeMajBDTemp(fileId:string,mapping:Record<string,string>):Promise<{success:boolean,data:number}>{
        try{
            const body = {
                mapping: mapping,
                file_id: fileId
            }
            const response = await api.post('/cadastre/import',body)
            return{success:response.data.success,data: response.data.data}
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

export const serviceCadastre =  new ServiceCadastre();