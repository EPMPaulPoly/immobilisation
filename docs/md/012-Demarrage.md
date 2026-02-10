# Démarrage du serveur
---
[^Tables des matières](../../README.md)|
[<Téléversement BD](011-VerseFormat.md)| 
[Versement des secteurs>](020-VerseSecteurs.md)
---
# Fichier .env

Le fichier .env devrait avoir le format suivant
```
DB_USER=postgres
DB_HOST=host.docker.internal
DB_NAME=parking_regs
DB_PASSWORD=votre_password_quelconque
DB_PORT=5432
```

# Comment démarrer le serveur?
Une fois les données obtenues, si l'on ne veut pas utiliser des données d'un autre utilisateur on peut simplement démarrer le serveur. Cela se fait au moyen de deux commandes qui doivent être lancées dans le dossier contenant le docker-compose.yml (la racine du dossier). Deux commandes doivent ensuite être utilisées dans le terminal:
```
docker compose build
```
lance la constructions des images et prend plusieurs minutes lorsqu'elle est initialement lancée du fait de la nécéssité de télécharger et d'installer les différentes librairies nécessaires à l'exécution des différentes fonctionnalités. Notés qu'il est possible que l'utilsateur doive utiliser `docker-compose build` sur Windows

Une fois la consruction des images complète, il est possible de lancer le serveur à l'aide de la commande suivante
```
docker compose up
```
Encore une fois, il possible de devoir utiliser `docker-compose up`. Vous devriez alors être capable de naviguer jusqu'à la page d'accueil de l'outil web. Cette page devrait être disponible à l'addresse suivante [http://localhost:3000](http://localhost:3000)