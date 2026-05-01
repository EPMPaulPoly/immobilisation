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
from db_interface import db_parking_regs as DBPR

def calculate_inventory_from_inputs_class(donnees_calcul:PII.ParkingCalculationInputs,methode_estime:int=3)->PI.ParkingInventory:
    ids_reglements_obtenir:list[int] = donnees_calcul[config_db.db_column_parking_regs_id].unique().tolist()
    reglements:PR.ParkingRegulations = DBPR.from_postgis(ids_reglements_obtenir)
    parking_out= []
    for id_reglement in ids_reglements_obtenir:
        donnees_pertinentes:pd.DataFrame = donnees_calcul.loc[donnees_calcul[config_db.db_column_parking_regs_id]==id_reglement]
        reglement:PR.ParkingRegulations = reglements.get_reg_by_id(int(id_reglement))
        unites = reglement.get_units()

        unites_donnees:list[int] = donnees_pertinentes.loc[
            donnees_pertinentes[config_db.db_column_parking_regs_id]==id_reglement,config_db.db_column_parking_unit_id
            ].unique().tolist()
        
        if unites.sort()==unites_donnees.sort():
            parking_last = CMR.calculate_parking_specific_reg_from_inputs_class(
                reglement,
                donnees_pertinentes,
                methode_estime
                )
            
            parking_out.append(parking_last)
    parking_final = IA.dissolve_list(parking_out)
    parking_final  = IA.merge_lot_data(parking_final)
    return parking_final