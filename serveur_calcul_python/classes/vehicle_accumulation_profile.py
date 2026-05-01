import pandas as pd
import geopandas as gpd
from shapely.geometry import Point,Polygon,LineString
from shapely import Geometry,wkb
from typing import Self
import os
#import dotenv
from psycopg2 import connect
import sqlalchemy
import math
import pyproj
from shapely.ops import transform
import matplotlib.pyplot as plt
import config.config_db as cf_db
import folium

class VehicleAccumulationProfile():

    def __init__(self,final_profile:pd.DataFrame):
        if final_profile.empty:
            ValueError('cannot initiate empty dataframe')
        self.final_profile = final_profile
    


    def to_json(self):
        return self.final_profile.to_json(orient='records',force_ascii=False)





if __name__=="__main__":
    path_od = r'C:\Users\paulc\Documents\01-Poly Msc\Recherche\DonneesOD\od17_extrait_2025049.csv'
    raw_od = pd.read_csv(path_od)
    engine = sqlalchemy.create_engine(cf_db.pg_string)
    query = 'SELECT * FROM public.sec_analyse WHERE id_quartier =1'
    with engine.connect() as con:
        sector = gpd.read_postgis(query,geom_col='geometry',crs=4326,con=con)
    vap_test = VehicleAccumulationProfile(raw_od,sector)
    print(f'Nombre de voitures du secteur: {math.ceil(vap_test.calculate_resident_cars())}')
    print(f'Population: {math.ceil(vap_test.get_population())}')
    vap_test_interactors_only = vap_test.filter_relevant_households_interacting_with_sector()
    print(vap_test_interactors_only.geo_od)
    output = vap_test_interactors_only.generate_vehicle_accumulation_profile()
    output.plot(x='hour',y='cars',kind='bar')
    plt.show()