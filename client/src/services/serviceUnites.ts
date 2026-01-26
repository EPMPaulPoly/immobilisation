import axios,{ AxiosResponse } from "axios";
import { ReponseColonnesConversionUnites, ReponseDBInfoInventaireReglementManuel, ReponseUnitesReglements } from "../types/serviceTypes";
import api from "./api";
import { unites_reglement_stationnement } from "../types/DataTypes";

class ServiceUnites{
    async obtiensUnitesPossibles():Promise<ReponseUnitesReglements>{
        try {
            const response: AxiosResponse<ReponseUnitesReglements> = await api.get(`/unites`);
            const data_res = response.data.data;
            return {success:response.data.success,data:data_res};
        } catch (error) {
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

    async obtiensUnitesReglementsParLot(id:string):Promise<ReponseDBInfoInventaireReglementManuel>{
        try{
            const parseId = id.replace(/ /g, "_");
            const response:AxiosResponse<ReponseDBInfoInventaireReglementManuel> = await api.get(`/unites/par-lot/${parseId}`)
            return{success:response.data.success,data:response.data.data}
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
    async obtiensColonnesPossibles():Promise<ReponseColonnesConversionUnites>{
        try{
            const response:AxiosResponse<ReponseDBInfoInventaireReglementManuel> = await api.get(`/unites/colonnes-possibles`)
            return{success:response.data.success,data:response.data.data}
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
    async creeNouvelleUnite(nouvelleUnite:unites_reglement_stationnement):Promise<ReponseUnitesReglements>{
        try{
            const response:AxiosResponse<ReponseUnitesReglements> = await api.post(`/unites`,nouvelleUnite)
            return{success:response.data.success,data:response.data.data}
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
    async modifieUnite(id_unite:number,nouvelleUnite:unites_reglement_stationnement):Promise<ReponseUnitesReglements>{
        try{
            const response:AxiosResponse<ReponseUnitesReglements> = await api.put(`/unites/${id_unite}`,nouvelleUnite)
            return{success:response.data.success,data:response.data.data}
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
    async supprimeUnite(id_unite:number):Promise<boolean>{
        try{
            const response:AxiosResponse<ReponseUnitesReglements> = await api.delete(`/unites/${id_unite}`)
            if (response.data.success===true){
                return true
            }else{
                return false
            }
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

export const serviceUnites =  new ServiceUnites();