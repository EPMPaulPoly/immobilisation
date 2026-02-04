

import geopandas as gpd
import pandas as pd
import os
import dotenv


path_ad = "~/Documents/SIG/ad_recensement_2021_vdq_4326.geojson"
path_pop_data = '~/Documents/SIG/population recensement canadien 2021.xlsx'
path_output = "~/Documents/SIG/recensement_2021.geojson"

ad = gpd.read_file(path_ad)
pop = pd.read_excel(path_pop_data)
pop = pop.drop(columns=['Province code','Province name','CD code','CD name','DA name'])
pop = pop.rename(columns={
    'Population and dwelling counts / Population, 2021':'pop_2021',
    'Population and dwelling counts / Population, 2016':'pop_2016',
    'Population and dwelling counts / Total private dwellings':'habitats_2021',
    'Population and dwelling counts / Private dwellings occupied by usual residents':'habitats_occup_2021',
    'Population and dwelling counts / Population density per square kilometre':'dens_pop_par_km_2',
    'Population and dwelling counts / Land area in square kilometres':'superf'})
ad['ADIDU'] = ad['ADIDU'].astype(str)
pop['GEO UID'] = pop['GEO UID'].astype(str)
fused_data = ad.merge(pop,how='left',left_on='ADIDU',right_on='GEO UID')
fused_data = fused_data.to_crs(epsg=4326)
fused_data.to_file("sortie_recensement2021.json", driver="GeoJSON")