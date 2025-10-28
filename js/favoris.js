import { etat, dom } from './config.js';
import { sauvegarderFavoris } from './storage.js';

/**
 * Bascule l'état favori d'un Pokémon
 * @param {number} pokemonId - L'ID du Pokémon
 */
export function basculerFavori(pokemonId) {
    const index = etat.pokemonFavoris.indexOf(pokemonId);
    
    if (index === -1) {
        // Ajouter aux favoris
        etat.pokemonFavoris.push(pokemonId);
    } else {
        // Retirer des favoris
        etat.pokemonFavoris.splice(index, 1);
    }
    
    sauvegarderFavoris();
    
    // Mettre à jour le bouton dans la modale
    const boutonModale = dom.corpsModale.querySelector('.bouton-favori-modale');
    if (boutonModale) {
        const estFavori = etat.pokemonFavoris.includes(pokemonId);
        boutonModale.classList.toggle('actif', estFavori);
        boutonModale.textContent = estFavori ? '❤️' : '🤍';
        boutonModale.title = estFavori ? 'Retirer des favoris' : 'Ajouter aux favoris';
    }
    
    // Si le filtre favoris est actif, rafraîchir l'affichage
    if (etat.typeSelectionne === 'favoris') {
        import('./recherche.js').then(module => module.gererFiltreType());
    }
}
