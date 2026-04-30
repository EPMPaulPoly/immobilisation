from classes import parking_inventory as PI
from tests.data_gen import reg_set_terr_data_store as RSTDS
from tests.data_gen import tax_data_store as TDS
from classes import reg_set_territory as RST
import pandas as pd
from config import config_db as cf_db

def test_affectation_TD_RST():
    rst_1,rst_2,rst_3 = RSTDS.generate_reg_set_terr()
    whole_tax_data_set = TDS.generate_tax_dataset()
    split_tax_data_sets = RST.split_td_by_rst(whole_tax_data_set,[rst_1,rst_2,rst_3])
    tds_1_theo = TDS.generate_tax_dataset(1)
    tds_2_theo = TDS.generate_tax_dataset(2)
    tds_3_theo = TDS.generate_tax_dataset(3)
    pd.testing.assert_frame_equal(split_tax_data_sets[0].tax_table.sort_values(by=cf_db.db_column_tax_id).reset_index(drop=True),tds_1_theo.tax_table.sort_values(by=cf_db.db_column_tax_id).reset_index(drop=True))
    pd.testing.assert_frame_equal(split_tax_data_sets[0].lot_table.sort_values(by=cf_db.db_column_lot_id).reset_index(drop=True),tds_1_theo.lot_table.sort_values(by=cf_db.db_column_lot_id).reset_index(drop=True))
    pd.testing.assert_frame_equal(split_tax_data_sets[0].lot_association.sort_values(by=cf_db.db_column_tax_id).reset_index(drop=True),tds_1_theo.lot_association.sort_values(by=cf_db.db_column_tax_id).reset_index(drop=True))
    pd.testing.assert_frame_equal(split_tax_data_sets[1].tax_table.sort_values(by=cf_db.db_column_tax_id).reset_index(drop=True),tds_2_theo.tax_table.sort_values(by=cf_db.db_column_tax_id).reset_index(drop=True))
    pd.testing.assert_frame_equal(split_tax_data_sets[1].lot_table.sort_values(by=cf_db.db_column_lot_id).reset_index(drop=True),tds_2_theo.lot_table.sort_values(by=cf_db.db_column_lot_id).reset_index(drop=True))
    pd.testing.assert_frame_equal(split_tax_data_sets[1].lot_association.sort_values(by=cf_db.db_column_tax_id).reset_index(drop=True),tds_2_theo.lot_association.sort_values(by=cf_db.db_column_tax_id).reset_index(drop=True))
    pd.testing.assert_frame_equal(split_tax_data_sets[2].tax_table.sort_values(by=cf_db.db_column_tax_id).reset_index(drop=True),tds_3_theo.tax_table.sort_values(by=cf_db.db_column_tax_id).reset_index(drop=True))
    pd.testing.assert_frame_equal(split_tax_data_sets[2].lot_table.sort_values(by=cf_db.db_column_lot_id).reset_index(drop=True),tds_3_theo.lot_table.sort_values(by=cf_db.db_column_lot_id).reset_index(drop=True))
    pd.testing.assert_frame_equal(split_tax_data_sets[2].lot_association.sort_values(by=cf_db.db_column_tax_id).reset_index(drop=True),tds_3_theo.lot_association.sort_values(by=cf_db.db_column_tax_id).reset_index(drop=True))
