import { dom } from './config.js';

/**
 * Initialise le thème à partir du localStorage
 */
export function initialiserTheme() {
    const themeSauvegarde = localStorage.getItem('pokedex-theme') || 'clair';
    if (themeSauvegarde === 'sombre') {
        document.body.classList.add('theme-sombre');
    }
}

/**
 * Bascule entre le thème clair et sombre
 */
export function basculerTheme() {
    document.body.classList.toggle('theme-sombre');
    const estSombre = document.body.classList.contains('theme-sombre');
    localStorage.setItem('pokedex-theme', estSombre ? 'sombre' : 'clair');
}

/**
 * Configure les écouteurs d'événements pour le thème
 */
export function configurerEcouteursTheme() {
    dom.basculeurTheme.addEventListener('click', basculerTheme);
}
