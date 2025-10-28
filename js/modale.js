import { etat, dom } from './config.js';
import { obtenirNomType, obtenirNomStat } from './utils.js';
import { basculerFavori } from './favoris.js';

/**
 * Ouvre la modale
 */
export function ouvrirModale() {
    dom.modale.classList.add('actif');
    document.body.style.overflow = 'hidden';
}

/**
 * Ferme la modale
 */
export function fermerModale() {
    dom.modale.classList.remove('actif');
    document.body.style.overflow = 'auto';
}

/**
 * Affiche les détails d'un Pokémon de l'API
 * @param {Object} pokemon - Les données du Pokémon
 * @param {Object} donneesEspece - Les données d'espèce du Pokémon
 */
export function afficherDetailsPokemon(pokemon, donneesEspece) {
    const types = pokemon.types.map(type => type.type.name);
    
    // Obtenir la description en français
    const descriptionFrancaise = donneesEspece.flavor_text_entries.find(
        entree => entree.language.name === 'fr'
    );
    
    const description = descriptionFrancaise ? 
        descriptionFrancaise.flavor_text.replaceAll('\f', ' ') : 
        'Aucune description disponible.';
    
    const estFavori = etat.pokemonFavoris.includes(pokemon.id);
    
    dom.corpsModale.innerHTML = `
        <div class="entete-modale">
            <button class="bouton-favori-modale ${estFavori ? 'actif' : ''}" data-id="${pokemon.id}" title="${estFavori ? 'Retirer des favoris' : 'Ajouter aux favoris'}">
                ${estFavori ? '❤️' : '🤍'}
            </button>
            <img src="${pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}" 
                 alt="${pokemon.name}" 
                 class="image-pokemon-modale">
            <h2 class="nom-pokemon-modale">${pokemon.name}</h2>
            <p class="identifiant-pokemon-modale">#${String(pokemon.id).padStart(3, '0')}</p>
            <div class="types-pokemon">
                ${types.map(type => `<span class="badge-type type-${type}">${obtenirNomType(type)}</span>`).join('')}
            </div>
        </div>
        
        <div class="conteneur-info">
            <h3 class="titre-section">Description</h3>
            <p style="text-align: left; line-height: 1.6; color: #666; margin-bottom: 20px;">${description}</p>
        </div>
        
        <div class="conteneur-info">
            <h3 class="titre-section">Informations</h3>
            <div class="grille-info">
                <div class="element-info">
                    <div class="etiquette-info">Taille</div>
                    <div class="valeur-info">${(pokemon.height / 10).toFixed(1)} m</div>
                </div>
                <div class="element-info">
                    <div class="etiquette-info">Poids</div>
                    <div class="valeur-info">${(pokemon.weight / 10).toFixed(1)} kg</div>
                </div>
                <div class="element-info">
                    <div class="etiquette-info">Expérience de base</div>
                    <div class="valeur-info">${pokemon.base_experience}</div>
                </div>
                <div class="element-info">
                    <div class="etiquette-info">Habitat</div>
                    <div class="valeur-info">${donneesEspece.habitat?.name || 'Inconnu'}</div>
                </div>
            </div>
        </div>
        
        <div class="conteneur-capacites">
            <h3 class="titre-section">Capacités</h3>
            <div class="liste-capacites">
                ${pokemon.abilities.map(capacite => 
                    `<span class="badge-capacite">${capacite.ability.name.replace('-', ' ')}</span>`
                ).join('')}
            </div>
        </div>
        
        <div class="conteneur-statistiques">
            <h3 class="titre-statistiques">Statistiques</h3>
            ${pokemon.stats.map(stat => `
                <div class="ligne-stat">
                    <span class="nom-stat">${obtenirNomStat(stat.stat.name)}</span>
                    <div class="conteneur-barre-stat">
                        <div class="barre-stat" style="width: ${(stat.base_stat / 255) * 100}%">
                            ${stat.base_stat > 30 ? stat.base_stat : ''}
                        </div>
                    </div>
                    <span class="valeur-stat">${stat.base_stat}</span>
                </div>
            `).join('')}
        </div>
    `;
    
    // Ajouter l'écouteur pour le bouton favori dans la modale
    const boutonFavoriModale = dom.corpsModale.querySelector('.bouton-favori-modale');
    boutonFavoriModale.addEventListener('click', () => {
        basculerFavori(pokemon.id);
    });
    
    ouvrirModale();
}

/**
 * Affiche les détails d'un Pokémon personnalisé
 * @param {Object} pokemon - Les données du Pokémon personnalisé
 */
export function afficherDetailsPokemonPersonnalise(pokemon) {
    const types = pokemon.types.map(type => type.type.name);
    const estFavori = etat.pokemonFavoris.includes(pokemon.id);
    
    dom.corpsModale.innerHTML = `
        <div class="entete-modale">
            <button class="bouton-favori-modale ${estFavori ? 'actif' : ''}" data-id="${pokemon.id}" title="${estFavori ? 'Retirer des favoris' : 'Ajouter aux favoris'}">
                ${estFavori ? '❤️' : '🤍'}
            </button>
            <span class="badge-personnalise">✨ Personnalisé</span>
            <img src="${pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}" 
                 alt="${pokemon.name}" 
                 class="image-pokemon-modale">
            <h2 class="nom-pokemon-modale">${pokemon.name}</h2>
            <p class="identifiant-pokemon-modale">#${String(pokemon.id).padStart(5, '0')}</p>
            <div class="types-pokemon">
                ${types.map(type => `<span class="badge-type type-${type}">${obtenirNomType(type)}</span>`).join('')}
            </div>
        </div>
        
        <div class="conteneur-info">
            <h3 class="titre-section">Description</h3>
            <p style="text-align: left; line-height: 1.6; color: #666; margin-bottom: 20px;">${pokemon.description}</p>
        </div>
        
        <div class="conteneur-info">
            <h3 class="titre-section">Informations</h3>
            <div class="grille-info">
                <div class="element-info">
                    <div class="etiquette-info">Taille</div>
                    <div class="valeur-info">${(pokemon.height / 10).toFixed(1)} m</div>
                </div>
                <div class="element-info">
                    <div class="etiquette-info">Poids</div>
                    <div class="valeur-info">${(pokemon.weight / 10).toFixed(1)} kg</div>
                </div>
                <div class="element-info">
                    <div class="etiquette-info">Expérience de base</div>
                    <div class="valeur-info">${pokemon.base_experience}</div>
                </div>
                <div class="element-info">
                    <div class="etiquette-info">Type</div>
                    <div class="valeur-info">Personnalisé</div>
                </div>
            </div>
        </div>
        
        <div class="conteneur-statistiques">
            <h3 class="titre-statistiques">Statistiques</h3>
            ${pokemon.stats.map(stat => `
                <div class="ligne-stat">
                    <span class="nom-stat">${obtenirNomStat(stat.stat.name)}</span>
                    <div class="conteneur-barre-stat">
                        <div class="barre-stat" style="width: ${(stat.base_stat / 255) * 100}%">
                            ${stat.base_stat > 30 ? stat.base_stat : ''}
                        </div>
                    </div>
                    <span class="valeur-stat">${stat.base_stat}</span>
                </div>
            `).join('')}
        </div>
    `;
    
    // Ajouter l'écouteur pour le bouton favori dans la modale
    const boutonFavoriModale = dom.corpsModale.querySelector('.bouton-favori-modale');
    boutonFavoriModale.addEventListener('click', () => {
        basculerFavori(pokemon.id);
    });
    
    ouvrirModale();
}

/**
 * Configure les écouteurs d'événements pour la modale
 */
export function configurerEcouteursModale() {
    dom.boutonFermer.addEventListener('click', fermerModale);
    dom.modale.addEventListener('click', (e) => {
        if (e.target === dom.modale) fermerModale();
    });
}
