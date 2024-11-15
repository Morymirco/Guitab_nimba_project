# GUITAB - Carte des Établissements de Conakry 🗺️

GUITAB est une application web cartographique permettant de gérer et visualiser les établissements publics de Conakry, Guinée.

## 📋 Table des Matières

- [Fonctionnalités](#fonctionnalités)
- [Captures d'écran](#captures-décran)
- [Technologies Utilisées](#technologies-utilisées)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [Documentation](#documentation)
- [Contribution](#contribution)

## ✨ Fonctionnalités

- 🏫 Gestion des établissements (Universités, Écoles, Hôpitaux, Bibliothèques)
- 🔍 Recherche et filtrage avancés
- 📍 Géolocalisation en temps réel
- 💾 Import/Export des données
- 🎯 Interface intuitive et responsive
- 📁 Import/Export des données
- 🔍 trouver la position sur la carte
- 🔍 Recherche par nom
- 🔍 Recherche par quartier
- 🎨 choix du type de vue sur la carte

## 📸 Captures d'écran

### Étape 1 : Page d'accueil
![Page d'accueil](screenshots/home.png)
- Vue d'ensemble de la carte
- Sidebar avec options de recherche

### Étape 2 : Ajout d'un établissement
![Ajout établissement](screenshots/add.png)
- Clic sur la carte
- Formulaire d'ajout

### Étape 3 : Détails et modifications
![Détails](screenshots/details.png)
- Vue détaillée d'un établissement
- Options de modification/suppression
### Modification d'un établissement
![Modification](screenshots/edit.png)
- Formulaire pré-rempli avec les données existantes
- Validation des modifications

### Suppression d'un établissement  
![Suppression](screenshots/delete.png)
- Confirmation de suppression
- Retrait instantané de la carte


### Étape 4 : Recherche et filtres
![Recherche](screenshots/search.png)
- Filtrage par type et quartier
- Résultats en temps réel
![Filtre par type](screenshots/filtreparnom.png)
![Filtre par quartier](screenshots/filtreparquartier.png)

### Étape 5 : Export des établissements
![Export](screenshots/export.png)
- Export des données au format JSON
- Sauvegarde complète des établissements
- Possibilité d'import/restauration
### Étape 6 : Import des établissements
![Import](screenshots/import.png)
- Import des données depuis un fichier JSON
- Validation du format des données
- Fusion avec les données existantes
### Étape 7 : Types de vue sur la carte
![Types de vue](screenshots/vues.png)
- Choix entre vue satellite et vue standard
- Changement dynamique de l'affichage
- Meilleure visualisation selon le contexte


## 🛠️ Technologies Utilisées

- HTML5/CSS3
- <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" width="20"/> HTML5/CSS3

- JavaScript (ES6+)
- <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" width="20"/> JavaScript (ES6+)


- Leaflet.js pour la cartographie
- <img src="https://leafletjs.com/docs/images/logo.png" width="20"/> Leaflet.js pour la cartographie
- <img src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/html/html5-storage.png" width="20"/> LocalStorage pour la persistance


## 📥 Installation
1. Télécharger ou cloner le projet :
   ```bash
   git clone https://github.com/Morymirco/Guitab_nimba_project.git
   ```

2. Ouvrir le dossier du projet :
   ```bash
   cd Guitab_nimba_project
   ```

3. Ouvrir le fichier index.html dans votre navigateur web préféré

## 🚀 Utilisation

- Naviguez sur la carte pour trouver la position de l'établissement
- Utilisez les filtres pour trouver l'établissement
- Ajoutez un établissement en cliquant sur la carte
- Modifiez un établissement en cliquant sur le bouton modifier
- Supprimez un établissement en cliquant sur le bouton supprimer

## 📚 Documentation

Pour plus de détails sur l'utilisation de chaque fonctionnalité, veuillez consulter la documentation en ligne.

## 👥 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Forkez le projet
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Pushez vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

### Contributeurs

<div style="display: flex; align-items: center; gap: 20px; margin-bottom: 20px;">
  <img src="img/mory.jpg" width="50" height="50" style="border-radius: 50%; object-fit: cover;"/> 
  <div>
    <strong>Mory Mirco</strong> - Chef de projet
    <ul>
      <li>Architecture du projet</li>
      <li>Développement des fonctionnalités principales</li>
      <li>Documentation technique</li>
    </ul>
  </div>
</div>

<div style="display: flex; align-items: center; gap: 20px; margin-bottom: 20px;">
  <img src="img/ramandan.jpg" width="50" height="50" style="border-radius: 50%; object-fit: cover;"/>
  <div>
    <strong>Mamadou Ramandan Barry</strong> - Développeur front-end
    <ul>
      <li>Intégration de la carte</li>
      <li>Gestion des marqueurs</li>
      <li>Tests et débogage</li>
    </ul>
  </div>
</div>

<div style="display: flex; align-items: center; gap: 20px; margin-bottom: 20px;">
  <img src="img/conte.jpg" width="50" height="50" style="border-radius: 50%; object-fit: cover;"/>
  <div>
    <strong>Djenabou Conte</strong> - Designer
    <ul>
      <li>Design de l'interface</li>
      <li>Expérience utilisateur</li>
      <li>Intégration CSS</li>
    </ul>
  </div>
</div>
