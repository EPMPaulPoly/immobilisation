import axios,{ AxiosResponse } from 'axios';
import { 
    roleFoncierGeoJsonProps,
    lotCadastralAvecBoolInvGeoJsonProperties, 
    recensementGeoJsonProperties,
    recensementDB
} from '../types/DataTypes';
import { 
    ReponseCadastre, 
    ReponseRole,
    ReponseDBRole, 
    ReponseDBCadastreBoolInv,
    ReponseCadastreBoolInv, 
    RequeteApiCadastre, 
    ReponseRecensement} from '../types/serviceTypes';
import api from './api';
import {
    FeatureCollection, 
    Geometry 
} from 'geojson';

class ServiceRecensement {

    async chercheRecensementQuery(requete:{annee:2016|2021,bbox:number[]}):Promise<ReponseRecensement>{
        try{
            let queries:string[]=[]
            
            if (requete.bbox!==undefined){
                queries.push(`bbox=${requete.bbox.join(',')}`)
            }
            
            let final_query = `/recensement/${requete.annee}`
            if (queries.length>0){
                final_query+='?'+queries.join('&')
            } 
            const response: AxiosResponse<recensementDB[]> = await api.get(final_query);
            const data_res = response.data;
            const featureCollection: FeatureCollection<Geometry, recensementGeoJsonProperties> = {
                type: "FeatureCollection",
                features: data_res.map((item) => ({
                    type: "Feature",
                    geometry: item.geometry??{},
                    properties: {
                        ADIDU:item.ADIDU,
                        pop_2016:item.pop_2016,
                        pop_2021:item.pop_2021,
                        habitats_2016:item.habitats_2016,
                        habitats_2021:item.habitats_2021
                    }
                }))
            };
            return {success:true,data:featureCollection};
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

export const serviceRecensement = new ServiceRecensement()

