
import pandas as pd
import geopandas as gpd
from sqlalchemy import create_engine,text,Engine,MetaData,Table
import classes.parking_inventory as PI
import sqlalchemy as db_alchemy
from config import config_db
from typing_extensions import Self
import logging
import sqlalchemy

def to_sql(inventory_to_save:PI.ParkingInventory,engine:sqlalchemy.Engine=None,overwrite:int=0):
    ''' # to_sql
        inserts parking frame into relevant 
    '''
    logger = logging.getLogger(__name__)
    if engine is None:
        engine = sqlalchemy.create_engine(config_db.pg_string)
        
    
    query_existing_inventory = f"SELECT * FROM public.{config_db.db_table_parking_inventory}"
    with engine.connect() as con:
        existing_inventory:pd.DataFrame = pd.read_sql(query_existing_inventory,con=con)
    existing_g_no_lot = existing_inventory[config_db.db_column_lot_id].unique().tolist()
    already_existing_inventory = inventory_to_save.parking_frame.loc[((inventory_to_save.parking_frame[config_db.db_column_lot_id].isin(existing_g_no_lot)) & (inventory_to_save.parking_frame['methode_estime']==2))]
    not_existing_inventory = inventory_to_save.parking_frame.loc[(~(inventory_to_save.parking_frame[config_db.db_column_lot_id].isin(existing_g_no_lot)) & (inventory_to_save.parking_frame['methode_estime']==2))]
    if already_existing_inventory.empty:
        inventory_to_save.parking_frame.to_sql(config_db.db_table_parking_inventory,con=engine,schema='public',if_exists='append',index=False)
        print('save_complete')
    else:
        if overwrite==1:
            logger.info(f'Les lots suivants sont déja dans la base de données \n {already_existing_inventory[config_db.db_column_lot_id].to_list()}\n')
            question_unanswered = True
            while question_unanswered:
                answer= str(input('Voulez vous remplacer les estimés pour lots en question[o/n]?'))
                if answer == 'o':
                    question_unanswered=False
                    lots_to_alter = already_existing_inventory[config_db.db_column_lot_id].unique().tolist()
                    query = f"DELETE FROM public.{config_db.db_table_parking_inventory} WHERE {config_db.db_column_lot_id} IN ('{"','".join(map(str,lots_to_alter))}') AND methode_estime = 2;"
                    statement = db_alchemy.text(query)
                    #meta = MetaData()
                    with engine.connect() as con:
                        dude = con.execute(statement)
                        con.commit()
                    inventory_to_save.parking_frame.to_sql(config_db.db_table_parking_inventory,con=engine,schema='public',if_exists='append',index=False)
                elif answer =='n':
                    logger.info(f'Nous sauverons seulement les éléments non-dupliqués')
                    question_unanswered=False
                    if not not_existing_inventory.empty:
                        not_existing_inventory.to_sql(config_db.db_table_parking_inventory,con=engine,schema='public',if_exists='append',index=False)
                else:
                    logger.info('Entrée invalide, seul y et n sont des entrés valides')
        else:
            logger.info("Seuls les items nos dupliqués seront sauvegardés, changez l'option overwrite pour supprimer les anciens estimés")
            if not not_existing_inventory.empty:
                not_existing_inventory.to_sql(config_db.db_table_parking_inventory,con=engine,schema='public',if_exists='append',index=False)


def get_lot_data_by_estimation(lot_ids:list[str],estimation_method:int,con:Engine=None)->PI.ParkingInventory:
    if con is None:
        con = create_engine(config_db.pg_string)
    with con.connect() as con2:
        query = f'''
                    SELECT 
                        *
                    FROM 
                        {config_db.db_table_parking_inventory}
                    WHERE {config_db.db_column_lot_id} in ('{("','").join(lot_ids)}') AND methode_estime={estimation_method}
                '''
        data = pd.read_sql(query,con=con2)
        data_PI = PI.ParkingInventory(data)
    return data_PI