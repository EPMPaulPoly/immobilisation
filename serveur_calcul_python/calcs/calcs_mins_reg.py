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
from calcs import calcs_mins_reg as CMR


def calculate_parking_specific_reg_from_inputs_class(reg_to_calculate:PR.ParkingRegulations,provided_inputs:PII.ParkingCalculationInputs,methode_estime:int=3)->PI.ParkingInventory:
    if reg_to_calculate.check_only_one_regulation():
        subsets = reg_to_calculate.get_subset_numbers()
        relevant_data = provided_inputs.get_by_reg(reg_to_calculate.get_reg_id())
        for inx,subset in enumerate(subsets):
            parking_inventory_subset:PI.ParkingInventory = CSE.calculate_parking_subset_from_inputs_class(reg_to_calculate,subset,relevant_data,methode_estime)
            if inx ==0:
                parking_out:PI.ParkingInventory = parking_inventory_subset
            else:
                parking_out =OSE.subset_operation(parking_out,reg_to_calculate.get_subset_inter_operation_type(subset),parking_inventory_subset)
    return parking_out