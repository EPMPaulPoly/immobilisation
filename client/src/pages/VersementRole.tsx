import MenuBar from "../components/MenuBar";
import React,{useState} from 'react';
import './versementRole.css';
import './common.css';
import MenuManipCadastre from "../components/MenuVersementCadastre";
import ModalVersementCadastre from "../components/ModalVersementCadastre";
import CarteVisionnementCadastre from "../components/CarteVisionnementCadastre";
import ModalVersementGen from "../components/ModalVersement";
import { EquivalenceVersementCarto } from "../types/DataTypes";

const VersementRole:React.FC =() =>{
    const [modalOuvert,defModalOuvert] = useState<boolean>(false);
    const [equivalenceFDB, defEquivalenceFBD] = useState<EquivalenceVersementCarto[]>(
        [
            {
                colonne_db:'rl0101a',
                description:'Numéro de rue',
                colonne_fichier:''
            },
            {
                colonne_db:'rl0101e',
                description:'Type de rue (blvd,ave)',
                colonne_fichier:''
            },
            {
                colonne_db:'rl0101g',
                description:'Nom de rue',
                colonne_fichier:''
            },
            {
                colonne_db:'rl0105a',
                description:'cubf',
                colonne_fichier:''
            },
            {
                colonne_db:'rl0301a',
                description:'Mesure Frontale',
                colonne_fichier:''
            },
            {
                colonne_db:'rl0306a',
                description:'Nombre étages',
                colonne_fichier:''
            },
            {
                colonne_db:'rl0307a',
                description:'Année Construction',
                colonne_fichier:''
            },
            {
                colonne_db:'rl0307b',
                description:'Année estimée ou réelle',
                colonne_fichier:''
            },
            {
                colonne_db:'rl0308a',
                description:`Aire d'étages`,
                colonne_fichier:''
            },
            {
                colonne_db:'rl0311a',
                description:'Nombre de Logements',
                colonne_fichier:''
            },
            {
                colonne_db:'rl0312a',
                description:'Nombre de chambres loc',
                colonne_fichier:''
            },
            {
                colonne_db:'rl0313a',
                description:'Nombre de locaux non res',
                colonne_fichier:''
            }
        ]
    )

    return(
        <div className='page-versement-visu-role'>
            <MenuBar/>
            <MenuManipCadastre
                modalOuvert={modalOuvert}
                defModalOuvert={defModalOuvert}
            />
            <ModalVersementGen
                modalOuvert={modalOuvert}
                defModalOuvert={defModalOuvert}
                champsARemplir={equivalenceFDB}
                defChampsARemplir={defEquivalenceFBD}
                title="Modal versement Role"
            />
            <>
            {
                <CarteVisionnementCadastre/>
            }
            </>
            
        </div>
    )
}

export default VersementRole;