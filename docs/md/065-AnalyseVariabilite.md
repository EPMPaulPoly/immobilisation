# L'analyse de variabilité

[^Tables des matières](../../README.md)|[<Profil d'accumulation de véhicules](064-ProfilAccumulationVeh.md)|[API>](070-APIIntro.md)
---

L'analyse de variabilité vise à donner un aperçu de la manière dont l'offre de stationnement varierait avec différents niveaux de rigueur réglementaire. Ainsi, l'analyse fonctionne en appliquant tous les ensembles de règlements à toutes les propriétés avec des données du rôle foncier. Ce faisant, on peut observer la variation de l'offre agrégée en fonction de la règlementation appliquée. Ceci permet de donner un regard agrégée sur la rigueur réglementaire. 

## Accès à l'analyse

La première étape est d'accéder à l'analyse en naviguant à \<base-url>/ana-var

## Calcul

L'image suivante montre la page d'analyse de variabilité en y accédant:

![Analyse de variabilité](/docs/md/images/anaVar/ana-var-acces.png)

Le bouton rouge dans la barre de contrôle permet de lancer le calcul. Ce calcul est cepdendant très long. L'utilisateur devrait donc prendre son mal en patience après avoir lancé le calcul. La page affiche alors une icône de calcul:

![Calcul analyse de variabilité](/docs/md/images/anaVar/ana-var-calcul.png)

## Affichage des résultats

Une fois le calcul complété, l'utilisateur doit sélectionner les ensembles de règlements qu'il veut afficher. Pour ce faire, un bouton est mis à sa disposition qui ouvre un modal de sélection montré à la figure suivante. 

![Sélection ensembles](/docs/md/images/anaVar/ana-var-select.png)


En utilisant ce modal, l'utilisateur peut sélectionner les ensembles de règlements.
L'utilisateur peut alors changer le mode de visualisation. Le tableau suivant donne la description de chacun des modes de visualisation

| Mode               | Description                                  |
|--------------------|----------------------------------------------|
| Barres - par ER    | Montre l'offre agrégée pour chacun des ensembles de règlements|
| Distribution - par Inventaire | Montre la distribution des offres pour les ensembles de règlements sélectionnés |
| Box plot - par échelle conversion | Montre la variation de l'offre agrégée de stationnement lorsque les facteurs de conversion d'unité sont modulés de 25%|
| Box plot - Estimé central | Montre tous les estimés d'offre de stationnement sur un diagramme à moustache |

L'affichage en diagramme à barre est montré à la figure suivante

![Affichage inventaire](/docs/md/images/anaVar/ana-var-supply.png)


L'affichage de la distribution des offres de stationnement est montré à la figure suivante:

![Affichage distribution](/docs/md/images/anaVar/ana-var-distro.png)

L'affichage des diagrammes à moustache avec les facteurs d'échelles est montré à la figure suivante:

![Affichage diagramme moustache avec échelle](/docs/md/images/anaVar/ana-var-boxplot.png)

L'affichage des diagrammes à moustache sans la variation des facteurs d'échelles est montrée ci-dessous:

![Affichage diagramme moustache sans échelle](/docs/md/images/anaVar/ana-var-boxplot-no-scale.png)

Ceci conclut la section sur l'analyse des résultats. La section suivante discutera brièvement de l'Application Programming Interface.