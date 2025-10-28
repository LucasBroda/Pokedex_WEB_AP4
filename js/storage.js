import { etat } from './config.js';

/**
 * Charge toutes les données depuis le localStorage
 */
export function chargerDonneesLocales() {
    // Charger les favoris
    const favorisStockes = localStorage.getItem('pokedex-favoris');
    etat.pokemonFavoris = favorisStockes ? JSON.parse(favorisStockes) : [];
    
    // Charger l'équipe
    const equipeStockee = localStorage.getItem('pokedex-equipe');
    etat.equipePokemon = equipeStockee ? JSON.parse(equipeStockee) : [];
    
    // Charger les Pokémon personnalisés
    const personnalisesStockes = localStorage.getItem('pokedex-personnalises');
    etat.pokemonPersonnalises = personnalisesStockes ? JSON.parse(personnalisesStockes) : [];
    
    // Charger le prochain ID
    const idStocke = localStorage.getItem('pokedex-prochain-id');
    etat.prochainIdPersonnalise = idStocke ? Number.parseInt(idStocke, 10) : 10000;
}

/**
 * Sauvegarde les favoris dans le localStorage
 */
export function sauvegarderFavoris() {
    localStorage.setItem('pokedex-favoris', JSON.stringify(etat.pokemonFavoris));
}

/**
 * Sauvegarde l'équipe dans le localStorage
 */
export function sauvegarderEquipe() {
    localStorage.setItem('pokedex-equipe', JSON.stringify(etat.equipePokemon));
}

/**
 * Sauvegarde les Pokémon personnalisés dans le localStorage
 */
export function sauvegarderPersonnalises() {
    localStorage.setItem('pokedex-personnalises', JSON.stringify(etat.pokemonPersonnalises));
    localStorage.setItem('pokedex-prochain-id', etat.prochainIdPersonnalise.toString());
}
