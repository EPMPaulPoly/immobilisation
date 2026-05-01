# import external libs
import logging
import pandas as pd
from typing import Union
import numpy as np
# Import stuff from other files in the project
from classes import parking_inventory as PI
from classes import reg_set_territory as RST
from classes import tax_dataset as TD
from calcs import calcs_conversion_unite as CCU
from calcs import calcs_mins_from_inputs as CMFI

def calculate_parking_for_reg_set_territories(reg_set_territories:Union[RST.RegSetTerritory,list[RST.RegSetTerritory]],tax_datas:Union[TD.TaxDataset,list[TD.TaxDataset]])->Union[PI.ParkingInventory,list[PI.ParkingInventory]]:
    logger = logging.getLogger(__name__)
    logger.info('-----------------------------------------------------------------------------------------------')
    logger.info('Entering Inventory')
    logger.info('-----------------------------------------------------------------------------------------------')
    if isinstance(reg_set_territories,RST.RegSetTerritory) and isinstance(tax_datas,TD.TaxDataset):
        logger.info('-----------------------------------------------------------------------------------------------')
        logger.info(f'Starting inventory for regset territory: {reg_set_territories}')
        logger.info('-----------------------------------------------------------------------------------------------')
        parking_calculation_input = CCU.generate_input_from_PRS_TD(reg_set_territories.parking_regulation_set,tax_datas)
        parking_inventory_to_return = CMFI.calculate_inventory_from_inputs_class(parking_calculation_input,2)
        return parking_inventory_to_return
    parking_inventory_list = []
    for sub_reg_set ,sub_tax_data in zip(reg_set_territories,tax_datas):
        if len(sub_tax_data.tax_table)>0 and len(sub_tax_data.lot_table)>0:
            logger.info('-----------------------------------------------------------------------------------------------')
            logger.info(f'Starting inventory for regset territory: {sub_reg_set}')
            logger.info('-----------------------------------------------------------------------------------------------')
            # find unique parking regs and recursively call function with only one
            parking_calculation_input = CCU.generate_input_from_PRS_TD(sub_reg_set.parking_regulation_set,sub_tax_data)
            parking_inventory_to_potentially_append = CMFI.calculate_inventory_from_inputs_class(parking_calculation_input,2)
            parking_inventory_list.append(parking_inventory_to_potentially_append)
    return parking_inventory_list