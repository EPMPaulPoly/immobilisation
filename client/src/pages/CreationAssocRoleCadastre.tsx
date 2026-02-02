import{FC} from 'react'
import MenuBar from '../components/MenuBar'
import './creationAssocRoleCadastre.css';
import './common.css'
import CarteAssocRoleCadastre from '../components/CarteAssocRoleCadastre';
import MenuAssociationCadastreRole from '../components/MenuAssociationCadastreRole';

const CreationAssocRoleCadastre:FC =()=>{
    return(
        <div className="page-assoc-cadastre-role">
            <MenuBar/>
            <MenuAssociationCadastreRole/>
            <CarteAssocRoleCadastre/>
        </div>
    )
}

export default CreationAssocRoleCadastre;