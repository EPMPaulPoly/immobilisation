import axios,{ AxiosResponse } from 'axios';
import { quartiers_analyse, quartiers_analyse_db } from '../types/DataTypes.js';
import { ReponseQuartierDBAnalyse, ReponseQuartiersAnalyse } from '../types/serviceTypes.js';
import api from './api.js';


class ServiceQuartiersAnalyse {
    async chercheTousQuartiersAnalyse():Promise<ReponseQuartiersAnalyse> {
        try {
            const response: AxiosResponse<ReponseQuartierDBAnalyse> = await api.get(`/quartiers-analyse`);
            const data:quartiers_analyse_db[] = response.data.data;

            const quartiers: GeoJSON.FeatureCollection<GeoJSON.Geometry, quartiers_analyse> = {
                type: 'FeatureCollection' as const,
                features: data.map((item: any) => ({
                    type: 'Feature',
                    properties: {
                        id_quartier: item.id_quartier,
                        nom_quartier: item.nom_quartier,
                        superf_quartier: item.superf_quartier,
                        acro: item.acro,
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
    async ecraseSecteursAnalyse(secteurs:GeoJSON.FeatureCollection<GeoJSON.Geometry,quartiers_analyse>):Promise<ReponseQuartiersAnalyse> {
        try {
            const reformattedSecteurs = secteurs.features.map((feature) => ({
                ...feature.properties,
                geometry: JSON.stringify(feature.geometry), // Convert geometry to string
            }));
            const response: AxiosResponse<ReponseQuartierDBAnalyse> = await api.post(`/quartiers-analyse/bulk-replace`,reformattedSecteurs);
            const data = response.data.data;

            const quartiers: GeoJSON.FeatureCollection<GeoJSON.Geometry, quartiers_analyse> = {
                type: 'FeatureCollection' as const,
                features: data.map((item: any) => ({
                    type: 'Feature',
                    properties: {
                        id_quartier: item.id_quartier,
                        nom_quartier: item.nom_quartier,
                        superf_quartier: item.superf_quartier??0,
                        acro: item.acro??'',
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

    async modifieQuartierAnalyse(id_quartier:number,quartier:quartiers_analyse_db):Promise<ReponseQuartiersAnalyse> {
        try {
            const reformattedSecteurs = {
                nom_quartier:quartier.nom_quartier,
                superf_quartier:quartier.superf_quartier,
                acro:quartier.acro,
                geometry: JSON.stringify(quartier.geometry), // Convert geometry to string
            }
            const response: AxiosResponse<ReponseQuartierDBAnalyse> = await api.put(`/quartiers-analyse/${id_quartier}`,reformattedSecteurs);
            const data = response.data.data;

            const quartiers: GeoJSON.FeatureCollection<GeoJSON.Geometry, quartiers_analyse> = {
                type: 'FeatureCollection' as const,
                features: data.map((item: any) => ({
                    type: 'Feature',
                    properties: {
                        id_quartier: item.id_quartier,
                        nom_quartier: item.nom_quartier,
                        superf_quartier: item.superf_quartier??0,
                        acro: item.acro??'',
                    },
                    geometry: item.geometry
                }))
            };
            console.log('Recu le quartier modifié')
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

}

export const serviceQuartiersAnalyse =  new ServiceQuartiersAnalyse();