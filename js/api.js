import { URL_BASE_API, NOMBRE_POKEMON_PAR_PAGE, etat, dom } from './config.js';
import { afficherChargement, cacherChargement } from './utils.js';
import { afficherPokemon } from './cartes.js';

// Charge les Pokémon depuis l'API spécifiée dans le fichier config.js
export async function chargerPokemon() {
    // On appelle afficherChargement pour montrer un indicateur de chargement
    afficherChargement();
    // Ici, on utilise un try catch pour gérer les erreurs potentielles lors de la requête API
    try {
        // Le &offset permet de paginer les résultats, cela permet de charger les Pokémon par lots
        const reponse = await fetch(`${URL_BASE_API}/pokemon?limit=${NOMBRE_POKEMON_PAR_PAGE}&offset=${etat.decalageActuel}`);
        const donnees = await reponse.json();
        
        // Permet de récupérer les données détaillées pour chaque Pokémon
        // fetch est utilisé pour obtenir les données complètes de chaque Pokémon
        // Le .then transforme la réponse en JSON, ce qui est nécessaire pour manipuler les données
        const promessesPokemon = donnees.results.map(pokemon => 
            fetch(pokemon.url).then(res => res.json())
        );
        
        // Permet de résoudre toutes les promesses et d'obtenir un tableau des données complètes des Pokémon
        const donneesPokemon = await Promise.all(promessesPokemon);
        
        // Permet d'ajouter les nouveaux Pokémon de l'API
        // Ici on utilise l'opérateur spread ... pour fusionner les tableaux avec les nouveaux Pokémon obtenus par l'API et stockés dans donneesPokemon
        etat.tousLesPokemon = [...etat.tousLesPokemon, ...donneesPokemon];
        
        // Si c'est le premier chargement, ajouter les Pokémon créés au début
        if (etat.decalageActuel === 0 && etat.pokemonPersonnalises.length > 0) {
            etat.tousLesPokemon = [...etat.pokemonPersonnalises, ...etat.tousLesPokemon];
        }
        
        // Initialiser les filtres avec tous les Pokémon chargés
        etat.pokemonFiltres = etat.tousLesPokemon;
        
        // Permet d'afficher uniquement les nouveaux Pokémon si ce n'est pas le premier chargement
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

// Permet de charger plus de Pokémon, les nouveaux Pokémon sont ajoutés à la liste existante et sont affichés à la suite
export async function chargerPlusDePokemon() {
    await chargerPokemon(); // -> Appelle la fonction chargerPokemon pour obtenir plus de Pokémon, le await permet d'attendre que le chargement soit terminé avant de continuer
}

// Permet de récupérer les détails complets d'un Pokémon
export async function recupererDetailsPokemon(id) {
    afficherChargement();
    try {
        // Vérifie si c'est un Pokémon personnalisé, on vérifie ici si l'id du Pokémon correspond à un id stocké dans etat.pokemonPersonnalises
        const pokemonPersonnalise = etat.pokemonPersonnalises.find(p => p.id === id);
        
        if (pokemonPersonnalise) {
            // Si c'est un Pokémon personnalisé, on importe dynamiquement la fonction afficherDetailsPokemonPersonnalise depuis modale.js
            const { afficherDetailsPokemonPersonnalise } = await import('./modale.js');
            afficherDetailsPokemonPersonnalise(pokemonPersonnalise);
        } else {
            // Si ce n'est pas un Pokémon personnalisé, on fait une requête à l'API pour obtenir les détails
            const reponse = await fetch(`${URL_BASE_API}/pokemon/${id}`);
            const donnees = await reponse.json();

            // Récupère les données d'espèce pour informations supplémentaires
            const reponseEspece = await fetch(donnees.species.url);
            const donneesEspece = await reponseEspece.json();

            // Permet d'importer dynamiquement la fonction afficherDetailsPokemon depuis modale.js
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

// Permet de déclarer un écouteur pour le bouton de chargement de plus de Pokémon
export function configurerEcouteursAPI() {
    dom.boutonChargerPlus.addEventListener('click', chargerPlusDePokemon);
}
