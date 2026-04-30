import geopandas as gpd
import sqlalchemy
from shapely.geometry import Point,Polygon,LineString
from shapely import Geometry,wkb
from classes import vehicle_accumulation_profile as VAP

def get_data_for_sector_from_database(quartier:int,engine:sqlalchemy.Engine)->VAP.VehicleAccumulationProfile:
    if (quartier ==0):
        query = f'''WITH all_territories AS (
                    SELECT
                        id_quartier,
                        geometry
                    FROM
                        public.sec_analyse
                ),
                matching_nologs AS (
                    SELECT 
                        DISTINCT odd.nolog
                    FROM 
                        od_data AS odd,
                        all_territories
                    WHERE
                        ST_Intersects(odd.geom_logis, all_territories.geometry) OR 
                        ST_Intersects(odd.geom_ori, all_territories.geometry) OR 
                        ST_Intersects(odd.geom_des, all_territories.geometry)
                )
                SELECT 
                    odd.*
                FROM 
                    od_data AS odd
                JOIN 
                    matching_nologs USING (nolog);'''
        query_territory = '''
                SELECT
                0 as id_quartier,
                ST_Union(geometry) as geometry
                FROM
                public.sec_analyse
            '''
    else :
        query = f'''WITH quartier AS (
                    SELECT
                        id_quartier,
                        geometry
                    FROM
                        public.sec_analyse
                    WHERE
                        id_quartier = {quartier}
                ),
                matching_nologs AS (
                    SELECT 
                        DISTINCT odd.nolog
                    FROM 
                        od_data AS odd,
                        quartier
                    WHERE
                        ST_Intersects(odd.geom_logis, quartier.geometry) OR 
                        ST_Intersects(odd.geom_ori, quartier.geometry) OR 
                        ST_Intersects(odd.geom_des, quartier.geometry)
                )
                SELECT 
                    odd.*
                FROM 
                    od_data AS odd
                JOIN 
                    matching_nologs USING (nolog);'''
        query_territory = f'''SELECT
                        id_quartier,
                        geometry
                    FROM
                        public.sec_analyse
                    WHERE
                        id_quartier = {quartier}'''
    with engine.connect() as conn:
        data_od_survey = gpd.read_postgis(query,geom_col='geom_logis',con=conn)
        data_territory = gpd.read_postgis(query_territory,geom_col='geometry',con=conn)
    # Convert the other geometry columns from WKB (they are not automatically parsed)
    other_geom_cols = ['geom_ori', 'geom_des', 'trip_line']

    for col in other_geom_cols:
        # if data_od_survey[col].dtype == object:
            data_od_survey[col] = data_od_survey[col].apply(lambda x: wkb.loads(x, hex=True) if isinstance(x, (str, bytes)) else None)
    vap_to_return = VAP.VehicleAccumulationProfile(data_od_survey,data_territory)
    return vap_to_return
    
