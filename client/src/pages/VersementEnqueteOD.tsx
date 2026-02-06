import { FC, use, useState } from "react";
import MenuBar from "../components/MenuBar";
import './common.css'
import './versementEnqueteOD.css'
import CarteVerseEnqueteOD from "../components/CarteVerseEnqueteOD";
import { ODGeomTypes } from "../types/EnumTypes";
import MenuVerseEnqueteOD from "../components/MenuVersementEnqueteOD";

const VersementEnqueteOD:FC=()=>{
    const [modalOuvert,defModalOuvert] = useState<boolean>(false);
    const [heure,defHeure] = useState<number|null>(null)
    const [mode,defMode] = useState<number|null>(null);
    const [motif,defMotif] = useState<number|null>(null);
    const [vueOD,defVueOD] = useState<ODGeomTypes>(ODGeomTypes.dep)
    return (
        <div className='page-versement-od'>
            <MenuBar/>
            <MenuVerseEnqueteOD
                modalOuvert={modalOuvert}
                defModalOuvert={defModalOuvert}
                typeObjetOD={vueOD}
                defTypeObjetOd={defVueOD}
                heure={heure}
                defHeure={defHeure}
                mode={mode}
                defMode={defMode}
                motif={motif}
                defMotif={defMotif}
            />
            <CarteVerseEnqueteOD
                vue={vueOD}
            />
        </div>
    )
}

export default VersementEnqueteOD;