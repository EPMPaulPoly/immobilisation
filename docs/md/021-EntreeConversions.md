# Entrée des facteurs de conversions d'unités

---
[^Tables des matières](../../README.md)|
[<Téléversement Secteurs](020-VerseSecteurs)| 
[Versement des données cadastrales>](022-VerseDonneesCadastre.md)
---

On peut ensuite utiliser le menu pour naviguer à la page d'entrée des [facteurs de conversion](http://localhost:3000/unites). L'interface de cette page est montrée à la figure ci-dessous:
![Page de conversion d'unités](images/VerseUnites/ConversionUnite.png)

L'interface est relativement simple. L'utilisateur peut ajouter des unités avec le bouton plus sous la liste d'unité et peut en faire la modification dans le panneau de droite. Toutes les conversions sont considérées comme des relation linéaire simple applicables à l'ensemble des codes d'utilisation du bien fonds.

La valeur se calcul comme `U = Facteur correction x rl* +abscisse correction` où rl* est une colonne du rôle foncier.