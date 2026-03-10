import pandas as pd

import os
import sys
from pathlib import Path
# ajoute le dossier serveur_calcul_python (qui contient classes, calcs, etc.) au sys.path
sys.path.append(str(Path(__file__).resolve().parents[2]))
print(sys.path)
from classes import parking_inventory_inputs as PCI
from classes import parking_regs as PR
from calcs import calcs_inventaire as IC

def test_reglement_simple_min():
    reg_header = pd.DataFrame({
        'id_reg_stat':[1],
        'description':['Test Simple'],
        'texte_loi':['Test Simple'],
        'annee_debut_reg':[1990],
        'annne_fin_reg':[1995],
        'article_loi':['Test Simple'],
        'texte_loi':['Test Simple'],
        'paragraphe_loi':['test simple'],
        'ville':['Test Simple']
    })
    reg_def = pd.DataFrame({
        'id_reg_stat_emp':[1],
        'id_reg_stat':[1],
        'ss_ensemble':[1],
        'seuil':[0],
        'oper':[None],
        'cases_fix_min':[0],
        'cases_fix_max':[None],
        'pente_min':[0.05],
        'pente_max':[None],
        'unite':[1]
    })
    units = pd.DataFrame({
        'id_unite':[1],
        'desc_unite':['Test Simple'],
        'colonne_role_foncier':['rl0308a'],
        'facteur_correction':[1],
        'abscisse_correction':[0]
    })

    simple_park_reg = PR.ParkingRegulations(reg_header,reg_def,units)

    input_data = PCI.ParkingCalculationInputs({
        'g_no_lot':['a','b'],
        'cubf':['1000','1000'],
        'id_reg_stat':[1,1],
        'id_er':[1,1],
        'unite':[1,1],
        'valeur':[100,1000]
    })

    inventaire = IC.calculate_parking_specific_reg_from_inputs_class(simple_park_reg,input_data,2)
    assert inventaire.parking_frame.loc[inventaire.parking_frame['g_no_lot']=='a','n_places_min'].values[0] == 5
    assert inventaire.parking_frame.loc[inventaire.parking_frame['g_no_lot']=='b','n_places_min'].values[0]  == 50


def test_reglement_seuil_min():
    reg_header = pd.DataFrame({
        'id_reg_stat':[1],
        'description':['Test Simple'],
        'texte_loi':['Test Simple'],
        'annee_debut_reg':[1990],
        'annne_fin_reg':[1995],
        'article_loi':['Test Simple'],
        'texte_loi':['Test Simple'],
        'paragraphe_loi':['test simple'],
        'ville':['Test Simple']
    })
    reg_def = pd.DataFrame({
        'id_reg_stat_emp':[1,2],
        'id_reg_stat':[1,1],
        'ss_ensemble':[1,1],
        'seuil':[0,100],
        'oper':[None,4],
        'cases_fix_min':[0,4],
        'cases_fix_max':[None,None],
        'pente_min':[0.05,0.01],
        'pente_max':[None,None],
        'unite':[1,1]
    })
    units = pd.DataFrame({
        'id_unite':[1],
        'desc_unite':['Test Simple'],
        'colonne_role_foncier':['rl0308a'],
        'facteur_correction':[1],
        'abscisse_correction':[0]
    })

    simple_park_reg = PR.ParkingRegulations(reg_header,reg_def,units)

    input_data = PCI.ParkingCalculationInputs({
        'g_no_lot':['a','b','c','d','e'],
        'cubf':['1000','1000','1000','1000','1000'],
        'id_reg_stat':[1,1,1,1,1],
        'id_er':[1,1,1,1,1],
        'unite':[1,1,1,1,1],
        'valeur':[0,50,100,150,200]
    })

    inventaire = IC.calculate_parking_specific_reg_from_inputs_class(simple_park_reg,input_data,2)
    assert inventaire.parking_frame.loc[inventaire.parking_frame['g_no_lot']=='a','n_places_min'].values[0] == 0
    assert inventaire.parking_frame.loc[inventaire.parking_frame['g_no_lot']=='b','n_places_min'].values[0] == 2.5
    assert inventaire.parking_frame.loc[inventaire.parking_frame['g_no_lot']=='c','n_places_min'].values[0] == 5
    assert inventaire.parking_frame.loc[inventaire.parking_frame['g_no_lot']=='d','n_places_min'].values[0] == 5.5
    assert inventaire.parking_frame.loc[inventaire.parking_frame['g_no_lot']=='e','n_places_min'].values[0] == 6

def test_reglement_addition_min():
    reg_header = pd.DataFrame({
        'id_reg_stat':[1],
        'description':['Test Simple'],
        'texte_loi':['Test Simple'],
        'annee_debut_reg':[1990],
        'annne_fin_reg':[1995],
        'article_loi':['Test Simple'],
        'texte_loi':['Test Simple'],
        'paragraphe_loi':['test simple'],
        'ville':['Test Simple']
    })
    reg_def = pd.DataFrame({
        'id_reg_stat_emp':[1,2],
        'id_reg_stat':[1,1],
        'ss_ensemble':[1,1],
        'seuil':[0,100],
        'oper':[None,1],
        'cases_fix_min':[0,0],
        'cases_fix_max':[None,None],
        'pente_min':[0.5,0.25],
        'pente_max':[None,None],
        'unite':[1,2]
    })
    units = pd.DataFrame({
        'id_unite':[1,2],
        'desc_unite':['Employe','Salle'],
        'colonne_role_foncier':['rl0308a','rl0308a'],
        'facteur_correction':[1,0.05],
        'abscisse_correction':[0,0]
    })

    simple_park_reg = PR.ParkingRegulations(reg_header,reg_def,units)

    input_data = PCI.ParkingCalculationInputs({
        'g_no_lot':['a','a','b','b','c','c','d','d'],
        'cubf':['1000','1000','2000','2000','3000','3000','4000','4000'],
        'id_reg_stat':[1,1,1,1,1,1,1,1],
        'id_er':[1,1,1,1,1,1,1,1],
        'unite':[1,2,1,2,1,2,1,2],
        'valeur':[0,0,100,0,0,100,100,100]
    })

    inventaire = IC.calculate_parking_specific_reg_from_inputs_class(simple_park_reg,input_data,2)
    assert inventaire.parking_frame.loc[inventaire.parking_frame['g_no_lot']=='a','n_places_min'].values[0] == 0
    assert inventaire.parking_frame.loc[inventaire.parking_frame['g_no_lot']=='b','n_places_min'].values[0] == 50
    assert inventaire.parking_frame.loc[inventaire.parking_frame['g_no_lot']=='c','n_places_min'].values[0] == 25
    assert inventaire.parking_frame.loc[inventaire.parking_frame['g_no_lot']=='d','n_places_min'].values[0] == 75

def test_reglement_plancher_min():
    reg_header = pd.DataFrame({
        'id_reg_stat':[1],
        'description':['Test Simple'],
        'texte_loi':['Test Simple'],
        'annee_debut_reg':[1990],
        'annne_fin_reg':[1995],
        'article_loi':['Test Simple'],
        'texte_loi':['Test Simple'],
        'paragraphe_loi':['test simple'],
        'ville':['Test Simple']
    })
    reg_def = pd.DataFrame({
        'id_reg_stat_emp':[1,2],
        'id_reg_stat':[1,1],
        'ss_ensemble':[1,2],
        'seuil':[0,0],
        'oper':[None,3],
        'cases_fix_min':[0,10],
        'cases_fix_max':[None,None],
        'pente_min':[0.05,None],
        'pente_max':[None,None],
        'unite':[1,1]
    })
    units = pd.DataFrame({
        'id_unite':[1],
        'desc_unite':['Test Simple'],
        'colonne_role_foncier':['rl0308a'],
        'facteur_correction':[1],
        'abscisse_correction':[0]
    })

    simple_park_reg = PR.ParkingRegulations(reg_header,reg_def,units)

    input_data = PCI.ParkingCalculationInputs({
        'g_no_lot':['a','b','c','d'],
        'cubf':['1000','1000','1000','1000'],
        'id_reg_stat':[1,1,1,1],
        'id_er':[1,1,1,1],
        'unite':[1,1,1,1],
        'valeur':[100,200,500,1000]
    })

    inventaire = IC.calculate_parking_specific_reg_from_inputs_class(simple_park_reg,input_data,2)
    assert inventaire.parking_frame.loc[inventaire.parking_frame['g_no_lot']=='a','n_places_min'].values[0] == 10
    assert inventaire.parking_frame.loc[inventaire.parking_frame['g_no_lot']=='b','n_places_min'].values[0] == 10
    assert inventaire.parking_frame.loc[inventaire.parking_frame['g_no_lot']=='c','n_places_min'].values[0] == 25
    assert inventaire.parking_frame.loc[inventaire.parking_frame['g_no_lot']=='d','n_places_min'].values[0] == 50

def test_reglement_plafond_max():
    reg_header = pd.DataFrame({
        'id_reg_stat':[1],
        'description':['Test Simple'],
        'texte_loi':['Test Simple'],
        'annee_debut_reg':[1990],
        'annne_fin_reg':[1995],
        'article_loi':['Test Simple'],
        'texte_loi':['Test Simple'],
        'paragraphe_loi':['test simple'],
        'ville':['Test Simple']
    })
    reg_def = pd.DataFrame({
        'id_reg_stat_emp':[1,2,3],
        'id_reg_stat':[1,1,1],
        'ss_ensemble':[1,2,3],
        'seuil':[0,0,0],
        'oper':[None,3,3],
        'cases_fix_min':[0,10,None],
        'cases_fix_max':[None,None,35],
        'pente_min':[0.05,None,None],
        'pente_max':[None,None,None],
        'unite':[1,1,1]
    })
    units = pd.DataFrame({
        'id_unite':[1],
        'desc_unite':['Test Simple'],
        'colonne_role_foncier':['rl0308a'],
        'facteur_correction':[1],
        'abscisse_correction':[0]
    })

    simple_park_reg = PR.ParkingRegulations(reg_header,reg_def,units)

    input_data = PCI.ParkingCalculationInputs({
        'g_no_lot':['a','b','c','d','e'],
        'cubf':['1000','1000','1000','1000','1000'],
        'id_reg_stat':[1,1,1,1,1],
        'id_er':[1,1,1,1,1],
        'unite':[1,1,1,1,1],
        'valeur':[100,200,500,675,1000]
    })

    inventaire = IC.calculate_parking_specific_reg_from_inputs_class(simple_park_reg,input_data,2)
    assert inventaire.parking_frame.loc[inventaire.parking_frame['g_no_lot']=='a','n_places_min'].values[0] == 10
    assert inventaire.parking_frame.loc[inventaire.parking_frame['g_no_lot']=='b','n_places_min'].values[0] == 10
    assert inventaire.parking_frame.loc[inventaire.parking_frame['g_no_lot']=='c','n_places_min'].values[0] == 25
    assert inventaire.parking_frame.loc[inventaire.parking_frame['g_no_lot']=='d','n_places_min'].values[0] == 33.75
    assert inventaire.parking_frame.loc[inventaire.parking_frame['g_no_lot']=='e','n_places_min'].values[0] == 35

def test_reglement_plafond_seuil():
    reg_header = pd.DataFrame({
        'id_reg_stat':[1],
        'description':['Test Simple'],
        'texte_loi':['Test Simple'],
        'annee_debut_reg':[1990],
        'annne_fin_reg':[1995],
        'article_loi':['Test Simple'],
        'texte_loi':['Test Simple'],
        'paragraphe_loi':['test simple'],
        'ville':['Test Simple']
    })
    reg_def = pd.DataFrame({
        'id_reg_stat_emp':[1,2,3],
        'id_reg_stat':[1,1,1],
        'ss_ensemble':[1,1,1],
        'seuil':[0,200,700],
        'oper':[None,4,4],
        'cases_fix_min':[10,0,35],
        'cases_fix_max':[None,None,None],
        'pente_min':[None,.05,None],
        'pente_max':[None,None,None],
        'unite':[1,1,1]
    })
    units = pd.DataFrame({
        'id_unite':[1],
        'desc_unite':['Test Simple'],
        'colonne_role_foncier':['rl0308a'],
        'facteur_correction':[1],
        'abscisse_correction':[0]
    })

    simple_park_reg = PR.ParkingRegulations(reg_header,reg_def,units)

    input_data = PCI.ParkingCalculationInputs({
        'g_no_lot':['a','b','c','d','e'],
        'cubf':['1000','1000','1000','1000','1000'],
        'id_reg_stat':[1,1,1,1,1],
        'id_er':[1,1,1,1,1],
        'unite':[1,1,1,1,1],
        'valeur':[100,200,500,675,1000]
    })

    inventaire = IC.calculate_parking_specific_reg_from_inputs_class(simple_park_reg,input_data,2)
    assert inventaire.parking_frame.loc[inventaire.parking_frame['g_no_lot']=='a','n_places_min'].values[0] == 10
    assert inventaire.parking_frame.loc[inventaire.parking_frame['g_no_lot']=='b','n_places_min'].values[0] == 10
    assert inventaire.parking_frame.loc[inventaire.parking_frame['g_no_lot']=='c','n_places_min'].values[0] == 25
    assert inventaire.parking_frame.loc[inventaire.parking_frame['g_no_lot']=='d','n_places_min'].values[0] == 33.75
    assert inventaire.parking_frame.loc[inventaire.parking_frame['g_no_lot']=='e','n_places_min'].values[0] == 35

if __name__=="__main__":
    test_reglement_plafond_seuil()