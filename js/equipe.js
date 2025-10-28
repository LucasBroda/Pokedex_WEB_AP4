import { etat, dom } from './config.js';
import { obtenirNomType } from './utils.js';
import { sauvegarderEquipe } from './storage.js';

/**
 * Ajoute un Pokémon à l'équipe
 * @param {Object} pokemon - Le Pokémon à ajouter
 */
export function ajouterAEquipe(pokemon) {
    // Vérifier si l'équipe est pleine
    if (etat.equipePokemon.length >= 6) {
        alert('Votre équipe est complète ! (Maximum 6 Pokémon)');
        return;
    }
    
    // Vérifier si le Pokémon est déjà dans l'équipe
    if (etat.equipePokemon.some(p => p.id === pokemon.id)) {
        return;
    }
    
    // Ajouter le Pokémon à l'équipe
    etat.equipePokemon.push({
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
    if (dom.panneauEquipe.classList.contains('actif')) {
        afficherEquipe();
    }
}

/**
 * Retire un Pokémon de l'équipe
 * @param {number} pokemonId - L'ID du Pokémon à retirer
 */
export function retirerDeEquipe(pokemonId) {
    etat.equipePokemon = etat.equipePokemon.filter(p => p.id !== pokemonId);
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

/**
 * Met à jour le compteur d'équipe
 */
export function mettreAJourCompteurEquipe() {
    dom.compteurEquipe.textContent = etat.equipePokemon.length;
}

/**
 * Affiche le panneau de l'équipe
 */
export function afficherPanneauEquipe() {
    dom.panneauEquipe.classList.add('actif');
    dom.overlayPanneau.classList.add('actif');
    afficherEquipe();
}

/**
 * Ferme le panneau de l'équipe
 */
export function fermerPanneauEquipe() {
    dom.panneauEquipe.classList.remove('actif');
    dom.overlayPanneau.classList.remove('actif');
}

/**
 * Affiche les Pokémon de l'équipe dans le panneau
 */
export function afficherEquipe() {
    if (etat.equipePokemon.length === 0) {
        dom.conteneurEquipe.innerHTML = '<p class="message-equipe-vide">Aucun Pokémon dans l\'équipe</p>';
        return;
    }
    
    dom.conteneurEquipe.innerHTML = etat.equipePokemon.map(pokemon => `
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
    const boutonsRetirer = dom.conteneurEquipe.querySelectorAll('.bouton-retirer');
    for (const bouton of boutonsRetirer) {
        bouton.addEventListener('click', () => {
            const pokemonId = Number.parseInt(bouton.dataset.id, 10);
            retirerDeEquipe(pokemonId);
        });
    }
}

/**
 * Configure les écouteurs d'événements pour l'équipe
 */
export function configurerEcouteursEquipe() {
    dom.boutonAfficherEquipe.addEventListener('click', afficherPanneauEquipe);
    dom.boutonFermerPanneau.addEventListener('click', fermerPanneauEquipe);
    dom.overlayPanneau.addEventListener('click', fermerPanneauEquipe);
}
