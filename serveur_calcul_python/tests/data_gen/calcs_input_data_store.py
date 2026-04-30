from classes import parking_inventory_inputs as PCI
import pandas as pd
def generate_all_required_inputs():
    simple_inputs= generate_inputs_simple()
    thresh_data = generate_thresh_data()
    add_data = generate_addition_based_data()
    floor_data = generate_floor_data()
    ceil_data_or = generate_ceil_data_or()
    ceil_data_thresh = generate_ceil_data_thresh()
    output = pd.concat([simple_inputs,thresh_data,add_data,floor_data,ceil_data_or,ceil_data_thresh]).reset_index(drop=True)
    return output

def generate_prs_1_inputs():
    simple_inputs= generate_inputs_simple()
    add_data = generate_addition_based_data()
    floor_data = generate_floor_data()
    ceil_data_or = generate_ceil_data_or()
    output = pd.concat([simple_inputs,add_data,floor_data,ceil_data_or]).reset_index(drop=True)
    return output

def generate_prs_2_inputs():
    ceil_data_thresh = generate_ceil_data_thresh()
    return ceil_data_thresh

def generate_prs_3_inputs():
    thresh_data = generate_thresh_data()
    return thresh_data

def generate_inputs_simple():
    return PCI.ParkingCalculationInputs({
        'g_no_lot':['a','b'],
        'id_reg_stat':[1,1],
        'unite':[1,1],
        'cubf':[5000,5000],
        'valeur':[100.0,1000.0],
        'id_er':[1,1]
    })

def generate_thresh_data():
    return PCI.ParkingCalculationInputs({
        'g_no_lot':['c','d','e','f','g'],
        'id_reg_stat':[2,2,2,2,2],
        'unite':[1,1,1,1,1],
        'cubf':[6000,6000,6000,6000,6000],
        'valeur':[0.0,50.0,100.0,150.0,200.0],
        'id_er':[3,3,3,3,3]
    })

def generate_addition_based_data():
    return PCI.ParkingCalculationInputs({
        'g_no_lot':['h','h','i','i','j','j','k','k'],
        'id_reg_stat':[3,3,3,3,3,3,3,3],
        'unite':[2,3,2,3,2,3,2,3],
        'cubf':[4000,4000,4000,4000,4000,4000,4000,4000],
        'valeur':[0.0,0.0,100.0,0.0,0.0,100.0,100.0,100.0],
        'id_er':[1,1,1,1,1,1,1,1]
    })

def generate_floor_data():
    return  PCI.ParkingCalculationInputs({
        'g_no_lot':['l','m','n','o'],
        'id_reg_stat':[4,4,4,4],
        'unite':[1,1,1,1],
        'cubf':[1000,1000,1000,1000],
        'valeur':[100.0,200.0,500.0,1000.0],
        'id_er':[1,1,1,1]
    })

def generate_ceil_data_or():
    return PCI.ParkingCalculationInputs({
        'g_no_lot':['p','q','r','s','t'],
        'id_reg_stat':[5,5,5,5,5],
        'unite':[1,1,1,1,1],
        'cubf':[2000,2000,2000,2000,2000],
        'valeur':[100.0,200.0,500.0,675.0,1000.0],
        'id_er':[1,1,1,1,1]
    })

def generate_ceil_data_thresh():
    return PCI.ParkingCalculationInputs({
        'g_no_lot':['u','v','w','x','y'],
        'id_reg_stat':[6,6,6,6,6],
        'unite':[1,1,1,1,1],
        'cubf':[2000,2000,2000,2000,2000],
        'valeur':[100.0,200.0,500.0,675.0,1000.0],
        'id_er':[2,2,2,2,2]
    })