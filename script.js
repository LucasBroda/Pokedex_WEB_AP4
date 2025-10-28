// Configuration de l'API
const URL_BASE_API = 'https://pokeapi.co/api/v2';
const NOMBRE_POKEMON_PAR_PAGE = 20;

// État de l'application
let decalageActuel = 0;
let tousLesPokemon = [];
let pokemonFiltres = [];
let typeSelectionne = '';
let pokemonFavoris = [];
let equipePokemon = [];

// Éléments DOM
const grillePokemon = document.getElementById('grillePokemon');
const chargement = document.getElementById('chargement');
const modale = document.getElementById('modale');
const corpsModale = document.getElementById('corpsModale');
const boutonFermer = document.querySelector('.bouton-fermer');
const champRecherche = document.getElementById('champRecherche');
const boutonRecherche = document.getElementById('boutonRecherche');
const filtreType = document.getElementById('filtreType');
const boutonChargerPlus = document.getElementById('boutonChargerPlus');
const basculeurTheme = document.getElementById('basculeurTheme');
const boutonAfficherEquipe = document.getElementById('boutonAfficherEquipe');
const compteurEquipe = document.getElementById('compteurEquipe');
const panneauEquipe = document.getElementById('panneauEquipe');
const boutonFermerPanneau = document.getElementById('boutonFermerPanneau');
const conteneurEquipe = document.getElementById('conteneurEquipe');
const overlayPanneau = document.getElementById('overlayPanneau');

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    initialiserTheme();
    chargerDonneesLocales();
    chargerPokemon();
    configurerEcouteurs();
    mettreAJourCompteurEquipe();
});

// Fonctions de gestion du thème
function initialiserTheme() {
    // Vérifier la préférence de thème sauvegardée ou utiliser le mode clair par défaut
    const themeSauvegarde = localStorage.getItem('pokedex-theme') || 'clair';
    if (themeSauvegarde === 'sombre') {
        document.body.classList.add('theme-sombre');
    }
}

function basculerTheme() {
    document.body.classList.toggle('theme-sombre');
    const estSombre = document.body.classList.contains('theme-sombre');
    localStorage.setItem('pokedex-theme', estSombre ? 'sombre' : 'clair');
}

// Fonctions de gestion du localStorage
function chargerDonneesLocales() {
    // Charger les favoris
    const favorisStockes = localStorage.getItem('pokedex-favoris');
    pokemonFavoris = favorisStockes ? JSON.parse(favorisStockes) : [];
    
    // Charger l'équipe
    const equipeStockee = localStorage.getItem('pokedex-equipe');
    equipePokemon = equipeStockee ? JSON.parse(equipeStockee) : [];
}

function sauvegarderFavoris() {
    localStorage.setItem('pokedex-favoris', JSON.stringify(pokemonFavoris));
}

function sauvegarderEquipe() {
    localStorage.setItem('pokedex-equipe', JSON.stringify(equipePokemon));
}

// Écouteurs d'événements
function configurerEcouteurs() {
    boutonFermer.addEventListener('click', fermerModale);
    modale.addEventListener('click', (e) => {
        if (e.target === modale) fermerModale();
    });
    
    champRecherche.addEventListener('input', gererRecherche);
    boutonRecherche.addEventListener('click', gererRecherche);
    champRecherche.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') gererRecherche();
    });
    
    filtreType.addEventListener('change', gererFiltreType);
    boutonChargerPlus.addEventListener('click', chargerPlusDePokemon);
    basculeurTheme.addEventListener('click', basculerTheme);
    
    // Écouteurs pour le panneau d'équipe
    boutonAfficherEquipe.addEventListener('click', afficherPanneauEquipe);
    boutonFermerPanneau.addEventListener('click', fermerPanneauEquipe);
    overlayPanneau.addEventListener('click', fermerPanneauEquipe);
    
    // Fermer la modale avec la touche Échap
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modale.classList.contains('actif')) {
            fermerModale();
        }
        if (e.key === 'Escape' && panneauEquipe.classList.contains('actif')) {
            fermerPanneauEquipe();
        }
    });
}

// Fonctions API
async function chargerPokemon() {
    afficherChargement();
    try {
        const reponse = await fetch(`${URL_BASE_API}/pokemon?limit=${NOMBRE_POKEMON_PAR_PAGE}&offset=${decalageActuel}`);
        const donnees = await reponse.json();
        
        // Récupérer les données détaillées pour chaque Pokémon
        const promessesPokemon = donnees.results.map(pokemon => 
            fetch(pokemon.url).then(res => res.json())
        );
        
        const donneesPokemon = await Promise.all(promessesPokemon);
        tousLesPokemon = [...tousLesPokemon, ...donneesPokemon];
        pokemonFiltres = tousLesPokemon;
        
        afficherPokemon(donneesPokemon);
        decalageActuel += NOMBRE_POKEMON_PAR_PAGE;
    } catch (erreur) {
        console.error('Erreur lors du chargement des Pokémon:', erreur);
        grillePokemon.innerHTML = '<p style="color: white; text-align: center;">Erreur de chargement. Veuillez réessayer.</p>';
    } finally {
        cacherChargement();
    }
}

async function chargerPlusDePokemon() {
    await chargerPokemon();
}

async function recupererDetailsPokemon(id) {
    afficherChargement();
    try {
        const reponse = await fetch(`${URL_BASE_API}/pokemon/${id}`);
        const donnees = await reponse.json();
        
        // Récupérer les données d'espèce pour informations supplémentaires
        const reponseEspece = await fetch(donnees.species.url);
        const donneesEspece = await reponseEspece.json();
        
        afficherDetailsPokemon(donnees, donneesEspece);
    } catch (erreur) {
        console.error('Erreur lors du chargement des détails:', erreur);
        corpsModale.innerHTML = '<p>Erreur de chargement des détails.</p>';
    } finally {
        cacherChargement();
    }
}

// Fonctions d'affichage
function afficherPokemon(listePokemon, ajouter = true) {
    if (!ajouter) {
        grillePokemon.innerHTML = '';
    }
    
    for (const pokemon of listePokemon) {
        const carte = creerCartePokemon(pokemon);
        grillePokemon.appendChild(carte);
    }
}

function creerCartePokemon(pokemon) {
    const carte = document.createElement('div');
    carte.className = 'carte-pokemon';
    carte.style.animationDelay = `${Math.random() * 0.3}s`;
    
    const types = pokemon.types.map(type => type.type.name);
    const typePrincipal = types[0];
    
    const estDansEquipe = equipePokemon.some(p => p.id === pokemon.id);
    
    carte.innerHTML = `
        <div class="identifiant-pokemon">#${String(pokemon.id).padStart(3, '0')}</div>
        <img src="${pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}" 
             alt="${pokemon.name}" 
             class="image-pokemon">
        <h3 class="nom-pokemon">${pokemon.name}</h3>
        <div class="types-pokemon">
            ${types.map(type => `<span class="badge-type type-${type}">${obtenirNomType(type)}</span>`).join('')}
        </div>
        <button class="bouton-ajouter-equipe ${estDansEquipe ? 'desactive' : ''}" 
                data-id="${pokemon.id}" 
                ${estDansEquipe ? 'disabled' : ''}
                title="${estDansEquipe ? 'Déjà dans l\'équipe' : 'Ajouter à l\'équipe'}">
            ${estDansEquipe ? '✓ Dans l\'équipe' : '+ Ajouter à l\'équipe'}
        </button>
    `;
    
    // Ajouter couleur de fond basée sur le type principal
    carte.style.setProperty('--couleur-type', obtenirCouleurType(typePrincipal));
    
    // Écouteur pour afficher les détails (clic sur toute la carte)
    carte.addEventListener('click', () => montrerDetailsPokemon(pokemon.id));
    
    // Écouteur pour le bouton équipe
    const boutonEquipe = carte.querySelector('.bouton-ajouter-equipe');
    boutonEquipe.addEventListener('click', (e) => {
        e.stopPropagation();
        ajouterAEquipe(pokemon);
    });
    
    return carte;
}

function afficherDetailsPokemon(pokemon, donneesEspece) {
    const types = pokemon.types.map(type => type.type.name);
    
    // Obtenir la description en français
    const descriptionFrancaise = donneesEspece.flavor_text_entries.find(
        entree => entree.language.name === 'fr'
    );
    
    const description = descriptionFrancaise ? 
        descriptionFrancaise.flavor_text.replaceAll('\f', ' ') : 
        'Aucune description disponible.';
    
    const estFavori = pokemonFavoris.includes(pokemon.id);
    
    corpsModale.innerHTML = `
        <div class="entete-modale">
            <button class="bouton-favori-modale ${estFavori ? 'actif' : ''}" data-id="${pokemon.id}" title="${estFavori ? 'Retirer des favoris' : 'Ajouter aux favoris'}">
                ${estFavori ? '❤️' : '🤍'}
            </button>
            <img src="${pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}" 
                 alt="${pokemon.name}" 
                 class="image-pokemon-modale">
            <h2 class="nom-pokemon-modale">${pokemon.name}</h2>
            <p class="identifiant-pokemon-modale">#${String(pokemon.id).padStart(3, '0')}</p>
            <div class="types-pokemon">
                ${types.map(type => `<span class="badge-type type-${type}">${obtenirNomType(type)}</span>`).join('')}
            </div>
        </div>
        
        <div class="conteneur-info">
            <h3 class="titre-section">Description</h3>
            <p style="text-align: left; line-height: 1.6; color: #666; margin-bottom: 20px;">${description}</p>
        </div>
        
        <div class="conteneur-info">
            <h3 class="titre-section">Informations</h3>
            <div class="grille-info">
                <div class="element-info">
                    <div class="etiquette-info">Taille</div>
                    <div class="valeur-info">${(pokemon.height / 10).toFixed(1)} m</div>
                </div>
                <div class="element-info">
                    <div class="etiquette-info">Poids</div>
                    <div class="valeur-info">${(pokemon.weight / 10).toFixed(1)} kg</div>
                </div>
                <div class="element-info">
                    <div class="etiquette-info">Expérience de base</div>
                    <div class="valeur-info">${pokemon.base_experience}</div>
                </div>
                <div class="element-info">
                    <div class="etiquette-info">Habitat</div>
                    <div class="valeur-info">${donneesEspece.habitat?.name || 'Inconnu'}</div>
                </div>
            </div>
        </div>
        
        <div class="conteneur-capacites">
            <h3 class="titre-section">Capacités</h3>
            <div class="liste-capacites">
                ${pokemon.abilities.map(capacite => 
                    `<span class="badge-capacite">${capacite.ability.name.replace('-', ' ')}</span>`
                ).join('')}
            </div>
        </div>
        
        <div class="conteneur-statistiques">
            <h3 class="titre-statistiques">Statistiques</h3>
            ${pokemon.stats.map(stat => `
                <div class="ligne-stat">
                    <span class="nom-stat">${obtenirNomStat(stat.stat.name)}</span>
                    <div class="conteneur-barre-stat">
                        <div class="barre-stat" style="width: ${(stat.base_stat / 255) * 100}%">
                            ${stat.base_stat > 30 ? stat.base_stat : ''}
                        </div>
                    </div>
                    <span class="valeur-stat">${stat.base_stat}</span>
                </div>
            `).join('')}
        </div>
    `;
    
    // Ajouter l'écouteur pour le bouton favori dans la modale
    const boutonFavoriModale = corpsModale.querySelector('.bouton-favori-modale');
    boutonFavoriModale.addEventListener('click', () => {
        basculerFavori(pokemon.id);
    });
    
    ouvrirModale();
}

// Fonctions de recherche et filtrage
function gererRecherche() {
    const termeRecherche = champRecherche.value.toLowerCase().trim();
    
    if (termeRecherche === '') {
        if (typeSelectionne === 'favoris') {
            pokemonFiltres = tousLesPokemon.filter(p => pokemonFavoris.includes(p.id));
        } else if (typeSelectionne) {
            pokemonFiltres = tousLesPokemon.filter(p => p.types.some(t => t.type.name === typeSelectionne));
        } else {
            pokemonFiltres = tousLesPokemon;
        }
    } else {
        pokemonFiltres = tousLesPokemon.filter(pokemon => 
            pokemon.name.toLowerCase().includes(termeRecherche) || 
            String(pokemon.id).includes(termeRecherche)
        );
        
        if (typeSelectionne === 'favoris') {
            pokemonFiltres = pokemonFiltres.filter(p => pokemonFavoris.includes(p.id));
        } else if (typeSelectionne) {
            pokemonFiltres = pokemonFiltres.filter(p => 
                p.types.some(t => t.type.name === typeSelectionne)
            );
        }
    }
    
    afficherPokemon(pokemonFiltres, false);
}

function gererFiltreType() {
    typeSelectionne = filtreType.value;
    
    if (typeSelectionne === '') {
        pokemonFiltres = tousLesPokemon;
    } else if (typeSelectionne === 'favoris') {
        pokemonFiltres = tousLesPokemon.filter(pokemon => pokemonFavoris.includes(pokemon.id));
    } else {
        pokemonFiltres = tousLesPokemon.filter(pokemon => 
            pokemon.types.some(type => type.type.name === typeSelectionne)
        );
    }
    
    // Appliquer le filtre de recherche si actif
    const termeRecherche = champRecherche.value.toLowerCase().trim();
    if (termeRecherche) {
        pokemonFiltres = pokemonFiltres.filter(pokemon => 
            pokemon.name.toLowerCase().includes(termeRecherche) || 
            String(pokemon.id).includes(termeRecherche)
        );
    }
    
    afficherPokemon(pokemonFiltres, false);
}

// Fonctions de gestion de la modale
function montrerDetailsPokemon(id) {
    recupererDetailsPokemon(id);
}

function ouvrirModale() {
    modale.classList.add('actif');
    document.body.style.overflow = 'hidden';
}

function fermerModale() {
    modale.classList.remove('actif');
    document.body.style.overflow = 'auto';
}

// Fonctions utilitaires
function afficherChargement() {
    chargement.classList.add('actif');
}

function cacherChargement() {
    chargement.classList.remove('actif');
}

function obtenirCouleurType(type) {
    const couleurs = {
        normal: '#A8A878',
        fire: '#F08030',
        water: '#6890F0',
        electric: '#F8D030',
        grass: '#78C850',
        ice: '#98D8D8',
        fighting: '#C03028',
        poison: '#A040A0',
        ground: '#E0C068',
        flying: '#A890F0',
        psychic: '#F85888',
        bug: '#A8B820',
        rock: '#B8A038',
        ghost: '#705898',
        dragon: '#7038F8',
        dark: '#705848',
        steel: '#B8B8D0',
        fairy: '#EE99AC'
    };
    return couleurs[type] || '#777';
}

function obtenirNomType(type) {
    const nomsTypes = {
        normal: 'Normal',
        fire: 'Feu',
        water: 'Eau',
        electric: 'Électrique',
        grass: 'Plante',
        ice: 'Glace',
        fighting: 'Combat',
        poison: 'Poison',
        ground: 'Sol',
        flying: 'Vol',
        psychic: 'Psy',
        bug: 'Insecte',
        rock: 'Roche',
        ghost: 'Spectre',
        dragon: 'Dragon',
        dark: 'Ténèbres',
        steel: 'Acier',
        fairy: 'Fée'
    };
    return nomsTypes[type] || type;
}

function obtenirNomStat(stat) {
    const nomsStat = {
        hp: 'PV',
        attack: 'Attaque',
        defense: 'Défense',
        'special-attack': 'Attaque Spé.',
        'special-defense': 'Défense Spé.',
        speed: 'Vitesse'
    };
    return nomsStat[stat] || stat;
}

// Fonctions de gestion des favoris
function basculerFavori(pokemonId) {
    const index = pokemonFavoris.indexOf(pokemonId);
    
    if (index === -1) {
        // Ajouter aux favoris
        pokemonFavoris.push(pokemonId);
    } else {
        // Retirer des favoris
        pokemonFavoris.splice(index, 1);
    }
    
    sauvegarderFavoris();
    
    // Mettre à jour le bouton dans la modale
    const boutonModale = corpsModale.querySelector('.bouton-favori-modale');
    if (boutonModale) {
        const estFavori = pokemonFavoris.includes(pokemonId);
        boutonModale.classList.toggle('actif', estFavori);
        boutonModale.textContent = estFavori ? '❤️' : '🤍';
        boutonModale.title = estFavori ? 'Retirer des favoris' : 'Ajouter aux favoris';
    }
    
    // Si le filtre favoris est actif, rafraîchir l'affichage
    if (typeSelectionne === 'favoris') {
        gererFiltreType();
    }
}

// Fonctions de gestion de l'équipe
function ajouterAEquipe(pokemon) {
    // Vérifier si l'équipe est pleine
    if (equipePokemon.length >= 6) {
        alert('Votre équipe est complète ! (Maximum 6 Pokémon)');
        return;
    }
    
    // Vérifier si le Pokémon est déjà dans l'équipe
    if (equipePokemon.some(p => p.id === pokemon.id)) {
        return;
    }
    
    // Ajouter le Pokémon à l'équipe
    equipePokemon.push({
        id: pokemon.id,
        name: pokemon.name,
        sprite: pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default,
        types: pokemon.types.map(t => t.type.name)
    });
    
    sauvegarderEquipe();
    mettreAJourCompteurEquipe();
    
    // Mettre à jour le bouton de la carte
    const cartes = document.querySelectorAll('.carte-pokemon');
    for (const carte of cartes) {
        const boutonEquipe = carte.querySelector(`.bouton-ajouter-equipe[data-id="${pokemon.id}"]`);
        if (boutonEquipe) {
            boutonEquipe.classList.add('desactive');
            boutonEquipe.disabled = true;
            boutonEquipe.textContent = '✓ Dans l\'équipe';
            boutonEquipe.title = 'Déjà dans l\'équipe';
        }
    }
    
    // Si le panneau est ouvert, le mettre à jour
    if (panneauEquipe.classList.contains('actif')) {
        afficherEquipe();
    }
}

function retirerDeEquipe(pokemonId) {
    equipePokemon = equipePokemon.filter(p => p.id !== pokemonId);
    sauvegarderEquipe();
    mettreAJourCompteurEquipe();
    afficherEquipe();
    
    // Mettre à jour le bouton de la carte si elle est visible
    const cartes = document.querySelectorAll('.carte-pokemon');
    for (const carte of cartes) {
        const boutonEquipe = carte.querySelector(`.bouton-ajouter-equipe[data-id="${pokemonId}"]`);
        if (boutonEquipe) {
            boutonEquipe.classList.remove('desactive');
            boutonEquipe.disabled = false;
            boutonEquipe.textContent = '+ Ajouter à l\'équipe';
            boutonEquipe.title = 'Ajouter à l\'équipe';
        }
    }
}

function mettreAJourCompteurEquipe() {
    compteurEquipe.textContent = equipePokemon.length;
}

function afficherPanneauEquipe() {
    panneauEquipe.classList.add('actif');
    overlayPanneau.classList.add('actif');
    afficherEquipe();
}

function fermerPanneauEquipe() {
    panneauEquipe.classList.remove('actif');
    overlayPanneau.classList.remove('actif');
}

function afficherEquipe() {
    if (equipePokemon.length === 0) {
        conteneurEquipe.innerHTML = '<p class="message-equipe-vide">Aucun Pokémon dans l\'équipe</p>';
        return;
    }
    
    conteneurEquipe.innerHTML = equipePokemon.map(pokemon => `
        <div class="membre-equipe">
            <img src="${pokemon.sprite}" alt="${pokemon.name}" class="sprite-equipe">
            <div class="info-membre-equipe">
                <h4 class="nom-membre-equipe">${pokemon.name}</h4>
                <div class="types-membre-equipe">
                    ${pokemon.types.map(type => `<span class="badge-type-mini type-${type}">${obtenirNomType(type)}</span>`).join('')}
                </div>
            </div>
            <button class="bouton-retirer" data-id="${pokemon.id}" title="Retirer de l'équipe">✕</button>
        </div>
    `).join('');
    
    // Ajouter les écouteurs pour les boutons de retrait
    const boutonsRetirer = conteneurEquipe.querySelectorAll('.bouton-retirer');
    for (const bouton of boutonsRetirer) {
        bouton.addEventListener('click', () => {
            const pokemonId = Number.parseInt(bouton.dataset.id, 10);
            retirerDeEquipe(pokemonId);
        });
    }
}
