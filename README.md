# Immobilisation : Un outil de prédiction de l'offre de stationnement hors-rue

[English](docs/md/README-en.md)

Ce projet a pour but de créer l'interface et le backend pour prédire la capacité de stationnement basé sur les règlements d'urbanisme. Le projet a été complété dans le cadre d'une maitrise en génie civil à la [Chaire mobilité](https://www.polymtl.ca/expertises/chaire-mobilite). La méthode reprend les travaux de [Chester et al(2015)](https://doi.org/10.1080/01944363.2015.1092879) mais l'adapte au contexte de données québecois et met en place une suite d'outils pour faire l'entrée de données, la prédiction, l'évaluation des performances et l'analyse des données dans un interface web. La mise en place d'un API permet aussi aux parties prenantes d'accéder au données unes fois qu'elles sont générées pour faciliter l'analyse par de tierces parties.

## Documentation

Mémoire(À venir)

[Installation](/docs/md/010-Installation.md)

[Démarrage rapide](/docs/md/011-QuickStart.md)

[Information API](/docs/md/070-APIIntro.md)

[Procédure détaillée](/docs/md/012-Procedure.md)

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

Un [dump psql](/db_template/format_bd_vide.sql) peut être utilisé pour rapidement mettre en place la structure de la base de données sur l'ordinateur de l'utilsateur. Du fait de la nature confidentielle des données. Les données sont disponible sur requête.

## Perspectives futures

Plusieurs limitations sont discutées dans le mémoire et la pages des [problèmes](https://github.com/EPMPaulPoly/interface_backend_stationnement_maitrise/issues).