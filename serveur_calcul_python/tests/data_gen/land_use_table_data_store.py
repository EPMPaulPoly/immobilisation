import pandas as pd
from config import config_db as cf_db

def get_land_use_table():
    cubf  = [
            1,
            1000,
            2,
            2000,
            3,
            3000,
            4,
            4000,
            5,
            5000,
            6,
            6000,
            7,
            7000,
            8,
            8000,
            9,
            9000
        ]
    desc = [
            'RÉSIDENTIEL',
            'résidentiel',
            'INDUSTRIE',
            'Industrie 1',
            'INDUSTRIE',
            'Industrie 2',
            'TRANSPORT',
            'Transport',
            'COMMERCIAL',
            'Commercial',
            'SERVICES',
            'Services',
            'LOISIR',
            'Loisir',
            'RESS NAT',
            'Ressources Naturelles',
            'INOCCUPÉ',
            'Inoccupé']
    return pd.DataFrame({
        cf_db.db_column_land_use_id:cubf,
        'description':desc
    })