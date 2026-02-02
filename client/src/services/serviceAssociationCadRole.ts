import axios, { AxiosResponse } from "axios";
import { ApiResponse, ReponseInsertionAuto } from "../types/serviceTypes";
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
}

export const serviceAssocCadRole = new ServiceAssocCadRole()