import axios, { AxiosResponse } from "axios";
import api from "./api";
import { ReponseSommaireDonnees } from "../types/serviceTypes";


class ServiceSomaireDonnees{
    async obtiensSommaireDonnees():Promise<ReponseSommaireDonnees>{
        try{
            const query = '/sommaire-donnees'
            const response: AxiosResponse<ReponseSommaireDonnees> = await api.get(query);
            return response.data
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
}

export const serviceSommaireDonnees = new ServiceSomaireDonnees()