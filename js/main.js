import { dom } from './config.js';
import { initialiserTheme, configurerEcouteursTheme } from './theme.js';
import { chargerDonneesLocales } from './storage.js';
import { chargerPokemon, configurerEcouteursAPI } from './api.js';
import { configurerEcouteursModale } from './modale.js';
import { configurerEcouteursEquipe, mettreAJourCompteurEquipe } from './equipe.js';
import { configurerEcouteursRecherche } from './recherche.js';
import { configurerEcouteursCreation } from './creation.js';

// Appeler une fois le DOM complètement chargé, permet d'afficher le contenu de l'application
document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialise le thème
    initialiserTheme();
    
    // 2. Charge les données du localStorage
    chargerDonneesLocales();

    // 3. Configure tous les écouteurs d'événements
    configurerEcouteurs();

    // 4. Met à jour le compteur d'équipe
    mettreAJourCompteurEquipe();

    // 5. Charge les Pokémon depuis l'API
    chargerPokemon();
});

// FAit appel à l'ensemble des fonctions de configuration des écouteurs d'événements que l'on peut trouver dans les différents fichiers
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
