import { etat, dom } from './config.js';
import { obtenirCouleurType, obtenirNomType } from './utils.js';
import { recupererDetailsPokemon } from './api.js';

/**
 * Affiche une liste de Pokémon dans la grille
 * @param {Array} listePokemon - Liste des Pokémon à afficher
 * @param {boolean} ajouter - Si true, ajoute à la grille existante, sinon remplace
 */
export function afficherPokemon(listePokemon, ajouter = true) {
    if (!ajouter) {
        dom.grillePokemon.innerHTML = '';
    }
    
    for (const pokemon of listePokemon) {
        const carte = creerCartePokemon(pokemon);
        dom.grillePokemon.appendChild(carte);
    }
}

/**
 * Crée une carte Pokémon
 * @param {Object} pokemon - Les données du Pokémon
 * @returns {HTMLElement} L'élément de la carte
 */
export function creerCartePokemon(pokemon) {
    const carte = document.createElement('div');
    carte.className = 'carte-pokemon';
    carte.style.animationDelay = `${Math.random() * 0.3}s`;
    
    const types = pokemon.types.map(type => type.type.name);
    const typePrincipal = types[0];
    
    const estDansEquipe = etat.equipePokemon.some(p => p.id === pokemon.id);
    
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
    boutonEquipe.addEventListener('click', async (e) => {
        e.stopPropagation();
        const { ajouterAEquipe } = await import('./equipe.js');
        ajouterAEquipe(pokemon);
    });
    
    return carte;
}

/**
 * Affiche les détails d'un Pokémon
 * @param {number} id - L'ID du Pokémon
 */
export function montrerDetailsPokemon(id) {
    recupererDetailsPokemon(id);
}
