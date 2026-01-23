import React,{useState,useRef} from 'react';
import { territoire, territoireGeoJsonProperties } from '../types/DataTypes';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import DownloadIcon from '@mui/icons-material/Download';
import { Delete, Edit,Save,Cancel } from "@mui/icons-material";
import {Button,Input} from '@mui/material';
import { TableTerritoireProps } from '../types/InterfaceTypes';
import { serviceTerritoires } from '../services';
import {FeatureCollection,Geometry,Feature} from 'geojson';

const TableTerritoire:React.FC<TableTerritoireProps> =(props:TableTerritoireProps) => {
    const panelRef = useRef<HTMLDivElement>(null);
    const handleMouseDown = (e: React.MouseEvent) => {
            const startY = e.clientY;
            const startHeight = panelRef.current ? panelRef.current.offsetHeight : 0;
    
            const handleMouseMove = (e: MouseEvent) => {
                const newHeight = startHeight + (startY - e.clientY);
                if (panelRef.current) {
                    panelRef.current.style.height = `${newHeight}px`;
                }
            };
    
            const handleMouseUp = () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
    
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        };
    const [territoireEdit,defTerritoireEdit] = useState<number>(0);
    const [ancientTerritoires,defAncienTerritoires] = useState<FeatureCollection<Geometry,territoireGeoJsonProperties>>({type:'FeatureCollection',features:[]})
    const saveGeoJSON = ( filename = "data.geojson") => {
        const blob = new Blob([JSON.stringify(props.territoires)], { type: "application/json" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        };

    const verseDonnees = async() => {
        // À implémenter : fonction pour verser les données
        const dataReturn = await serviceTerritoires.ajouteTerritoiresEnBloc(props.periodeSelect,props.secTerritoireNew)
        if (dataReturn.success===true){
            props.defTerritoire(dataReturn.data)
            props.defSecTerritoireNew({type:'FeatureCollection',features:[]})
            props.defNouvelleCartoDispo(false)
        } else{
            alert('Échec')
        }
    };
    const annuleVersement = () => {
        // À implémenter : fonction pour annuler le versement
        props.defNouvelleCartoDispo(false);
        props.defSecTerritoireNew({type: "FeatureCollection", features: []});
    };

    const gestSupprimeUnTerr = async (id_periode_geo: number | null) => {
        if (id_periode_geo && id_periode_geo > 0) {
            const res = await serviceTerritoires.supprimeTerritoire(id_periode_geo);
            if (res === true) {
                const nouvTerr: FeatureCollection<Geometry, territoireGeoJsonProperties> = {
                    type: 'FeatureCollection',
                    features: props.territoires.features.filter(
                        (item:any): item is Feature<Geometry, territoireGeoJsonProperties> =>
                            (item.properties as territoireGeoJsonProperties).id_periode_geo !== id_periode_geo
                    )
                };
                props.defTerritoire(nouvTerr);
            } else {
                alert('Erreur');
            }
        }
    };

    const gereEditionPropsTerr= (id_periode_geo:number,newValue:string)=>{
        //implementer
    }
    return (
        <div className="panneau-bas-historique" ref={panelRef}>
            <div className="resize-handle" onMouseDown={handleMouseDown}></div>
            <h4>Table Territoire</h4>
            <div className="upload-download-geopolitics" style={{gap:'10px'}}>
                {props.periodeSelect === -1 ? (
                    <span>Choisir une période</span>
                ):(props.nouvelleCartoDispo ? (
                        <>  
                            <span>Periode: {props.periodeSelect}</span>
                            <Button 
                                variant='outlined' 
                                sx={{backgroundColor:'green',color:'black'}}
                                onClick={()=>verseDonnees()}
                            >
                                Verser
                            </Button>
                            <Button 
                                variant='outlined' 
                                sx={{backgroundColor:'red', color:'black'}}
                                onClick={()=>annuleVersement()}
                            >
                                Annuler
                            </Button>
                        </>
                    ):(
                        <>
                        <FileUploadIcon
                            onClick={() => props.defModalVersementOuvert(!props.modalOuvert)}
                        />
                        <DownloadIcon 
                            onClick={()=>saveGeoJSON()} 
                        />
                        </>
                    )
                )}
            </div>
            <table className="table-territoire-historique">
                <thead>
                    <tr>
                        <th>ID période</th>
                        <th>Ville</th>
                        <th>Secteur</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {props.territoires.features.map((territoire) => (
                        territoire.properties && (
                            <tr key={territoire.properties.id_periode_geo}>
                                <td>{territoire.properties.id_periode}</td>
                                <td>
                                    {territoireEdit===territoire.properties.id_periode_geo?
                                    <Input value={territoire.properties.ville} onChange={(e)=>gereEditionPropsTerr(territoire.properties?.id_periode_geo??0,e.target.value)}/>:
                                    territoire.properties.ville}
                                </td>
                                <td>{territoire.properties.secteur}</td>
                                <td>{props.nouvelleCartoDispo===false?
                                        territoireEdit===territoire.properties.id_periode_geo?
                                        <Save/>:
                                        <Edit onClick={()=>defTerritoireEdit(territoire.properties?.id_periode_geo??0)}/>:
                                        <></>
                                    }
                                </td>
                                <td>
                                    {props.nouvelleCartoDispo===false?
                                        territoireEdit===territoire.properties.id_periode_geo?
                                        <Cancel onClick={()=>defTerritoireEdit(0)}/>:
                                        <DeleteIcon onClick={()=> gestSupprimeUnTerr(territoire.properties?.id_periode_geo??-1)}/>:
                                        <></>
                                    }
                                </td>
                            </tr>
                        )
                    ))}
                </tbody>
            </table>
        </div>
    );
};


export default TableTerritoire;