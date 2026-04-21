import pandas as pd
import geopandas as gpd

import classes.parking_inventory_inputs as PCI
import classes.tax_dataset as TD
from shapely.geometry import Polygon,Point




def test_conversersion_unite():
    lot_1_lon=-71.5
    lot_1_lat=46.5
    lot_2_lon=-71.48
    lot_2_lat=46.48
    lot_3_lon=-71.49
    lot_3_lat=46.49
    points = []
    polygon_set = []
    for index, lon, lat in enumerate(zip([lot_1_lon, lot_2_lon, lot_3_lon], [lot_1_lat, lot_2_lat, lot_3_lat])):
        lon_point_list = [lot_1_lon-.05,lot_1_lon+.05,lot_1_lon+.05,lot_1_lon-.05,lot_1_lon-.05]
        lat_point_list = [lot_1_lat-.05,lot_1_lat-.05,lot_1_lat+.05,lot_1_lat+.05,lot_1_lat-.05]
        polygon_geom = Polygon(zip(lon_point_list, lat_point_list))
        polygon_set.append(polygon_geom)
        points.append(Point(lon, lat))

    
    lot_table = gpd.GeoDataFrame(
        data={
            'g_no_lot':['1','2','3'],
            'g_va_suprf':[100,200,300],
            'g_nb_coord':[-71.5,-71.48,-71.49],
            'g_nb_coo_1':[-46.5,-46.48,-46.49]
        },
        geometry=polygon_set,
        crs='EPSG:4326'
    )
    tax_table = gpd.GeoDataFrame(
        data={
            'id_provinc':['a','b','c'],
        },
        geometry=points,
        crs='EPSG:4326'
    )