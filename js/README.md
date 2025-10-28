# 📁 Structure des Modules JavaScript

Ce dossier contient tous les modules JavaScript de l'application Pokédex, organisés de manière modulaire pour une meilleure lisibilité et maintenabilité.

## 📂 Organisation des fichiers

### `config.js` - Configuration et constantes
- **Rôle** : Centralise toutes les constantes et variables d'état de l'application
- **Contenu** :
  - URL de l'API Pokémon
  - Variables d'état globales (pokémon chargés, filtres, favoris, équipe, etc.)
  - Références aux éléments DOM

### `theme.js` - Gestion du thème
- **Rôle** : Gère le basculement entre thème clair et sombre
- **Fonctions principales** :
  - `initialiserTheme()` : Charge le thème depuis localStorage
  - `basculerTheme()` : Change le thème et le sauvegarde

### `storage.js` - Gestion du localStorage
- **Rôle** : Centralise toutes les opérations de sauvegarde/chargement
- **Fonctions principales** :
  - `chargerDonneesLocales()` : Charge favoris, équipe et pokémon personnalisés
  - `sauvegarderFavoris()`, `sauvegarderEquipe()`, `sauvegarderPersonnalises()`

### `utils.js` - Fonctions utilitaires
- **Rôle** : Contient les fonctions helper réutilisables
- **Fonctions principales** :
  - `afficherChargement()`, `cacherChargement()` : Indicateur de chargement
  - `obtenirCouleurType()` : Retourne la couleur d'un type
  - `obtenirNomType()`, `obtenirNomStat()` : Traductions français

### `api.js` - Communication avec PokeAPI
- **Rôle** : Gère tous les appels à l'API Pokémon
- **Fonctions principales** :
  - `chargerPokemon()` : Charge les pokémon par page
  - `recupererDetailsPokemon()` : Récupère les détails d'un pokémon
  - `chargerPlusDePokemon()` : Pagination

### `cartes.js` - Affichage des cartes
- **Rôle** : Crée et affiche les cartes pokémon dans la grille
- **Fonctions principales** :
  - `afficherPokemon()` : Affiche une liste de pokémon
  - `creerCartePokemon()` : Génère le HTML d'une carte
  - `montrerDetailsPokemon()` : Ouvre les détails

### `modale.js` - Gestion des modales
- **Rôle** : Affiche les détails des pokémon dans une modale
- **Fonctions principales** :
  - `ouvrirModale()`, `fermerModale()` : Contrôle de la modale
  - `afficherDetailsPokemon()` : Pour les pokémon de l'API
  - `afficherDetailsPokemonPersonnalise()` : Pour les pokémon créés

### `equipe.js` - Gestion de l'équipe
- **Rôle** : Gère l'équipe de 6 pokémon maximum
- **Fonctions principales** :
  - `ajouterAEquipe()`, `retirerDeEquipe()` : Modification de l'équipe
  - `afficherPanneauEquipe()` : Affiche le panneau latéral
  - `mettreAJourCompteurEquipe()` : Met à jour le badge

### `favoris.js` - Gestion des favoris
- **Rôle** : Gère les pokémon favoris
- **Fonctions principales** :
  - `basculerFavori()` : Ajoute/retire des favoris

### `recherche.js` - Recherche et filtrage
- **Rôle** : Implémente la recherche et les filtres par type
- **Fonctions principales** :
  - `gererRecherche()` : Recherche par nom ou ID
  - `gererFiltreType()` : Filtre par type de pokémon

### `creation.js` - Création de pokémon personnalisés
- **Rôle** : Gère le formulaire de création avec validation
- **Fonctions principales** :
  - `ouvrirModaleCreation()`, `fermerModaleCreation()` : Contrôle du formulaire
  - `validerNom()`, `validerType()`, etc. : Validation en temps réel
  - `gererSoumissionFormulaire()` : Crée le pokémon personnalisé
  - `gererSelectionImage()` : Gestion de l'upload d'image

### `main.js` - Point d'entrée principal
- **Rôle** : Orchestre l'initialisation de toute l'application
- **Responsabilités** :
  - Initialisation au chargement du DOM
  - Configuration de tous les écouteurs d'événements
  - Coordination des différents modules

## 🔄 Flux d'exécution

```
1. index.html charge main.js (type="module")
2. main.js importe tous les modules nécessaires
3. Au DOMContentLoaded :
   - Initialise le thème
   - Charge les données locales
   - Configure les écouteurs
   - Charge les pokémon
```

## 🎯 Avantages de cette architecture

- ✅ **Séparation des responsabilités** : Chaque module a un rôle clair
- ✅ **Réutilisabilité** : Les fonctions sont facilement réutilisables
- ✅ **Maintenabilité** : Plus facile de trouver et modifier du code
- ✅ **Testabilité** : Chaque module peut être testé indépendamment
- ✅ **Lisibilité** : Code mieux organisé et documenté
- ✅ **Performance** : Modules ES6 natifs avec tree-shaking possible

## 📝 Convention de nommage

- **Fichiers** : minuscules avec tirets (ex: `config.js`)
- **Fonctions** : camelCase (ex: `chargerPokemon()`)
- **Constantes** : MAJUSCULES_AVEC_UNDERSCORES (ex: `URL_BASE_API`)
- **Variables d'état** : camelCase dans l'objet `etat`
