# Projet Pipeline CI

Groupe 59.

[[_TOC_]]

## Architecture du projet

Le projet comporte une partie **back**, en Symfony, et une partie **front**, en React.

Pour lancer le projet, on utilise **docker-compose**.



## Installation

```bash
git clone https://github.com/remi95/Pipeline-CI.git <dirname>
cd <dirname>/docker
docker-compose up -d
```



## Continuous Integration - Fonctionnement

Chaque `git push` déclenche une pipeline **Travis CI**, définie dans le fichier `.travis.yml`.

Les tâches exécutées : 

- Lance le docker-compose du projet pour lancer les tests en front & back.
- Lance une analyse de code avec **SonarCloud** (configuration dans `sonar-project.properties`)



---

Un récapitulatif est disponible sur Github, à côté de chaque commit.

Pour plus d'infos :

- [Lien du Travis](https://travis-ci.org/github/remi95/Pipeline-CI)

- [Lien du SonarCloud](https://sonarcloud.io/dashboard?branch=feature%2Ftravis-pipeline&id=remi95_Pipeline-CI) 

