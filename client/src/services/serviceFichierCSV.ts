
import axios, { AxiosResponse } from "axios";
import api from "./api";

import { Dispatch, SetStateAction } from "react";


export const ServiceFichierCSV ={
    verseFichierFlux: async(file:File,onProgress?: Dispatch<SetStateAction<number>>):Promise<{ tempFileId: string, columns:string[] }>=>{
        try{
            const formData = new FormData();
            formData.append("file", file);

            const response = await api.post("/fichier-csv/temp-upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
                onUploadProgress: (e) => {
                    if (!e.total) return;
                    const percent = Math.round((e.loaded / e.total) * 100);
                    onProgress?.(percent); // call the callback if provided
                },
            });
            return response.data; // { tempFileId: "xyz123.tmp" ,['colonne_1','colonne_2']}  
        }catch(err:any){
            console.log(err)
            throw err; // Re-throw if necessary
        } 
    },
    confirmeMAJBDTemp:async (fileId:string,mappingNormal:Record<string,string>,table:string,mapping_geom?:Record<string,any>):Promise<{success:boolean,data:number}>=>{
        try{
            const body={
                mapping_cols: mappingNormal,
                mapping_geom: mapping_geom,
                file_id:fileId,
                table:table
            }
            const response = await api.post('/fichier-csv/import',body)
            return{success:response.data.success,data:response.data.data}
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