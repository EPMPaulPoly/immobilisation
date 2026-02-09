import axios,{ AxiosResponse } from 'axios';
import { territoire, territoireGeoJsonProperties } from '../types/DataTypes';
import { ReponseTerritoire,ReponseDbTerritoire, ReponseTerritoireUnique, } from '../types/serviceTypes';
import api from './api';
import { FeatureCollection,Geometry,Feature } from 'geojson';

class ServiceTerritoires {
    async chercheTerritoiresParPeriode(id:number):Promise<ReponseTerritoire> {
        try {
            const response: AxiosResponse<ReponseDbTerritoire> = await api.get(`/territoire/periode/${id}`);
            const data_res = response.data.data;
            const featureCollection: FeatureCollection<Geometry, territoireGeoJsonProperties> = {
                type: "FeatureCollection",
                features: data_res.map((item) => ({
                    type: "Feature",
                    geometry: item.geometry,
                    properties: {
                        id_periode_geo: item.id_periode_geo,
                        id_periode: item.id_periode,
                        ville: item.ville,
                        secteur: item.secteur
                    }
                }))
            };
            
            return {success:response.data.success,data:featureCollection};
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

    async chercheTerritoiresParId(id:number):Promise<ReponseTerritoire> {
        try {
            const response: AxiosResponse<ReponseDbTerritoire> = await api.get(`/territoire/periode-geo/${id}`);
            const data_res = response.data.data;
            const featureCollection: FeatureCollection<Geometry, territoireGeoJsonProperties> = {
                type: "FeatureCollection",
                features: data_res.map((item) => ({
                    type: "Feature",
                    geometry: item.geometry,
                    properties: {
                        id_periode_geo: item.id_periode_geo,
                        id_periode: item.id_periode,
                        ville: item.ville,
                        secteur: item.secteur
                    }
                }))
            } as FeatureCollection<Geometry,territoireGeoJsonProperties>;

            return {success:response.data.success,data:featureCollection};
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

    async ajouteTerritoiresEnBloc(id_periode:number,territoires:FeatureCollection<Geometry, territoireGeoJsonProperties>):Promise<ReponseTerritoire> {
        try {
            const reformattedSecteurs = territoires.features.map((feature:Feature<Geometry,Omit<territoireGeoJsonProperties,'id_periode_geo'>>) => ({
                id_periode: id_periode,
                ville: feature.properties.ville,
                secteur: feature.properties.secteur,
                geometry: JSON.stringify(feature.geometry), // Convert geometry to string
            }));
            const response: AxiosResponse<ReponseDbTerritoire> = await api.post(`/territoire/bulk-replace/${id_periode}`,reformattedSecteurs);
            const data = response.data.data;

            const quartiers: FeatureCollection<Geometry,territoireGeoJsonProperties> = {
                type: 'FeatureCollection' as const,
                features: data.map((item: any) => ({
                    type: 'Feature',
                    properties: {
                        id_periode_geo: item.id_periode_geo,
                        ville: item.ville,
                        secteur: item.secteur,
                        id_periode: item.id_periode,
                    },
                    geometry: item.geometry
                }))
            };
            console.log('Recu les quartiers')
            return {success:response.data.success,data:quartiers};
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

    async supprimeTerritoire(id_periode_geo:number):Promise<boolean>{
        try {
            const response: AxiosResponse= await api.delete(`/territoire?id_periode_geo=${id_periode_geo}`);
            const data = response.data;
            if (data.success ===true){
                return true
            }else{
                return false
            }
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

    async supprimeTerritoiresPeriode(id_periode:number):Promise<boolean>{

        try {
            const response: AxiosResponse<ReponseDbTerritoire> = await api.delete(`/territoire?id_periode=${id_periode}`);
            const data = response.data;
            if (data.success ===true){
                return true
            }else{
                return false
            }
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

    async modifieTerritoire(id_periode_geo:number,donnee: Feature<Geometry,territoireGeoJsonProperties>):Promise<ReponseTerritoireUnique>{
        try{
            const reformattedSecteurs = {
                id_periode:donnee.properties.id_periode,
                ville:donnee.properties.ville,
                secteur:donnee.properties.secteur,
                geometry: JSON.stringify(donnee.geometry)
            }
            const response: AxiosResponse<ReponseDbTerritoire> = await api.put(`territoire/${id_periode_geo}`,reformattedSecteurs)
            const quartierModif = response.data.data[0]
            const quartierModifFormat = {
                type:'Feature',
                properties:{
                    id_periode_geo:quartierModif.id_periode_geo,
                    ville: quartierModif.ville,
                    secteur: quartierModif.secteur,
                    id_periode: quartierModif.id_periode
                },
                geometry: quartierModif.geometry
            } as Feature<Geometry,territoireGeoJsonProperties>
            return{success:true,data: quartierModifFormat}
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

export const serviceTerritoires =  new ServiceTerritoires();