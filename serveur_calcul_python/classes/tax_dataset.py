import pandas as pd
import geopandas as gpd
import numpy as np
from shapely import wkt
import matplotlib.pyplot as plt
from sqlalchemy import create_engine,text
import sqlalchemy
from config import config_db
from typing import Optional, Union, Self
from folium import Map

aggregate_def_dict:dict = {'rl0308a':'sum','rl0311a':'sum','rl0312a':'sum','rl0313a':'sum','rl0307a':'max'}

class TaxDataset():
    """# TaxDataset: \n
    contient le rôle foncier, le cadastre et la table associant les deux avec une table. Des propriétés agrégées sont aussi fournies
    ## Attributs:
        - tax_table: role foncier
        - lot_table: cadastrer
        - lot_association: table d'association cadastre rôle
        - aggregate_data: données du rôle agrégées par lot
    """
    def __init__(self,data_table:gpd.GeoDataFrame,lot_association:pd.DataFrame,lot_data:gpd.GeoDataFrame):
        self.tax_table = data_table
        self.lot_association = lot_association
        self.lot_table = lot_data
        self.aggregate_data = pd.DataFrame()
        constr_year_int = self.tax_table[config_db.db_column_tax_constr_year].fillna(0).astype('int32')
        self.tax_table[config_db.db_column_tax_constr_year] = constr_year_int
        land_use_int = self.tax_table[config_db.db_column_tax_land_use].astype('int32')
        self.tax_table[config_db.db_column_tax_land_use] = land_use_int
        self.aggregate_data_create(aggregate_def_dict)
    
    def aggregate_data_create(self, aggregate_dict:dict)->None:
        '''# aggregate_data_create
            Utilisé pour créé des données agrégées par lot pour chaque 
            ## Inputs
                - aggregate_dict: dictionnaire sous format colonne:fonction qui donne les colonnes à agréger et selon quelle fonction
            ## Sortie
                - Mise à jour de la table aggregate_data
                '''
        tax_table_ammended = self.tax_table.merge(self.lot_association,on=config_db.db_column_tax_id,how='left')
        columns = list(aggregate_dict)
        columns.append(config_db.db_column_lot_id)
        columns.reverse()
        aggregate_table_base = tax_table_ammended[columns]
        aggregate_table_final = aggregate_table_base.groupby(by=config_db.db_column_lot_id).aggregate(aggregate_dict)
        self.aggregate_data = aggregate_table_final

    def plot(self,ax:plt.axis=None,arguments=None):
        ''' # plot\n 
        Permet de créer un graphe très simple de du cadastre et du rôle foncier pour pouvoir faire de la visualisation
        ## Inputs
            - Aucun
        ## Outputs
            - ax L un ax matplotlib'''
        if ax:
            ax = self.lot_table.plot(ax=ax)
            self.tax_table.plot(ax=ax,color="r")
        else:
            ax=self.lot_table.plot()
            self.tax_table.plot(ax=ax,color="r")
        return ax
    
    def explore(self,m:Map=None,arguments=None):
        '''# explore\n
            utilise leaflet pour envoyer les données vers un fichier html
            ## Inputs
                - file: nom du fichier
        '''
        if m is None:
            m1 = self.lot_table.explore()
        else:
            m1 = self.lot_table.explore(m=m)
        tax_table = self.tax_table.drop(columns="dat_cond_mrche")
        tax_table.explore(m=m1,color='red')
        return m1

    def year_filter(self,start_year=None,end_year=None):
        '''# year_filter
        Returns a tax dataset within a year set
        ## Inputs
            - start_year: start year of filter
            - end_year : end year of filter
        ## Outputs
            - TaxDataSet'''
        if start_year is None and end_year is None:
            raise ValueError
        elif start_year is None:
            new_tax_table:gpd.GeoDataFrame = self.tax_table.loc[((self.tax_table[config_db.db_column_tax_constr_year]<= end_year))]
        elif end_year is None:
            new_tax_table:gpd.GeoDataFrame = self.tax_table.loc[((self.tax_table[config_db.db_column_tax_constr_year]>= start_year))]
        else:
            new_tax_table:gpd.GeoDataFrame = self.tax_table.loc[((self.tax_table[config_db.db_column_tax_constr_year]>= start_year) & (self.tax_table[config_db.db_column_tax_constr_year]<= end_year))].copy()
        tax_ids = new_tax_table[config_db.db_column_tax_id].unique().tolist()
        new_association_table:pd.DataFrame = self.lot_association.loc[self.lot_association[config_db.db_column_tax_id].isin(tax_ids)].copy()
        lot_ids = new_association_table[config_db.db_column_lot_id].unique().tolist()
        new_lot_table:gpd.GeoDataFrame = self.lot_table.loc[self.lot_table[config_db.db_column_lot_id].isin(lot_ids)].copy()
        new_tax_data = TaxDataset(new_tax_table,new_association_table,new_lot_table)
        return new_tax_data

    def territory_filter(self,territory:gpd.GeoDataFrame):
        new_tax_table = self.tax_table.clip(territory).copy()
        tax_ids = new_tax_table[config_db.db_column_tax_id].unique().tolist()
        new_association_table = self.lot_association.loc[self.lot_association[config_db.db_column_tax_id].isin(tax_ids)].copy()
        lot_ids = new_association_table[config_db.db_column_lot_id].unique().tolist()
        new_lot_table = self.lot_table.loc[self.lot_table[config_db.db_column_lot_id].isin(lot_ids)].copy()
        tax_data_to_out = TaxDataset(new_tax_table,new_association_table,new_lot_table)
        return tax_data_to_out

    def __repr__(self):
        '''# __repr__ \n
         donne la représentation de l'ensemble de données. Il faudra faire un ménage parce que la jointure va prendre trop longtemps. Ce n'est pas particulièrement brillant en ce moment'''
        repr = f'Tax Dataset: N accounts = {self.tax_table[config_db.db_column_tax_id].count()} - N lots = {self.lot_table[config_db.db_column_lot_id].count()}'
        return repr

    def select_by_land_uses(self,cubf:Union[int,list[int]])->Self:
        '''# select_by_land_use
            Permet de tirer un sous ensemble de données taxe foncière basé sur les identifiants du CUBF. Retourne un ensemble de données de taxe'''
        new_tax_table:pd.DataFrame = self.tax_table.loc[self.tax_table[config_db.db_column_tax_land_use].isin(cubf)].copy()
        tax_ids_to_pull = new_tax_table[config_db.db_column_tax_id].unique().tolist()
        new_association_table = self.lot_association.loc[self.lot_association[config_db.db_column_tax_id].isin(tax_ids_to_pull)].copy()
        lot_ids_to_pull = new_association_table[config_db.db_column_lot_id].unique().tolist()
        new_lot_table = self.lot_table.loc[self.lot_table[config_db.db_column_lot_id].isin(lot_ids_to_pull)].copy()
        new_tax_data_set = TaxDataset(new_tax_table,new_association_table,new_lot_table)
        return new_tax_data_set
    def select_by_land_use_range(self,min:int,max:int)->Self:
        '''# select_by_land_use
            Permet de tirer un sous ensemble de données taxe foncière basé sur les identifiants du CUBF. Retourne un ensemble de données de taxe.
            Si le lot a plusieurs entrées foncières, il retourne toutes les entrées foncières incluant celle qui ne sont pas dans le range
        '''
        relevant_tax_ids:list = self.tax_table.loc[self.tax_table[config_db.db_column_tax_land_use]<=max & self.tax_table[config_db.db_column_tax_land_use]>=min,config_db.db_column_tax_id].unique().tolist()
        relevant_lots = self.lot_association.loc[self.lot_association[config_db.db_column_tax_id].isin(relevant_tax_ids),config_db.db_column_lot_id].unique().tolist()
        tax_ids_to_pull = self.lot_association.loc[self.lot_association[config_db.db_column_lot_id].isin(relevant_lots),config_db.db_column_tax_id].unique().tolist()
        new_association_table = self.lot_association.loc[self.lot_association[config_db.db_column_lot_id].isin(relevant_lots)].copy()
        new_tax_table = self.tax_table.loc[self.tax_table[config_db.db_column_tax_id].isin(tax_ids_to_pull)].copy()
        new_lot_table = self.lot_table.loc[self.lot_table[config_db.db_column_lot_id].isin(relevant_lots)].copy()
        new_tax_data_set = TaxDataset(new_tax_table,new_association_table,new_lot_table)
        return new_tax_data_set
    def get_land_uses_in_set(self)->list[int]:
        land_uses_to_return = self.tax_table[config_db.db_column_tax_land_use].unique().tolist()
        return land_uses_to_return
    
    def filter_by_id(self:Self,list:list[str])->list[int]:
        relevant_lots = self.lot_table.loc[self.lot_table[config_db.db_column_lot_id].isin(list)].copy()
        relevant_association = self.lot_association.loc[self.lot_association[config_db.db_column_lot_id].isin(list)].copy()
        relevant_provincial_tax_list = relevant_association[config_db.db_column_tax_id].unique().tolist()
        relevant_tax = self.tax_table.loc[self.tax_table[config_db.db_column_tax_id].isin(relevant_provincial_tax_list)].copy()
        new_tax_dataset = TaxDataset(relevant_tax,relevant_association,relevant_lots)
        return new_tax_dataset

        
if __name__=="__main__":
    #datatax=np.array([["23027258894478510000000",125,0,"POINT(0.5 0.5)"],["23027258968770010000000",181,1,"POINT(1.5 1.5)"]])
    #tax_table = gpd.GeoDataFrame(data=datatax,columns=["id_provinc","rl_0308a","rl0311a","geometry"])
    #tax_table["geometry"] = tax_table["geometry"].apply(wkt.loads)
    #tax_table = tax_table.set_geometry("geometry")
    #tax_table =tax_table.set_crs(4326)
    #datalot = np.array([["1 000 000","dude 1","POLYGON((0 0, 0 1, 1 1, 1 0, 0 0))"],
    #                    ["1 000 001","dude 2","POLYGON((1 1, 1 2, 2 2, 2 1, 1 1))"]])
    #lot_table = gpd.GeoDataFrame(data=datalot, columns = ["g_no_lot","dude","geometry"])
    #lot_table["geometry"] = lot_table["geometry"].apply(wkt.loads)
    #lot_table = lot_table.set_geometry("geometry")
    #lot_table = lot_table.set_crs(4326)
    #assocation_table = pd.DataFrame(data=np.array([["23027258894478510000000","1 000 000"],
     #                                ["23027258968770010000000","1 000 001"]]),columns=["id_provinc","g_no_lot"])
    #tax_dataset = TaxDataset(tax_table,assocation_table,lot_table)
    #tax_dataset.plot()
    #plt.show()
    #print(tax_dataset)
    #tax_data = from_postgis()
    #print(tax_data)
    #tax_data.plot()
    #plt.show()
    tax_dataset = tax_database_points_from_date_territory([64,65],1995,1996)
    tax_dataset.plot()
    plt.show()