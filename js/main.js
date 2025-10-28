/**
 * Fichier principal - Orchestre l'initialisation de l'application Pokédex
 */

import { dom } from './config.js';
import { initialiserTheme, configurerEcouteursTheme } from './theme.js';
import { chargerDonneesLocales } from './storage.js';
import { chargerPokemon, configurerEcouteursAPI } from './api.js';
import { configurerEcouteursModale } from './modale.js';
import { configurerEcouteursEquipe, mettreAJourCompteurEquipe } from './equipe.js';
import { configurerEcouteursRecherche } from './recherche.js';
import { configurerEcouteursCreation } from './creation.js';

/**
 * Initialise l'application au chargement du DOM
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialiser le thème
    initialiserTheme();
    
    // 2. Charger les données du localStorage
    chargerDonneesLocales();
    
    // 3. Configurer tous les écouteurs d'événements
    configurerEcouteurs();
    
    // 4. Mettre à jour le compteur d'équipe
    mettreAJourCompteurEquipe();
    
    // 5. Charger les Pokémon depuis l'API
    chargerPokemon();
});

/**
 * Configure tous les écouteurs d'événements de l'application
 */
function configurerEcouteurs() {
    configurerEcouteursTheme();
    configurerEcouteursModale();
    configurerEcouteursAPI();
    configurerEcouteursEquipe();
    configurerEcouteursRecherche();
    configurerEcouteursCreation();
    
    // Écouteur pour fermer les modales avec la touche Échap
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (dom.modale.classList.contains('actif')) {
                import('./modale.js').then(module => module.fermerModale());
            }
            if (dom.panneauEquipe.classList.contains('actif')) {
                import('./equipe.js').then(module => module.fermerPanneauEquipe());
            }
            if (dom.modaleCreation.classList.contains('actif')) {
                import('./creation.js').then(module => module.fermerModaleCreation());
            }
        }
    });
}
