# Révision des règlements
---
[^Tables des matières](../../README.md)|
[<Introduction aux règlements](030-IntroductionReglementation.md)| 
[Création des règlements>](032-RegCreation.md)
---

La première étape consiste à valider que toutes les unité nécessaires ont été compilées dans la base de données. 


Les unités suivantes ont été recensées dans les règlements présentés à la section précédente ainsi que les facteurs de conversion qui seront utilisés dans l'exemple ces derniers sont utilisés à titre indicatif puisque les conversions d'unité sont l'un des facteurs majeurs contribuant aux erreurs de prédiction.

| Unité                  | Utilisée dans        | Ordonnée à l'origine | Pente     | Colonne rôle | Description        |
|------------------------|----------------------|----------------------|-----------|--------------|--------------------|
| Logements              | Partout              |  0                   | 1         | rl0311a      | 1 pour 1           |
| Superficie d'étages    | Partout              |  0                   | 1         | rl0308a      | 1 pour 1           |
| Sièges                 | Restaurant, assemblée|  0                   | 0.5       | rl0308a      | 1 siège par 2m²    |
| Lit                    | Santé                |  0                   | 0.04      | rl0308a      | 1 lit par 25m²     |
| Employé                | Santé / Industrie    |  0                   | 0.1       | rl0308a      | 1 employé par 10m² |
| Médecin                | Santé                |  0                   | 0.01      | rl0308a      | 1 médecin par 100m²| 
| Table                  | Restauration         |  0                   | 0.1       | rl0308a      | 1 table par 10m²   |   

