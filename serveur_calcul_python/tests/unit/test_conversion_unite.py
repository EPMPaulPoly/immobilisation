import pandas as pd
import geopandas as gpd
import sys
from pathlib import Path
#sys.path.append(str(Path(__file__).resolve().parents[2]))

import classes.parking_inventory_inputs as PCI
from serveur_calcul_python.tests.data_gen.tax_data_store import generate_tax_dataset
from serveur_calcul_python.tests.data_gen.regulation_set_data_store import generate_parking_regulation_sets
from serveur_calcul_python.tests.data_gen.calcs_input_data_store import generate_prs_1_inputs,generate_prs_2_inputs,generate_prs_3_inputs

def test_conversion_unite():
    tax_dataset_prs_1  = generate_tax_dataset(1)
    tax_dataset_prs_2 = generate_tax_dataset(2)
    tax_dataset_prs_3 = generate_tax_dataset(3)
    prs_1,prs_2,prs_3,prs_4 = generate_parking_regulation_sets()
    inputs_data_prs_1 = PCI.generate_input_from_PRS_TD(prs_1,tax_dataset_prs_1)
    inputs_data_prs_2 = PCI.generate_input_from_PRS_TD (prs_2,tax_dataset_prs_2)
    inputs_data_prs_3 = PCI.generate_input_from_PRS_TD(prs_3,tax_dataset_prs_3)
    inputs_theoretical_1 = generate_prs_1_inputs()
    inputs_theoretical_2 = generate_prs_2_inputs()
    inputs_theoretical_3 = generate_prs_3_inputs()
    pd.testing.assert_frame_equal(inputs_data_prs_1,inputs_theoretical_1)
    pd.testing.assert_frame_equal(inputs_data_prs_2,inputs_theoretical_2)
    pd.testing.assert_frame_equal(inputs_data_prs_3,inputs_theoretical_3)
    #m1 = tax_dataset_prs_1.explore()
    #m1.save('check.html')
    


if __name__== "__main__":
    test_conversion_unite()