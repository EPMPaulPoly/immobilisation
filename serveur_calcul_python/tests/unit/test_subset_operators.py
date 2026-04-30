# import des librairies
import pandas as pd
import sys, pathlib
import numpy as np
import os
import sys
import serveur_calcul_python.tests.data_gen.inventory_data_store as IDS
from pathlib import Path
# ajoute le dossier serveur_calcul_python (qui contient classes, calcs, etc.) au sys.path
#sys.path.append(str(Path(__file__).resolve().parents[2]))
# import des classes et fonctions à tester
from classes import parking_inventory as PI


def test_or_simple():
    '''
    Test de la fonction simple_or de inventory_calcs
    '''
    min_left_smaller_min_right_simple_or()
    min_left_larger_min_right_simple_or()
    
def test_or_plus_contraignant():
    '''
        test de la fonction most_constraining_or de inventory_calcs
    '''
    min_left_larger_min_right_most_const_or()
    min_left_smaller_min_right_most_const_or()
    max_left_smaller_min_right_most_const_or()
    max_left_larger_min_right_most_const_or()
    min_left_smaller_max_right_most_const_or()
    min_left_larger_max_right_most_const_or()

def min_left_smaller_min_right_simple_or():
    left_PI = IDS.get_min_only_small_PI()
    right_PI = IDS.get_min_only_large_PI()
    test_subject_1 = PI.subset_operation(left_PI,6,right_PI)
    assert test_subject_1.parking_frame.iloc[0]['n_places_min'] == IDS.get_low_inventory()[0]
    assert test_subject_1.parking_frame.iloc[1]['n_places_min'] == IDS.get_low_inventory()[1]

def min_left_larger_min_right_simple_or():
    left_PI = IDS.get_min_only_large_PI()
    right_PI = IDS.get_min_only_small_PI()
    test_subject_1 = PI.subset_operation(left_PI,6,right_PI)
    assert test_subject_1.parking_frame.iloc[0]['n_places_min'] == IDS.get_low_inventory()[0]
    assert test_subject_1.parking_frame.iloc[1]['n_places_min'] == IDS.get_low_inventory()[1]

def min_left_smaller_min_right_most_const_or():
    left_PI = IDS.get_min_only_small_PI()
    right_PI = IDS.get_min_only_large_PI()
    test_subject_1 = PI.subset_operation(left_PI,3,right_PI)
    assert test_subject_1.parking_frame.iloc[0]['n_places_min'] == IDS.get_high_inventory()[0]
    assert test_subject_1.parking_frame.iloc[1]['n_places_min'] == IDS.get_high_inventory()[1]

def min_left_larger_min_right_most_const_or():
    left_PI = IDS.get_min_only_large_PI()
    right_PI = IDS.get_min_only_small_PI()
    test_subject_1 = PI.subset_operation(left_PI,3,right_PI)
    assert test_subject_1.parking_frame.iloc[0]['n_places_min'] == IDS.get_high_inventory()[0]
    assert test_subject_1.parking_frame.iloc[1]['n_places_min'] == IDS.get_high_inventory()[1]

def max_left_smaller_min_right_most_const_or():
    left_PI = IDS.get_max_only_small_PI()
    right_PI = IDS.get_min_only_large_PI()
    test_subject_1 = PI.subset_operation(left_PI,3,right_PI)
    assert test_subject_1.parking_frame.iloc[0]['n_places_min'] == IDS.get_low_inventory()[0]
    assert test_subject_1.parking_frame.iloc[1]['n_places_min'] == IDS.get_low_inventory()[1]

def max_left_larger_min_right_most_const_or():
    left_PI = IDS.get_max_only_large_PI()
    right_PI = IDS.get_min_only_small_PI()
    test_subject_1 = PI.subset_operation(left_PI,3,right_PI)
    assert test_subject_1.parking_frame.iloc[0]['n_places_min'] == IDS.get_low_inventory()[0]
    assert test_subject_1.parking_frame.iloc[1]['n_places_min'] == IDS.get_low_inventory()[1]

def min_left_smaller_max_right_most_const_or():
    left_PI = IDS.get_min_only_small_PI()
    right_PI = IDS.get_max_only_large_PI()
    test_subject_1 = PI.subset_operation(left_PI,3,right_PI)
    assert test_subject_1.parking_frame.iloc[0]['n_places_min'] == IDS.get_low_inventory()[0]
    assert test_subject_1.parking_frame.iloc[1]['n_places_min'] == IDS.get_low_inventory()[1]

def min_left_larger_max_right_most_const_or():
    left_PI = IDS.get_min_only_large_PI()
    right_PI = IDS.get_max_only_small_PI()
    test_subject_1 = PI.subset_operation(left_PI,3,right_PI)
    assert test_subject_1.parking_frame.iloc[0]['n_places_min'] == IDS.get_low_inventory()[0]
    assert test_subject_1.parking_frame.iloc[1]['n_places_min'] == IDS.get_low_inventory()[1]

if __name__ == "__main__":
    #sys.path.append(str(pathlib.Path(__file__).resolve().parents[2]))
    test_or_simple()
    test_or_plus_contraignant()
    print('All Tests passed')