import { Dispatch, SetStateAction } from "react";
import api from "./api";

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
}

export const ServiceGeoJson =  new  serviceGeoJson();