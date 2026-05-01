import pandas as pd
import geopandas as gpd
import numpy as np
from shapely import wkt
import matplotlib.pyplot as plt
from sqlalchemy import create_engine,text
import sqlalchemy
from config import config_db
from typing import Optional, Union, Self
from folium import Map
from classes import tax_dataset as TD

def tax_database_points_from_date_territory(
        id_territory:Union[int,list[int]],
        start_year:int,
        end_year:int
        )->TD.TaxDataset:
    '''# tax_database_points_from_polygon \n
        Permet de tirer les données du rôle, du cadastre et l\'association qui permet de sortir un objet TaxDataset
        ## Inputs:+
            - id_polygon: identifiant du/des secteur(s) municipal/aux pour lequel on veut aller chercher les données
            - start_year: borne inferieure de construction du bâtiment
            - end_year: borne supérieure de construction du bâtiment
        ## Output
            - TaxDataset: returns a tax_dataset'''
    engine = create_engine(config_db.pg_string)
    with engine.connect() as con:
        # pull tax data
        if isinstance(id_territory,int):
            command_points = f"SELECT * FROM {config_db.db_table_tax_data_points} as p WHERE ST_Within(p.geometry::geometry, (SELECT geometry FROM public.{config_db.db_table_territory} WHERE {config_db.db_column_territory_id} = {id_territory})::geometry) AND CAST({config_db.db_column_tax_constr_year} AS int) >= {start_year} AND CAST({config_db.db_column_tax_constr_year} AS int) <= {end_year};"
        elif isinstance(id_territory,list):
            command_points = f"SELECT * FROM {config_db.db_table_tax_data_points} as p WHERE ST_Within(p.geometry::geometry, (SELECT ST_Union(geometry) FROM public.{config_db.db_table_territory} WHERE {config_db.db_column_territory_id} IN ({",".join(map(str,id_territory))}))::geometry) AND CAST({config_db.db_column_tax_constr_year} AS int) >= {start_year} AND CAST({config_db.db_column_tax_constr_year} AS int) <= {end_year};"
        data = gpd.read_postgis(command_points,con=con,geom_col="geometry")
        # find the unique tax accounts and find the associated lot ids
        id_role = data[config_db.db_column_tax_id].unique().tolist()
        command_rel_assoc = f"SELECT * FROM public.{config_db.db_table_match_tax_lots} WHERE {config_db.db_column_tax_id} IN ('{"','".join(map(str,id_role))}');"
        association_table = pd.read_sql(command_rel_assoc,con=con)
        # find unique lot numbers and pull the relevant lots
        id_cadastre = association_table[config_db.db_column_lot_id].unique().tolist()
        command_lots = f"SELECT * FROM public.{config_db.db_table_lots} WHERE {config_db.db_column_lot_id} in ('{"','".join(map(str,id_cadastre))}');"
        lot_table = gpd.read_postgis(command_lots,con=con,geom_col="geometry")
    # create the tax dataset
    data_to_out = TD.TaxDataset(data_table=data,lot_association=association_table,lot_data=lot_table)
    return data_to_out
    
def tax_database_for_analysis_territory(id_analysis_territory:int)->TD.TaxDataset:
    engine = create_engine(config_db.pg_string)
    with engine.connect() as con:
        # commande pour aller chercher les points de rôle foncier à l'intérieur du territoire d'analuse
        command = f'SELECT points.* FROM {config_db.db_table_tax_data_points} AS points, {config_db.db_table_analysis_territory} AS polygons WHERE ST_Within(points.{config_db.db_geom_tax}, (SELECT polygons.{config_db.db_geom_analysis} WHERE polygons."{config_db.db_column_analysis_territory_id}" = {id_analysis_territory}))'
        tax_base_data = gpd.read_postgis(command,con=engine,geom_col=config_db.db_geom_tax)
        # list les identifiants provinciaux
        unique_tax_ids = tax_base_data[config_db.db_column_tax_id].unique().tolist()
        # va chercher la table d'association pour tous les points trouvés ci-haut
        command_association = f"SELECT * FROM {config_db.db_table_match_tax_lots} WHERE {config_db.db_column_tax_id} IN ('{"','".join(map(str,unique_tax_ids))}')"
        association_database = pd.read_sql(command_association,con=con)
        # liste les lots qu'on vient d'aller chercher
        unique_lot_ids = association_database[config_db.db_column_lot_id].unique().tolist()
        # va chercher les lots qu'on vient de lister
        command_lots = f"SELECT * FROM {config_db.db_table_lots} WHERE {config_db.db_column_lot_id} IN ('{"','".join(map(str,unique_lot_ids))}')"
        lot_database = gpd.read_postgis(command_lots,con=engine,geom_col=config_db.db_geom_lots)
        # Crée un tax_dataset à retourner
        tax_data_set_to_return = TD.TaxDataset(tax_base_data,association_database,lot_database)
    return tax_data_set_to_return

def tax_database_from_lot_id(lot_id:Union[str,list[str]],engine:sqlalchemy.Engine = None):
    '''
        # tax_database_from_lot_id
        Retrieves tax_data from lot 
    '''
    if engine is None:
        engine = create_engine(config_db.pg_string)
    with engine.connect() as con:
        # va chercher le lot à analyser
        if isinstance(lot_id, str):
            lot_query = f"SELECT * FROM {config_db.db_table_lots} WHERE {config_db.db_column_lot_id} = '{lot_id}'"
        if isinstance(lot_id, list):
            lot_query = f"SELECT * FROM {config_db.db_table_lots} WHERE {config_db.db_column_lot_id} IN ('{"','".join(lot_id)}')"
        lot_database = gpd.read_postgis(lot_query,con=engine,geom_col=config_db.db_geom_lots)
        # va chercher la table d'association pour tous les points trouvés ci-haut
        if isinstance(lot_id, str):
            command_association = f"SELECT * FROM {config_db.db_table_match_tax_lots} WHERE {config_db.db_column_lot_id} = '{lot_id}'"
        if isinstance(lot_id, list):
            command_association = f"SELECT * FROM {config_db.db_table_match_tax_lots} WHERE {config_db.db_column_lot_id} IN ('{"','".join(lot_id)}')"
        association_database:pd.DataFrame = pd.read_sql(command_association,con=con)
        unique_tax_ids = association_database[config_db.db_column_tax_id].unique().tolist()
        
        # va chercher les lots qu'on vient de lister
        command_lots = f"SELECT * FROM {config_db.db_table_tax_data_points} WHERE {config_db.db_column_tax_id} IN ('{"','".join(map(str,unique_tax_ids))}')"
        tax_base_data = gpd.read_postgis(command_lots,con=engine,geom_col=config_db.db_geom_lots)
        # Crée un tax_dataset à retourner
        tax_data_set_to_return = TD.TaxDataset(tax_base_data,association_database,lot_database)
    return tax_data_set_to_return

from typing import Tuple

def get_all_lots_with_valid_data(engine:sqlalchemy.Engine=None) -> Tuple[TD.TaxDataset, pd.DataFrame]:
    '''
        # get_all_lots_with_valid_data
        Retrieves all tax_data in the city which have supposedly valid input. Assuming that's number of dwellings in housing and GFA otherwise
        input:
            - Engine: sqlalchemy engine à utiliser pour la connection à la BD
        Output 
            - TaxDataset: ensemble de données foncier 
    '''
    if engine is None:
        engine = create_engine(config_db.pg_string)
    with engine.connect() as con:
        query=  f'''WITH tax_data AS (
                        SELECT
                            acr.{config_db.db_column_tax_id},
                            acr.{config_db.db_column_lot_id},
                            rf.{config_db.db_column_tax_land_use}::int AS cubf,
                            rf.{config_db.db_column_tax_gross_floor_area} AS gfa,
                            rf.{config_db.db_column_tax_number_dwellings} AS n_dwellings,
                            (rf.{config_db.db_column_tax_land_use}::int < 2000 AND rf.{config_db.db_column_tax_number_dwellings} IS NOT NULL) 
                                OR (rf.{config_db.db_column_tax_land_use}::int >= 2000 AND rf.{config_db.db_column_tax_gross_floor_area}  IS NOT NULL) AS condition
                        FROM association_cadastre_role acr
                        LEFT JOIN role_foncier rf ON rf.{config_db.db_column_tax_id} = acr.{config_db.db_column_tax_id}
                        LEFT JOIN cadastre cad ON cad.{config_db.db_column_lot_id} = acr.{config_db.db_column_lot_id}
                    )
                    SELECT 
                        td.{config_db.db_column_lot_id},
                        bool_and(td.condition) AS lot_condition,
                        array_agg(DISTINCT td.cubf ORDER BY td.cubf) AS cubf_list,
                        cardinality(array_agg(DISTINCT td.cubf ORDER BY td.cubf)) AS n_cubf,
                        -- Single cubf if there's only one
                        CASE 
                            WHEN cardinality(array_agg(DISTINCT td.cubf ORDER BY td.cubf)) = 1
                            THEN (array_agg(DISTINCT td.cubf ORDER BY td.cubf))[1]
                        END AS single_cubf,
                        -- Hierarchy extraction if only one cubf
                        CASE 
                            WHEN cardinality(array_agg(DISTINCT td.cubf ORDER BY td.cubf)) = 1
                            THEN left((array_agg(DISTINCT td.cubf ORDER BY td.cubf))[1]::text, 1)::int
                        END AS cubf_lvl1,
                        CASE 
                            WHEN cardinality(array_agg(DISTINCT td.cubf ORDER BY td.cubf)) = 1
                            THEN left((array_agg(DISTINCT td.cubf ORDER BY td.cubf))[1]::text, 2)::int
                        END AS cubf_lvl2,
                        CASE 
                            WHEN cardinality(array_agg(DISTINCT td.cubf ORDER BY td.cubf)) = 1
                            THEN left((array_agg(DISTINCT td.cubf ORDER BY td.cubf))[1]::text, 3)::int
                        END AS cubf_lvl3
                    FROM tax_data td
                    GROUP BY td.{config_db.db_column_lot_id}
                    HAVING bool_and(td.condition) = true;
                '''
        valid_lots = pd.read_sql(query,con=con)
        valid_tax_lots = valid_lots[config_db.db_column_lot_id].unique().tolist()
        tax_dataset_to_out = tax_database_from_lot_id(valid_tax_lots)
    return [tax_dataset_to_out,valid_lots]
    

def from_postgis(**kwargs):
    polygon = kwargs.get("polygon",None)
    engine = create_engine(config_db.pg_string)
    with engine.connect() as con:
        if polygon ==None:
            command = f"SELECT * FROM public.role_foncier"
            tax_data = gpd.read_postgis(command,con,geom_col="geometry")
            command = f"SELECT * FROM public.cadastre"
            lot_data =  gpd.read_postgis(command,con,geom_col="geometry")
            command = f"SELECT * FROM public.association_cadastre_role"
            association_data = pd.read_sql(command,con)
        else:
            print("Bounding box retrival Function not implemented")
    object_out = TD.TaxDataset(tax_data,association_data,lot_data)
    return object_out