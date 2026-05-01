
import pandas as pd
import geopandas as gpd
from sqlalchemy import create_engine,text,Engine,MetaData,Table
import sqlalchemy as db_alchemy
from config import config_db
from typing_extensions import Self
import logging
import sqlalchemy

class ParkingInventory():
    '''
        # ParkingInventory
            Objet contenant un inventaire de stationnement. Pour l'instant l'inventaire de stationnment est aggrégé au niveau du lot cadastral pour l'instant pour permettre de créer un inventaire basé sur les réglements de stationnement. 
    '''
    def __init__(self,parking_inventory_frame: pd.DataFrame)->Self:
        f'''
            # __init__
            Fonction d'instanciation de l'object ParkingInventory.
            Inputs:
                - parking_inventory_frame: dataframe with columns:g_no_lot, n_places_min,n_places_max,methode_estime,id_ens_reg,id_reg_stat,rl,commentaire
        '''
        fields_to_confirm = [config_db.db_column_lot_id,'n_places_min','n_places_max','methode_estime',config_db.db_column_reg_sets_id,config_db.db_column_parking_regs_id,config_db.db_column_land_use_id, 'commentaire']
        if all(item in parking_inventory_frame.columns for item in fields_to_confirm):
            self.parking_frame:pd.DataFrame = parking_inventory_frame
        else: 
            KeyError("Colonnes suivantes doivent être présentes dans l'estimé ['id_cadastre','n_places','methode_estime','ens_reg_estim','reg_estim','commentaire']")
       
    def __repr__(self):
        return f'N_lots ={len(self.parking_frame[config_db.db_column_lot_id].unique())}, N_places_min = {self.parking_frame['n_places_min'].agg('sum')}'
           
    def concat(self,inventory_2:Self)->Self:
        '''# concat
            concatène deux inventaire de stationnement en un sans en modificer le contenu
        '''
        logger = logging.getLogger(__name__)
        if self.parking_frame.empty==False and inventory_2.parking_frame.empty ==False:
            logger.info('Inventory concatenation - 2 inventories with data')
            self.parking_frame = pd.concat([self.parking_frame,inventory_2.parking_frame])
        elif self.parking_frame.empty==True:
            logger.info('Inventory concatenation - Main inventory empty, setting to inventory 2 frame')
            self.parking_frame = inventory_2.parking_frame
        else:
            logger.warning('Inventory concatenation - Both datasets are empty - continuing')
        
    def to_postgis(self,con:db_alchemy.Engine=None):
        '''
        # to_postgis
        Fonction qui envoie l'inventaire de stationnement sur la base de données
        '''
        logger = logging.getLogger(__name__)
        if isinstance(con,db_alchemy.Engine):
            logger.info('Using existing connection engine')
        else: 
            con = db_alchemy.create_engine(config_db.pg_string)
        self.parking_frame.to_sql(config_db.db_table_parking_inventory,con=con,if_exists='replace',index=False)

    def to_json(self)->str :
        '''# to_json
            Transforme les données         
        '''
        return self.parking_frame.to_json(orient='records',force_ascii=False)
    
    def copy(self:Self)->Self:
        '''
            # copy
            renvoie une copie du dataframe.
        '''
        return ParkingInventory(self.parking_frame.copy())


def check_neighborhood_inventory()->bool:
    NotImplementedError('Not Yet implemented')



