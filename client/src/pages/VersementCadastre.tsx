import MenuBar from "../components/MenuBar";
import React,{useState} from 'react';
import './versementCadastre.css';
import './common.css';
import MenuManipCadastre from "../components/MenuVersementCadastre";
import ModalVersementCadastre from "../components/ModalVersementCadastre";

const VersementCadastre:React.FC =() =>{
    const [modalSelectionCadastreOuvert,defModalSelectionCadastreOuvert] = useState<boolean>(false);

    return(
        <div className='page-versement-visu-cadastre'>
            <MenuBar/>
            <MenuManipCadastre
                modalOuvert={modalSelectionCadastreOuvert}
                defModalOuvert={defModalSelectionCadastreOuvert}
            />
            <ModalVersementCadastre
                modalOuvert={modalSelectionCadastreOuvert}
                defModalOuvert={defModalSelectionCadastreOuvert}
            />
        </div>
    )
}

export default VersementCadastre;