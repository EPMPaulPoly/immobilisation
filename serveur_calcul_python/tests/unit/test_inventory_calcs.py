# import des librairies
import pandas as pd
import sys, pathlib
import os
# import des classes et fonctions à tester
from classes import parking_inventory as PI
from calcs import inventory_calcs as IC


def test_simple_or():
    '''
    Test de la fonction simple_or de inventory_calcs
    '''
    parking_frame_petit = PI.ParkingInventory(parking_inventory_frame = pd.DataFrame({
        'g_no_lot':[1],
        'n_places_min':[1]}
    ))
    parking_frame_grand = PI.ParkingInventory(parking_inventory_frame = pd.DataFrame({
        'g_no_lot':[1],
        'n_places_min':[2]}
    ))

    assert IC.simple_or_operation(parking_frame_petit,parking_frame_grand).parking_frame.iloc[0]['n_places_min'] == 1


if __name__ == "__main__":
    sys.path.append(str(pathlib.Path(__file__).resolve().parents[2]))
    test_simple_or()
    print('All Tests passed')