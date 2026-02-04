import React from 'react';
import { propsMenuSecAnalyse, PropsMenuVersementCadastre, PropsMenuVersementRecens } from '../types/InterfaceTypes';
import {Edit,Upload,FileOpen} from '@mui/icons-material';
import {Select,MenuItem, Menu} from '@mui/material';
import Button from '@mui/material/Button';
import { serviceQuartiersAnalyse } from '../services';

const MenuManipRecensement:React.FC<PropsMenuVersementRecens> = (props:PropsMenuVersementRecens) => {
    
    return(
        <div className='menu-manip-recensement'>
            <FileOpen onClick={() => props.defModalOuvert(!props.modalOuvert)}/>
            <Select 
                value={props.anneeRecens} 
                onChange={(e)=>{
                if(e.target.value === 2016 ){
                    props.defAnneeRecens(e.target.value)
                    props.defTableModif('census_population_2016')
                    props.defEquiv(props.equivOptions[2016])
                }
                if(e.target.value === 2021 ){
                    props.defAnneeRecens(e.target.value)
                    props.defTableModif('census_population')
                    props.defEquiv(props.equivOptions[2021])
                }
                }}
                sx={{
                    backgroundColor: 'black',
                    color: 'white',
                    '& .MuiSvgIcon-root': { color: 'white' }, // arrow
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#666' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#888' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#aaa' },
                }}
            >
                <MenuItem key={2016} value={2016}>2016</MenuItem>
                <MenuItem key={2021} value={2021}>2021</MenuItem>
            </Select>
        </div>
    )
}

export default MenuManipRecensement;