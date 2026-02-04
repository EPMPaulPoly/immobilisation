import { Dispatch, SetStateAction } from "react";
import { serviceCadastre } from "../services";
import { serviceAssocCadRole } from "../services/serviceAssociationCadRole";
import { serviceRole } from "../services/serviceRoleFoncier";
import { FeatureCollection, Geometry } from "geojson";
import { assocRoleCadastre, lotCadastralGeoJsonProperties, roleFoncierGeoJsonProps } from "../types/DataTypes";


const selectLotRole = async(
    props:{
        id_provinc?:string,
        g_no_lot?:string,
        defRoleSelect: Dispatch<SetStateAction<FeatureCollection<Geometry,roleFoncierGeoJsonProps>>>,
        defLotSelect: Dispatch<SetStateAction<FeatureCollection<Geometry,lotCadastralGeoJsonProperties>>>,
        defRoleRegard: Dispatch<SetStateAction<string>>
    }
    )=>{
        console.error('selectLotRole CALLED', {
            id_provinc: props.id_provinc,
            g_no_lot: props.g_no_lot
        })
        let assocOut:assocRoleCadastre[]=[];
        if (typeof props.id_provinc!== 'undefined' && typeof props.g_no_lot!== 'undefined'){
            throw new Error('Doit spécifier une entrée du rôle ou une entrée cadastrale mais pas les deux')
        } else if (typeof props.id_provinc!=='undefined'){
            const assoc = await serviceAssocCadRole.obtiensAssoc({id_provinc:props.id_provinc,g_no_lot:undefined})
            assocOut = assoc.data
        } else if ( typeof props.g_no_lot!=='undefined'){
            const assoc = await serviceAssocCadRole.obtiensAssoc({id_provinc:undefined,g_no_lot:props.g_no_lot})
            assocOut = assoc.data
        }else{
            throw new Error('Doit spécifier au moins un identifiant')
        }
        console.log('assocOut snapshot:', JSON.stringify(assocOut));
        console.log('assocOut length:', assocOut.length);
        console.log('keys:', Object.keys(assocOut));
        if (assocOut.length!==0){
            console.log('entering receipt')
            const lotId = new Set<string> (assocOut.map((item)=>item.g_no_lot))
            const roleIds = new Set (assocOut.map((item)=>item.id_provinc))
            const [role,lots] = await Promise.all([serviceRole.obtiensRoleFonciers({id_provinc:Array.from(roleIds.values())}),serviceCadastre.chercheCadastreQuery({g_no_lot:Array.from(lotId.values())[0]})])
            props.defRoleSelect(role.data)
            props.defLotSelect(lots.data)
            props.defRoleRegard(role.data.features[0]?.properties.id_provinc??'')
        }else{
            console.log('entering 0')
            props.defRoleSelect({type:'FeatureCollection',features:[]})
            props.defLotSelect({type:'FeatureCollection',features:[]})
            props.defRoleRegard('')
            alert('Aucune entrée du rôle associée à ce lot')
        }
        
}


export default selectLotRole;