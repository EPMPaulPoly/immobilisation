from open_tax_data import conversion_FGDB_GeoJSON

def main():
    MUNICIPALITE = str(23027)
    LOCALISATION_ROLE_FONCIER_FGDB = r"/home/paul-charbonneau/Documents/dev/ROLE2023_FGDB/Role_2023.gdb"
    outFolder= r"/home/paul-charbonneau/Documents/dev"
    demande_conversion_GDB = input("Voulez-vous convertir les données FGDB en GeoJSON?[O/N]")
    if demande_conversion_GDB == "O":
        conversion_FGDB_GeoJSON(LOCALISATION_ROLE_FONCIER_FGDB,MUNICIPALITE,outFolder)

if __name__ == "__main__":
    main()