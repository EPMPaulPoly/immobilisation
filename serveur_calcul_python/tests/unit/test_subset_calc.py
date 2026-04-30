import pandas as pd
import numpy as np
import os
import sys
from pathlib import Path
import classes.parking_regs as PR
import classes.parking_inventory as PI
import classes.parking_inventory_inputs as PCI
import tests.data_gen.regulation_data_store as RDS
import tests.data_gen.calcs_input_data_store as CIDS
from config import config_db as cf_db

def test_subset_simple_min():
    

    simple_park_reg = RDS.get_simple_rule_straight_conversion()

    input_data = CIDS.generate_inputs_simple()
    inventaire = PI.calculate_parking_subset_from_inputs_class(simple_park_reg,1,input_data,2)
    assert inventaire.parking_frame.loc[inventaire.parking_frame[cf_db.db_column_lot_id]=='a','n_places_min'].values[0] == 5
    assert inventaire.parking_frame.loc[inventaire.parking_frame[cf_db.db_column_lot_id]=='b','n_places_min'].values[0] == 50

def test_subset_seuil_min():
    simple_park_reg = RDS.generate_threshold_based_reg()

    input_data = CIDS.generate_thresh_data()

    inventaire = PI.calculate_parking_subset_from_inputs_class(simple_park_reg,1,input_data,2)
    assert inventaire.parking_frame.loc[inventaire.parking_frame['g_no_lot']=='c','n_places_min'].values[0] == 0
    assert inventaire.parking_frame.loc[inventaire.parking_frame['g_no_lot']=='d','n_places_min'].values[0] == 2.5
    assert inventaire.parking_frame.loc[inventaire.parking_frame['g_no_lot']=='e','n_places_min'].values[0] == 5
    assert inventaire.parking_frame.loc[inventaire.parking_frame['g_no_lot']=='f','n_places_min'].values[0] == 5.5
    assert inventaire.parking_frame.loc[inventaire.parking_frame['g_no_lot']=='g','n_places_min'].values[0] == 6

def test_subset_addition_min():
    simple_park_reg = RDS.generate_addition_based_reg()

    input_data = CIDS.generate_addition_based_data()

    inventaire = PI.calculate_parking_subset_from_inputs_class(simple_park_reg,1,input_data,2)
    assert inventaire.parking_frame.loc[inventaire.parking_frame['g_no_lot']=='h','n_places_min'].values[0] == 0
    assert inventaire.parking_frame.loc[inventaire.parking_frame['g_no_lot']=='i','n_places_min'].values[0] == 50
    assert inventaire.parking_frame.loc[inventaire.parking_frame['g_no_lot']=='j','n_places_min'].values[0] == 25
    assert inventaire.parking_frame.loc[inventaire.parking_frame['g_no_lot']=='k','n_places_min'].values[0] == 75

if __name__=="__main__":
    test_subset_simple_min()
    test_subset_seuil_min()