# Méthodes d'analyse 

[^Tables des matières](../../README.md)|[<Méthodes d'évaluation](053-MethodesEvaluation.md)|[Diagrammes à Barres>](061-Barres.md)
---

Une fois l'évaluation de la performance des prédictions complété, l'analyste aura la possibilité d'utiliser des outils de visulalisation graphique de résultats 
pour donner un éclairage sur la mobilité des personnes en fonction de l'offre de stationnement prédite.

Pour ce faire, l'outil implémente diverses méthodes de visulation et d'analyse et cette section donnera un aperçu des méthodes de visualisation implémentées dans l'outil:
- des diagrammes à barre,
- des graphiques XY
- des cartes choroplèthes
- des profils d'accumulation de véhicules
- l'analyse de la variabilité

Chacune de ces méthodes donne un regard agrégé sur le problème et n'aborde pas nécessairement la problématique d'un point de vue désagrégé et de la perception
de l'individu. Les données pour cette section sont celles qui ont été utilisées dans le cadre de cette section sont issues de l'étude de cas de Québec qui est abordée
dans le [mémoire](https://publications.polymtl.ca/72087/) 

Outre les profils d'accumulation de véhicules, les variables suivantes sont disponibles à l'affichage:

Le tableau suivant donne une liste des variables disponibles à l'affichage. Les formules mathématiques sont définies dans le mémoire. 
Les valeurs sont disponibles pour les diagrammes à barre, des diagrammes XY et des cartes choroplèthes. Les inventaires sont montrés 
aussi dans les profils d'accumulation de véhicules.

| Nom de la variable                                                | Unité de formulation                          | Utilise l'offre prédite | 
| ------------------------------------------------------------------|-----------------------------------------------|-------------------------|
| Stationnement Total                                               | Places                                        | Oui                     |
| Densité de stationnement                                          | Places par hectare                            | Oui                     |
| Stationnement par personne 2021                                   | Places par personne                           | Oui                     |
| Stationnement par voiture résident                                | Places par voiture                            | Oui                     | 
| Pourcentage du territoire dédié au stationnement                  | %                                             | Oui                     |
| Superficie du quartier                                            | Hectares                                      | Non                     |
| Population 2021                                                   | Personnes                                     | Non                     | 
| Densité de Population 2021                                        | Personne par km²                              | Non                     | 
| Valeur moyenne des logements                                      | CAD                                           | Non                     | 
| Superficie moyenne des logements                                  | m²                                            | Non                     |
| Valeur foncière totale                                            | CAD                                           | Non                     | 
| Valeur foncière par superficie                                    | CAD / Hectare                                 | Non                     | 
| Nombre de voitures                                                | Voitures                                      | Non                     | 
| Nombre de voitures par 1000 personnes                             | Voitures par 1000 personnes                   | Non                     | 
| Delta voitures Jour - Nuit                                        | Voitures                                      | Non                     | 
| Nombre de voitures max                                            | Voitures                                      | Non                     |
| Nombre de voitures min                                            | Voitures                                      | Non                     | 
| Stationnements par voitures max                                   | Places par voiture                            | Oui                     | 
| Stationnements par permis                                         | Places par permis                             | Oui                     |
| Nombre de permis                                                  | Nombre de permis                              | Non                     | 
| Nombre de voitures par permis                                     | Voitures / permis                             | Non                     |
| Stationnement par personne 2016                                   | Places par personne                           | Oui                     |
| Nombre de voitures par 1000 personnes 2016                        | Voitures par 1000 personnes                   | Oui                     |
| Population 2016                                                   | Personnes                                     | Non                     |
| Densité Population 2016                                           | Personnes par km²                             | Non                     |
| Part modale auto-conducteur - résidents                           | %                                             | Non                     |
| Part modale auto-passager - résidents                             | %                                             | Non                     |
| Part modale Transport en commun - résidents                       | %                                             | Non                     |
| Part modale marche-vélo - résidents                               | %                                             | Non                     | 
| Part modale bus scolaire - résidents                              | %                                             | Non                     |
| Part modale auto-conducteur - interne                             | %                                             | Non                     |
| Part modale auto-passager - interne                               | %                                             | Non                     |
| Part modale Transport en commun - interne                         | %                                             | Non                     |
| Part modale marche-vélo - interne                                 | %                                             | Non                     | 
| Part modale bus scolaire - interne                                | %                                             | Non                     |
| Part modale AC à destination du quartier                          | %                                             | Non                     |
| Part modale AP à destination du quartier                          | %                                             | Non                     |
| Part modale TC à destination du quartier                          | %                                             | Non                     | 
| Part modale MV à destination du quartier                          | %                                             | Non                     |
| Part modale BS à destination du quartier                          | %                                             | Non                     |
| Part modale AC originant du quartier                              | %                                             | Non                     |
| Part modale AP originant du quartier                              | %                                             | Non                     |
| Part modale TC originant du quartier                              | %                                             | Non                     |
| Part modale MV originant du quartier                              | %                                             | Non                     |
| Part modale BS originant du quartier                              | %                                             | Non                     |
| Places de stationnement inutilisées                               | Places inutitilisées                          | Non                     |
| Superficie des places inutilisées                                 | m² de places inutilisées                      | Non                     |
| Nombre de logement construisibles sur le stationnement inutilisés | Nombre de logements                           | Non                     |
| Stationnement résidentiel                                         | Nombre de places de stationnement             | Oui                     |
| Stationnement industriel                                          | Nombre de places de stationnement             | Oui                     | 
| Stationnement infrastructure                                      | Nombre de places de stationnement             | Oui                     |
| Stationnement commercial                                          | Nombre de places de stationnement             | Oui                     |
| Stationnement services                                            | Nombre de places de stationnement             | Oui                     |
| Stationnement Assemblée et récréation                             | Nombre de places de stationnement             | Oui                     |
| Stationnement ressouces naturelles                                | Nombre de places de stationnement             | Oui                     |
| Stationnement immeubles inoccupés                                 | Nombre de places de stationnement             | Oui                     |
| Stationnement résidentiel par permis                              | Nombre de places de stationnement par permis  | Oui                     |


