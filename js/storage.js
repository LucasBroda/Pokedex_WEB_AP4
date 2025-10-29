import { etat } from './config.js';

// Permet d'obtenir l'espace utilisé dans le localStorage en Ko
export function obtenirEspaceUtilise() {
    let total = 0;
    for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
            total += localStorage[key].length + key.length;
        }
    }
    return (total / 1024).toFixed(2); // Convertir en Ko
}

// Affiche des informations de stockage dans la console pour debug
export function afficherInfoStockage() {
    const espaceUtilise = obtenirEspaceUtilise();
    console.log(`Espace localStorage utilisé : ${espaceUtilise} Ko`);
    console.log(`Pokémon personnalisés : ${etat.pokemonPersonnalises.length}`);
    console.log(`Favoris : ${etat.pokemonFavoris.length}`);
    console.log(`Équipe : ${etat.equipePokemon.length}`);
}

// Charge toutes les données depuis le localStorage
export function chargerDonneesLocales() {
    // Charge les favoris
    const favorisStockes = localStorage.getItem('pokedex-favoris');
    etat.pokemonFavoris = favorisStockes ? JSON.parse(favorisStockes) : [];
    
    // Charge l'équipe
    const equipeStockee = localStorage.getItem('pokedex-equipe');
    etat.equipePokemon = equipeStockee ? JSON.parse(equipeStockee) : [];
    
    // Charge les Pokémon personnalisés
    const personnalisesStockes = localStorage.getItem('pokedex-personnalises');
    etat.pokemonPersonnalises = personnalisesStockes ? JSON.parse(personnalisesStockes) : [];
    
    // Charge le prochain ID
    const idStocke = localStorage.getItem('pokedex-prochain-id');
    etat.prochainIdPersonnalise = idStocke ? Number.parseInt(idStocke, 10) : 10000;
}

// Permet de sauvegarder les favoris dans le localStorage
export function sauvegarderFavoris() {
    try {
        localStorage.setItem('pokedex-favoris', JSON.stringify(etat.pokemonFavoris));
    } catch (error) {
        if (error.name === 'QuotaExceededError' || error.code === 22) {
            console.warn('Impossible de sauvegarder les favoris : espace de stockage plein');
        }
    }
}

// Permet de sauvegarder l'équipe dans le localStorage
export function sauvegarderEquipe() {
    try {
        localStorage.setItem('pokedex-equipe', JSON.stringify(etat.equipePokemon));
    } catch (error) {
        if (error.name === 'QuotaExceededError' || error.code === 22) {
            console.warn('Impossible de sauvegarder l\'équipe : espace de stockage plein');
        }
    }
}

// Permet de sauvegarder les Pokémon personnalisés dans le localStorage
export function sauvegarderPersonnalises() {
    try {
        localStorage.setItem('pokedex-personnalises', JSON.stringify(etat.pokemonPersonnalises));
        localStorage.setItem('pokedex-prochain-id', etat.prochainIdPersonnalise.toString());
    } catch (error) {
        if (error.name === 'QuotaExceededError' || error.code === 22) {
            // Le localStorage est plein
            alert('Espace de stockage plein !\n\nVous avez trop de Pokémon personnalisés avec des images. Pour continuer :\n\n1. Supprimez quelques Pokémon personnalisés, OU\n2. Créez des Pokémon sans image, OU\n3. Videz le cache du navigateur');

            // Permet de nettoyer automatiquement le localStorage
            const confirmer = confirm('Voulez-vous supprimer tous les Pokémon personnalisés pour libérer de l\'espace ?');
            if (confirmer) {
                etat.pokemonPersonnalises = [];
                localStorage.removeItem('pokedex-personnalises');
                localStorage.setItem('pokedex-prochain-id', '10000');
                alert('Pokémon personnalisés supprimés. Vous pouvez maintenant en créer de nouveaux.');
                // Recharge la page pour afficher les changements
                globalThis.location.reload();
            }
        } else {
            console.error('Erreur lors de la sauvegarde:', error);
        }
    }
}
