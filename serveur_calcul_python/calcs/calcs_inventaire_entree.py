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
from calcs import calcs_sous_ensembles_mins as CSE
from calcs import calcs_sous_ensembles_ops as OSE
from calcs import calcs_mins_reg_set_territory as CMRST
from db_interface import db_tax_dataset as DBTD
from db_interface import db_reg_set_territory as DBRST

def calculate_inventory_by_analysis_sector(sector_to_calculate:int, create_html:bool = False,overwrite:int=0)->PI.ParkingInventory:
    '''
        # calculate_inventory_by_analysis_sector
        Permet de calculer le stationnement pour chaque lot danas un quartier d'analyse donné
    '''
    try:
        # find all points within sector
        logging.info('Getting tax data sets within neighbourhoods')
        tax_data_to_analyse: TD.TaxDataset = DBTD.tax_database_for_analysis_territory(sector_to_calculate)
        # find all territories that touch the data
        logging.info('Finding relevant parking rulesets')
        [RSTs,TDs] = DBRST.get_rst_by_tax_data(tax_data_to_analyse)
        #creating  parking inventories
        logging.info('Calculating parking inventory')
        parking_inventories:list[PI.ParkingInventory] = CMRST.calculate_parking_for_reg_set_territories(RSTs,TDs)
        logging.info('Inventory completed - merging inventory list into one list')
        final_parking_inventory = IA.dissolve_list(parking_inventories)
        logging.info('Merging inventories for a given lot')
        final_parking_inventory = IA.merge_lot_data(final_parking_inventory)
        return final_parking_inventory
    except Exception as e:
        logging.error(f'Error in inventory calculation for sector {sector_to_calculate} - error message: {e}\n')
        raise  

def calculate_inventory_by_lot(lot_to_calculate:str, create_html:bool = False,overwrite:int=0)->PI.ParkingInventory:
    '''
        # calculate_inventory_by_lot
            calculates the inventory for a lot
    '''
    # find all points within sector
    logging.info(f'Starting parking inventory calculation for lot: {lot_to_calculate}')
    logging.info('Getting tax data sets within neighbourhoods')
    tax_data_to_analyse = DBTD.tax_database_from_lot_id(lot_to_calculate)
    # find all territories that touch the data
    logging.info('Finding relevant parking rulesets')
    [RSTs,TDs] = DBRST.get_rst_by_tax_data(tax_data_to_analyse)
    #creating  parking inventories
    logging.info('Calculating parking inventory')
    parking_inventories:list[PI.ParkingInventory] = CMRST.calculate_parking_for_reg_set_territories(RSTs,TDs)
    logging.info('Inventory completed - merging inventory list into one list')
    final_parking_inventory = IA.dissolve_list(parking_inventories)
    logging.info('Merging inventories for a given lot')
    final_parking_inventory = IA.merge_lot_data(final_parking_inventory)
    return final_parking_inventory













