import geopandas as gpd
import pandas as pd
import os
import dotenv


path_ad = r"~/Documents/SIG/ad_recensement_2016_vdq_4326.geojson"
path_pop_data = r'~/Documents/SIG/population recensement canadien 2016.xlsx'
path_out = '~/Documents/SIG/output_2016.geojson'

ad = gpd.read_file(path_ad)
pop = pd.read_excel(path_pop_data)
pop = pop.rename(columns={
    'Chiffres de population et des logements / Population, 2016':'pop_2016',
    'Chiffres de population et des logements / Total des logements privés':'habitats_2016',
    'Chiffres de population et des logements / Logements privés occupés par des résidents habituels':'habitats_occup_2016',
    'Chiffres de population et des logements / Densité de la population au kilomètre carré':'dens_pop_par_km_2_2016',
    'Chiffres de population et des logements / Superficie des terres en kilomètres carrés':'superf_2016'})



ad['ADIDU'] = ad['ADIDU'].astype(str)
pop['GEO UID'] = pop['GEO UID'].astype(str)
fused_data = ad.merge(pop,how='left',left_on='ADIDU',right_on='GEO UID')
fused_data = fused_data.to_crs(epsg=4326)

fused_data.to_file(path_out,driver='geojson')