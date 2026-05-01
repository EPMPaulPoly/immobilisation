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

def calculate_parking_subset_from_inputs_class(reg_to_calculate:PR.ParkingRegulations,subset:int,relevant_inputs:PII.ParkingCalculationInputs,methode_estime:int=3)->PI.ParkingInventory:
    if reg_to_calculate.check_only_one_regulation():
        match reg_to_calculate.get_subset_intra_operation_type(subset):
            case 1:
                inventory = calculate_addition_based_subset_from_inputs_class(reg_to_calculate,subset,relevant_inputs,methode_estime)
                #NotImplementedError('Not yet Implemented')
            case 2:
                AttributeError('Operation 2  deprecated and no longer in use. Use operator 4 instead')
            case 3:
                AttributeError('Operation 3 not supported within one subset')
            case 4:
                inventory = calculate_threshold_based_subset_from_inputs_class(reg_to_calculate,subset,relevant_inputs,methode_estime)
            case 5:
                AttributeError('Operation 5 not supported within one subset')
            case 6:
                AttributeError('Operation 6 not supported within one subset')
        return inventory
    else:
        ValueError('Can only calculate one rule at a time')

def calculate_threshold_based_subset_from_inputs_class(reg_to_calculate:PR.ParkingRegulations,subset:int,data:PII.ParkingCalculationInputs,methode_estime:int=3):
    if reg_to_calculate.check_subset_exists(subset) and reg_to_calculate.check_only_one_regulation():
        units = reg_to_calculate.get_subset_units(subset)
        operator = reg_to_calculate.get_subset_intra_operation_type(subset)
        if len(units)==1 and operator ==4:
            thresholds = reg_to_calculate.get_subset_thresholds(subset)
            previous_threshold = None
            parking_final = pd.DataFrame()
            for threshold in thresholds:
                lower_thresh = float(threshold)
                if previous_threshold is not None:
                    upper_thresh = float(previous_threshold)
                else:
                    upper_thresh = previous_threshold
                
                relevant_data = data.get_by_reg(reg_to_calculate.get_reg_id()).get_by_units(units[0]).filter_by_threshold(lower_thresh, upper_thresh)
                previous_threshold=threshold
                if not relevant_data.empty:
                    line_def = reg_to_calculate.get_line_item_by_subset_threshold(subset,threshold)
                    zero_crossing_min = line_def[config_db.db_column_parking_zero_crossing_min].values[0]
                    zero_crossing_max = line_def[config_db.db_column_parking_zero_crossing_max].values[0]
                    slope_min = line_def[config_db.db_column_parking_slope_min].values[0]
                    slope_max = line_def[config_db.db_column_parking_slope_max].values[0]
                    parking_frame_thresh = pd.DataFrame()
                    parking_frame_thresh[config_db.db_column_lot_id] = relevant_data[config_db.db_column_lot_id]
                    if zero_crossing_min is not None and slope_min is not None:
                        parking_frame_thresh['n_places_min'] = zero_crossing_min + slope_min * relevant_data['valeur']
                    elif zero_crossing_min is not None:
                        parking_frame_thresh['n_places_min'] = zero_crossing_min
                    else:
                        parking_frame_thresh['n_places_min'] = None
                    if zero_crossing_max is not None and slope_max is not None:
                        parking_frame_thresh['n_places_max'] = zero_crossing_max + slope_max * relevant_data['valeur']
                    elif zero_crossing_max is not None:
                        parking_frame_thresh['n_places_max'] = zero_crossing_max
                    else: 
                        parking_frame_thresh['n_places_max'] = None

                    parking_frame_thresh.loc[parking_frame_thresh['n_places_max']<parking_frame_thresh['n_places_min'],'n_places_max']=None
                    parking_frame_thresh['n_places_mesure'] = None
                    parking_frame_thresh['n_places_estime'] = None
                    parking_frame_thresh['methode_estime'] = methode_estime
                    parking_frame_thresh[config_db.db_column_parking_regs_id] = relevant_data[config_db.db_column_parking_regs_id]
                    if config_db.db_column_reg_sets_id in relevant_data.columns:
                        parking_frame_thresh[config_db.db_column_reg_sets_id] = relevant_data[config_db.db_column_reg_sets_id]
                    else: 
                        parking_frame_thresh[config_db.db_column_reg_sets_id]=0
                    parking_frame_thresh[config_db.db_column_land_use_id] = relevant_data[config_db.db_column_land_use_id]
                    parking_frame_thresh['commentaire'] = relevant_data.apply(lambda x: f'Unite: {x[config_db.db_column_parking_unit_id]} Val: {x['valeur']} ',axis=1)
                    if parking_final.empty:
                        parking_final = parking_frame_thresh
                    else:
                        parking_final = pd.concat([parking_final,parking_frame_thresh])
            parking_out = PI.ParkingInventory(parking_final)
            return parking_out
        else:
            ValueError('subset should have operator 4 and only one unit') 
    else:
        ValueError('Can only calculate one rule at a time')

def calculate_addition_based_subset_from_inputs_class(reg_to_calculate:PR.ParkingRegulations,subset:int,data:PII.ParkingCalculationInputs,methode_estime:int=3):
    if reg_to_calculate.check_subset_exists(subset) and reg_to_calculate.check_only_one_regulation():
        operator = reg_to_calculate.get_subset_intra_operation_type(subset)
        if operator==1:
            subset_def = reg_to_calculate.get_subset_def(subset)
            relevant_data = data.get_by_reg(reg_to_calculate.get_reg_id())
            reg_units = reg_to_calculate.get_subset_units(subset)

            if relevant_data.check_units_present(reg_units):
                inventory = pd.DataFrame(relevant_data.loc[relevant_data[config_db.db_column_parking_unit_id].isin(reg_units)].merge(subset_def,on=[config_db.db_column_parking_regs_id,config_db.db_column_parking_unit_id],how='left'))
                
                # Create a mask for rows where both conditions are not None
                mask_both_min_not_none = (
                    inventory[config_db.db_column_parking_zero_crossing_min].notna() & 
                    inventory[config_db.db_column_parking_slope_min].notna()
                )
                mask_both_max_not_note = (
                    inventory[config_db.db_column_parking_zero_crossing_max].notna() & 
                    inventory[config_db.db_column_parking_slope_max].notna()
                )
                # Create a mask for rows where both conditions are not None
                mask_crossing_min_not_none = (
                    inventory[config_db.db_column_parking_zero_crossing_min].notna()& 
                    inventory[config_db.db_column_parking_slope_min].isna()
                )
                mask_crossing_max_not_none = (
                    inventory[config_db.db_column_parking_zero_crossing_max].notna()& 
                    inventory[config_db.db_column_parking_slope_max].isna()
                )

                mask_both_min_none = (
                    inventory[config_db.db_column_parking_zero_crossing_min].isna()& 
                    inventory[config_db.db_column_parking_slope_min].isna()
                )
                mask_both_max_none = (
                    inventory[config_db.db_column_parking_zero_crossing_max].isna()& 
                    inventory[config_db.db_column_parking_slope_max].isna()
                )

                inventory.loc[mask_both_min_not_none,'n_places_min'] = inventory.loc[mask_both_min_not_none,
                        config_db.db_column_parking_zero_crossing_min] + inventory.loc[mask_both_min_not_none,
                            config_db.db_column_parking_slope_min] * inventory.loc[mask_both_min_not_none,'valeur']
                inventory.loc[mask_crossing_min_not_none,'n_places_min'] = inventory.loc[mask_crossing_min_not_none,config_db.db_column_parking_zero_crossing_min]
                inventory.loc[mask_both_min_none,'n_places_min'] = np.nan

                inventory.loc[mask_both_max_not_note,'n_places_max'] = inventory.loc[mask_both_max_not_note,
                        config_db.db_column_parking_zero_crossing_max] + inventory.loc[mask_both_max_not_note,
                            config_db.db_column_parking_slope_max] * inventory.loc[mask_both_max_not_note,'valeur']
                inventory.loc[mask_crossing_max_not_none,'n_places_max'] = inventory.loc[mask_crossing_max_not_none,config_db.db_column_parking_zero_crossing_max]
                inventory.loc[mask_both_max_none,'n_places_max'] = np.nan
                inventory.drop(columns=['id_reg_stat_emp','ss_ensemble','seuil','oper','cases_fix_min','cases_fix_max','pente_min','pente_max'],inplace=True)
                inventory['commentaire'] = inventory.apply(lambda x: f'Unite: {x[config_db.db_column_parking_unit_id]} Val: {x['valeur']} ', axis=1)
                if config_db.db_column_reg_sets_id not in inventory.columns:
                    inventory[config_db.db_column_reg_sets_id]=0
                agg_dict = {
                    config_db.db_column_land_use_id: lambda x: '/'.join(map(str, x)),
                    config_db.db_column_parking_regs_id: lambda x: '/'.join(map(str, x)),
                    config_db.db_column_reg_sets_id: lambda x: '/'.join(map(str, x)), 
                    'commentaire': lambda x: '/'.join(set(x)),    # Concatenate unique names
                    'n_places_min': lambda x: x.sum(min_count=1),
                    'n_places_max': lambda x: x.sum(min_count=1)                  # Sum the values
                }
                inventory_out = inventory.groupby(by=config_db.db_column_lot_id).agg(agg_dict).reset_index()
                inventory_out.loc[inventory_out['n_places_max']<inventory_out['n_places_min'],'n_places_max']=None
                inventory_out['methode_estime'] = methode_estime
                inventory_out['n_places_mesure'] = np.nan
                inventory_out['n_places_estime'] = np.nan
                return PI.ParkingInventory(inventory_out)
            else:
                ValueError('You need to provide all relevant units for a regulation')

