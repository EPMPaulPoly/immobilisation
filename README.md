# Immobilisation : Un outil de prédiction de l'offre de stationnement hors-rue

[English](docs/md/README-en.md)

Ce projet a pour but de créer l'interface et le backend pour prédire la capacité de stationnement basé sur les règlements d'urbanisme. Le projet a été complété dans le cadre d'une maitrise en génie civil à la [Chaire mobilité](https://www.polymtl.ca/expertises/chaire-mobilite). La méthode reprend les travaux de [Chester et al(2015)](https://doi.org/10.1080/01944363.2015.1092879) mais l'adapte au contexte de données québecois et met en place une suite d'outils pour faire l'entrée de données, la prédiction, l'évaluation des performances et l'analyse des données dans un interface web. La mise en place d'un API permet aussi aux parties prenantes d'accéder au données unes fois qu'elles sont générées pour faciliter l'analyse par de tierces parties.

## Documentation

Mémoire(À venir)

En plus du mémoire, un manuel d'instruction a été mis en place pour faciliter la création et l'analyse dans le futur

### Survol
[Logigramme de l'analyse(a faire)](/docs/md/000-Procedure.md)
### Installation des logiciels et mise en place de la BD
[Installations requises](/docs/md/010-Installation.md)

[Création de la BD](/docs/md/011-VerseFormat.md)

[Demarrage du serveur pour opérer l'interface](/docs/md/012-Demarrage.md)

### Téléversement des données

[Secteurs d'analyse](/docs/md/020-VerseSecteurs.md)

[Conversions d'unités](docs/md/021-EntreeConversions.md)

[Données Cadastrales](docs/md/022-VerseDonneesCadastre.md)

[Données du rôle foncier](docs/md/023-VerseDonneesRole.md)

[Association cadastre-rôle](docs/md/024-CreationAssocRoleCadastre.md)

[Données Recensement](docs/md/025-VersementDonneesPopu.md)

[Données OD](docs/md/026-VerseDonneesOD.md)

[Données CUBF](docs/md/027-VersementCUBF.md)

[Sommaire Versement](docs/md/028-SommaireVersements.md)
### Création de la réglementation

[Intro à la réglementation - Cas démo(a faire)](docs/md/030-IntroductionRegelementation.md)

[Données historique(a faire)](docs/md/031-VersementModifHistorique.md)

[Création des règlements(a faire)](docs/md/032-RegCreation.md)

[Création des ensembles de règlements(a faire)](docs/md/033-EnsRegCreation.md)

[Association Ensemble de règlements aux territoires(a faire)](docs/md/034-EnsRegTerrCreation.md)

[Visualisation règlements(a faire)](docs/md/035-VisualisationReg.md)

### Imputation de l'offre de stationnement
[Prédiction automatique par les minimums(a faire)](docs/md/040-Prediction.md)

[Méthodes alternatives supportées(a faire)](docs/md/041-MethodesAlternatives.md)

### Évaluation de la performance
[Survol(a faire)](docs/md/050-EvaluationPerformance.md)

[Création des catégories(a faire)](docs/md/051-CreationCateg.md)

[Collecte des données(a faire)](docs/md/052-CollecteDonnees.md)

[Méthodes d'évaluation(a faire)](docs/md/053-MethodesEvaluation.md)

### Méthodes d'analyse
[Survol(a faire)](docs/md/060-Analyse.md)

[Diagrammes à Barres(a faire)](docs/md/061-Barres.md)

[Diagrammes XY(a faire)](docs/md/062-XY.md)

[Cartes(a faire)](docs/md/063-Carto.md)

[Profils d'accumulation de véhicules(a faire)](docs/md/064-ProfilAccumulationVeh.md)

[Analyse de variabilité(a faire)](docs/md/065-AnalyseVariabilite.md)

### Informations sur l'API
[Information API(a faire)](/docs/md/070-APIIntro.md)

## Références utiles pour la compréhension
Chester, M., Fraser, A., Matute, J., Flower, C., & Pendyala, R. (2015). Parking Infrastructure : A Constraint on or Opportunity for Urban Redevelopment? A Study of Los Angeles County Parking Supply and Growth. Journal of the American Planning Association, 81(4), 268‑286. https://doi.org/10.1080/01944363.2015.1092879

Hoehne, C. G., Chester, M. V., Fraser, A. M., & King, D. A. (2019). Valley of the sun-drenched parking space : The growth, extent, and implications of parking infrastructure in Phoenix. Cities, 89, 186‑198. https://doi.org/10.1016/j.cities.2019.02.007


## Structure de base du logiciel
Le dossier est divisé en trois grandes sections:
- client: ensemble de scripts qui font le rendu de l'interface dans le fureteur de l'utilisateur
- serveur: ensemble de scripts qui gèrent l'accès à la base de données et formattent les données
- serveur_calcul_python: scripts Python utilisés pour faire les opérations plus complexes requiérant, notamment le calcul de la capacité de stationnement

Ces trois parties sont implémentées dans une instance [Docker](https://fr.wikipedia.org/wiki/Docker_(logiciel)). Les paramètres de cette instance sont gérés à l'aide de 4 fichiers:
 
- le [docker-compose](docker-compose.yml): Fichier qui est un ensemble de paramètres pour où les fichiers se trouvent et des données d'environnement
- le [DockerFile serveur](/serveur/Dockerfile): Ensemble d'instructions définissant les commandes à exécuter sur la machine virtuelle pour implémenter le serveur backend et le serveur_calcul_python
- le [DockerFile client](/client/Dockerfile): Ensemble d'instructions définissant les commandes à exécuter sur la machine virtuelle pour mettre en place le serveur frontend.
- .env: fichier non fourni définissant 6 paramètres nécessaires pour l'accès à la base de données. Dans le cadre du mémoire, la base de données était implémentée localement sur l'ordinateur de l'utilisateur:
  - DB_USER
  - DB_HOST
  - DB_NAME
  - DB_PASSWORD
  - DB_PORT
  - SERVER_PORT

Un [dump psql](/db_template/format_bd_vide.sql) peut être utilisé pour rapidement mettre en place la structure de la base de données sur l'ordinateur de l'utilsateur. Du fait de la nature confidentielle des données de l'enquête OD, les données utilisées dans le mémoire sont disponible sur requête.

## Perspectives futures

Plusieurs limitations sont discutées dans le mémoire et la pages des [problèmes](https://github.com/EPMPaulPoly/interface_backend_stationnement_maitrise/issues).