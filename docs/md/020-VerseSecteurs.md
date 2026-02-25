# Téléversement des secteurs d'analyse
---
[^Tables des matières](../../README.md)|
[<Démarrage](012-Demarrage.md)| 
[Entrée des facteurs de conversion d'unités>](021-EntreeConversions.md)
---

## Source des données et choix du niveau d'agrégation

Le découpage des secteurs d'analyse demeure la prérogative de l'analyste à la fin de la journée. Des secteurs plus fins sont plus discriminants spatialement mais comportent le risque d'avoir des enjeux de taille d'échantillon. Dans le cadre du mémoire, les quartiers de la ville de Québec ont été utilisés pour démontrer les procédures d'analyse. Ces derniers sont disponibles sur le site [Données Québec](https://www.donneesquebec.ca/recherche/dataset/vque_9).

Une approche alternative pourrait être d'utiliser les secteurs de l'enquête OD et de n'utiliser que les secteurs qui sont à l'intérieur de la ville. Ces derniers ne sont cependant pas disponibles en données ouvertes en format géospatial ou sur Géo-index. Une carte [pdf](https://cdn-contenu.quebec.ca/cdn-contenu/adm/min/transports/transports/recherches-statistiques/planification/EOD/quebec/2017/EOD17_sommaire.pdf) est disponible pour référence à la page 31 du fichier mis en lien. Un fichier json peut aussi être extrait des flux de données de la [carte interactive](https://www.enqueteodregionquebec.cmquebec.qc.ca/index.html) de l'enquête OD, mais sont protégés par les droits d'auteur.

Au final, n'importe quel type de division peuvent être utilisé, tant que le fichier contient au moins des zones, qui ont les attributs suivants:
 - un identifiant de quartier
 - un nom de quartier
 - une superficie calculée (dans les propriétés)
 - optionnellement un acronyme

## Procédure de versement
Les secteurs d'analyse sont les premiers à être versés. Pour ce faire, on choisi l'onglet [Entrée données départ](http://localhost:3000/sec-analyse-verse) ou l'on arrive à la page montrée à la figure suivante

![Page de versement des secteurs d'analyse](images/secteurs-verse/PageVersementSecteurs.png)

On navique à l'onglet nouveaux secteurs d'analyse dans la barre déroulante à gauche. On clique ensuite sur l'icone de versement à côté de la liste déroulante qui ouvre le modal de versement 
![Modal Versement secteur d'analyses](images/secteurs-verse/ModalVersementSecteurDebut.png)

Une fois le fichier choisi on peu sélectionner l'affectation des colonnes![Affectation des colonnes](images/secteurs-verse/SelectionColonnesSecteurs.png)

En cliquant sur charger les données on charge les données dans le frontend (elles ne sont pas encore côté serveur). Notez que cette approche limite la complexité des secteurs choisis. une approche alternative pourrait être mise en place comme c'est le cas pour le cadastre et le rôle foncier. La page ressemble alors à ce qui est montrée ci dessous:
![Copie locale secteurs](images/secteurs-verse/VersementLocal.png)

En cliquant sur écraser anciens secteurs on peut alors verser sur la base de données
On peut alors changer la valeur de la liste déroulante en haut à gauche pour voir ce qui est sur la bd et le modifier:
![Secteurs sauvegardés](images/secteurs-verse/SecteursBd.png)

Les champs de textes des secteurs peuvent être modifiés dans l'outil mais pas leur géométrie. L'API ne fait pas de distinction mais les utilitaires de carte n'ont pas été mis en place pour le faire