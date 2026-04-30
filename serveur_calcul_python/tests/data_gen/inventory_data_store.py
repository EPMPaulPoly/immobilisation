from classes import parking_inventory as PI
import pandas as pd

def get_min_only_small_PI():
    return  PI.ParkingInventory(parking_inventory_frame = pd.DataFrame({
        'g_no_lot':get_lot_numbers(),
        'cubf':get_cubf(),
        'id_reg_stat':get_id_reg_stat(),
        'id_er':get_id_er(),
        'commentaire':get_commentaire_left(),
        'methode_estime':get_methode_estime(),
        'n_places_min':get_low_inventory(),
        'n_places_max':get_none_inventory()}
    ))
def get_min_only_large_PI():
    return PI.ParkingInventory(parking_inventory_frame = pd.DataFrame({
        'g_no_lot':get_lot_numbers(),
        'cubf':get_cubf(),
        'id_reg_stat':get_id_reg_stat(),
        'id_er':get_id_er(),
        'commentaire':get_commentaire_right(),
        'methode_estime':get_methode_estime(),
        'n_places_min':get_high_inventory(),
        'n_places_max':get_none_inventory()}
    ))  

def get_max_only_small_PI():
    return  PI.ParkingInventory(parking_inventory_frame = pd.DataFrame({
        'g_no_lot':get_lot_numbers(),
        'cubf':get_cubf(),
        'id_reg_stat':get_id_reg_stat(),
        'id_er':get_id_er(),
        'commentaire':get_commentaire_left(),
        'methode_estime':get_methode_estime(),
        'n_places_min':get_none_inventory(),
        'n_places_max':get_low_inventory()}
    ))
def get_max_only_large_PI():
    return PI.ParkingInventory(parking_inventory_frame = pd.DataFrame({
        'g_no_lot':get_lot_numbers(),
        'cubf':get_cubf(),
        'id_reg_stat':get_id_reg_stat(),
        'id_er':get_id_er(),
        'commentaire':get_commentaire_right(),
        'methode_estime':get_methode_estime(),
        'n_places_min':get_none_inventory(),
        'n_places_max':get_high_inventory()}
    ))  


def get_low_inventory():
    return [1,4]

def get_high_inventory():
    return [2,5]

def get_none_inventory():
    return[None,None]

def get_lot_numbers():
    return['a','b']

def get_cubf():
    return ['1000','1000']

def get_id_reg_stat():
    return['1','2']

def get_id_er():
    return['3','4']

def get_methode_estime():
    return [2,2]

def get_commentaire_left():
    return ['Comm_left_1','Comm_left_2']

def get_commentaire_right():
    return ['Comm_right_1','Comm_right_2']