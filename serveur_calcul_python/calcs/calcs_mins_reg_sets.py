# import external libs
import logging
import pandas as pd
from typing import Union
import numpy as np
# Import stuff from other files in the project
from classes import parking_inventory_inputs as PII
from classes import parking_inventory as PI
from classes import parking_reg_sets as PRS
from classes import tax_dataset as TD
from calcs import calcs_conversion_unite as CCU
from calcs import calcs_mins_from_inputs as CMFI

def calculate_parking_specific_reg_set( 
        reg_set:PRS.ParkingRegulationSet,
        tax_data:TD.TaxDataset,
        reg_set_territory_to_transfer:int=0,
        scale:float=None)->PI.ParkingInventory:
    logger = logging.getLogger(__name__)
    logger.info('-----------------------------------------------------------------------------------------------')
    logger.info(f'Starting inventory for regset: {reg_set}')
    logger.info('-----------------------------------------------------------------------------------------------')
    if scale is None:
        scale = 1
    parking_calculation_input:PII.ParkingCalculationInputs = CCU.generate_input_from_PRS_TD(reg_set,tax_data,scale)
    parking_inventory:PI.ParkingInventory = CMFI.calculate_inventory_from_inputs_class(parking_calculation_input,2)
    return parking_inventory