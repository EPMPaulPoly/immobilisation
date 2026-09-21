# Introduction à l'API

[^Tables des matières](../../README.md)|[<Analyse de variabilité](066-AnalyseVariabilite.md)
---

Cette section discutera de l'Interface de Programmation Applicative ou Application Programming Interface (API). L'API est le protocole qui détermine la communication entre l'interface client qui a été montré dans les sections précédentes et le serveur ou se trouve la base de données et où les calculs sont complétés.

L'API est basé sur le système REST qui est un protocole de communication web sur lequel repose beaucoup de sites web. Il a initialement été formulé par Fielding(2000) et repose sur un ensemble de conventions qui sont inclues dans beaucoup de languages de programmation. 

L'interface est documenté au moyen des fichiers YAML. La section suivante donnera un aperçu des étapes nécessaires pour consulter la documentation. Dans votre terminal, naviguez à /docs/api dans le dossier de projet puis entrez la commande suivante.

```
npx @scalar/cli document serve openapiInterface.yaml --port 4000

```
Votre machine lancera alors un serveur qui permettra de visualiser les fonctions de l'API à http://localhost:4000
![Interface de test d'API](/docs/md/images/api/api-doc-server.png)

Vous pouvez ainsi visualiser les paramètres de chacune des fonctions et les tester. D'autre part, Scalar créer des extraits de code pour lancer la requête dans la langue de votre choix.


--

Fielding, R. T. (2000). Architectural styles and the design of network-based software architectures [Phd]. University of California, Irvine.
