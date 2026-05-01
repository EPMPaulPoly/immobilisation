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
from classes import travel_survey_data as TSD


def get_population(travel_survey_data:TSD.TravelSurveyData):
    travel_survey_data.set_geometry_column('hh')
    relevant_persons_head = travel_survey_data.geo_od.loc[travel_survey_data.geo_od.within(travel_survey_data.sector_geometry['geometry'].iloc[0]) & travel_survey_data.geo_od['tper']==1]
    population = relevant_persons_head['facper'].agg('sum')
    return population

def get_license_holder_count(travel_survey_data:TSD.TravelSurveyData):
    travel_survey_data.set_geometry_column('hh')
    relevant_persons_head = travel_survey_data.geo_od.loc[(travel_survey_data.geo_od.within(travel_survey_data.sector_geometry['geometry'].iloc[0])) & (travel_survey_data.geo_od['tper'] == 1) & (travel_survey_data.geo_od['percond'] == 1)]
    population = relevant_persons_head['facper'].agg('sum')
    return population


def calculate_resident_cars(travel_survey_data:TSD.TravelSurveyData)->int:
    travel_survey_data.set_geometry_column('hh')
    data_from_sector = travel_survey_data.filter_by_sector_location('hh')
    household_head:TSD.TravelSurveyData = data_from_sector.household_head_return()
    household_head.geo_od['cars_times_fac'] = household_head.geo_od['nbveh'] * household_head.geo_od['facmen']
    total_cars = household_head.geo_od['cars_times_fac'].agg('sum')
    return total_cars
    

def calculate_outgoing_trips(car_trips_in_hour:gpd.GeoDataFrame,sector_polygon:Polygon):
    test= car_trips_in_hour.copy()
    test.drop(columns=['nolog', 'tlog', 'nbper', 'nbveh', 'xlonlog', 'ylatlog', 'sdrlog',
       'smlog', 'srlog', 'gslog', 'facmen',  'tper', 'sexe',
       'age', 'grpage', 'percond', 'occper', 'xlonocc', 'ylatocc', 'mobil',
       'facpermc',  'nodep', 'hredep',
       'hredepimp',  'hrearv', 'motif', 'motif_gr', 'mode2',
       'mode3', 'mode4', 'stat', 'coutstat', 'termstat', 'lieuori', 'xlonori',
       'ylatori', 'smori', 'xlondes', 'ylatdes'],inplace=True)
    
    test['ori_in_sector'] = test.set_geometry(col='geom_ori',crs=4326).within(sector_polygon)
    test['des_out_sector'] = ~test.set_geometry(col='geom_des',crs=4326).within(sector_polygon)
    test['is_outgoing_trip'] = test['ori_in_sector'] & test['des_out_sector']
    outgoing_trips = test.loc[test['is_outgoing_trip']]
    number_of_outgoing_trip = math.ceil(outgoing_trips['facdep'].agg('sum'))
    return number_of_outgoing_trip

def calculate_outgoing_trips_from_residence(car_trips_in_hour:gpd.GeoDataFrame,sector_polygon:Polygon):
    test= car_trips_in_hour.copy()
    test.drop(columns=['nolog', 'tlog', 'nbper', 'nbveh', 'xlonlog', 'ylatlog', 'sdrlog',
       'smlog', 'srlog', 'gslog', 'facmen',  'tper', 'sexe',
       'age', 'grpage', 'percond', 'occper', 'xlonocc', 'ylatocc', 'mobil',
       'facpermc',  'nodep', 'hredep',
       'hredepimp',  'hrearv',  'motif_gr', 'mode2',
       'mode3', 'mode4', 'stat', 'coutstat', 'termstat', 'lieuori', 'xlonori',
       'ylatori', 'smori', 'xlondes', 'ylatdes'],inplace=True)
    
    test['ori_in_sector'] = test.set_geometry(col='geom_ori',crs=4326).within(sector_polygon)
    test['des_out_sector'] = ~test.set_geometry(col='geom_des',crs=4326).within(sector_polygon)
    test['buffer_geom'] = gpd.GeoSeries(
        test.set_geometry(col='geom_logis', crs=4326).to_crs(3857).geometry.buffer(50),
        crs=3857
    ).to_crs(4326)
    test['is_ori_at_residence'] = test.set_geometry(col='geom_ori',crs=4326).within(test.set_geometry(col='buffer_geom',crs=4326))
    test['is_outgoing_trip'] = test['ori_in_sector'] & test['des_out_sector'] & test['is_ori_at_residence']
    outgoing_trips = test.loc[test['is_outgoing_trip']]
    number_of_outgoing_trip = math.ceil(outgoing_trips['facdep'].agg('sum'))
    return number_of_outgoing_trip

def calculate_outgoing_trips_from_public(car_trips_in_hour:gpd.GeoDataFrame,sector_polygon:Polygon):
    test= car_trips_in_hour.copy()
    project = pyproj.Transformer.from_crs("EPSG:4326", "EPSG:3857", always_xy=True).transform
    sector_polygon_3857 = transform(project, sector_polygon)
    test.drop(columns=['nolog', 'tlog', 'nbper', 'nbveh', 'xlonlog', 'ylatlog', 'sdrlog',
       'smlog', 'srlog', 'gslog', 'facmen',  'tper', 'sexe',
       'age', 'grpage', 'percond', 'occper', 'xlonocc', 'ylatocc', 'mobil',
       'facpermc',  'nodep', 'hredep',
       'hredepimp',  'hrearv',  'motif_gr', 'mode2',
       'mode3', 'mode4', 'stat', 'coutstat', 'termstat', 'lieuori', 'xlonori',
       'ylatori', 'smori', 'xlondes', 'ylatdes'],inplace=True)
    
    test['ori_in_sector'] = test.set_geometry(col='geom_ori',crs=4326).within(sector_polygon)
    test['des_out_sector'] = ~test.set_geometry(col='geom_des',crs=4326).within(sector_polygon)
    test['buffer_geom'] = gpd.GeoSeries(
        test.set_geometry(col='geom_logis', crs=4326).to_crs(3857).geometry.buffer(50),
        crs=3857
    ).to_crs(4326)
    test['is_ori_at_residence'] = test.set_geometry(col='geom_ori',crs=4326).within(test.set_geometry(col='buffer_geom',crs=4326))
    test['is_outgoing_trip'] = test['ori_in_sector'] & test['des_out_sector'] & ~test['is_ori_at_residence']
    outgoing_trips = test.loc[test['is_outgoing_trip']]
    number_of_outgoing_trip = math.ceil(outgoing_trips['facdep'].agg('sum'))
    return number_of_outgoing_trip

def calculate_internal_trips_transfer_res_to_pub(car_trips_in_hour:gpd.GeoDataFrame,sector_polygon:Polygon):
    test= car_trips_in_hour.copy()
    project = pyproj.Transformer.from_crs("EPSG:4326", "EPSG:3857", always_xy=True).transform
    sector_polygon_3857 = transform(project, sector_polygon)
    test.drop(columns=['nolog', 'tlog', 'nbper', 'nbveh', 'xlonlog', 'ylatlog', 'sdrlog',
       'smlog', 'srlog', 'gslog', 'facmen',  'tper', 'sexe',
       'age', 'grpage', 'percond', 'occper', 'xlonocc', 'ylatocc', 'mobil',
       'facpermc',  'nodep', 'hredep',
       'hredepimp',  'hrearv', 'motif', 'motif_gr', 'mode2',
       'mode3', 'mode4', 'stat', 'coutstat', 'termstat', 'lieuori', 'xlonori',
       'ylatori', 'smori', 'xlondes', 'ylatdes'],inplace=True)
    
    test['ori_in_sector'] = test.set_geometry(col='geom_ori',crs=4326).within(sector_polygon)
    test['des_in_sector'] = test.set_geometry(col='geom_des',crs=4326).within(sector_polygon)
    test['buffer_geom'] = gpd.GeoSeries(
        test.set_geometry(col='geom_logis', crs=4326).to_crs(3857).geometry.buffer(50),
        crs=3857
    ).to_crs(4326)
    test['trip_from_home'] = test.set_geometry(col='geom_ori',crs=4326).within(test.set_geometry(col='buffer_geom',crs=4326))
    test['move_from_residence_out'] = test['ori_in_sector'] & test['des_in_sector'] & test ['trip_from_home']
    outgoing_trips = test.loc[test['move_from_residence_out']]
    internal_trips_out_of_residence = math.ceil(outgoing_trips['facdep'].agg('sum'))
    return internal_trips_out_of_residence

def calculate_internal_trips_transfer_pub_to_res(car_trips_in_hour:gpd.GeoDataFrame,sector_polygon:Polygon):
    test= car_trips_in_hour.copy().to_crs(crs=3857)
    project = pyproj.Transformer.from_crs("EPSG:4326", "EPSG:3857", always_xy=True).transform
    sector_polygon_3857 = transform(project, sector_polygon)
    test.drop(columns=['nolog', 'tlog', 'nbper', 'nbveh', 'xlonlog', 'ylatlog', 'sdrlog',
       'smlog', 'srlog', 'gslog', 'facmen', 'tper', 'sexe',
       'age', 'grpage', 'percond', 'occper', 'xlonocc', 'ylatocc', 'mobil',
       'facpermc', 'nodep', 'hredep', 'hredepimp', 'hrearv', 'motif_gr',
       'mode2', 'mode3', 'mode4', 'stat', 'coutstat', 'termstat', 'lieuori',
       'xlonori', 'ylatori', 'smori', 'xlondes', 'ylatdes'], inplace=True)
    
    test['ori_in_sector'] = test.set_geometry(col='geom_ori',crs=4326).within(sector_polygon)
    test['des_in_sector'] = test.set_geometry(col='geom_des',crs=4326).within(sector_polygon)
    test['buffer_geom'] = gpd.GeoSeries(
        test.set_geometry(col='geom_logis', crs=4326).to_crs(3857).geometry.buffer(50),
        crs=3857
    ).to_crs(4326)  
    test['trip_to_home'] = (test.set_geometry(col='geom_des',crs=4326).within(test.set_geometry(col='buffer_geom',crs=4326))) | (test['motif']==12)
    test['move_from_residence_out'] = test['ori_in_sector'] & test['des_in_sector'] & test['trip_to_home'] 
    outgoing_trips = test.loc[test['move_from_residence_out']]
    internal_trips_to_residence = math.ceil(outgoing_trips['facdep'].agg('sum'))
    return internal_trips_to_residence

def calculate_incoming_trips(car_trips_in_hour:gpd.GeoDataFrame,sector_polygon:Polygon):
    test= car_trips_in_hour.copy()
    test.drop(columns=['nolog', 'tlog', 'nbper', 'nbveh', 'xlonlog', 'ylatlog', 'sdrlog',
       'smlog', 'srlog', 'gslog', 'facmen',  'tper', 'sexe',
       'age', 'grpage', 'percond', 'occper', 'xlonocc', 'ylatocc', 'mobil',
       'facpermc',  'nodep', 'hredep',
       'hredepimp',  'hrearv', 'motif', 'motif_gr', 'mode2',
       'mode3', 'mode4', 'stat', 'coutstat', 'termstat', 'lieuori', 'xlonori',
       'ylatori', 'smori', 'xlondes', 'ylatdes'],inplace=True)
    
    test['ori_out_sector'] = ~test.set_geometry(col='geom_ori',crs=4326).within(sector_polygon)
    test['des_in_sector'] = test.set_geometry(col='geom_des',crs=4326).within(sector_polygon)
    test['is_incoming_trip'] = test['ori_out_sector'] & test['des_in_sector']

    incoming_trips = test.loc[test['is_incoming_trip']]
    number_of_incoming_trip = math.ceil(incoming_trips['facdep'].agg('sum'))

    return number_of_incoming_trip

def calculate_incoming_trips_to_residence(car_trips_in_hour:gpd.GeoDataFrame,sector_polygon:Polygon):
    test= car_trips_in_hour.copy()
    project = pyproj.Transformer.from_crs("EPSG:4326", "EPSG:3857", always_xy=True).transform
    sector_polygon_3857 = transform(project, sector_polygon)
    test.drop(columns=['nolog', 'tlog', 'nbper', 'nbveh', 'xlonlog', 'ylatlog', 'sdrlog',
       'smlog', 'srlog', 'gslog', 'facmen',  'tper', 'sexe',
       'age', 'grpage', 'percond', 'occper', 'xlonocc', 'ylatocc', 'mobil',
       'facpermc',  'nodep', 'hredep',
       'hredepimp',  'hrearv',  'motif_gr', 'mode2',
       'mode3', 'mode4', 'stat', 'coutstat', 'termstat', 'lieuori', 'xlonori',
       'ylatori', 'smori', 'xlondes', 'ylatdes'],inplace=True)
    
    
    test['ori_out_sector'] = ~test.set_geometry(col='geom_ori',crs=4326).within(sector_polygon)
    test['des_in_sector'] = test.set_geometry(col='geom_des',crs=4326).within(sector_polygon)
    test['buffer_geom'] = gpd.GeoSeries(
        test.set_geometry(col='geom_logis', crs=4326).to_crs(3857).geometry.buffer(50),
        crs=3857
    ).to_crs(4326)
    test['des_is_residence'] = (test.set_geometry(col='geom_des',crs=4326).within(test.set_geometry(col='buffer_geom',crs=4326)))| (test['motif']==12)
    test['motif_ret_hom'] = test['motif']==12
    test['is_incoming_trip'] = test['ori_out_sector'] & test['des_in_sector'] & test['des_is_residence']

    incoming_trips = test.loc[test['is_incoming_trip']]
    number_of_incoming_trip = math.ceil(incoming_trips['facdep'].agg('sum'))

    return number_of_incoming_trip

def calculate_incoming_trips_to_public(car_trips_in_hour:gpd.GeoDataFrame,sector_polygon:Polygon):
    test= car_trips_in_hour.copy()
    test.drop(columns=['nolog', 'tlog', 'nbper', 'nbveh', 'xlonlog', 'ylatlog', 'sdrlog',
       'smlog', 'srlog', 'gslog', 'facmen',  'tper', 'sexe',
       'age', 'grpage', 'percond', 'occper', 'xlonocc', 'ylatocc', 'mobil',
       'facpermc',  'nodep', 'hredep',
       'hredepimp',  'hrearv',  'motif_gr', 'mode2',
       'mode3', 'mode4', 'stat', 'coutstat', 'termstat', 'lieuori', 'xlonori',
       'ylatori', 'smori', 'xlondes', 'ylatdes'],inplace=True)
    
    
    test['ori_out_sector'] = ~test.set_geometry(col='geom_ori',crs=4326).within(sector_polygon)
    test['des_in_sector'] = test.set_geometry(col='geom_des',crs=4326).within(sector_polygon)
    test['buffer_geom'] = gpd.GeoSeries(
        test.set_geometry(col='geom_logis', crs=4326).to_crs(3857).geometry.buffer(50),
        crs=3857
    ).to_crs(4326)
    test['des_is_residence'] = test.set_geometry(col='geom_des',crs=4326).within(test.set_geometry(col='buffer_geom',crs=4326))
    test['motif_ret_hom'] = test['motif']==12
    test['is_incoming_trip'] = test['ori_out_sector'] & test['des_in_sector'] & ~test['des_is_residence']

    incoming_trips = test.loc[test['is_incoming_trip']]
    number_of_incoming_trip = math.ceil(incoming_trips['facdep'].agg('sum'))
    
    return number_of_incoming_trip
