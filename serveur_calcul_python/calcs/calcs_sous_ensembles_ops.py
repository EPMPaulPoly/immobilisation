# import external libs
import logging
import pandas as pd
from typing import Union
import numpy as np
# Import stuff from other files in the project
from classes import parking_inventory_inputs as PII
from classes import parking_inventory as PI
from config import config_db
from classes import parking_regs as PR
from classes import reg_set_territory as RST
from classes import parking_reg_sets as PRS
from classes import tax_dataset as TD
from calcs import calcs_conversion_unite as CCU
from aggregation import agg_inventaire as IA


def subset_operation(inventory_1:PI.ParkingInventory,operator,inventory_2:PI.ParkingInventory) ->PI.ParkingInventory:
    logger = logging.getLogger(__name__)
    if isinstance(operator,int):
        match operator:
            case 1:
                raise NotImplementedError('Subset Operator no implemented')
            case 2:
                raise NotImplementedError('Obsolete operator')
            case 3:
                new_parking = most_constraining_or_operation(inventory_1,inventory_2)
            case 4:
                raise NotImplementedError('Subset Operator no implemented')
            case 5:
                raise NotImplementedError('Obsolete operator')
            case 6:
                new_parking = simple_or_operation(inventory_1,inventory_2)
        return new_parking
    else:
        raise ValueError(f'Operator must be integer, you supplied {type(operator)}')
        

def most_constraining_or_operation(inventory_1:PI.ParkingInventory,inventory_2:PI.ParkingInventory):
    logger = logging.getLogger(__name__)
    logger.info('entering MOST CONSTRAINING OR operation')
    if (inventory_1.parking_frame['n_places_min'].isnull().all() and inventory_2.parking_frame['n_places_max'].isnull().all()): # one is a min, one is a max if min > max
        logger.info('Entrée dans l''opération de subset par défaut')
        # create dataframe
        parking_frame_out = pd.DataFrame()
        # pull data from left
        parking_frame_out = inventory_1.parking_frame[[config_db.db_column_lot_id,'n_places_max']].copy()
        parking_frame_out.rename(columns={'n_places_max':'n_places_max_left'},inplace=True)
        # pull data from right
        parking_frame_right =inventory_2.parking_frame[[config_db.db_column_lot_id,'n_places_min']].copy()
        parking_frame_right.rename(columns={'n_places_min':'n_places_min_right'},inplace=True)
        #merge data
        parking_frame_out = parking_frame_out.merge(parking_frame_right,on=config_db.db_column_lot_id)
        # case 1 min<=max
        parking_frame_out.loc[parking_frame_out['n_places_min_right']<=parking_frame_out['n_places_max_left'],'n_places_min_final'] = parking_frame_out.loc[parking_frame_out['n_places_min_right']<=parking_frame_out['n_places_max_left'],'n_places_min_right'] 
        parking_frame_out.loc[parking_frame_out['n_places_min_right']<=parking_frame_out['n_places_max_left'],'n_places_max_final'] = parking_frame_out.loc[parking_frame_out['n_places_min_right']<=parking_frame_out['n_places_max_left'],'n_places_max_left'] 
        # case 2 min>max
        parking_frame_out.loc[parking_frame_out['n_places_min_right']>parking_frame_out['n_places_max_left'],'n_places_min_final'] = parking_frame_out.loc[parking_frame_out['n_places_min_right']>parking_frame_out['n_places_max_left'],'n_places_max_left'] 
        parking_frame_out.loc[parking_frame_out['n_places_min_right']>parking_frame_out['n_places_max_left'],'n_places_max_final'] = parking_frame_out.loc[parking_frame_out['n_places_min_right']>parking_frame_out['n_places_max_left'],'n_places_max_left'] 
        # clean up the right left stuff
        parking_frame_out.drop(columns=['n_places_min_right','n_places_max_left'],inplace=True)
        # copy old parking frame
        old_parking_frame = inventory_1.parking_frame.copy()
        # merge the data to the old parking frame
        new_parking_frame = old_parking_frame.merge(parking_frame_out,how='left',on=config_db.db_column_lot_id)
        # drop the old data
        new_parking_frame.drop(columns=['n_places_min','n_places_max'],inplace=True)
        # rename columns
        new_parking_frame.rename(columns={'n_places_min_final':'n_places_min','n_places_max_final':'n_places_max'},inplace=True)
        #create parking inventory object
        parking_inventory_object = PI.ParkingInventory(new_parking_frame)
    elif (inventory_1.parking_frame['n_places_max'].isnull().all() and inventory_2.parking_frame['n_places_min'].isnull().all()): # one is a min, one is a max if min > max
        logger.info('Entrée dans l''opération de subset par défaut')
        # create dataframe
        parking_frame_out = pd.DataFrame()
        # pull data from left
        parking_frame_out = inventory_1.parking_frame[[config_db.db_column_lot_id,'n_places_min']].copy()
        parking_frame_out.rename(columns={'n_places_min':'n_places_min_left'},inplace=True)
        # pull data from right
        parking_frame_right =inventory_2.parking_frame[[config_db.db_column_lot_id,'n_places_max']].copy()
        parking_frame_right.rename(columns={'n_places_max':'n_places_max_right'},inplace=True)
        #merge data
        parking_frame_out = parking_frame_out.merge(parking_frame_right,on=config_db.db_column_lot_id)
        # case 1 min<=max
        parking_frame_out.loc[parking_frame_out['n_places_min_left']<=parking_frame_out['n_places_max_right'],'n_places_min_final'] = parking_frame_out.loc[parking_frame_out['n_places_min_left']<=parking_frame_out['n_places_max_right'],'n_places_min_left'] 
        parking_frame_out.loc[parking_frame_out['n_places_min_left']<=parking_frame_out['n_places_max_right'],'n_places_max_final'] = parking_frame_out.loc[parking_frame_out['n_places_min_left']<=parking_frame_out['n_places_max_right'],'n_places_max_right'] 
        # case 2 min>max
        parking_frame_out.loc[parking_frame_out['n_places_min_left']>parking_frame_out['n_places_max_right'],'n_places_min_final'] = parking_frame_out.loc[parking_frame_out['n_places_min_left']>parking_frame_out['n_places_max_right'],'n_places_max_right'] 
        parking_frame_out.loc[parking_frame_out['n_places_min_left']>parking_frame_out['n_places_max_right'],'n_places_max_final'] = parking_frame_out.loc[parking_frame_out['n_places_min_left']>parking_frame_out['n_places_max_right'],'n_places_max_right'] 
        # clean up the right left stuff
        parking_frame_out.drop(columns=['n_places_min_left','n_places_max_right'],inplace=True)
        # copy old parking frame
        old_parking_frame = inventory_1.parking_frame.copy()
        # merge the data to the old parking frame
        new_parking_frame = old_parking_frame.merge(parking_frame_out,how='left',on=config_db.db_column_lot_id)
        # drop the old data
        new_parking_frame.drop(columns=['n_places_min','n_places_max'],inplace=True)
        # rename columns
        new_parking_frame.rename(columns={'n_places_min_final':'n_places_min','n_places_max_final':'n_places_max'},inplace=True)
        #create parking inventory object
        parking_inventory_object = PI.ParkingInventory(new_parking_frame)
    else: # default case, i have a min and a max
        logger.info('Entrée dans l''opération de subset par défaut')
        # create an emptry dataframe
        parking_frame_out = pd.DataFrame()
        # copy over self.parking_frame, mins and maxes, rename left
        parking_frame_out = inventory_1.parking_frame[[config_db.db_column_lot_id,'n_places_min','n_places_max']].copy()
        parking_frame_out.rename(columns={'n_places_min':'n_places_min_left','n_places_max':'n_places_max_left'},inplace=True)
        # copy over inventory_2.parking_frame, mins and maxes, rename right
        parking_frame_right =inventory_2.parking_frame[[config_db.db_column_lot_id,'n_places_min','n_places_max']].copy()
        parking_frame_right.rename(columns={'n_places_min':'n_places_min_right','n_places_max':'n_places_max_right'},inplace=True)
        # merge the dataframes
        parking_frame_out = parking_frame_out.merge(parking_frame_right,on=config_db.db_column_lot_id)
        # mins and maxes and cleanup
        parking_frame_out['n_places_min_final'] = parking_frame_out[['n_places_min_left','n_places_min_right']].max(axis=1)
        parking_frame_out['n_places_max_final'] = parking_frame_out[['n_places_max_left','n_places_max_right']].min(axis=1)
        parking_frame_out.drop(columns=['n_places_min_left','n_places_min_right','n_places_max_left','n_places_max_right'],inplace=True)
        # copy th old frame
        old_parking_frame = inventory_1.parking_frame.copy()
        # merge new onto old
        new_parking_frame = old_parking_frame.merge(parking_frame_out,how='left',on=config_db.db_column_lot_id)
        # drop old
        new_parking_frame.drop(columns=['n_places_min','n_places_max'],inplace=True)
        #name cleanup
        new_parking_frame.rename(columns={'n_places_min_final':'n_places_min','n_places_max_final':'n_places_max'},inplace=True)
        new_parking_frame['commentaire'] = inventory_1.parking_frame['commentaire']+'/' +inventory_2.parking_frame['commentaire']
        #create object
        parking_inventory_object = PI.ParkingInventory(new_parking_frame)
    logger.info('Complétion du cas de base')
    return parking_inventory_object

def simple_or_operation(inventory_1:PI.ParkingInventory,inventory_2:PI.ParkingInventory):
    logger = logging.getLogger(__name__)
    logger.info('Entrée dans l''opération OU SIMPLE')
    parking_frame_out = pd.DataFrame()
    parking_frame_out = inventory_1.parking_frame[[config_db.db_column_lot_id,'n_places_min','n_places_max']].copy()
    parking_frame_out.rename(columns={'n_places_min':'n_places_min_left','n_places_max':'n_places_max_left'},inplace=True)
    parking_frame_right =inventory_2.parking_frame[[config_db.db_column_lot_id,'n_places_min','n_places_max']].copy()
    parking_frame_right.rename(columns={'n_places_min':'n_places_min_right','n_places_max':'n_places_max_right'},inplace=True)
    parking_frame_out = parking_frame_out.merge(parking_frame_right,on=config_db.db_column_lot_id)
    # implémenté comme prenant le minimum des requis minimaux. Ceci et mis en place selon la logique qu'un développeur immobilier voudrait potentiellement 
    # Cas 1 la gauche_min est plus petit: min_final = min_left, max_final = max_left
    parking_frame_out.loc[parking_frame_out['n_places_min_left']<parking_frame_out['n_places_min_right'],'n_places_min_final'] = parking_frame_out.loc[parking_frame_out['n_places_min_left']<parking_frame_out['n_places_min_right'],'n_places_min_left']
    parking_frame_out.loc[parking_frame_out['n_places_min_left']<parking_frame_out['n_places_min_right'],'n_places_max_final'] = parking_frame_out.loc[parking_frame_out['n_places_min_left']<parking_frame_out['n_places_min_right'],'n_places_max_left']
    # Cas 2 la droite_min est plus petit: min_final = min_right, max_final = max_right
    parking_frame_out.loc[parking_frame_out['n_places_min_left']>=parking_frame_out['n_places_min_right'],'n_places_min_final'] = parking_frame_out.loc[parking_frame_out['n_places_min_left']>=parking_frame_out['n_places_min_right'],'n_places_min_right']
    parking_frame_out.loc[parking_frame_out['n_places_min_left']>=parking_frame_out['n_places_min_right'],'n_places_max_final'] = parking_frame_out.loc[parking_frame_out['n_places_min_left']>=parking_frame_out['n_places_min_right'],'n_places_max_right']
    # ramène le vieux frame
    old_parking_frame = inventory_1.parking_frame.copy()
    # drop gauche/droite
    parking_frame_out.drop(columns=['n_places_min_left','n_places_min_right','n_places_max_left','n_places_max_right'],inplace=True)
    new_parking_frame = old_parking_frame.merge(parking_frame_out,how='left',on=config_db.db_column_lot_id)
    new_parking_frame.drop(columns=['n_places_min','n_places_max'],inplace=True)
    new_parking_frame.rename(columns={'n_places_min_final':'n_places_min','n_places_max_final':'n_places_max'},inplace=True)
    new_parking_frame['commentaire'] = inventory_1.parking_frame['commentaire']+'/' +inventory_2.parking_frame['commentaire']
    if config_db.db_column_reg_sets_id not in new_parking_frame.columns:
        new_parking_frame[config_db.db_column_reg_sets_id]=0
    parking_inventory_object = PI.ParkingInventory(new_parking_frame)
    return parking_inventory_object