import pandas as pd
import sys
from pathlib import Path
sys.path.append(str(Path(__file__).resolve().parents[2]))


from classes import parking_regs as PR

def get_simple_rule_straight_conversion():
    return generate_all_relevant_regs().get_reg_by_id(1)

def generate_threshold_based_reg():
    return generate_all_relevant_regs().get_reg_by_id(2)

def generate_addition_based_reg():    
    return generate_all_relevant_regs().get_reg_by_id(3)

def generate_floor_based_reg():
    return generate_all_relevant_regs().get_reg_by_id(4)

def generate_ceil_or_based_reg():
    return generate_all_relevant_regs().get_reg_by_id(5)

def generate_ceil_thresh_based_reg():
    return generate_all_relevant_regs().get_reg_by_id(6)

def generate_all_relevant_regs():
    reg_header = pd.DataFrame({
        'id_reg_stat':[1,2,3,4,5,6],
        'description':['Règlement min une seule pente','Règlement min base seuil','Règlement min basé addition avec conversion','Règlement min avec plancher','Règlement min avec plafond max','Règlement min avec plafond seuil'],
        'texte_loi':[
            'Texte règlement une seule pente',
            'Texte règlement basé seuil',
            'Texte Règlement addition avec conversion',
            'Texte Règlement plancher',
            'Texte Règlement plafond max',
            'Texte Règlement plafond seuil' ],
        'annee_debut_reg':[1990,1995,1990,1990, 1990,1990],
        'annee_fin_reg':[2000,2000,2000,2000,2000,2000],
        'article_loi':['article règlement une seule pente','article règlement seuil','article règlement addition avec conversion','article règlement plancher','article règlement plafond max','article règlement plafond seuil'],
        'paragraphe_loi':[
            'Paragraph règlement une seule pente',
            'Paragraphe Règlement seuil',
            'Paragraphe Règlement addition avec conversion',
            'Paragraphe règlement plancher',
            'Paragraphe règlement plafond max',
            'Paragraphe règlement plafond seuil'],
        'ville':[
            'Ville règlement une seule pente',
            'Ville règlement seuil',
            'Ville règlement addition avec conversion',
            'Ville règlement plancher',
            'Ville règlement plafond max',
            'Ville règlement plafond seuil']
    })
    reg_def = pd.DataFrame({
        'id_reg_stat_emp':[
            1, # règlement 1: min une seule pente
            2, # Règlemetn 2: seuil
            3, 
            4, # Règlement 3: addition
            5,
            6, # Reg : plancher
            7,
            8,# plafond max
            9,
            10,
            11, # plafond seuil
            12,
            13
            ],
        'id_reg_stat':[
            1, # Reg 1: pente
            2, # reg 2: seuile
            2,
            3, # reg 3: addition
            3,
            4, # reg 4: plancher
            4,
            5, # reg 5: plafond max
            5, 
            5,
            6, # reg 6: plafond seuil
            6,
            6,
            ],
        'ss_ensemble':[
            1, # Reg 1 : 1 seul sous ensemble
            1, # Reg 2 : 1 seul sous ensemble
            1,
            1, # Reg 3: 1 seul sous ensemble
            1,
            1, # Reg 4: plancher 2 sous ensembles
            2,
            1, # reg 5: plancher et plafond max
            2,
            3,
            1, # reg 6: plancher et plafond seuil 1 seul sous ensemble
            1,
            1
            ],
        'seuil':[
            0, # reg 1
            0, # reg 2 seuil
            100, # seuil à 100m2
            0,# reg 3 addition
            0, # reg 3 addition
            0, # reg 4 plancher
            0, # reg 4 plancher
            0, # reg 5 plafond max,
            0, # reg 5 pladond max.
            0, # reg 5 plafond max
            0, # reg 6 plafond seuil
            200, # Reg 6 plafond seuil
            700 # reg 6 plafond seuil
            ],
        'oper':[
            None,
            None, # Reg 1 seuil
            4,  # Seuil à 100m2 
            None, # reg 3
            1, # reg 3 1 signifie additoin 
            None,# reg 4 se 1
            3, # reg 4 ou plus contraignant
            None, # reg 5 plafond max
            3,
            3,
            None, # reg plafnd seuil
            4,
            4
            ],
        'cases_fix_min':[
            0, # 
            0, # reg 2: 1 place par 20m2 jusqu 100m2 pui un place par 100m2 au dela
            4, # cases_fix_min_1 = cases_fix_min_0+ pente_min_0 * seuil_1 - pente_min_1 * seuil_1
            0, # reg 3: basé addition tout à zéro
            0, # reg 3: basé addtion 
            10, # reg 4: basé min max
            0,
            0, # reg 5
            10,
            None,
            10, # reg 6
            0,
            35
            ],
        'cases_fix_max':[
            None,# reg 1
            None,# ref 2
            None,
            None, #reg 3
            None,
            None, # reg 4
            None,
            None,# reg 5
            None, 
            35,
            None,
            None, # reg 6
            None
            ],
        'pente_min':[
            0.05, # reg 1
            0.05, # reg 2
            0.01, 
            0.5, # reg 3 addition 0.5 par employe + 0.25 par salle
            0.25,
            None, # reg 4 10 places ou 1 place par 20m2 au plus contraignant
            0.05,
            0.05, # reg 5 10 places ou 1 place par 20m2 jusqu 'a concurrence de 35 places
            None,
            None,
            None, # reg 6
            0.05,
            None
            ],
        'pente_max':[
            None,
            None,
            None,
            None,
            None,
            None,
            None,
            None,
            None,
            None,
            None,
            None,
            None
            ],
        'unite':[
            1,
            1,
            1,
            2,
            3,
            1,
            1,
            1,
            1,
            1, 
            1,
            1,
            1
            ]
    })
    units = pd.DataFrame({
        'id_unite':[1,2,3],
        'desc_unite':['Aire plancher','Employé','Salle'],
        'colonne_role_foncier':['rl0308a','rl0308a','rl0311a'],
        'facteur_correction':[1,0.01,0.025], # 1 employé par 100m2 , 1 salle par 40m2
        'abscisse_correction':[0,0,0]
    })
    big_pr = PR.ParkingRegulations(reg_header,reg_def,units)

    return big_pr

if __name__ == "__main__":
    generate_all_relevant_regs()