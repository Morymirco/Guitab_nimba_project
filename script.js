'use strict';

class Etablissement {
  
  id = Date.now() + Math.floor(Math.random() * 100);
  date = new Date();

  constructor(coords, nom, description) {
    this.coords = coords;
    this.nom = nom;
    this.description = description;
  }

  _setDescription() {
    const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    this.dateDescription = `${this.type} créé le ${this.date.getDate()} ${months[this.date.getMonth()]}`;
  }
}

class Universite extends Etablissement {
  type = 'universite';
  constructor(coords, nom, description, nombreEtudiants) {
    super(coords, nom, description);
    this.nombreEtudiants = nombreEtudiants;
    this._setDescription();
  }
}

class Hopital extends Etablissement {
  type = 'hopital';
  constructor(coords, nom, description, nombreLits) {
    super(coords, nom, description);
    this.nombreLits = nombreLits;
    this._setDescription();
  }
}

class Bibliotheque extends Etablissement {
  type = 'bibliotheque';
  constructor(coords, nom, description, nombreLivres) {
    super(coords, nom, description);
    this.nombreLivres = nombreLivres;
    this._setDescription();
  }
}

class Ecole extends Etablissement {
  type = 'ecole';
  constructor(coords, nom, description, nombreEleves) {
    super(coords, nom, description);
    this.nombreEleves = nombreEleves;
    this._setDescription();
  }
}

class App {
  // Stocke la référence à la carte Leaflet
  #map;
  
  // Stocke l'événement de clic sur la carte
  #mapEvent;
  
  // Niveau de zoom initial de la carte
  #mapZoomLevel = 13;
  
  // Tableau stockant tous les établissements créés
  #etablissements = [];
  
  // Objet stockant les marqueurs Leaflet associés aux établissements
  #markers = {};
  
  // Palette de couleurs utilisée pour différencier les établissements sur la carte
  #colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
    '#FFEEAD', '#D4A5A5', '#9B59B6', '#3498DB',
    '#E67E22', '#27AE60', '#F1C40F', '#E74C3C'
  ];

  // Icônes personnalisées pour chaque type d'établissement sur la carte
  #icons = {
    universite: L.divIcon({
      html: '<i class="fas fa-graduation-cap" style="color: #3498db;"></i>',
      className: 'custom-marker universite-marker',
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40]
    }),
    ecole: L.divIcon({
      html: '<i class="fas fa-school" style="color: #2ecc71;"></i>',
      className: 'custom-marker ecole-marker',
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40]
    }),
    hopital: L.divIcon({
      html: '<i class="fas fa-hospital" style="color: #e74c3c;"></i>',
      className: 'custom-marker hopital-marker',
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40]
    }),
    bibliotheque: L.divIcon({
      html: '<i class="fas fa-book-reader" style="color: #f1c40f;"></i>',
      className: 'custom-marker bibliotheque-marker',
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40]
    })
  };

  // Différents styles de carte disponibles (satellite, rues, etc.)
  #mapStyles = {
    streets: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    terrain: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    dark: 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png'
  };

  // Stocke la couche de tuiles actuellement affichée sur la carte
  
  // Stocke la couche de tuiles actuellement affichée sur la carte
  #currentTileLayer = null;
 

  constructor() {
    // Récupérer les éléments du DOM
    this.form = document.querySelector('.form');
    this.inputType = document.querySelector('.form__input--type');
    this.inputNom = document.querySelector('.form__input--nom');
    this.inputDescription = document.querySelector('.form__input--description');
    this.champUnique = document.querySelector('.form__input--capacite');
    this.locationsList = document.getElementById('locations-list');
    
    // Initialiser la carte
    this._getPosition();
    this._getLocalStorage();
    
    // Event listeners
    // Permet d'accéder aux propriétés de la classe dans le gestionnaire d'événements 
    // bind(this) permet de lier la fonction à l'instance de la classe 
    // this._newEtablissement est une méthode de la classe App
  
    this.form.addEventListener('submit', this._newEtablissement.bind(this));

    // Ajouter les event listeners pour import/export
    document.getElementById('export-locations').addEventListener('click', this._exportLocations.bind(this));
    document.getElementById('import-file').addEventListener('change', this._importLocations.bind(this));

    // Sélectionner le bouton d'annulation
    const cancelButton = document.querySelector('.form__btn--cancel');
    const form = document.querySelector('.form');

    // Ajouter un écouteur d'événement sur le bouton d'annulation
    cancelButton.addEventListener('click', (e) => {
      e.preventDefault();
      this._hideForm();
    });

    // Ajouter l'écouteur d'événement pour le bouton "Ma position"
    document.getElementById('locate-me').addEventListener('click', this._locateMe.bind(this));

    // Ajouter les écouteurs d'événements pour la recherche et les filtres
    document.getElementById('search-input').addEventListener('input', this._filterLocations.bind(this));
    document.getElementById('filter-type').addEventListener('change', this._filterLocations.bind(this));
    document.getElementById('filter-rating').addEventListener('change', this._filterLocations.bind(this));

    // Ajouter un conteneur pour les notifications
    this.notifContainer = document.createElement('div');
    this.notifContainer.className = 'notification-container';
    document.body.appendChild(this.notifContainer);

    // Ajouter la validation en temps réel
    this.inputNom.addEventListener('input', this._validateInput.bind(this));
    this.inputDescription.addEventListener('input', this._validateInput.bind(this));

    // Gestionnaires pour le modal
    document.querySelector('.modal-close').addEventListener('click', this._hideForm.bind(this));
    document.querySelector('.modal-overlay').addEventListener('click', this._hideForm.bind(this));
    document.querySelector('.modal-form').addEventListener('submit', this._newEtablissement.bind(this));
    document.querySelector('.modal-form .form__btn--cancel').addEventListener('click', this._hideForm.bind(this));

    // Ajouter l'écouteur pour le changement de style de carte
    document.getElementById('map-style').addEventListener('change', this._changeMapStyle.bind(this));


    // Appeler la fonction au chargement pour initialiser l'affichage
    document.addEventListener('DOMContentLoaded', () => {
        toggleSpecificFields();
    });

    // Pour le modal également
    const modalTypeSelect = document.querySelector('.modal-form .form__input--type');
    if (modalTypeSelect) {
        modalTypeSelect.addEventListener('change', function() {
            // Cacher tous les champs spécifiques du modal
            const allModalSpecificFields = document.querySelectorAll('.modal-form .form__group--universite, .modal-form .form__group--ecole, .modal-form .form__group--hopital, .modal-form .form__group--bibliotheque');
            allModalSpecificFields.forEach(field => field.classList.add('hidden'));
            
            // Afficher les champs spécifiques pour le type sélectionné
            const selectedType = this.value;
            const specificFields = document.querySelector(`.modal-form .form__group--${selectedType}`);
            if (specificFields) {
                specificFields.classList.remove('hidden');
            }
        });
    }

    // Modifier la structure du header de la liste
    const listHeader = document.querySelector('.list-header');
    listHeader.innerHTML = `
        <div class="list-header-content">
            <h3>Liste des établissements</h3>
            <button class="btn-clear-all" title="Vider la liste">
                <i class="fas fa-trash-alt" style="color: #e74c3c;"></i>
            </button>
        </div>
    `;

    // Ajouter l'écouteur d'événements pour le bouton de suppression
    const clearAllBtn = listHeader.querySelector('.btn-clear-all');
    clearAllBtn.addEventListener('click', this._clearAllEtablissements.bind(this));

    // Ajouter un écouteur d'événements sur le bouton de suppression
    document.querySelector('.clear-list-btn').addEventListener('click', function() {
        // Afficher une notification de confirmation
        showConfirmationNotification({
            message: "Êtes-vous sûr de vouloir supprimer tous les établissements ?",
            onConfirm: clearAllLocations,
            type: 'warning'
        });
    });

    // Fonction pour supprimer tous les établissements
    function clearAllLocations() {
        try {
            // Vider le stockage local
            localStorage.removeItem('locations');
            
            // Vider la liste des marqueurs sur la carte
            markers.forEach(marker => map.removeLayer(marker));
            markers = [];
            
            // Vider la liste des établissements dans le DOM
            document.getElementById('locations-list').innerHTML = '';
            
            // Afficher une notification de succès
            showNotification({
                message: "Tous les établissements ont été supprimés avec succès",
                type: 'success'
            });
            
        } catch (error) {
            // En cas d'erreur, afficher une notification d'erreur
            showNotification({
                message: "Une erreur est survenue lors de la suppression",
                type: 'error'
            });
            console.error('Erreur lors de la suppression :', error);
        }
    }

    // Fonction pour afficher une notification de confirmation
    function showConfirmationNotification({ message, onConfirm, type = 'warning' }) {
        const notificationHtml = `
            <div class="notification notification--${type}">
                <div class="notification__content">
                    <i class="notification__icon fas fa-exclamation-triangle"></i>
                    <p class="notification__message">${message}</p>
                </div>
                <div class="notification__actions">
                    <button class="notification__btn notification__btn--confirm">Confirmer</button>
                    <button class="notification__btn notification__btn--cancel">Annuler</button>
                </div>
            </div>
        `;

        const notificationContainer = document.querySelector('.notification-container');
        notificationContainer.insertAdjacentHTML('beforeend', notificationHtml);

        const notification = notificationContainer.lastElementChild;
        
        // Ajouter la classe show après un court délai pour l'animation
        setTimeout(() => notification.classList.add('show'), 10);

        // Gérer les boutons de confirmation
        notification.querySelector('.notification__btn--confirm').addEventListener('click', () => {
            onConfirm();
            removeNotification(notification);
        });

        notification.querySelector('.notification__btn--cancel').addEventListener('click', () => {
            removeNotification(notification);
        });
    }

    // Fonction pour supprimer une notification
    function removeNotification(notification) {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }
  }

  _getPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function() {
          alert('Impossible d\'obtenir votre position!');
        }
      );
    }
  }

  _loadMap(position) {
    const { latitude, longitude } = position.coords;
    const coords = [latitude, longitude];

    this.#map = L.map('map').setView(coords, this.#mapZoomLevel);

    // Définir les styles de carte disponibles
    this.#mapStyles = {
      streets: {
        url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      },
      satellite: {
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        attribution: '&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
      },
      terrain: {
        url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>'
      },
      dark: {
        url: 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png',
        attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
      }
    };

    // Initialiser avec le style par défaut
    this.#currentTileLayer = L.tileLayer(this.#mapStyles.streets.url, {
      attribution: this.#mapStyles.streets.attribution
    }).addTo(this.#map);

    // Ajouter l'écouteur d'événements pour le changement de style
    document.getElementById('map-style').addEventListener('change', (e) => {
      const style = e.target.value;
      if (this.#currentTileLayer) {
        this.#map.removeLayer(this.#currentTileLayer);
      }
      this.#currentTileLayer = L.tileLayer(this.#mapStyles[style].url, {
        attribution: this.#mapStyles[style].attribution
      }).addTo(this.#map);
    });

    // Gestionnaire de clic sur la carte
    this.#map.on('click', this._showForm.bind(this));

    // Afficher les établissements existants
    this.#etablissements.forEach(etab => {
      this._renderEtablissementMarker(etab);
      this._renderLocationItem(etab);
    });
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;
    
    // Ajouter la classe form-active à la sidebar
    document.querySelector('.sidebar').classList.add('form-active');
    
    if (window.innerWidth <= 900) {
        document.querySelector('.modal-overlay').classList.add('active');
        document.querySelector('.modal-container').classList.add('active');
        document.querySelector('.modal-form .form__input--nom').focus();
    } else {
        this.form.classList.remove('hidden');
        this.form.classList.add('active');
        this.inputNom.focus();
    }
  }

  _hideForm() {
    // Retirer la classe form-active de la sidebar
    document.querySelector('.sidebar').classList.remove('form-active');
    
    if (window.innerWidth <= 900) {
        document.querySelector('.modal-overlay').classList.remove('active');
        document.querySelector('.modal-container').classList.remove('active');
        document.querySelector('.modal-form').reset();
    } else {
        this.form.classList.add('hidden');
        this.form.classList.remove('active');
        this.form.reset();
    }

    // Réinitialiser les erreurs
    const inputs = document.querySelectorAll('.form__input');
    inputs.forEach(input => {
        input.classList.remove('invalid');
        const errorElement = input.parentElement.querySelector('.form__error');
        if (errorElement) errorElement.textContent = '';
    });
  }

  _newEtablissement(e) {
    e.preventDefault();
    
    // Valider tous les champs requis
    const nomValid = this._validateInput({ target: this.inputNom });
    const descriptionValid = this._validateInput({ target: this.inputDescription });

    if (!nomValid || !descriptionValid) {
      return;
    }

    // Récupérer les coordonnées du clic
    const { lat, lng } = this.#mapEvent.latlng;
    
    // Récupérer les valeurs du formulaire
    const type = this.inputType.value;
    const nom = this.inputNom.value;
    const description = this.inputDescription.value;
    const champUnique = this.champUnique.value;
    const quartier = document.querySelector('.form__input--quartier').value;

    // Vérifier que les champs sont remplis
    if (!nom || !description) {
      this._showNotification('Veuillez remplir tous les champs', 'error');
      return;
    }

    let etablissement;

    // Créer le bon type d'établissement
    switch(type) {
      case 'universite':
        etablissement = new Universite([lat, lng], nom, description, champUnique);
        console.log(champUnique);
        
        break;
      case 'ecole':
        etablissement = new Ecole([lat, lng], nom, description, 0);
        break;
      case 'hopital':
        etablissement = new Hopital([lat, lng], nom, description, 0);
        break;
      case 'bibliotheque':
        etablissement = new Bibliotheque([lat, lng], nom, description, 0);
        break;
      default:
        return;
    }

    // Ajouter le quartier à l'établissement
    etablissement.quartier = quartier;

    // Ajouter le nouvel établissement
    this.#etablissements.push(etablissement);
    
    // Afficher l'établissement
    this._renderEtablissementMarker(etablissement);
    this._renderLocationItem(etablissement);
    
    // Nettoyer l'interface
    this._hideForm();
    this._setLocalStorage();

    // Afficher la notification de succès
    this._showNotification(`${this._formatType(type)} "${nom}" ajouté avec succès dans ${quartier}`, 'success');
  }

  _renderEtablissementMarker(etablissement) {
    const bgColor = this._getRandomColor();
    const initials = this._getInitials(etablissement.nom);
    
    const marker = L.marker(etablissement.coords, {
      icon: this.#icons[etablissement.type]
    })
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: true,
          closeOnClick: true,
          className: `${etablissement.type}-popup`,
        })
      )
      .setPopupContent(
        `<div class="popup-content">
          <div class="popup-initials" style="background-color: ${bgColor}">
            ${initials}
          </div>
          <div class="popup-info">
            <h3>${this._getIconForType(etablissement.type)} ${etablissement.nom}</h3>
            <p class="popup-type"><strong>${this._formatType(etablissement.type)}</strong></p>
            <p class="popup-description">${etablissement.description}</p>
          </div>
        </div>`
      );

    marker.on('mouseover', function() {
      this.openPopup();
    });

    marker.on('mouseout', function() {
      this.closePopup();
    });

    marker.on('click', () => {
      this._showLocationDetails(etablissement);
    });

    marker.bgColor = bgColor;
    this.#markers[etablissement.id] = marker;
  }

  _renderLocationItem(etablissement) {
    const html = `
      <div class="location-item" data-id="${etablissement.id}" data-type="${etablissement.type}">
        <h3>${etablissement.nom}</h3>
        <p class="location-type">
          ${this._getIconForType(etablissement.type)} ${this._formatType(etablissement.type)}
        </p>
        <p class="location-quartier"><i class="fas fa-map-marker-alt" style="color: #666;"></i> ${etablissement.quartier}</p>
        <p class="location-description">${etablissement.description}</p>
      </div>
    `;
    this.locationsList.insertAdjacentHTML('beforeend', html);

    // Ajouter l'écouteur d'événements pour le clic sur l'élément de la liste
    const locationItem = this.locationsList.querySelector(`.location-item[data-id="${etablissement.id}"]`);
    locationItem.addEventListener('click', () => {
      // Centrer la carte sur l'établissement
      this.#map.setView(etablissement.coords, 16);
      
      // Ouvrir le popup du marker
      const marker = this.#markers[etablissement.id];
      marker.openPopup();
      
      // Afficher les détails dans la sidebar
      this._showLocationDetails(etablissement);
    });
  }

  _setLocalStorage() {
    localStorage.setItem('etablissements', JSON.stringify(this.#etablissements));
  }

  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem('etablissements'));
    if (!data) return;

    this.#etablissements = data;
  }

  reset() {
    localStorage.removeItem('etablissements');
    location.reload();
  }

  _getIconForType(type) {
    const iconColors = {
      universite: '#3498db',    // Bleu
      ecole: '#2ecc71',        // Vert
      hopital: '#e74c3c',      // Rouge
      bibliotheque: '#f1c40f'  // Jaune
    };

    const icons = {
      universite: `<i class="fas fa-graduation-cap" style="color: ${iconColors.universite};"></i>`,
      ecole: `<i class="fas fa-school" style="color: ${iconColors.ecole};"></i>`,
      hopital: `<i class="fas fa-hospital" style="color: ${iconColors.hopital};"></i>`,
      bibliotheque: `<i class="fas fa-book-reader" style="color: ${iconColors.bibliotheque};"></i>`
    };
    return icons[type] || '<i class="fas fa-map-marker-alt" style="color: #666;"></i>';
  }

  _formatType(type) {
    const types = {
      universite: 'Université',
      ecole: 'École',
      hopital: 'Hôpital',
      bibliotheque: 'Bibliothèque'
    };
    return types[type] || type;
  }

  _exportLocations() {
    try {
        // Vérifier s'il y a des établissements à exporter
        if (this.#etablissements.length === 0) {
            this._showNotification('Aucun établissement à exporter', 'info');
            return;
        }

        // Créer le fichier JSON
        const data = JSON.stringify(this.#etablissements, null, 2);
        // Créer un objet contenant les données à exporter
        // Convertir les données en chaîne JSON formatée avec indentation
        // Créer un blob avec les données pour le téléchargement
        const blob = new Blob([data], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        
        // Créer un lien temporaire pour le téléchargement
        const a = document.createElement('a');
        a.href = url;
        a.download = `etablissements_${new Date().toISOString().split('T')[0]}.json`;
        
        // Déclencher le téléchargement
        document.body.appendChild(a);
        a.click();
        
        // Nettoyer
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        // Afficher la notification de succès
        this._showNotification(`${this.#etablissements.length} établissements exportés avec succès`, 'success');
    } catch (err) {
        this._showNotification('Erreur lors de l\'export des données', 'error');
        console.error('Erreur export:', err);
    }
  }

  _importLocations(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Créer un lecteur de fichier pour lire le contenu du fichier
    // utiliser FileReader pour lire le contenu du fichier
    const reader = new FileReader();
    
    reader.onload = (event) => {
        try {
            const data = JSON.parse(event.target.result);
            
            // Vérifier si les données sont valides
            if (!Array.isArray(data)) {
                throw new Error('Format de fichier invalide');
            }

            // Nettoyer la carte et la liste actuelles
            this._clearAllLocations();

            // Convertir les objets simples en instances de classes
            this.#etablissements = data.map(item => {
                let etablissement;
                switch(item.type) {
                    case 'universite':
                        etablissement = new Universite(item.coords, item.nom, item.description, item.nombreEtudiants);
                        break;
                    case 'ecole':
                        etablissement = new Ecole(item.coords, item.nom, item.description, item.nombreEleves);
                        break;
                    case 'hopital':
                        etablissement = new Hopital(item.coords, item.nom, item.description, item.nombreLits);
                        break;
                    case 'bibliotheque':
                        etablissement = new Bibliotheque(item.coords, item.nom, item.description, item.nombreLivres);
                        break;
                    default:
                        return null;
                }
                etablissement.id = item.id;
                etablissement.date = new Date(item.date);
                etablissement.quartier = item.quartier;
                return etablissement;
            }).filter(item => item !== null);

            // Afficher les établissements importés
            this.#etablissements.forEach(etab => {
                this._renderEtablissementMarker(etab);
                this._renderLocationItem(etab);
            });

            // Sauvegarder dans le localStorage
            this._setLocalStorage();

            this._showNotification(`${this.#etablissements.length} établissements importés avec succès`, 'success');
        } catch (err) {
            this._showNotification('Erreur : Le fichier importé n\'est pas valide', 'error');
            console.error('Erreur import:', err);
        }
    };

    reader.readAsText(file);
    
    // Réinitialiser l'input file pour permettre de réimporter le même fichier
    e.target.value = '';
  }

  _clearAllLocations() {
    // Nettoyer les marqueurs de la carte
    Object.values(this.#markers).forEach(marker => {
      this.#map.removeLayer(marker);
    });
    this.#markers = {};

    // Nettoyer la liste des établissements
    this.locationsList.innerHTML = '';
  }

  _showLocationDetails(etablissement) {
    // Cacher les boutons d'action
    const actionButtons = document.querySelector('.action-buttons');
    const mapStyleContainer = document.querySelector('.map-style-container');
    if (actionButtons) actionButtons.style.display = 'none';
    if (mapStyleContainer) mapStyleContainer.style.display = 'none';

    // Masquer le bouton de corbeille lors de l'affichage des détails
    const listHeaderContent = document.querySelector('.list-header-content');
    if (listHeaderContent) {
        listHeaderContent.innerHTML = `<h3>Détail de l'établissement</h3>`;
    }

    // Changer le titre de la section
    const listHeader = document.querySelector('.list-header h3');
    if (listHeader) listHeader.textContent = "Détail de l'établissement";

    // Créer le HTML pour les détails
    const detailsHtml = `
        <div class="location-details" data-id="${etablissement.id}">
            <button class="btn-back"><i class="fas fa-arrow-left" style="color: #666;"></i> Retour à la liste</button>
            <h3>${etablissement.nom}</h3>
            <p class="location-type">
                ${this._getIconForType(etablissement.type)} ${this._formatType(etablissement.type)}
            </p>
            <p class="location-quartier"><i class="fas fa-map-marker-alt" style="color: #666;"></i> ${etablissement.quartier || 'Aucun quartier spécifié'}</p>
            <p class="location-description">${etablissement.description}</p>
            <p class="location-date"><i class="far fa-calendar-alt" style="color: #666;"></i> ${etablissement.dateDescription}</p>
            <div class="location-actions">
                <button class="btn-edit"><i class="fas fa-edit" style="color: #3498db;"></i> Modifier</button>
                <button class="btn-delete"><i class="fas fa-trash-alt" style="color: #e74c3c;"></i> Supprimer</button>
            </div>
        </div>
    `;

    // Remplacer le contenu de la liste par les détails
    this.locationsList.innerHTML = detailsHtml;

    // Ajouter les écouteurs d'événements pour les boutons
    const btnBack = this.locationsList.querySelector('.btn-back');
    const btnEdit = this.locationsList.querySelector('.btn-edit');
    const btnDelete = this.locationsList.querySelector('.btn-delete');

    btnBack.addEventListener('click', () => {
        // Restaurer le header original avec le bouton de corbeille
        if (listHeaderContent) {
            listHeaderContent.innerHTML = `
                <h3>Liste des établissements</h3>
                <button class="btn-clear-all" title="Vider la liste">
                    <i class="fas fa-trash-alt" style="color: #e74c3c;"></i>
                </button>
            `;
            // Réattacher l'écouteur d'événements
            const clearAllBtn = listHeaderContent.querySelector('.btn-clear-all');
            clearAllBtn.addEventListener('click', this._clearAllEtablissements.bind(this));
        }

        // Réafficher les boutons d'action
        if (actionButtons) actionButtons.style.display = 'grid';
        if (mapStyleContainer) mapStyleContainer.style.display = 'block';
        
        // Restaurer le titre original
        if (listHeader) listHeader.textContent = "Liste des établissements";
        
        // Vider le contenu actuel
        this.locationsList.innerHTML = '';
        // Recréer la liste complète
        this.#etablissements.forEach(etab => {
            this._renderLocationItem(etab);
        });
        // Réinitialiser le zoom de la carte
        this.#map.setView(this.#map.getCenter(), this.#mapZoomLevel);
    });

    // Ajouter les gestionnaires pour édition et suppression
    btnEdit.addEventListener('click', () => {
        this._editLocation(etablissement);
    });

    btnDelete.addEventListener('click', () => {
        this._deleteLocation(etablissement);
    });
  }

  _editLocation(etablissement) {
    const isMobile = window.innerWidth <= 900;
    const form = isMobile ? document.querySelector('.modal-form') : this.form;
    const inputType = form.querySelector('.form__input--type');
    const inputNom = form.querySelector('.form__input--nom');
    const inputDescription = form.querySelector('.form__input--description');
    const inputQuartier = form.querySelector('.form__input--quartier');

    if (isMobile) {
        document.querySelector('.modal-overlay').classList.add('active');
        document.querySelector('.modal-container').classList.add('active');
    } else {
        form.classList.remove('hidden');
        form.classList.add('active');
    }
    
    // Pré-remplir le formulaire
    inputType.value = etablissement.type;
    inputNom.value = etablissement.nom;
    inputDescription.value = etablissement.description;
    inputQuartier.value = etablissement.quartier || '';

    // Stocker l'ID de l'établissement en cours d'édition
    form.dataset.editId = etablissement.id;

    // Modifier le gestionnaire de soumission du formulaire
    const submitHandler = (e) => {
        e.preventDefault();
        
        // Mettre à jour l'établissement
        const index = this.#etablissements.findIndex(e => e.id === etablissement.id);
        if (index !== -1) {
            const updatedEtablissement = this.#etablissements[index];
            updatedEtablissement.type = inputType.value;
            updatedEtablissement.nom = inputNom.value;
            updatedEtablissement.description = inputDescription.value;
            updatedEtablissement.quartier = inputQuartier.value;

            // Mettre à jour le marker
            const marker = this.#markers[etablissement.id];
            if (marker) {
                const initials = this._getInitials(updatedEtablissement.nom);
                marker.setIcon(this.#icons[updatedEtablissement.type]);
                marker.setPopupContent(
                    `<div class="popup-content">
                        <div class="popup-initials" style="background-color: ${marker.bgColor}">
                            ${initials}
                        </div>
                        <div class="popup-info">
                            <h3>${this._getIconForType(updatedEtablissement.type)} ${updatedEtablissement.nom}</h3>
                            <p class="popup-type"><strong>${this._formatType(updatedEtablissement.type)}</strong></p>
                            <p class="popup-description">${updatedEtablissement.description}</p>
                        </div>
                    </div>`
                );
            }

            this._setLocalStorage();
            this._showNotification('Établissement modifié avec succès', 'success');
            this._showLocationDetails(updatedEtablissement);
        }

        // Nettoyer le formulaire
        this._hideForm();
        delete form.dataset.editId;
        
        // Retirer le gestionnaire d'événements temporaire
        form.removeEventListener('submit', submitHandler);
    };

    // Ajouter le nouveau gestionnaire
    form.addEventListener('submit', submitHandler);
  }

  _deleteLocation(etablissement) {
    // Créer un popup de confirmation personnalisé
    const confirmDialog = document.createElement('div');
    confirmDialog.className = 'notification notification--warning';
    confirmDialog.innerHTML = `
      <div class="notification__content">
        <span class="notification__icon"><i class="fas fa-exclamation-triangle" style="color: #f1c40f;"></i></span>
        <p class="notification__message">Voulez-vous vraiment supprimer "${etablissement.nom}" ?</p>
      </div>
      <div class="notification__actions">
        <button class="notification__btn notification__btn--confirm"><i class="fas fa-trash-alt" style="color: #e74c3c;"></i> Supprimer</button>
        <button class="notification__btn notification__btn--cancel"><i class="fas fa-times" style="color: #666;"></i> Annuler</button>
      </div>
    `;

    this.notifContainer.appendChild(confirmDialog);
    setTimeout(() => confirmDialog.classList.add('show'), 10);

    // Gérer les actions de confirmation
    const confirmBtn = confirmDialog.querySelector('.notification__btn--confirm');
    const cancelBtn = confirmDialog.querySelector('.notification__btn--cancel');

    confirmBtn.addEventListener('click', () => {
      // Supprimer l'établissement du tableau
      this.#etablissements = this.#etablissements.filter(e => e.id !== etablissement.id);
      
      // Supprimer le marker de la carte
      const marker = this.#markers[etablissement.id];
      this.#map.removeLayer(marker);
      delete this.#markers[etablissement.id];
      
      // Vider l'affichage des détails et retourner à la liste
      this.locationsList.innerHTML = '';
      this.#etablissements.forEach(etab => {
        this._renderLocationItem(etab);
      });
      
      // Sauvegarder dans le localStorage
      this._setLocalStorage();

      // Afficher une notification de succès
      this._showNotification('Établissement supprimé avec succès', 'success');

      // Fermer le dialog
      confirmDialog.classList.remove('show');
      setTimeout(() => confirmDialog.remove(), 300);
    });

    cancelBtn.addEventListener('click', () => {
      confirmDialog.classList.remove('show');
      setTimeout(() => confirmDialog.remove(), 300);
    });
  }

  _locateMe() {
    if (navigator.geolocation) {
      // Afficher le spinner
      const spinnerContainer = document.querySelector('.spinner-container');
      spinnerContainer.classList.remove('hidden');

      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          
          // Centrer la carte sur la position de l'utilisateur
          this.#map.setView([latitude, longitude], 15);
          
          // Créer un cercle pour montrer la zone approximative
          const accuracyCircle = L.circle([latitude, longitude], {
            radius: position.coords.accuracy / 2,
            color: '#4285f4',
            fillColor: '#4285f4',
            fillOpacity: 0.2
          }).addTo(this.#map);
          
          // Ajouter un marqueur pour la position de l'utilisateur
          const userMarker = L.marker([latitude, longitude], {
            icon: L.divIcon({
              className: 'user-location-marker',
              html: `
                <div class="pulse-marker">
                  <div class="pulse-core"></div>
                </div>
              `,
              iconSize: [20, 20],
              iconAnchor: [10, 10]
            })
          }).addTo(this.#map);
          
          // Créer un popup 
          
          const popupContent = `
            <div class="user-popup">
              <div class="user-popup-header">
                <div class="user-popup-icon">📍</div>
                <h3>Votre position</h3>
              </div>
              <div class="user-popup-content">
                <p>Latitude: ${latitude.toFixed(6)}</p>
                <p>Longitude: ${longitude.toFixed(6)}</p>
                <p class="accuracy">Précision: ${(position.coords.accuracy).toFixed(0)}m</p>
              </div>
            </div>
          `;
          
          userMarker.bindPopup(popupContent, {
            className: 'user-location-popup',
            closeButton: false
          }).openPopup();
          
          // Cacher le spinner
          spinnerContainer.classList.add('hidden');
          
          // Supprimer le marqueur et le cercle après 10 secondes
          setTimeout(() => {
            this.#map.removeLayer(userMarker);
            this.#map.removeLayer(accuracyCircle);
          }, 10000);
        },
        error => {
          // Cacher le spinner en cas d'erreur
          spinnerContainer.classList.add('hidden');
          this._showNotification('Impossible d\'obtenir votre position. ' + error.message, 'error');
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      this._showNotification('La géolocalisation n\'est pas supportée par votre navigateur.', 'info');
    }
  }

  _filterLocations() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const typeFilter = document.getElementById('filter-type').value;
    const quartierFilter = document.getElementById('filter-rating').value;

    // Filtrer les établissements
    this.#etablissements.forEach(etab => {
      const marker = this.#markers[etab.id];
      const locationItem = document.querySelector(`.location-item[data-id="${etab.id}"]`);
      
      // Vérifier si l'établissement correspond aux critères de recherche
      const matchesSearch = etab.nom.toLowerCase().includes(searchTerm) || 
                          etab.description.toLowerCase().includes(searchTerm);
      const matchesType = typeFilter === 'all' || etab.type === typeFilter;
      const matchesQuartier = quartierFilter === 'all' || etab.quartier === quartierFilter;

      // Afficher ou masquer selon les filtres
      if (matchesSearch && matchesType && matchesQuartier) {
        marker.addTo(this.#map);
        if (locationItem) locationItem.style.display = 'block';
      } else {
        this.#map.removeLayer(marker);
        if (locationItem) locationItem.style.display = 'none';
      }
    });
  }


  _getRandomColor() {
    return this.#colors[Math.floor(Math.random() * this.#colors.length)];
  }

  // Obtient les initiales d'un nom en prenant la première lettre de chaque mot
  // et en les combinant (maximum 2 lettres)
  // Exemple: "John Doe" -> "JD"
  _getInitials(name) {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }

  _showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    
    const iconColors = {
        success: '#2ecc71',  // Vert
        error: '#e74c3c',    // Rouge
        info: '#3498db'      // Bleu
    };
    
    const icon = type === 'success' ? `<i class="fas fa-check-circle" style="color: ${iconColors.success};"></i>` : 
                type === 'error' ? `<i class="fas fa-exclamation-circle" style="color: ${iconColors.error};"></i>` : 
                `<i class="fas fa-info-circle" style="color: ${iconColors.info};"></i>`;
    
    notification.innerHTML = `
      <div class="notification__content">
        <span class="notification__icon">${icon}</span>
        <p class="notification__message">${message}</p>
      </div>
      <button class="notification__close"><i class="fas fa-times" style="color: #666;"></i></button>
    `;

    this.notifContainer.appendChild(notification);

    // Ajouter l'animation d'entrée
    setTimeout(() => notification.classList.add('show'), 10);

    // Gérer le bouton de fermeture
    const closeBtn = notification.querySelector('.notification__close');
    closeBtn.addEventListener('click', () => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    });

    // Auto-fermeture après 5 secondes
    setTimeout(() => {
      if (notification.parentElement) {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
      }
    }, 5000);
  }

  _validateInput(e) {
    const input = e.target;
    const errorElement = input.parentElement.querySelector('.form__error');
    
    if (input.value.trim() === '') {
      input.classList.add('invalid');
      errorElement.textContent = `Le champ ${input.placeholder} est requis`;
      return false;
    } else {
      input.classList.remove('invalid');
      errorElement.textContent = '';
      return true;
    }
  }

  _changeMapStyle(e) {
    const style = e.target.value;
    
    // Retirer la couche actuelle
    if (this.#currentTileLayer) {
      this.#map.removeLayer(this.#currentTileLayer);
    }

    // Ajouter la nouvelle couche
    this.#currentTileLayer = L.tileLayer(this.#mapStyles[style], {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.#map);

    // Ajuster les attributions selon le style
    if (style === 'satellite') {
      this.#currentTileLayer.options.attribution = '&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';
    } else if (style === 'terrain') {
      this.#currentTileLayer.options.attribution = 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>';
    } else if (style === 'dark') {
      this.#currentTileLayer.options.attribution = '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
    }
  }

  _clearAllEtablissements() {
    if (this.#etablissements.length === 0) {
        this._showNotification('Aucun établissement à supprimer', 'info');
        return;
    }

    // Créer un popup de confirmation personnalisé
    const confirmDialog = document.createElement('div');
    confirmDialog.className = 'notification notification--warning';
    confirmDialog.innerHTML = `
      <div class="notification__content">
        <span class="notification__icon"><i class="fas fa-exclamation-triangle" style="color: #f1c40f;"></i></span>
        <p class="notification__message">Voulez-vous vraiment supprimer tous les établissements ?</p>
        <p class="notification__submessage" style="font-size: 0.9em; color: #666;">Cette action est irréversible.</p>
      </div>
      <div class="notification__actions">
        <button class="notification__btn notification__btn--confirm"><i class="fas fa-trash-alt" style="color: #e74c3c;"></i> Tout supprimer</button>
        <button class="notification__btn notification__btn--cancel"><i class="fas fa-times" style="color: #666;"></i> Annuler</button>
      </div>
    `;

    this.notifContainer.appendChild(confirmDialog);
    setTimeout(() => confirmDialog.classList.add('show'), 10);

    // Gérer les actions de confirmation
    const confirmBtn = confirmDialog.querySelector('.notification__btn--confirm');
    const cancelBtn = confirmDialog.querySelector('.notification__btn--cancel');

    confirmBtn.addEventListener('click', () => {
        // Supprimer tous les markers de la carte
        Object.values(this.#markers).forEach(marker => {
            this.#map.removeLayer(marker);
        });

        // Réinitialiser les tableaux et objets
        this.#etablissements = [];
        this.#markers = {};

        // Vider la liste
        this.locationsList.innerHTML = '';

        // Sauvegarder dans le localStorage
        this._setLocalStorage();

        // Afficher une notification de succès
        this._showNotification('Tous les établissements ont été supprimés', 'success');

        // Fermer le dialog
        confirmDialog.classList.remove('show');
        setTimeout(() => confirmDialog.remove(), 300);
    });

    cancelBtn.addEventListener('click', () => {
        confirmDialog.classList.remove('show');
        setTimeout(() => confirmDialog.remove(), 300);
    });
  }
}

const app = new App();
