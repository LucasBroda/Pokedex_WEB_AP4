// Configuration de l'API
export const URL_BASE_API = 'https://pokeapi.co/api/v2';
export const NOMBRE_POKEMON_PAR_PAGE = 20;

// État de l'application
export const etat = {
    decalageActuel: 0,
    tousLesPokemon: [],
    pokemonFiltres: [],
    typeSelectionne: '',
    pokemonFavoris: [],
    equipePokemon: [],
    pokemonPersonnalises: [],
    prochainIdPersonnalise: 10000
};

// Éléments DOM
export const dom = {
    grillePokemon: document.getElementById('grillePokemon'),
    chargement: document.getElementById('chargement'),
    modale: document.getElementById('modale'),
    corpsModale: document.getElementById('corpsModale'),
    boutonFermer: document.querySelector('.bouton-fermer'),
    champRecherche: document.getElementById('champRecherche'),
    boutonRecherche: document.getElementById('boutonRecherche'),
    filtreType: document.getElementById('filtreType'),
    boutonChargerPlus: document.getElementById('boutonChargerPlus'),
    basculeurTheme: document.getElementById('basculeurTheme'),
    boutonAfficherEquipe: document.getElementById('boutonAfficherEquipe'),
    compteurEquipe: document.getElementById('compteurEquipe'),
    panneauEquipe: document.getElementById('panneauEquipe'),
    boutonFermerPanneau: document.getElementById('boutonFermerPanneau'),
    conteneurEquipe: document.getElementById('conteneurEquipe'),
    overlayPanneau: document.getElementById('overlayPanneau'),
    boutonCreerPokemon: document.getElementById('boutonCreerPokemon'),
    modaleCreation: document.getElementById('modaleCreation'),
    boutonFermerCreation: document.querySelector('.bouton-fermer-creation'),
    formulaireCreation: document.getElementById('formulaireCreation'),
    boutonAnnuler: document.getElementById('boutonAnnuler'),
    champImagePokemon: document.getElementById('imagePokemon'),
    apercuImage: document.getElementById('apercuImage'),
    imageApercu: document.getElementById('imageApercu'),
    boutonSupprimerImage: document.getElementById('boutonSupprimerImage')
};
