import axios, { AxiosResponse } from "axios";
import { ApiResponse, ReponseAssocRoleCad, ReponseInsertionAuto } from "../types/serviceTypes";
import api from "./api";


class ServiceAssocCadRole{
    async creeAssocAutomatique():Promise<{success:boolean,insert_rows:number}>{
        try{
            const response:AxiosResponse = await api.get(`/assoc-cad-role/bulk-auto`)
            return response.data
        }catch(error){
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

    async obtiensAssoc(options:{id_provinc?:string,g_no_lot?:string}):Promise<ReponseAssocRoleCad>{
        try{
            const queries:string[]=[];

            if (typeof options.id_provinc!=='undefined'){
                queries.push(`id_provinc=${options.id_provinc}`)
            }
            if (typeof options.g_no_lot !=='undefined'){
                queries.push(`g_no_lot=${options.g_no_lot}`)
            }
            let finalQuery = `/assoc-cad-role` 
            if (queries.length>0){
                finalQuery += '?' + queries.join('&')
            }
            const response:AxiosResponse = await api.get(finalQuery)
            return response.data
        }catch(error){
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

export const serviceAssocCadRole = new ServiceAssocCadRole()