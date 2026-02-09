# Téléversement de données
---
[^Tables des matières](../../README.md)|
[<Installation](010-Installation.md)| 
[Démarrage du serveur>](012-Demarrage.md)
---

Deux solutions sont disponibles pour téléverser les données dans la base de données. La première consiste à téléverser le rôle et le cadastre dans un format de base de données vide par exemple pour un nouveau projet. La deuxième consiste à téléverser une base de données créée par un autre utilisateur. 

# Création d'un nouveau projet
La première étape est d'aller chercher le [format de base de données](../../db_template/format_bd_vide.sql) dans le dépôt github du projet. Vous pouvez utiliser ce format directement. La base de données étant créé sous windows une étape supplémentaire est nécessaire sous Ubuntu pour mettre en place le format.

## Versement sous Windows
### Versement du format et création de la base de données

Dans le cas de windows, le format fourni peut directement être utilisé. Il créera la base de données parking_regs_test qui contient le format et les différentes vue utilisées. Les étapes sont les suivantes:
1. Naviguez au dossier immobilisation/db_template dans l'explorateur de fichier
2. Faites un clic droit et cliquer sur ouvrir le terminal dans ce dossier
3. Entrez la commande suivante:
```
psql -f format_bd_vide.sql
```

## Versement sous Ubuntu

### Création de la base de données
Commencer par créer la base de données à l'aide de la commande de terminal suivante:
```
sudo -u postgres createdb --template=template0 --lc-collate='C.UTF-8' --lc-ctype='C.UTF-8' parking_regs
```
Vous pouvez valider le succès de la création à l'aide de la fonction suivante:
```
sudo -u postgres psql -l
```
qui devrait renvoyer le résultat suivant:

|Nom            | Propriétaire | Encodage | Fournisseur de locale | Collationnement | Type caract. | Locale ICU | Règles ICU : |    Droits d'accès                      |
|---------------|--------------|----------|-----------------------|-----------------|--------------|------------|--------------|----------------------------------------|
|parking_regs   | postgres     | UTF8     | libc                  | C.UTF-8         | C.UTF-8      |            |              |                                        |
|postgres       | postgres     | UTF8     | libc                  | fr_FR.UTF-8     | fr_FR.UTF-8  |            |              |                                        |
|template0      | postgres     | UTF8     | libc                  | fr_FR.UTF-8     | fr_FR.UTF-8  |            |              | =c/postgres + postgres=CTc/postgres    |
|template1      | postgres     | UTF8     | libc                  | fr_FR.UTF-8     | fr_FR.UTF-8  |            |              | =c/postgres + postgres=CTc/postgres    |

### Versement du format
On va maintenand verser le format de la base de données dans la bd de pour que les différents scripts et requêtes puissent fonctionner.

On commence par copier le format de base de données dans un dossier autre que le dépôt de programmation(ici dans mes documents) où 
```
cp ~/Documents/dev/immobilisation/db_template/format_bd_vide.sql ~/Documents
```

Il faut mainenant faire un légère modification au format de base de données pour prendre en compte le fait que le format a été créé sous Windows. Utilisez la commande suivant pour supprimer la section de création de base de données et enlever la commande de connection:
```
sed '/CREATE DATABASE/,+6d' ~/Documents/format_bd_vide.sql > ~/Documents/format_db_sans_creation.sql
```
On verse ensuite le format 
```
sudo -u postgres psql -d parking_regs < ~/Documents/format_db_sans_creation.sql
```

Vous pouvez valider le versement des données avec deux fonctions:
```
sudo -u postgres psql -d parking_regs -c "\dt"
```
qui donnera le résultat suivant:
 Schéma |               Nom                | Type  | Propriétaire 
-------|----------------------------------|-------|---------
public | assignation_strates              | table | postgres
public | association_cadastre_role        | table | postgres
public | association_er_reg_stat          | table | postgres
public | association_er_territoire        | table | postgres
public | association_strates              | table | postgres
public | cadastre                         | table | postgres
public | cartographie_secteurs            | table | postgres
public | census_population                | table | postgres
public | census_population_2016           | table | postgres
public | conditions_strates_a_echant      | table | postgres
public | cubf                             | table | postgres
public | donnees_brutes_ana_var           | table | postgres
public | donnees_foncieres_agregees       | table | postgres
public | ensembles_reglements_stat        | table | postgres
public | entete_reg_stationnement         | table | postgres
public | historique_geopol                | table | postgres
public | inputs_validation                | table | postgres
public | inv_reg_aggreg_cubf_n1           | table | postgres
public | inventaire_stationnement         | table | postgres
public | liste_operations                 | table | postgres
public | motorisation_par_quartier        | table | postgres
public | multiplicateur_facteurs_colonnes | table | postgres
public | od_data                          | table | postgres
public | parts_modales                    | table | postgres
public | population_par_quartier          | table | postgres
public | profile_accumulation_vehicule    | table | postgres
public | reg_stationnement_empile         | table | postgres
public | resultats_validation             | table | postgres
public | role_foncier                     | table | postgres
public | sec_analyse                      | table | postgres
public | spatial_ref_sys                  | table | postgres
public | stat_agrege                      | table | postgres
public | strates_echantillonage           | table | postgres
public | variabilite                      | table | postgres

La fonction suivante donne les vues précompilées
```
sudo -u postgres psql -d parking_regs -c "\dv"
```
Schema  |              Name              | Type |  Owner   
--------|--------------------------------|------|---------
public | association_er_reg_stat_etendu  | view | postgres
public | dens_pop_quartier               | view | postgres
public | dens_stat_reg_quartier          | view | postgres
public | geography_columns               | view | postgres
public | geometry_columns                | view | postgres
public | max_pav_all_data                | view | postgres
public | pourcent_territoire             | view | postgres
public | stat_corr_pub_res               | view | postgres
public | stat_reg_tot_par_quartier       | view | postgres
public | taux_occupation_max             | view | postgres
public | taux_occupation_public          | view | postgres
public | taux_occupation_res_max         | view | postgres
public | visu_ens_a_reg                  | view | postgres
public | visu_reg_tete_a_reg_empile_2    | view | postgres
public | vue_parametres_reglements       | view | postgres
public | vue_periode_terr_er             | view | postgres

Une fois le format versé vous pouvez procéder aux étapes de téléversement des données une à une [en commençant par les secteurs d'analyse](021-UploadSecteurs.md)
# Téléversement d'un projet pré-existant