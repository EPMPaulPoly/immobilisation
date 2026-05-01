import numpy as np
import geopandas as gpd
import pandas as pd
from typing import Optional, Union
from datetime import datetime
from sqlalchemy import create_engine,text
from config import config_db
from classes import parking_reg_sets as PRS
from classes import tax_dataset as TD
import matplotlib.pyplot as plt
from copy import deepcopy
from folium import Map
import logging

class RegSetTerritory():
    '''
        # reg_set_territory 
         This is an object that represents the combination of a territory and a ruleset
         ## Attributes:
            Territory: GeoSeries representing the territory of a municipality, the end and start date of it's existence
            ruleset: a ParkingRegulationSet as defined in the classes document See that file for more details
         ## Methods:

    '''
    def __init__(self, territory: gpd.GeoSeries, parking_regulation_set:PRS.ParkingRegulationSet,period_start_year:int,period_end_year:int,assoc_id:int):
        self.assoc_id = assoc_id
        self.territory_info = territory
        self.parking_regulation_set = parking_regulation_set
        self.start_year = period_start_year
        self.end_year = period_end_year
    
    def __repr__(self):
        if self.end_year is None:
            return_string = f"RST ID: {self.assoc_id:03} - Territory: {self.territory_info[config_db.db_column_territory_name].values[0]} - {self.start_year:.0f}-Présent - Ruleset: {self.parking_regulation_set.description}"
        elif self.end_year is None:
            return_string = f"RST ID: {self.assoc_id:03} - Territory: {self.territory_info[config_db.db_column_territory_name].values[0]} - Big Bang -{self.end_year:.0f} - Ruleset: {self.parking_regulation_set.description}"
        else:
            return_string = f"RST ID: {self.assoc_id:03} - Territory: {self.territory_info[config_db.db_column_territory_name].values[0]} - {self.start_year:.0f}-{self.end_year:.0f} - Ruleset: {self.parking_regulation_set.description}"
        return return_string



def explore_RST_TD(reg_sets:Union[RegSetTerritory,list[RegSetTerritory]],tax_data:Union[TD.TaxDataset,list[TD.TaxDataset]])->Union[Map,list[Map]]:
    '''# explore_RST
        permet d'aller regarder les données  '''
    if isinstance(reg_sets,list) and isinstance(tax_data,list):
        if not (len(reg_sets)==len(tax_data)):
            raise KeyError('reg_sets and tax_data must have same length')
        reg_tax_foliums = []
        for reg,tax in zip(reg_sets,tax_data):
            m1 = reg.territory_info.explore(color="orange")
            m1 = tax.explore(m=m1)
            reg_tax_foliums.append(m1)
        return reg_tax_foliums
    elif isinstance(reg_sets,RegSetTerritory) and isinstance(tax_data,TD.TaxDataset):
        m1 = reg_sets.territory_info.explore(color="orange")
        m1 = tax.explore(m=m1)
        return m1
    else:
        raise TypeError('reg_set and tax_data must be both list or both individual')
    

