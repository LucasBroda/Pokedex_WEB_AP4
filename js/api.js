import { URL_BASE_API, NOMBRE_POKEMON_PAR_PAGE, etat, dom } from './config.js';
import { afficherChargement, cacherChargement } from './utils.js';
import { afficherPokemon } from './cartes.js';

/**
 * Charge les Pokémon depuis l'API
 */
export async function chargerPokemon() {
    afficherChargement();
    try {
        const reponse = await fetch(`${URL_BASE_API}/pokemon?limit=${NOMBRE_POKEMON_PAR_PAGE}&offset=${etat.decalageActuel}`);
        const donnees = await reponse.json();
        
        // Récupérer les données détaillées pour chaque Pokémon
        const promessesPokemon = donnees.results.map(pokemon => 
            fetch(pokemon.url).then(res => res.json())
        );
        
        const donneesPokemon = await Promise.all(promessesPokemon);
        
        // Ajouter les nouveaux Pokémon de l'API
        etat.tousLesPokemon = [...etat.tousLesPokemon, ...donneesPokemon];
        
        // Si c'est le premier chargement, ajouter les Pokémon personnalisés au début
        if (etat.decalageActuel === 0 && etat.pokemonPersonnalises.length > 0) {
            etat.tousLesPokemon = [...etat.pokemonPersonnalises, ...etat.tousLesPokemon];
        }
        
        etat.pokemonFiltres = etat.tousLesPokemon;
        
        // Afficher uniquement les nouveaux Pokémon si ce n'est pas le premier chargement
        if (etat.decalageActuel === 0) {
            afficherPokemon(etat.tousLesPokemon, false);
        } else {
            afficherPokemon(donneesPokemon);
        }
        
        etat.decalageActuel += NOMBRE_POKEMON_PAR_PAGE;
    } catch (error_) {
        console.error('Erreur lors du chargement des Pokémon:', error_);
        dom.grillePokemon.innerHTML = '<p style="color: white; text-align: center;">Erreur de chargement. Veuillez réessayer.</p>';
    } finally {
        cacherChargement();
    }
}

/**
 * Charge plus de Pokémon (pagination)
 */
export async function chargerPlusDePokemon() {
    await chargerPokemon();
}

/**
 * Récupère les détails complets d'un Pokémon
 * @param {number} id - L'ID du Pokémon
 */
export async function recupererDetailsPokemon(id) {
    afficherChargement();
    try {
        // Vérifier si c'est un Pokémon personnalisé
        const pokemonPersonnalise = etat.pokemonPersonnalises.find(p => p.id === id);
        
        if (pokemonPersonnalise) {
            const { afficherDetailsPokemonPersonnalise } = await import('./modale.js');
            afficherDetailsPokemonPersonnalise(pokemonPersonnalise);
        } else {
            const reponse = await fetch(`${URL_BASE_API}/pokemon/${id}`);
            const donnees = await reponse.json();
            
            // Récupérer les données d'espèce pour informations supplémentaires
            const reponseEspece = await fetch(donnees.species.url);
            const donneesEspece = await reponseEspece.json();
            
            const { afficherDetailsPokemon } = await import('./modale.js');
            afficherDetailsPokemon(donnees, donneesEspece);
        }
    } catch (error_) {
        console.error('Erreur lors du chargement des détails:', error_);
        dom.corpsModale.innerHTML = '<p>Erreur de chargement des détails.</p>';
    } finally {
        cacherChargement();
    }
}

/**
 * Configure les écouteurs d'événements pour l'API
 */
export function configurerEcouteursAPI() {
    dom.boutonChargerPlus.addEventListener('click', chargerPlusDePokemon);
}
