# Cahier des Charges - Projet GUITAB

## 1. Présentation du Projet

### 1.1 Contexte
GUITAB est une application web cartographique destinée à répertorier et localiser les établissements publics de Conakry, Guinée. L'application permet aux utilisateurs de visualiser, ajouter, modifier et gérer différents types d'établissements sur une carte interactive.

### 1.2 Objectifs
- Faciliter la localisation des établissements publics de Conakry
- Offrir une interface intuitive pour la gestion des établissements
- Permettre la recherche et le filtrage des établissements
- Assurer la persistance des données
- Fournir des fonctionnalités d'import/export des données

## 2. Spécifications Fonctionnelles

### 2.1 Gestion des Établissements
- Types d'établissements supportés :
  * Universités
  * Écoles
  * Hôpitaux
  * Bibliothèques

### 2.2 Fonctionnalités Principales
- Visualisation des établissements sur une carte interactive
- Ajout d'établissements par clic sur la carte
- Modification des informations des établissements
- Suppression d'établissements
- Recherche et filtrage par :
  * Nom
  * Type d'établissement
  * Quartier
- Géolocalisation de l'utilisateur
- Import/Export des données en format JSON

### 2.3 Interface Utilisateur
- Sidebar avec :
  * Formulaire d'ajout/modification
  * Barre de recherche
  * Filtres de type et quartier
  * Liste des établissements
  * Boutons d'actions (import/export, géolocalisation)
- Carte interactive avec :
  * Marqueurs personnalisés par type d'établissement
  * Popups d'information
  * Navigation fluide

## 3. Spécifications Techniques

### 3.1 Technologies Utilisées
- HTML5/CSS3 pour la structure et le style
- JavaScript (ES6+) pour la logique
- Leaflet.js pour la cartographie
- LocalStorage pour la persistance des données

### 3.2 Architecture
- Programmation Orientée Objet
- Classes distinctes pour chaque type d'établissement
- Système de notifications personnalisé
- Gestion des états (formulaire, filtres, etc.)

### 3.3 Données
- Structure des établissements :
  * ID unique
  * Coordonnées géographiques
  * Nom
  * Type
  * Description
  * Quartier
  * Date de création
  * Informations spécifiques selon le type

## 4. Contraintes et Exigences

### 4.1 Performance
- Chargement rapide de la carte
- Réactivité de l'interface
- Gestion efficace des marqueurs

### 4.2 Compatibilité
- Navigateurs modernes (Chrome, Firefox, Safari, Edge)
- Responsive design
- Support de la géolocalisation

### 4.3 Sécurité
- Validation des données entrées
- Gestion des erreurs
- Messages de confirmation pour les actions critiques

## 5. Évolutions Futures Possibles

### 5.1 Fonctionnalités Additionnelles
- Authentification utilisateur
- Mode hors ligne
- Partage de positions
- Itinéraires vers les établissements
- Photos des établissements
- Commentaires et évaluations

### 5.2 Améliorations Techniques
- Backend avec base de données
- API REST
- Optimisation des performances
- Support multilingue
- Version mobile native

## 6. Livrables

- Code source commenté
- Documentation technique
- Guide d'utilisation
- Fichiers de données exemple
- Tests unitaires 