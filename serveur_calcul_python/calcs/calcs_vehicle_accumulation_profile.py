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
from classes import vehicle_accumulation_profile as VAP
from calcs import calcs_survey_data as CSD
from db_interface import db_travel_survey_data as DBTSD
from classes import travel_survey_data as TSD

def calculate_VAP_from_database_data(quartier:int,con:sqlalchemy.Engine)->Self:
    travel_data:TSD.TravelSurveyData = DBTSD.get_data_for_sector_from_database(quartier,con)
    vap_out = generate_vehicle_accumulation_profile(travel_data)
    return vap_out


def generate_vehicle_accumulation_profile(travel_survey_data:TSD.TravelSurveyData):
    sector_geometry_only = travel_survey_data.sector_geometry.geometry.iloc[0]
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
            output.append(math.ceil(CSD.calculate_resident_cars(travel_survey_data)))
            output_cars_in_residential.append(math.ceil(CSD.calculate_resident_cars(travel_survey_data)))
            output_cars_not_in_residential.append(0)
            output_people.append(math.ceil(CSD.get_population(travel_survey_data)))
            output_licenses.append(math.ceil(CSD.get_license_holder_count(travel_survey_data)))
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
            relevant_car_trips = travel_survey_data.get_car_trips_in_hour(heure)
            # PAV de base
            n_outgoing_trips = CSD.calculate_outgoing_trips(relevant_car_trips,sector_geometry_only)
            inter_car_outgoing_tot.append(n_outgoing_trips)
            n_incoming_trips = CSD.calculate_incoming_trips(relevant_car_trips,sector_geometry_only)
            inter_car_incoming_tot.append(n_incoming_trips)
            # déplacements AC internes différenciés par type de stationnement présumé
            n_res_to_pub_int = CSD.calculate_internal_trips_transfer_res_to_pub(relevant_car_trips,sector_geometry_only)
            inter_car_int_res_to_pub.append(n_res_to_pub_int)
            n_pub_to_res_int = CSD.calculate_internal_trips_transfer_pub_to_res(relevant_car_trips,sector_geometry_only)
            inter_car_int_pub_to_res.append(n_pub_to_res_int)
            # déplacements AC sortants différenciés par type de stationnemetn présumé
            n_outgoing_from_res = CSD.calculate_outgoing_trips_from_residence(relevant_car_trips,sector_geometry_only)
            inter_car_out_from_res.append(n_outgoing_from_res)
            n_outgoing_from_pub = CSD.calculate_outgoing_trips_from_public(relevant_car_trips,sector_geometry_only)
            inter_car_out_from_pub.append(n_outgoing_from_pub)
            # déplacements AC entrants différenciés par type de stationnement présumé
            n_incoming_to_pub = CSD.calculate_incoming_trips_to_public(relevant_car_trips,sector_geometry_only)
            inter_car_in_to_pub.append(n_incoming_to_pub)
            n_incoming_to_res = CSD.calculate_incoming_trips_to_residence(relevant_car_trips,sector_geometry_only)
            inter_car_in_to_res.append(n_incoming_to_res)
            # Tous déplacements
            all_relevant_trips = travel_survey_data.get_all_trips_in_hour(heure)
            n_all_outgoing_trips = CSD.calculate_outgoing_trips(all_relevant_trips,sector_geometry_only)
            inter_people_outgoing_tot.append(n_all_outgoing_trips)
            n_all_incoming_trips = CSD.calculate_incoming_trips(all_relevant_trips,sector_geometry_only)
            inter_people_incoming_tot.append(n_all_incoming_trips)
            # Déplacements des détenteurs de permis
            all_licensholder_trips = travel_survey_data.get_all_licenseholder_trips_in_hour(heure)
            n_licenseholder_outgoing_trips = CSD.calculate_outgoing_trips(all_licensholder_trips,sector_geometry_only)
            inter_licenses_outgoing_tot.append(n_licenseholder_outgoing_trips)
            n_licenseholder_incoming_trips = CSD.calculate_incoming_trips(all_licensholder_trips,sector_geometry_only)
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
    final_out['id_quartier'] = travel_survey_data.sector_geometry['id_quartier'].values[0]
    return VAP.VehicleAccumulationProfile(final_out)