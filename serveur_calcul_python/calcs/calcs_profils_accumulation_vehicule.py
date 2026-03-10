import sqlalchemy
import geopandas as gpd
import pandas as pd
from shapely.geometry import Point,Polygon,LineString
import pyproj
from shapely.ops import transform
import math

import classes.vehicle_accumulation_profile as VAP
from db_interface import db_interface_vap as db_vap

def calculate_VAP_from_database_data(quartier:int,con:sqlalchemy.Engine)->VAP.VehicleAccumulationProfile:
    vap_to_calculate:VAP.VehicleAccumulationProfile = db_vap.get_data_for_sector_from_database(quartier,con)
    outputVAP = generate_vehicle_accumulation_profile(vap_to_calculate)
    return outputVAP


def generate_vehicle_accumulation_profile(inputVAP:VAP.VehicleAccumulationProfile):
    sector_geometry_only = inputVAP.sector_geometry.geometry.iloc[0]
    heures_pertinentes= list(range(0,29))
    output = []
    output_cars_in_residential = []
    output_cars_not_in_residential = []
    output_people = []
    output_licenses = []
    inter_car_incoming_tot = []
    inter_car_outgoing_tot = []
    inter_car_int_pub_to_res = []
    inter_car_int_res_to_pub = []
    inter_car_out_from_res = []
    inter_car_out_from_pub = []
    inter_car_in_to_res = []
    inter_car_in_to_pub = []
    inter_people_incoming_tot = []
    inter_people_outgoing_tot = []
    inter_licenses_incoming_tot = []
    inter_licenses_outgoing_tot = []
    for heure in heures_pertinentes:
        # append default values to start
        if heure==0:
            output.append(math.ceil(inputVAP.calculate_resident_cars()))
            output_cars_in_residential.append(math.ceil(inputVAP.calculate_resident_cars()))
            output_cars_not_in_residential.append(0)
            output_people.append(math.ceil(inputVAP.get_population()))
            output_licenses.append(math.ceil(inputVAP.get_license_holder_count()))
            inter_car_incoming_tot.append(0)
            inter_car_outgoing_tot.append(0)
            inter_car_int_pub_to_res.append(0)
            inter_car_int_res_to_pub.append(0)
            inter_car_out_from_res.append(0)
            inter_car_out_from_pub.append(0)
            inter_car_in_to_res.append(0)
            inter_car_in_to_pub.append(0)
            inter_people_incoming_tot.append(0)
            inter_people_outgoing_tot.append(0)
            inter_licenses_incoming_tot.append(0)
            inter_licenses_outgoing_tot.append(0)
        else:
            previous_cars = output[-1]
            previous_cars_in_residence = output_cars_in_residential[-1]
            previous_cars_not_in_residence = output_cars_not_in_residential[-1]
            previous_people = output_people[-1]
            previous_licenseholders = output_licenses[-1]
            relevant_car_trips = inputVAP.get_car_trips_in_hour(heure)
            # PAV de base
            n_outgoing_trips = calculate_outgoing_trips(relevant_car_trips,sector_geometry_only)
            inter_car_outgoing_tot.append(n_outgoing_trips)
            n_incoming_trips = calculate_incoming_trips(relevant_car_trips,sector_geometry_only)
            inter_car_incoming_tot.append(n_incoming_trips)
            # déplacements AC internes différenciés par type de stationnement présumé
            n_res_to_pub_int = calculate_internal_trips_transfer_res_to_pub(relevant_car_trips,sector_geometry_only)
            inter_car_int_res_to_pub.append(n_res_to_pub_int)
            n_pub_to_res_int = calculate_internal_trips_transfer_pub_to_res(relevant_car_trips,sector_geometry_only)
            inter_car_int_pub_to_res.append(n_pub_to_res_int)
            # déplacements AC sortants différenciés par type de stationnemetn présumé
            n_outgoing_from_res = calculate_outgoing_trips_from_residence(relevant_car_trips,sector_geometry_only)
            inter_car_out_from_res.append(n_outgoing_from_res)
            n_outgoing_from_pub = calculate_outgoing_trips_from_public(relevant_car_trips,sector_geometry_only)
            inter_car_out_from_pub.append(n_outgoing_from_pub)
            # déplacements AC entrants différenciés par type de stationnement présumé
            n_incoming_to_pub = calculate_incoming_trips_to_public(relevant_car_trips,sector_geometry_only)
            inter_car_in_to_pub.append(n_incoming_to_pub)
            n_incoming_to_res = calculate_incoming_trips_to_residence(relevant_car_trips,sector_geometry_only)
            inter_car_in_to_res.append(n_incoming_to_res)
            # Tous déplacements
            all_relevant_trips = inputVAP.get_all_trips_in_hour(heure)
            n_all_outgoing_trips = calculate_outgoing_trips(all_relevant_trips,sector_geometry_only)
            inter_people_outgoing_tot.append(n_all_outgoing_trips)
            n_all_incoming_trips = calculate_incoming_trips(all_relevant_trips,sector_geometry_only)
            inter_people_incoming_tot.append(n_all_incoming_trips)
            # Déplacements des détenteurs de permis
            all_licensholder_trips = inputVAP.get_all_licenseholder_trips_in_hour(heure)
            n_licenseholder_outgoing_trips = calculate_outgoing_trips(all_licensholder_trips,sector_geometry_only)
            inter_licenses_outgoing_tot.append(n_licenseholder_outgoing_trips)
            n_licenseholder_incoming_trips = calculate_incoming_trips(all_licensholder_trips,sector_geometry_only)
            inter_licenses_incoming_tot.append(n_licenseholder_incoming_trips)
            ## Calcul des differ Profils d'accumulation
            # PAV de base
            current_cars =              math.ceil(previous_cars-n_outgoing_trips+n_incoming_trips)
            # PAPERS
            current_people =            math.ceil(previous_people + n_all_incoming_trips - n_all_outgoing_trips)
            # PAPERM
            current_licenseholder =     math.ceil(previous_licenseholders + n_licenseholder_incoming_trips - n_licenseholder_outgoing_trips)
            # PAVs différenciés par type de stationnement
            current_cars_residential = math.ceil(previous_cars_in_residence      - n_res_to_pub_int + n_pub_to_res_int - n_outgoing_from_res + n_incoming_to_res)
            current_cars_public =       math.ceil(previous_cars_not_in_residence + n_res_to_pub_int - n_pub_to_res_int - n_outgoing_from_pub + n_incoming_to_pub)
            
            
            output_cars_in_residential.append(current_cars_residential)
            output_cars_not_in_residential.append(current_cars_public)
            output.append(current_cars)
            output_people.append(current_people)
            output_licenses.append(current_licenseholder)
    final_out_dict = {'heure': heures_pertinentes,
                        'voitures':                 output,
                        'personnes':                output_people,
                        'permis':                   output_licenses,
                        'voitures_res':             output_cars_in_residential,
                        'voitures_pub':             output_cars_not_in_residential,
                        'voit_entrantes_tot':       inter_car_incoming_tot,
                        'voit_entrantes_pub':       inter_car_in_to_pub,
                        'voit_entrantes_res':       inter_car_in_to_res,
                        'voit_sortantes_tot':       inter_car_outgoing_tot,
                        'voit_sortantes_pub':       inter_car_out_from_pub,
                        'voit_sortantes_res':       inter_car_out_from_res,
                        'voit_transfer_res_a_pub':  inter_car_int_res_to_pub,
                        'voit_transfer_pub_a_res':  inter_car_int_pub_to_res,
                        'pers_entrantes_tot':       inter_people_incoming_tot,
                        'pers_sortantes_tot':       inter_people_outgoing_tot,
                        'perm_entrants_tot':        inter_licenses_incoming_tot,
                        'perm_sortants_tot':        inter_licenses_outgoing_tot}
    final_out = pd.DataFrame(final_out_dict)
    final_out['id_quartier'] = inputVAP.sector_geometry['id_quartier'].values[0]
    inputVAP.final_profile=final_out
    output_vap = VAP.VehicleAccumulationProfile(od_data=inputVAP.geo_od,sector_geom=inputVAP.sector_geometry)
    output_vap.final_profile = final_out
    return output_vap


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

