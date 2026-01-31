import { Dispatch, SetStateAction } from "react";
import api from "./api";
import axios from "axios";

class serviceGeoJson{
    async verseFichierFlux(
        fichier:File,
        onProgress?: Dispatch<SetStateAction<number>>
    ):Promise<{ tempFileId: string, columns:string[] }>{
        const formData = new FormData();
        formData.append("file", fichier);

        const response = await api.post("/geojson/temp-upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress: (e) => {
                if (!e.total) return;
                const percent = Math.round((e.loaded / e.total) * 100);
                onProgress?.(percent); // call the callback if provided
            },
        });
        return response.data; // { tempFileId: "xyz123.tmp" ,['colonne_1','colonne_2']}   
    }
    async confirmeMajBDTemp(fileId:string,mapping:Record<string,string>,table:string):Promise<{success:boolean,data:number}>{
        try{
            const body = {
                mapping: mapping,
                file_id: fileId,
                table: table
            }
            const response = await api.post('/geojson/import',body)
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

export const ServiceGeoJson =  new  serviceGeoJson();