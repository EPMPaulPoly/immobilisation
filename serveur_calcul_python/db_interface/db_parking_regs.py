import pandas as pd
import mimetypes
from utilitaires.database_interface import retrieve_table
from functools import singledispatchmethod,singledispatch
import numpy as np
from config import config_db
from sqlalchemy import create_engine,text
import logging
from typing import Optional, Union,Self
from classes import parking_regs as PR

@singledispatch
def from_postgis(indice_)->PR.ParkingRegulations:
    raise NotImplementedError("Cannot retrieve this data type")

@from_postgis.register
def _(indice_:int):
    engine = create_engine(config_db.pg_string)
    with engine.connect() as con:
        command = f"SELECT * FROM public.entete_reg_stationnement WHERE {config_db.db_column_parking_regs_id} = {indice_}"
        reg_head = pd.read_sql(command,con,index_col = config_db.db_column_parking_regs_id).reset_index()
        command = f"SELECT * FROM public.reg_stationnement_empile WHERE {config_db.db_column_parking_regs_id} = {indice_}" 
        reg_def = pd.read_sql(command,con,index_col = config_db.db_column_parking_regs_id).reset_index()
        command = f"SELECT * FROM public.multiplicateur_facteurs_colonnes"
        units_table = pd.read_sql(command,con).reset_index()
    object_out = PR.ParkingRegulations(reg_head,reg_def,units_table)
    return object_out

@from_postgis.register
def _(indice_:list):
    engine = create_engine(config_db.pg_string)
    with engine.connect() as con:
        command = f"SELECT * FROM public.entete_reg_stationnement WHERE {config_db.db_column_parking_regs_id} IN ({','.join(map(str, indice_))})"
        reg_head = pd.read_sql(command,con,index_col = config_db.db_column_parking_regs_id).reset_index()
        command = f"SELECT * FROM public.reg_stationnement_empile WHERE {config_db.db_column_parking_regs_id} IN ({','.join(map(str, indice_))})" 
        reg_def = pd.read_sql(command,con,index_col = config_db.db_column_parking_regs_id).reset_index()
        command = f"SELECT * FROM public.multiplicateur_facteurs_colonnes"
        units_table = pd.read_sql(command,con).reset_index()
    object_out = PR.ParkingRegulations(reg_head,reg_def,units_table)
    return object_out

def get_units_for_regs(regs_units_for:Union[list[int],int])->pd.DataFrame:
    query = ''
    if isinstance(regs_units_for,list):
        query=f'''
            SELECT DISTINCT
                rse.id_reg_stat,
                rse.unite,
                mfc.desc_unite
            FROM
                public.reg_stationnement_empile as rse
            JOIN
                public.multiplicateur_facteurs_colonnes as mfc on mfc.id_unite = rse.unite 
            WHERE 
                rse.id_reg_stat IN ({','.join(map(str,regs_units_for))})
            '''    
    else:
        query=f'''
            SELECT DISTINCT
                rse.id_reg_stat,
                rse.unite,
                mfc.desc_unite
            FROM
                public.reg_stationnement_empile as rse
            JOIN
                public.multiplicateur_facteurs_colonnes as mfc on mfc.id_unite = rse.unite 
            WHERE 
                rse.id_reg_stat = {regs_units_for}
            '''    
    engine = create_engine(config_db.pg_string)
    with engine.connect() as con:
        units = pd.read_sql_query(query,con)
    return units
