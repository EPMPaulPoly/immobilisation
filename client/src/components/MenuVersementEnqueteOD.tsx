import { FC } from "react";
import { PropsMenuEnqueteOD } from "../types/InterfaceTypes";
import { FileOpen } from "@mui/icons-material";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { ODGeomTypes } from "../types/EnumTypes";



const MenuVerseEnqueteOD:FC<PropsMenuEnqueteOD> = (props:PropsMenuEnqueteOD)=>{
    function gereChangementObjet(obj:string) {
        if (obj==='men'){
            props.defTypeObjetOd(ODGeomTypes.men)
        } else if (obj==='pers'){
            props.defTypeObjetOd(ODGeomTypes.pers)
        } else if(obj==='dep'){
            props.defTypeObjetOd(ODGeomTypes.dep)
        }

    }

    return(
        <div className="menu-versement-enquete-od">
            <FileOpen onClick={() => props.defModalOuvert(!props.modalOuvert)}/>
            <FormControl variant="outlined" size="small" style={{ minWidth: 120 }}>
                <InputLabel id="select-objet"
                    sx={{
                        color: 'white',
                        '&.Mui-focused': { color: 'white' },
                        '&.MuiInputLabel-shrink': { color: 'white' },
                    }}
                >
                    Men/Pers/Dep
                </InputLabel>
                <Select
                    labelId="select-objet"
                    id="select-n-charts"
                    value={props.typeObjetOD}
                    onChange={(e) => gereChangementObjet(String(e.target.value))}
                    label="N Graphes"
                    sx={{
                        backgroundColor: 'black',
                        color: 'white',
                        '& .MuiSvgIcon-root': { color: 'white' }, // arrow
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: '#666' },
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#888' },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#aaa' },
                    }}
                    MenuProps={{
                        PaperProps: {
                            sx: {
                                bgcolor: 'black',
                                color: 'white',
                            },
                        },
                    }}
                >
                        <MenuItem key={1} value={ODGeomTypes.men}>
                            Ménages
                        </MenuItem>
                        <MenuItem key={2} value={ODGeomTypes.pers}>
                            Personnes
                        </MenuItem>
                        <MenuItem key={3} value={ODGeomTypes.dep}>
                            Déplacement
                        </MenuItem>
                </Select>
            </FormControl>
            {
                props.typeObjetOD==='dep'?
                <>
                    <FormControl variant="outlined" size="small" style={{ minWidth: 120 }}>
                        <InputLabel id="select-heure-label"
                            sx={{
                                color: 'white',
                                '&.Mui-focused': { color: 'white' },
                                '&.MuiInputLabel-shrink': { color: 'white' },
                            }}
                        >
                            Heure Déplacement
                        </InputLabel>
                        <Select
                            labelId="select-heure-label"
                            id="select-heure"
                            value={props.heure}
                            onChange={(e) => props.defHeure(Number(e.target.value))}
                            label="Heure"
                            sx={{
                                backgroundColor: 'black',
                                color: 'white',
                                '& .MuiSvgIcon-root': { color: 'white' }, // arrow
                                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#666' },
                                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#888' },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#aaa' },
                            }}
                            MenuProps={{
                                PaperProps: {
                                    sx: {
                                        bgcolor: 'black',
                                        color: 'white',
                                    },
                                },
                            }}
                        >
                            <MenuItem value={-1}>Sans Filtre</MenuItem>
                            {Array.from({ length: 28 - 4 + 1 }, (_, i) => (
                                <MenuItem key={i} value={i + 4}>
                                    {i + 4}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl variant="outlined" size="small" style={{ minWidth: 120 }}>
                        <InputLabel id="select-motif"
                            sx={{
                                color: 'white',
                                '&.Mui-focused': { color: 'white' },
                                '&.MuiInputLabel-shrink': { color: 'white' },
                            }}
                        >
                            Motif Déplacement
                        </InputLabel>
                        <Select
                            labelId="select-motif"
                            id="select-n-charts"
                            value={props.motif}
                            onChange={(e) => props.defMotif(Number(e.target.value))}
                            label="N Graphes"
                            sx={{
                                backgroundColor: 'black',
                                color: 'white',
                                '& .MuiSvgIcon-root': { color: 'white' }, // arrow
                                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#666' },
                                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#888' },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#aaa' },
                            }}
                            MenuProps={{
                                PaperProps: {
                                    sx: {
                                        bgcolor: 'black',
                                        color: 'white',
                                    },
                                },
                            }}
                        >
                            <MenuItem value={-1}>Sans Filtre</MenuItem>
                            {Array.from({ length: 14 }, (_, i) => (
                                <MenuItem key={i} value={i+1}>
                                    {i+1}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl variant="outlined" size="small" style={{ minWidth: 120 }}>
                        <InputLabel id="select-mode-label"
                            sx={{
                                color: 'white',
                                '&.Mui-focused': { color: 'white' },
                                '&.MuiInputLabel-shrink': { color: 'white' },
                            }}
                        >
                            Mode Déplacements
                        </InputLabel>
                        <Select
                            labelId="select-mode-label"
                            id="select-mode"
                            value={props.mode}
                            //onChange={(e) => handleChange(Number(e.target.value))}
                            label="N Graphes"
                            sx={{
                                backgroundColor: 'black',
                                color: 'white',
                                '& .MuiSvgIcon-root': { color: 'white' }, // arrow
                                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#666' },
                                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#888' },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#aaa' },
                            }}
                            MenuProps={{
                                PaperProps: {
                                    sx: {
                                        bgcolor: 'black',
                                        color: 'white',
                                    },
                                },
                            }}
                        >
                            <MenuItem value={-1}>Sans Filtre</MenuItem>
                            {Array.from({ length: 17 }, (_, i) => (
                                <MenuItem key={i} value={i+1}>
                                    {i+1}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </>:<></>
            }
            
        </div>

    )
}

export default MenuVerseEnqueteOD