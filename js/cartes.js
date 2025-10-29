import { etat, dom } from './config.js';
import { obtenirCouleurType, obtenirNomType } from './utils.js';
import { recupererDetailsPokemon } from './api.js';

// Permet d'afficher la liste des Pokémon
export function afficherPokemon(listePokemon, ajouter = true) {
    // Si ajouter est false, on vide la grille avant d'ajouter les nouveaux Pokémon
    if (!ajouter) {
        // On utilise ici innerHTML pour vider le contenu existant de la grille
        dom.grillePokemon.innerHTML = '';
    }
    
    // Pour chaque Pokémon, on crée une carte dans lequel il sera affiché
    for (const pokemon of listePokemon) {
        const carte = creerCartePokemon(pokemon);
        // On utilise appendChild pour ajouter la carte créée à la grille des Pokémon
        dom.grillePokemon.appendChild(carte);
    }
}

// Permet de créer une carte pour un Pokémon
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

// Permet d'afficher les détails d'un Pokémon en pariculier
export function montrerDetailsPokemon(id) {
    recupererDetailsPokemon(id);
}
