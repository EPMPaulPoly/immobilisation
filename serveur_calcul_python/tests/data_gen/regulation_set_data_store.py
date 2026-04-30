import serveur_calcul_python.tests.data_gen.regulation_data_store as RDS
import serveur_calcul_python.tests.data_gen.land_use_table_data_store as LUTDS
import classes.parking_reg_sets as PRS
import pandas as pd
import config.config_db as cf_db

def generate_parking_regulation_sets():
    all_regs = RDS.generate_all_relevant_regs()
    first_prs_regs = all_regs.get_reg_by_id([1,3,4,5])
    prs_1 = PRS.ParkingRegulationSet(
        first_prs_regs.reg_head,
        first_prs_regs.reg_def,
        1990,
        1995,
        'Premier_ensemble_reglement',
        pd.DataFrame(data={
            cf_db.db_column_land_use_id:    [1,2,3,4,5,6,7,8,9],
            cf_db.db_column_parking_regs_id:[4,5,5,3,1,1,1,1,1]
        }),
        1,
        first_prs_regs.units_table,
        LUTDS.get_land_use_table()
    )

    second_prs_regs = all_regs.get_reg_by_id([1,3,4,6])
    prs_2 = PRS.ParkingRegulationSet(
        second_prs_regs.reg_head,
        second_prs_regs.reg_def,
        1990,
        1995,
        'Deuxième_ensemble_reglement',
        pd.DataFrame(data={
            cf_db.db_column_land_use_id:    [1,2,3,4,5,6,7,8,9],
            cf_db.db_column_parking_regs_id:[4,6,6,3,1,1,1,1,1]
        }),
        2,
        second_prs_regs.units_table,
        LUTDS.get_land_use_table()
    )
    third_prs_regs = all_regs.get_reg_by_id([1,2,3,4,5])
    prs_3 = PRS.ParkingRegulationSet(
        third_prs_regs.reg_head,
        third_prs_regs.reg_def,
        1995,
        2000,
        'Deuxième_ensemble_reglement',
        pd.DataFrame(data={
            cf_db.db_column_land_use_id:    [1,2,3,4,5,6,7,8,9],
            cf_db.db_column_parking_regs_id:[4,5,5,3,1,2,2,2,2]
        }),
        3,
        third_prs_regs.units_table,
        LUTDS.get_land_use_table()
    )
    prs_4 = PRS.ParkingRegulationSet(
        first_prs_regs.reg_head,
        first_prs_regs.reg_def,
        1995,
        2000,
        'Deuxième_ensemble_reglement',
        pd.DataFrame(data={
            cf_db.db_column_land_use_id:[1,2,3,4,5,6,7,8,9],
            cf_db.db_column_parking_regs_id:[4,6,6,3,1,2,2,2,2]
        }),
        4,
        first_prs_regs.units_table,
        LUTDS.get_land_use_table()
    )
    return prs_1,prs_2,prs_3,prs_4