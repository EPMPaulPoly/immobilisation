import React, { FC } from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material"
import { propsParamSecAnalyse } from '../types/InterfaceTypes';
import { FeatureCollection, Geometry } from 'geojson';
import { quartiers_analyse } from '../types/DataTypes';
import { Edit,Calculate } from '@mui/icons-material';
const TableSecAnalyse: FC<propsParamSecAnalyse> = (props:propsParamSecAnalyse) => {
    const [edit,setEdit] = React.useState<boolean>(false);

    const manipulerTexte = (id_quartier:number,champs:string,nouvelleValeur:string): void => {
        // Implementation here
        const nouveauQuartiers = {
            type: "FeatureCollection",
            features: props.secAnalyseMontrer.features.map(feature => {
                if (feature.properties.id_quartier === id_quartier) {
                    return {
                        ...feature,
                        properties: {
                            ...feature.properties,
                            [champs]: nouvelleValeur
                        }
                    };
                }
                return feature;
            })
        } as FeatureCollection<Geometry, quartiers_analyse>;
        props.setSecAnalyseMontrer(nouveauQuartiers);
    }
    return(
        <div className="table-sec-analyse">
            <TableContainer component={Paper} sx={{
                    maxHeight: '100%',
                    overflowY: 'auto'
                }}>
                <Table stickyHeader>
                    <TableHead >
                        <TableRow>
                            <TableCell>ID Quartier</TableCell>
                            <TableCell>Nom Quartier</TableCell>
                            <TableCell>Superficie (m²)</TableCell>
                            <TableCell>Acronyme</TableCell>
                            {edit && <TableCell><Edit/></TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody >
                        {props.secAnalyseMontrer.features.map((feature) => (
                            <TableRow key={feature.properties.id_quartier}>
                                <TableCell>{feature.properties.id_quartier}</TableCell>
                                <TableCell><TextField value={feature.properties.nom_quartier??''} onChange={(e) => manipulerTexte(feature.properties.id_quartier, 'nom_quartier', e.target.value)}/></TableCell>
                                <TableCell sx={{ verticalAlign: 'center'}}><Calculate/>{feature.properties.superf_quartier??''}</TableCell>
                                <TableCell><TextField value={feature.properties.acro??''} onChange={(e) => manipulerTexte(feature.properties.id_quartier, 'acro', e.target.value)}/></TableCell>

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

export default TableSecAnalyse;