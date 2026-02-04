# Versement des données du recensement

---
[^Tables des matières](../../README.md)|
[<Création Assocation rôle cadastre](025-CreationAssocRoleCadastre.md)| 
[Versement données OD>](026-VerseDonneesOD.md)
---

Les données du recensement sont issues de deux sources:

- Le site de statistiques Canada est utilisé pour les [délimitations géographiques des aires de diffusion](https://www12.statcan.gc.ca/census-recensement/2021/geo/sip-pis/boundary-limites/index2021-fra.cfm?year=21)
- Le [site de CHASS](https://datacentre.chass.utoronto.ca) pour les données de population par aire de diffusion


## Traitement des données géographiques
Il est fortement suggéré d'extraire seulement les aires de diffusions appartenant à la municipalité d'intérêt. Cela peut être fait au préalable au moyen de QGIS. Un script est mis à disposition pour faire la jointure entre le fichier Excel de CHASS et le JSON des limites Géographiques.

Le script fourni peut alors être utilisé pour traiter les données de [2021](../../serveur_calcul_python/utilitaires/1_recensement_2021.py) et [2016](../../serveur_calcul_python/utilitaires/2_recensement_2016.py). Ces deux fichiers joignent les données du CHASS aux données de statistique Canada selon l'identifiant d'aire de diffusion et assure que les données sont dans le référentiel 4326 qui est utilisé dans la base de données.

## Versement

Le versement s'opère de manière similaire aux autres données géographiques. Si des données existent actuellement elles sont montrées dans la carte si l'utilisateur zoom assez proche. Autrement, l'utilisateur peut sélectionner l'icone en haut à gauche pour verser des données sur le serveur

L'utilisateur choisit tout d'abord le fichier


Puis il affecte les noms de colonnes du fichier au nom de colonnes de la base de donnée.

Une fois l'affectation complétée, le bouton permettant de charger les données est montré et l'utilisateur verse les donnnées sur la BD en cliquant dessus. 

Une fois le modal fermé, les secteurs de recensement devrait apparaitre dans la carte montrée à l'écran