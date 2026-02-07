import { FC, use, useState } from "react";
import MenuBar from "../components/MenuBar";
import './common.css'
import './versementEnqueteOD.css'
import CarteVerseEnqueteOD from "../components/CarteVerseEnqueteOD";
import { ODGeomTypes } from "../types/EnumTypes";
import MenuVerseEnqueteOD from "../components/MenuVersementEnqueteOD";
import ModalVersementOD from "../components/ModalVersementOD";
import { EquivalenceCSVCoordPoint, EquivalenceVersementCarto } from "../types/DataTypes";
import BoutonApprobationVerse from "../components/BoutonApprobationVerse";
import { ServiceEnqueteOD } from "../services/serviceEnqueteOD";

const VersementEnqueteOD:FC=()=>{
    const [modalOuvert,defModalOuvert] = useState<boolean>(false);
    const [heure,defHeure] = useState<number|null>(-1)
    const [mode,defMode] = useState<number|null>(-1);
    const [motif,defMotif] = useState<number|null>(-1);
    const [vueOD,defVueOD] = useState<ODGeomTypes>(ODGeomTypes.dep)
    const [equivalenceFDB, defEquivalenceFBD] = useState<EquivalenceVersementCarto[]>(
            [
                {
                    colonne_db:'nolog',
                    description:'Identifiant du ménage',
                    colonne_fichier:``,
                    obligatoire:true,
                    page:'Ménage'
                },
                {
                    colonne_db:'nbper',
                    description: 'Nombre de personnes dans le ménage',
                    colonne_fichier:``,
                    obligatoire:true,
                    page:'Ménage'
                },
                {
                    colonne_db:'nbveh',
                    description: 'Nombre véhicules du ménage',
                    colonne_fichier:``,
                    obligatoire:true,
                    page:'Ménage'
                },
                {
                    colonne_db:'tlog',
                    description:'Binaire tête de ménage',
                    colonne_fichier:``,
                    obligatoire:true,
                    page:'Ménage'
                },
                {
                    colonne_db:'facmen',
                    description:'Facteur de pondération du ménage',
                    colonne_fichier:``,
                    obligatoire:true,
                    page:'Ménage'
                },
                {
                    colonne_db:'clepersonne',
                    description:'Identifiant unique de la personne',
                    colonne_fichier:``,
                    obligatoire:true,
                    page:'Personne'
                },
                {
                    colonne_db:'tper',
                    description:'Binaire tête de personne',
                    colonne_fichier:'',
                    obligatoire:true,
                    page:'Personne'
                },
                {
                    colonne_db:'sexe',
                    description: 'Sexe de la personne',
                    colonne_fichier:'',
                    obligatoire:true,
                    page:'Personne'
                },
                {
                    colonne_db:'age',
                    description:'Age de la personne',
                    colonne_fichier:'',
                    obligatoire:true,
                    page:'Personne'
                },
                {
                    colonne_db:'grpage',
                    description:`Groupe d'age de la personne `,
                    colonne_fichier:'',
                    obligatoire:true,
                    page:'Personne'
                }, 
                {
                    colonne_db:'percond',
                    description:'Statut permis de conduire',
                    colonne_fichier:'',
                    obligatoire:true,
                    page:'Personne'
                },
                {
                    colonne_db:'occper',
                    description:'Occupation de la personne',
                    colonne_fichier:'',
                    obligatoire:false,
                    page:'Personne'
                },
                {
                    colonne_db:'mobil',
                    description:'Binaire personne mobile',
                    colonne_fichier:'',
                    obligatoire:true,
                    page:'Personne'
                },
                {
                    colonne_db:'facper',
                    description:'Facteur de pondération personne pour caractériques de personnes',
                    colonne_fichier:'',
                    obligatoire:true,
                    page:'Personne'
                },
                {
                    colonne_db:'facpermc',
                    description:'Facteur de pondération personne pour populations',
                    colonne_fichier:'',
                    obligatoire:true,
                    page:'Personne'
                },
                {
                    colonne_db:'cledeplacement',
                    description:'Identifiant unique de deplacement',
                    colonne_fichier:'',
                    obligatoire:true,
                    page:'Déplacement'
                },
                {
                    colonne_db:'nodep',
                    description:'Identifiant de déplacement pour la personne',
                    colonne_fichier:'',
                    obligatoire:true,
                    page:'Déplacement'
                },
                {
                    colonne_db:'hredep',
                    description:'Heure et minute de départ',
                    colonne_fichier:'',
                    obligatoire:true,
                    page:'Déplacement'
                },
                {
                    colonne_db:'heure',
                    description:'Heure de départ',
                    colonne_fichier:'',
                    obligatoire:true,
                    page:'Déplacement'
                },
                {
                    colonne_db:'motif',
                    description:'Motif détaillé',
                    colonne_fichier:'',
                    obligatoire:true,
                    page:'Déplacement'
                },
                {
                    colonne_db:'motif_gr',
                    description:'Groupe de motifs',
                    colonne_fichier:'',
                    obligatoire:true,
                    page:'Déplacement'
                },
                {
                    colonne_db:'mode1',
                    description:'Premier mode emprunté',
                    colonne_fichier:'',
                    obligatoire:true,
                    page:'Déplacement'
                },
                {
                    colonne_db:'mode2',
                    description:'Deuxième mode emprunté',
                    colonne_fichier:'',
                    obligatoire:true,
                    page:'Déplacement'
                },
                {
                    colonne_db:'mode3',
                    description:'Troisième mode emprunté',
                    colonne_fichier:'',
                    obligatoire:true,
                    page:'Déplacement'
                },
                {
                    colonne_db:'mode4',
                    description:'Quatrième mode emprunté',
                    colonne_fichier:'',
                    obligatoire:true,
                    page:'Déplacement'
                },
                {
                    colonne_db:'stat',
                    description:'Type de stationnement (grat,payant,subvent)',
                    colonne_fichier:'',
                    obligatoire:true,
                    page:'Déplacement'
                },
                {
                    colonne_db:'coutstat',
                    description:'Cout payé pour le stationnement',
                    colonne_fichier:'',
                    obligatoire:true,
                    page:'Déplacement'
                },
                {
                    colonne_db:'termstat',
                    description:'Terme du stationnement (horaire, hebdo,mensuel)',
                    colonne_fichier:'',
                    obligatoire:true,
                    page:'Déplacement'
                }
            ]
        )
    const [equivalenceGeom,defEquivalenceGeom] = useState<EquivalenceCSVCoordPoint[]>(
        [
            {
                colonne_db:'geom_logis',
                description:'Lieu du ménage',
                obligatoire:true,
                page:'Ménage',
                desc_geometrie:{
                    type:'Point',
                    descriptionXLon:'Longitude du ménage',
                    colonneXLon:'',
                    descriptionYLat:'Latitude du ménage',
                    colonneYLat:''
                }
            },
            {
                colonne_db:'geom_ori',
                description:'Lieu origine',
                obligatoire:true,
                page:'Déplacement',
                desc_geometrie:{
                    type:'Point',
                    descriptionXLon:`Longitude de l'origine`,
                    colonneXLon:'',
                    descriptionYLat:`Latitude de l'origine`,
                    colonneYLat:''
                }
            },
            {
                colonne_db:'geom_des',
                description:'Lieu de destination',
                obligatoire:true,
                page:'Déplacement',
                desc_geometrie:{
                    type:'Point',
                    descriptionXLon:`Longitude de la destination`,
                    colonneXLon:'',
                    descriptionYLat:`Latitude de la destination`,
                    colonneYLat:''
                }
            },
            {
                colonne_db:'trip_line',
                description:'Vecteur origine destination',
                obligatoire:true,
                page:'Déplacement',
                desc_geometrie:{
                    type:'Ligne',
                    pointDeb:{
                        type:'Point',
                        descriptionXLon:`Longitude de l'origine`,
                        colonneXLon:'',
                        descriptionYLat:`Latitude de l'origine`,
                        colonneYLat:''
                    },
                    pointFin:{
                        type:'Point',
                        descriptionXLon:`Longitude de la destination`,
                        colonneXLon:'',
                        descriptionYLat:`Latitude de la destination`,
                        colonneYLat:''
                    },
                }
            }
        ]
    )
    
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
            <ModalVersementOD
                modalOuvert={modalOuvert}
                defModalOuvert={defModalOuvert}
                champsARemplir={equivalenceFDB}
                defChampsARemplir={defEquivalenceFBD}
                title='Ouverture fihier EOD'
                table='od_data'
                champsGeomARemplir={equivalenceGeom}
                defChampsGeomARemplir={defEquivalenceGeom}
                serviceUploadPeak={ServiceEnqueteOD.verseFichierFlux}
                serviceMAJ={ServiceEnqueteOD.confirmeMAJBDTemp}
            />
            <CarteVerseEnqueteOD
                vue={vueOD}
            />

        </div>
    )
}

export default VersementEnqueteOD;