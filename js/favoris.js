import { etat, dom } from './config.js';
import { sauvegarderFavoris } from './storage.js';

// Permet d'effectuer le basculement d'un Pokémon dans les favoris
export function basculerFavori(pokemonId) {
    const index = etat.pokemonFavoris.indexOf(pokemonId);
    
    // Vérifie si le Pokémon est déjà dans les favoris à la dernière position
    if (index === -1) {
        // Ajoute aux favoris
        etat.pokemonFavoris.push(pokemonId);
    } else {
        // Retire des favoris
        etat.pokemonFavoris.splice(index, 1);
    }
    
    sauvegarderFavoris();
    
    // Met à jour le bouton dans la modale
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
