import pandas as pd
import mimetypes
from utilitaires.database_interface import retrieve_table
from functools import singledispatchmethod,singledispatch
import numpy as np
from config import config_db
from sqlalchemy import create_engine,text
import sqlalchemy
import logging
from typing import Optional, Union,Self
from classes import parking_regs as PR
from classes import parking_reg_sets as PRS

def from_sql(
        ruleset_id:Union[int,list],
        con:sqlalchemy.Connection=None
    )->list[PRS.ParkingRegulationSet]:
    '''
    from_sql generates a ParkingRegulationSetObject from the PostgreSQL database
        - inputs: 
            - ruleset_id: can be integer or list of integer that point to the relevant ruleset(ensemble de règlements) that you want to pull
            - con: sqlalchemy connection
        - output:
            - list_to_out: list of ParkingRegulationSet with the relevant id'''
    # if no connection was provided create one
    if con==None:
        # create the sqlalchemy connection
        engine=create_engine(config_db.pg_string)
        # connect to database and start requests
        with engine.connect() as con:
            rulesets_header_table,rules_association_table,relevant_rules_def,relevant_rules_heads,units_table,land_use_table= run_sql_requests(ruleset_id,con)
    #otherwise, use what was provided
    else:
        rulesets_header_table,rules_association_table,relevant_rules_def,relevant_rules_heads,units_table,land_use_table= run_sql_requests(ruleset_id,con)
    # create empty list to append to
    list_to_out = []
    # if it's an integer, just pull the outputs and stick em in there
    if isinstance(ruleset_id,int):
        parking_set_to_out = PRS.ParkingRegulationSet(relevant_rules_heads,relevant_rules_def,rulesets_header_table.loc[0,"date_debut_er"],rulesets_header_table.loc[0,"date_fin_er"],rulesets_header_table.loc[0,"description_er"],rules_association_table,rulesets_header_table.loc[0,"id_er"],units_table,land_use_table)
        list_to_out.append(parking_set_to_out)
    # else break it down by the outputs
    elif isinstance(ruleset_id,list):
        for ruleset in ruleset_id:
            rules_to_out = rules_association_table.loc[rules_association_table["id_er"]==ruleset,"id_reg_stat"].unique()
            association_table_out = rules_association_table.loc[rules_association_table["id_er"]==ruleset]
            rules_to_out_head = relevant_rules_heads.loc[relevant_rules_heads["id_reg_stat"].isin(rules_to_out)]
            rules_to_out_stacks = relevant_rules_def.loc[relevant_rules_def["id_reg_stat"].isin(rules_to_out)]
            ruleset_to_out_header = rulesets_header_table.loc[rulesets_header_table["id_er"]==ruleset]
            parking_set_to_out = PRS.ParkingRegulationSet(rules_to_out_head,rules_to_out_stacks,ruleset_to_out_header["date_debut_er"].values[0],ruleset_to_out_header["date_fin_er"].values[0],ruleset_to_out_header["description_er"].values[0], association_table_out,ruleset_to_out_header["id_er"].values[0],units_table,land_use_table)
            #print(parking_set_to_out)
            list_to_out.append(parking_set_to_out)
    return list_to_out

def run_sql_requests(ruleset_id,con:sqlalchemy.Connection):
    # create the sqlalchemy connection
    engine=create_engine(config_db.pg_string)
    # connect to database and start requests
    with engine.connect() as con:
        # convert rulesets to retrieve to string for SQL request
        if isinstance(ruleset_id,int):
            list_of_rulesets=str(ruleset_id)
        else:
            list_of_rulesets = ",".join(map(str,ruleset_id))
        # pull the relevant rulesets headers
        command = f"SELECT * FROM public.{config_db.db_table_reg_sets_header} WHERE {config_db.db_column_reg_sets_id} IN ({list_of_rulesets})"
        rulesets_header_table = pd.read_sql(command,con=con)
        # go get the association table to have all the rules relevant to the rulesets you're trying to pull
        command = f"SELECT * FROM public.{config_db.db_table_reg_sets_match} WHERE {config_db.db_column_reg_sets_id} IN ({list_of_rulesets}) ORDER BY id_assoc_er_reg ASC"
        rules_association_table = pd.read_sql(command,con=con)
        # convert the relevant rules to string to pull the requests in the rules tables
        list_rules_to_retrieve = ",".join(rules_association_table[config_db.db_column_parking_regs_id].unique().astype(str))
        # pull the rules headers
        command = f"SELECT * FROM public.{config_db.db_table_parking_reg_headers} WHERE {config_db.db_column_parking_regs_id} IN ({list_rules_to_retrieve}) ORDER BY {config_db.db_column_parking_regs_id} ASC"
        relevant_rules_heads = pd.read_sql(command,con=con)
        # pull the stacked rules
        command = f"SELECT * FROM public.{config_db.db_table_parking_reg_stacked} WHERE {config_db.db_column_parking_regs_id} IN ({list_rules_to_retrieve}) ORDER BY {config_db.db_column_parking_regs_id},{config_db.db_column_stacked_parking_id} ASC"
        relevant_rules_def = pd.read_sql(command,con=con)
        # pull the units
        command = f"SELECT * FROM public.{config_db.db_table_units}"
        units_table = pd.read_sql(command,con=con)
        # pull all the available land uses
        command = f"select * from public.cubf"
        land_use_table= pd.read_sql(command,con=con)
    return rulesets_header_table,rules_association_table,relevant_rules_def,relevant_rules_heads,units_table,land_use_table


def get_parking_reg_for_lot(lot_id:str)->pd.DataFrame:
    NotImplementedError('Not Yet Implemented')
    query = f"""SELECT 
                    rf.RL0105A::int,
                    luc.description as description_cubf,
                    coalesce(rf.rl0307A::int,0) as rl0307a,
                    PRS.id_er,
                    PRS.description_er,
                    cs.id_periode_geo,
                    cs.ville_sec,
                    STRING_AGG(rf.id_provinc::text, ',') AS id_provinc_list,
                    SUM(rf.RL0308A) as rl0308a_somme,
                    SUM(rf.rl0311a) as rl0311a_somme,
                    SUM(rf.rl0312a) as rl0312a_somme,
                    SUM(rf.rl0404a) as rl0404a_somme
                FROM
                    public.association_cadastre_role AS cad
                JOIN
                    public.role_foncier AS rf ON cad.id_provinc = rf.id_provinc
                JOIN
                    public.cartographie_secteurs AS cs ON ST_Intersects(rf.geometry, cs.geometry)
                JOIN
                    public.historique_geopol AS hg ON cs.id_periode = hg.id_periode
                JOIN
                    public.association_er_territoire AS ass ON ass.id_periode_geo = cs.id_periode_geo
                JOIN
                    public.ensembles_reglements_stat AS PRS ON ass.id_er = PRS.id_er
                JOIN public.cubf luc on luc.cubf::int=rf.RL0105A::int
                WHERE
                    cad.g_no_lot = '{lot_id}' AND
                    (hg.date_debut_periode <= COALESCE(rf.RL0307A::int, 0) OR hg.date_debut_periode IS NULL) AND
                    (hg.date_fin_periode >= COALESCE(rf.RL0307A::int, 0) OR hg.date_fin_periode IS NULL) AND
                    (PRS.date_debut_er <= COALESCE(rf.RL0307A::int, 0) OR PRS.date_debut_er IS NULL) AND
                    (PRS.date_fin_er >= COALESCE(rf.RL0307A::int, 0) OR PRS.date_fin_er IS NULL)
                GROUP BY
                    rf.RL0105A,
                    PRS.id_er,
                    PRS.description_er,
                    cs.id_periode_geo,
                    cs.ville_sec,
                    rf.rl0307a,
                    luc.description;
            """
    engine = create_engine(config_db.pg_string)
    with engine.connect() as con:
        rulesets_association_data = pd.read_sql_query(query,con)
    rulesets_to_obtain = rulesets_association_data[config_db.db_column_reg_sets_id].unique().tolist()
    relevant_rulesets = from_sql(rulesets_to_obtain)
    association_with_rule = pd.DataFrame()
    for ruleset in relevant_rulesets:
        relevant_associations = rulesets_association_data.loc[rulesets_association_data[config_db.db_column_reg_sets_id]==ruleset.ruleset_id].copy()
        association_final = relevant_associations.merge(ruleset.expanded_table, left_on=config_db.db_column_tax_land_use,right_on=config_db.db_column_land_use_id,how="left")
        association_final = association_final.merge(ruleset.reg_head[[config_db.db_column_parking_regs_id,config_db.db_column_parking_description]],on=config_db.db_column_parking_regs_id,how="inner")
        association_final.rename(columns={'description':'description_reg_stat'},inplace=True)
        association_final = association_final.merge(ruleset.land_use_table,how='left', on=config_db.db_column_land_use_id)
        if association_with_rule.empty:
            association_with_rule = association_final
        else:
            association_with_rule = pd.concat(association_with_rule,association_final)
    units = DBPR.get_units_for_regs(association_with_rule[config_db.db_column_parking_regs_id].to_list())
    association_with_rule= association_with_rule.merge(units,how='left',on=config_db.db_column_parking_regs_id)
    return association_with_rule

def get_all_reg_sets_from_database(engine:sqlalchemy.Engine=None)->list[PRS.ParkingRegulationSet]:
    '''
        # get_all_reg_sets_from_database
        Renvoie tous les ensembles de règlements dans une liste
            Intrants:
                - engine: Engine sqlalchemy de la connection
            Extrants:
                - liste[ParkingRegulationSet]: list des ensembles de règlements
    '''
    query = f'''
        SELECT
            {config_db.db_column_reg_sets_id}
        FROM {config_db.db_table_reg_sets_header}

    '''
    if engine is None:
        engine = sqlalchemy.create_engine(config_db.pg_string)
    with engine.connect() as con:
        reg_sets_ids:pd.DataFrame = pd.read_sql(query,con=con)
        rsi_list:list[int] = reg_sets_ids[config_db.db_column_reg_sets_id].unique().tolist()
        reg_sets = from_sql(rsi_list)
    return reg_sets