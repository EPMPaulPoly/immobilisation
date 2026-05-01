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

class TravelSurveyData():
    def __init__(self,od_data:gpd.GeoDataFrame,sector_geom:gpd.GeoDataFrame):
        if len(sector_geom)>1:
            ValueError('sector must only have one item')
        if od_data.empty:
            ValueError('cannot initiate empty dataframe')
        self.sector_geometry = sector_geom
        self.geo_od:gpd.GeoDataFrame = od_data
    

    def set_geometry_column(self,geom_to_use:str='hh'):
        if geom_to_use not in {"hh", "ori", "des"}:
            raise ValueError(f"Invalid geom option: {geom_to_use}")
        else:
            match geom_to_use:
                case 'hh':
                    self.geo_od.set_geometry(col="geom_logis",inplace=True)
                case 'ori':
                    self.geo_od.set_geometry(col="geom_ori",inplace=True)
                case 'des':
                    self.geo_od.set_geometry(col="geom_des",inplace=True)
                case _:
                    self.geo_od.set_geometry(col="geom_logis",inplace=True)

    def filter_by_sector_location(self,location_option:str = 'hh') ->Self:
        self.set_geometry_column(location_option)
        data_out:gpd.GeoDataFrame = self.geo_od.loc[self.geo_od.within(self.sector_geometry.geometry.iloc[0])]
        data_out_VAP = TravelSurveyData(od_data=pd.DataFrame(data_out),sector_geom=self.sector_geometry)
        return data_out_VAP

    def household_head_return(self)->Self:
        data_out = self.geo_od.loc[self.geo_od['tlog']==1]
        data_out_vap = TravelSurveyData(od_data=data_out,sector_geom=self.sector_geometry)
        return data_out_vap

    def filter_relevant_households_interacting_with_sector(self):
        # find people with origin, destination or housing in sector
        sector_geom_only:Geometry = self.sector_geometry['geometry'].iloc[0]
        relevant_person_list = self.geo_od.loc[
            self.geo_od.set_geometry(col="geom_logis").within(sector_geom_only) | 
            self.geo_od.set_geometry(col='geom_ori').within(sector_geom_only) | 
            self.geo_od.set_geometry(col='geom_des').within(sector_geom_only),
            'clepersonne'].unique().tolist()
        data_out = self.geo_od.loc[self.geo_od['clepersonne'].isin(relevant_person_list)]
        data_out_vap = TravelSurveyData(data_out,self.sector_geometry)
        return data_out_vap

    def get_list_of_dep_hours(self):
        data_out = self.geo_od['hredep'].unique().tolist()
        return data_out
    

 
    
    def get_car_trips_in_hour(self,hour:int):
        data_out = self.geo_od.loc[(self.geo_od['heure']==hour) & (self.geo_od['mode1']==1)]
        return data_out
    
    def get_non_car_trips_in_hour(self,hour:int):
        data_out = self.geo_od.loc[(self.geo_od['heure']==hour) & (self.geo_od['mode1']!=1)]
        return data_out

    def get_all_trips_in_hour(self,hour:int):
        data_out = self.geo_od.loc[(self.geo_od['heure']==hour)]
        return data_out
    def get_all_licenseholder_trips_in_hour(self,hour:int):
        data_out = self.geo_od.loc[(self.geo_od['heure']==hour) & (self.geo_od['percond']==1)]
        return data_out

def create_geometry_columns(raw_od)->gpd.GeoDataFrame:
    hh_lat_column_name = 'ylatlog'
    hh_long_column_name = 'xlonlog'
    hh_geometry_column_name = "geom_logis"
    ori_lat_column_name = 'ylatori'
    ori_long_column_name = 'xlonori'
    ori_geometry_column_name = "geom_ori"
    des_lat_column_name = 'ylatdes'
    des_long_column_name = 'xlondes'
    des_geometry_column_name = "geom_des"

    raw_od[hh_geometry_column_name] = [Point(xy) for xy in zip(raw_od[hh_long_column_name], raw_od[hh_lat_column_name])]
    raw_od[ori_geometry_column_name] = [Point(xy) for xy in zip(raw_od[ori_long_column_name], raw_od[ori_lat_column_name])]
    raw_od[des_geometry_column_name] = [Point(xy) for xy in zip(raw_od[des_long_column_name], raw_od[des_lat_column_name])]
    raw_od['trip_line'] = raw_od.apply(lambda row: LineString([row['geom_ori'], row['geom_des']]), axis=1)
    # Create the GeoDataFrame
    gdf = gpd.GeoDataFrame(raw_od, geometry=hh_geometry_column_name,crs=4326)
    return gdf

def explore_trip_contents(trips:gpd.GeoDataFrame,file:str):
    m1 = trips.set_geometry(col='trip_line',crs=4326).explore(name='Trip Line')
    trips.set_geometry(col='geom_ori',crs=4326).explore(m=m1,color='red',name='Origin')
    trips.set_geometry(col='geom_des',crs=4326).explore(m=m1,color='blue',name='Destination')
    trips.set_geometry(col='geom_logis',crs=4326).explore(m=m1,color='green',name='Dwelling')
    if "buffer_geom" in trips.columns:
            trips.set_geometry("buffer_geom", crs=4326).explore(
            m=m1,
            color="yellow",
            name="Dwelling buffer"
        )
    m1.add_child(folium.LayerControl())
    m1.save(file)