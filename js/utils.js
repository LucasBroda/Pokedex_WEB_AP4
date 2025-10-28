import { dom } from './config.js';

/**
 * Affiche l'indicateur de chargement
 */
export function afficherChargement() {
    dom.chargement.classList.add('actif');
}

/**
 * Cache l'indicateur de chargement
 */
export function cacherChargement() {
    dom.chargement.classList.remove('actif');
}

/**
 * Retourne la couleur associée à un type de Pokémon
 * @param {string} type - Le type du Pokémon
 * @returns {string} La couleur hexadécimale
 */
export function obtenirCouleurType(type) {
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

/**
 * Retourne le nom français d'un type de Pokémon
 * @param {string} type - Le type en anglais
 * @returns {string} Le nom français du type
 */
export function obtenirNomType(type) {
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

/**
 * Retourne le nom français d'une statistique
 * @param {string} stat - Le nom de la statistique en anglais
 * @returns {string} Le nom français de la statistique
 */
export function obtenirNomStat(stat) {
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
