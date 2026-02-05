import React from 'react';
import { propsMenuSecAnalyse, PropsMenuVersementCadastre, PropsMenuVersementRecens } from '../types/InterfaceTypes';
import {Edit,Upload,FileOpen} from '@mui/icons-material';
import {Select,MenuItem, Menu} from '@mui/material';
import Button from '@mui/material/Button';
import { serviceQuartiersAnalyse } from '../services';
import { serviceRecensement } from '../services/serviceRecensement';

const MenuManipRecensement:React.FC<PropsMenuVersementRecens> = (props:PropsMenuVersementRecens) => {
    const gestionChangementAnnee =async (nouvelleValeur:2016|2021)=>{
        console.log('Changement annee recense')
        if(nouvelleValeur === 2016 ){
            props.defAnneeRecens(nouvelleValeur)
            props.defTableModif('census_population_2016')
            props.defEquiv(props.equivOptions[2016])
            const bbox = props.limites
            ? (() => {
                const sw = props.limites.getSouthWest();
                const ne = props.limites.getNorthEast();
                return { minx: sw.lng, miny: sw.lat, maxx: ne.lng, maxy: ne.lat };
                })()
            : null;
            if (bbox!==null){
                console.log('bbox dispo')
                const resultat = await serviceRecensement.chercheRecensementQuery({annee:nouvelleValeur,bbox:[bbox.minx, bbox.miny, bbox.maxx, bbox.maxy]})
                props.defDonnees(resultat.data)
            }else{
                console.log('bbox non dispo')
            }
        }
        if(nouvelleValeur=== 2021 ){
            props.defAnneeRecens(nouvelleValeur)
            props.defTableModif('census_population')
            props.defEquiv(props.equivOptions[2021])
            const bbox = props.limites
            ? (() => {
                const sw = props.limites.getSouthWest();
                const ne = props.limites.getNorthEast();
                return { minx: sw.lng, miny: sw.lat, maxx: ne.lng, maxy: ne.lat };
                })()
            : null;
            if (bbox!==null){
                console.log('bbox dispo')
                const resultat = await serviceRecensement.chercheRecensementQuery({annee:nouvelleValeur,bbox:[bbox.minx, bbox.miny, bbox.maxx, bbox.maxy]})
                props.defDonnees(resultat.data)
            }else{
                console.log('bbox non dispo')
            }
        }
        
    }
    return(
        <div className='menu-manip-recensement'>
            <FileOpen onClick={() => props.defModalOuvert(!props.modalOuvert)}/>
            <Select 
                value={props.anneeRecens} 
                onChange={(e)=>gestionChangementAnnee(e.target.value)}
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