import pytest
import pandas as pd
import geopandas as gpd

@pytest.fixture(scope="session", autouse=True)
def print_versions():
    print("\n=== ENVIRONMENT INFO ===")
    print("pandas:", pd.__version__)
    print("geopandas:", gpd.__version__)
    print("========================\n")