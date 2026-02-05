import { FC, useState } from "react";
import MenuBar from "../components/MenuBar";
import './common.css'
import './versementEnqueteOD.css'
import CarteVerseEnqueteOD from "../components/CarteVerseEnqueteOD";
import { ODGeomTypes } from "../types/EnumTypes";

const VersementEnqueteOD:FC=()=>{
    const [vueOD,defVueOD] = useState<ODGeomTypes>(ODGeomTypes.dep)
    return (
        <div className='page-versement-od'>
            <MenuBar/>
            <CarteVerseEnqueteOD
                vue={vueOD}
            />
        </div>
    )
}

export default VersementEnqueteOD;