import{FC} from 'react'
import MenuBar from '../components/MenuBar'
import './creationAssocRoleCadastre.css';
import './common.css'
import CarteAssocRoleCadastre from '../components/CarteAssocRoleCadastre';

const CreationAssocRoleCadastre:FC =()=>{
    return(
        <div className="page-assoc-cadastre-role">
            <MenuBar/>
            <CarteAssocRoleCadastre/>
        </div>
    )
}

export default CreationAssocRoleCadastre;