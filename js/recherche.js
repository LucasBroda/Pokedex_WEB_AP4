import { etat, dom } from './config.js';
import { afficherPokemon } from './cartes.js';

// Permet de gérer la recherche de Pokémon
export function gererRecherche() {
    // Fait encore une fois appel à un élément d'état dans les constantes du dom
    const termeRecherche = dom.champRecherche.value.toLowerCase().trim();
    
    if (termeRecherche === '') {
        // Si le champ de recherche est vide, on applique uniquement le filtre par type
        if (etat.typeSelectionne === 'favoris') {
            etat.pokemonFiltres = etat.tousLesPokemon.filter(p => etat.pokemonFavoris.includes(p.id));
        } else if (etat.typeSelectionne) {
            etat.pokemonFiltres = etat.tousLesPokemon.filter(p => p.types.some(t => t.type.name === etat.typeSelectionne));
        } else {
            etat.pokemonFiltres = etat.tousLesPokemon;
        }
    } else {
        // Si un terme de recherche est présent, on filtre par nom ou ID
        etat.pokemonFiltres = etat.tousLesPokemon.filter(pokemon => 
            pokemon.name.toLowerCase().includes(termeRecherche) || 
            String(pokemon.id).includes(termeRecherche)
        );
        
        if (etat.typeSelectionne === 'favoris') {
            etat.pokemonFiltres = etat.pokemonFiltres.filter(p => etat.pokemonFavoris.includes(p.id));
        } else if (etat.typeSelectionne) {
            etat.pokemonFiltres = etat.pokemonFiltres.filter(p => 
                p.types.some(t => t.type.name === etat.typeSelectionne)
            );
        }
    }
    
    afficherPokemon(etat.pokemonFiltres, false);
}

// Gère le filtre par type
export function gererFiltreType() {
    etat.typeSelectionne = dom.filtreType.value;
    
    if (etat.typeSelectionne === '') {
        etat.pokemonFiltres = etat.tousLesPokemon;
    } else if (etat.typeSelectionne === 'favoris') {
        etat.pokemonFiltres = etat.tousLesPokemon.filter(pokemon => etat.pokemonFavoris.includes(pokemon.id));
    } else {
        etat.pokemonFiltres = etat.tousLesPokemon.filter(pokemon => 
            pokemon.types.some(type => type.type.name === etat.typeSelectionne)
        );
    }
    
    // Applique le filtre de recherche si actif
    const termeRecherche = dom.champRecherche.value.toLowerCase().trim();
    if (termeRecherche) {
        etat.pokemonFiltres = etat.pokemonFiltres.filter(pokemon => 
            pokemon.name.toLowerCase().includes(termeRecherche) || 
            String(pokemon.id).includes(termeRecherche)
        );
    }
    
    afficherPokemon(etat.pokemonFiltres, false);
}

// Configure les écouteurs d'événements pour la recherche et les filtres
export function configurerEcouteursRecherche() {
    dom.champRecherche.addEventListener('input', gererRecherche);
    dom.boutonRecherche.addEventListener('click', gererRecherche);
    dom.champRecherche.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') gererRecherche();
    });
    
    dom.filtreType.addEventListener('change', gererFiltreType);
}
