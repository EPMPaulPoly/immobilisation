# Instructions d'installation
---
[<Lisez-moi](../../README.md)|[Téléversement>](020-Upload.md)
---
La procédure d'installation sera détaillée pour windows et Ubuntu



## Ubuntu

Cette section donnera le détail d'installation des suites de logiciel requises pour faire fonctionner l'application.

### Installation Docker

On commence par installer le moteur Docker selon la procédure donnée au lien suivant

[Installation Docker Engine](https://docs.docker.com/engine/install/ubuntu/)

Pour valider l'installation, entrez la commande `docker run hello-world` dans le terminal

Il est ensuite nécessaire d'installer le plugin Docker Compose selon la procédure détaillée sur le site web.

[Installation Docker compose](https://docs.docker.com/compose/install/linux/)

Pour vérifier l'installation,  entrez la commande `docker compose --version`

[Retour au début](#ubuntu)

### Installation PostGreSQL

PostgreSQL est requis pour implémenter la base de données qui est permet de sauvegarder les différentes relations. 

Commencez par configurer le repositoire apt:
```sudo apt install -y postgresql-common
sudo /usr/share/postgresql-common/pgdg/apt.postgresql.org.sh
```
On peut ensuite installer postgresql-16. La version 16 est utilisée plutôt que la version 18 par souci de support complet de postgis
```
sudo apt install postgresql-16
```
On installe ensuite postgis au moyen de la commande suivante:
```
sudo apt install postgresql-16-postgis-3
```
Tapez ensuite la commande suivante pour pouvoir modifier la base de données:
```
sudo -u postgres psql
```
Entrez ensuite la commande suivante dans la base de données en substituant votre mot de passe choisi:

``` 
ALTER USER postgres WITH PASSWORD 'nouveau_mot_de_passe';
```

Les étapes pour téléverser les données pertinentes et la structure de données seront détaillées dans la [page pertinente](020-Upload.md)

[Retour au début](#ubuntu)

### Configuration PostgreSQL

Modifiez le fichier `/etc/postgresql/16/main/postgresql.conf`. Trouvez la ligne #listen_addresses = 'localhost' et renplacez la par 
`listen_addresses = '*'`

Modifiez le fichier `/etc/postgresql/16/main/pg_hba.conf` en ajoutant deux lignes qui permettent aux instances docker d'accéder au 
```
host    all             all             172.25.0.0/16           scram-sha-256
host    replication     all             172.25.0.0/16           scram-sha-256
```

[Retour au début](#ubuntu)

### Téléchargement du code

Il faut ensuite télécharger le code dans le dossier de votre choix. Naviguer au dossier de votre choix et faites un click-droit > Ouvrir dans un terminal. Une fois le terminal ouvert, entrer la commande

``` 
git clone https://github.com/EPMPaulPoly/immobilisation.git
```

Un nouveau dossier nommé immobilisation apparaitra à ce moment.

[Retour au début](#ubuntu)

### Insllation miniconda(optionnel) et création d'environnement virtuel

Pour téléverser les données de cadastre et du rôle foncier, quelques scripts python ont été écrits et requièrent une distribution Python. Il est recommandé d'utiliser un environnement virtuel pour faire ce type d'opérations plutôt que de se fier à la distribution principale installée sur le système. Anaconda met en place un environnement virtuel avec une distribution de python stable ainsi que l'ensemble des librairies requises. Pour installer anaconda, entrez les instructions suivantes dans le terminal:
```
wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh
bash Miniconda3-latest-Linux-x86_64.sh
```

Une fois conda installé naviguer au dossier serveur_calcul_python dans le dossier téléchargé à l'étape précédente. Entrez la commande suivante:
```
conda env --file environment.yml
```

Cette commande crée un environnement virtuel à partir duquel il est possible d'importer les données pertinentes au besoin.


[Retour au début](#ubuntu)

## Windows

L'installation windows est généralement plus simple puisqu'il s'agit simplement d'exécuter des fichier précompilés. 

[Retour au début](#windows)

### Installation Docker

Installer docker desktop selon les [instructions fournies par Docker](https://docs.docker.com/desktop/setup/install/windows-install/)

[Retour au début](#windows)

### Installation PostgreSQL

Installez docker selon les [instructions fournies.](https://www.postgresql.org/download/windows/). L'application a été développée en utilisant postgres 16.11

Lorsque l'installateur vous demandera de spécifier les add-ons, cochez l'option de postgis

[Retour au début](#windows)

### Installation GIT

Téléchargez [git pour windows](https://git-scm.com/install/windows) et installer l'application

[Retour au début](#windows)

### Téléchargement du dépôt GIT

Comme pour Ubuntu, allez au dossier que vous voulez utiliser pour entreposer le dépot git et ouvrez un terminal à partir d'un clic droit. Dans le terminal, entrez la commande suivante:

``` 
git clone https://github.com/EPMPaulPoly/immobilisation.git
```

Un nouveau dossier nommé immobilisation apparaitra à ce moment.

[Retour au début](#windows)

### Insllation miniconda(optionnel) et création d'environnement virtuel

Pour téléverser les données de cadastre et du rôle foncier, quelques scripts python ont été écrits et requièrent une distribution Python. Il est recommandé d'utiliser un environnement virtuel pour faire ce type d'opérations plutôt que de se fier à la distribution principale installée sur le système. Anaconda met en place un environnemetn virtuel avec une distribution de python stable ainsi que l'ensemble des librairies requises. 

Pour installer miniconda, suivez les instructions données  sur  [le site web](https://www.anaconda.com/docs/getting-started/miniconda/install) 

Une fois conda installé naviguer au dossier serveur_calcul_python dans le dossier téléchargé à l'étape précédente. Entrez la commande suivante:
```
conda env --file environment.yml
```

Cette commande crée un environnement virtuel à partir duquel il est possible d'importer les données pertinentes au besoin.

[Retour au début](#windows)