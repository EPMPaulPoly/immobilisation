import pandas as pd

import os
import sys
from pathlib import Path
# ajoute le dossier serveur_calcul_python (qui contient classes, calcs, etc.) au sys.path
#sys.path.append(str(Path(__file__).resolve().parents[2]))
#print(sys.path)
from classes import parking_inventory_inputs as PCI
from classes import parking_regs as PR
import classes.parking_inventory as PI
from serveur_calcul_python.tests.data_gen import regulation_data_store as RDS
from serveur_calcul_python.tests.data_gen import calcs_input_data_store as CIDS

def test_get_reglement():
    all_regs= RDS.generate_all_relevant_regs()
    get_reg_res = all_regs.get_reg_by_id(1)
    header_res =  all_regs.reg_head.loc[all_regs.reg_head['id_reg_stat']==1]
    def_res = all_regs.reg_def.loc[all_regs.reg_def['id_reg_stat']==1]
    units_res = all_regs.units_table.loc[all_regs.units_table['id_unite'].isin(def_res['unite'].unique().tolist())]
    pd.testing.assert_frame_equal(get_reg_res.reg_head,header_res)
    pd.testing.assert_frame_equal(get_reg_res.reg_def,def_res)
    pd.testing.assert_frame_equal(get_reg_res.units_table,units_res)

def test_reglement_simple_min():
    simple_park_reg = RDS.get_simple_rule_straight_conversion()
    input_data = CIDS.generate_inputs_simple() 
    inventaire = PI.calculate_parking_specific_reg_from_inputs_class(simple_park_reg,input_data,2)
    assert inventaire.parking_frame.loc[inventaire.parking_frame['g_no_lot']=='a','n_places_min'].values[0] == 5
    assert inventaire.parking_frame.loc[inventaire.parking_frame['g_no_lot']=='b','n_places_min'].values[0]  == 50

def test_reglement_seuil_min():
    simple_park_reg = RDS.generate_threshold_based_reg()
    input_data = CIDS.generate_thresh_data()

    inventaire = PI.calculate_parking_specific_reg_from_inputs_class(simple_park_reg,input_data,2)
    assert inventaire.parking_frame.loc[inventaire.parking_frame['g_no_lot']=='c','n_places_min'].values[0] == 0
    assert inventaire.parking_frame.loc[inventaire.parking_frame['g_no_lot']=='d','n_places_min'].values[0] == 2.5
    assert inventaire.parking_frame.loc[inventaire.parking_frame['g_no_lot']=='e','n_places_min'].values[0] == 5
    assert inventaire.parking_frame.loc[inventaire.parking_frame['g_no_lot']=='f','n_places_min'].values[0] == 5.5
    assert inventaire.parking_frame.loc[inventaire.parking_frame['g_no_lot']=='g','n_places_min'].values[0] == 6

def test_reglement_addition_min():
    simple_park_reg = RDS.generate_addition_based_reg()
    input_data = CIDS.generate_addition_based_data()

    inventaire = PI.calculate_parking_specific_reg_from_inputs_class(simple_park_reg,input_data,2)
    assert inventaire.parking_frame.loc[inventaire.parking_frame['g_no_lot']=='h','n_places_min'].values[0] == 0
    assert inventaire.parking_frame.loc[inventaire.parking_frame['g_no_lot']=='i','n_places_min'].values[0] == 50
    assert inventaire.parking_frame.loc[inventaire.parking_frame['g_no_lot']=='j','n_places_min'].values[0] == 25
    assert inventaire.parking_frame.loc[inventaire.parking_frame['g_no_lot']=='k','n_places_min'].values[0] == 75

def test_reglement_plancher_min():
    simple_park_reg = RDS.generate_floor_based_reg()

    input_data = CIDS.generate_floor_data()

    inventaire = PI.calculate_parking_specific_reg_from_inputs_class(simple_park_reg,input_data,2)
    assert inventaire.parking_frame.loc[inventaire.parking_frame['g_no_lot']=='l','n_places_min'].values[0] == 10
    assert inventaire.parking_frame.loc[inventaire.parking_frame['g_no_lot']=='m','n_places_min'].values[0] == 10
    assert inventaire.parking_frame.loc[inventaire.parking_frame['g_no_lot']=='n','n_places_min'].values[0] == 25
    assert inventaire.parking_frame.loc[inventaire.parking_frame['g_no_lot']=='o','n_places_min'].values[0] == 50

def test_reglement_plafond_max():
    
    simple_park_reg = RDS.generate_ceil_or_based_reg()

    input_data = CIDS.generate_ceil_data_or()

    inventaire = PI.calculate_parking_specific_reg_from_inputs_class(simple_park_reg,input_data,2)
    assert inventaire.parking_frame.loc[inventaire.parking_frame['g_no_lot']=='p','n_places_min'].values[0] == 10
    assert inventaire.parking_frame.loc[inventaire.parking_frame['g_no_lot']=='q','n_places_min'].values[0] == 10
    assert inventaire.parking_frame.loc[inventaire.parking_frame['g_no_lot']=='r','n_places_min'].values[0] == 25
    assert inventaire.parking_frame.loc[inventaire.parking_frame['g_no_lot']=='s','n_places_min'].values[0] == 33.75
    assert inventaire.parking_frame.loc[inventaire.parking_frame['g_no_lot']=='t','n_places_min'].values[0] == 35

def test_reglement_plafond_seuil():
    simple_park_reg = RDS.generate_ceil_thresh_based_reg()

    input_data = CIDS.generate_ceil_data_thresh()

    inventaire = PI.calculate_parking_specific_reg_from_inputs_class(simple_park_reg,input_data,2)
    assert inventaire.parking_frame.loc[inventaire.parking_frame['g_no_lot']=='u','n_places_min'].values[0] == 10
    assert inventaire.parking_frame.loc[inventaire.parking_frame['g_no_lot']=='v','n_places_min'].values[0] == 10
    assert inventaire.parking_frame.loc[inventaire.parking_frame['g_no_lot']=='w','n_places_min'].values[0] == 25
    assert inventaire.parking_frame.loc[inventaire.parking_frame['g_no_lot']=='x','n_places_min'].values[0] == 33.75
    assert inventaire.parking_frame.loc[inventaire.parking_frame['g_no_lot']=='y','n_places_min'].values[0] == 35

if __name__=="__main__":
    #test_reglement_simple_min()
    #test_reglement_seuil_min()
    #test_reglement_addition_min()
    #test_reglement_plancher_min()
    #test_reglement_plafond_max()
    test_reglement_plafond_seuil()