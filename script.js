// Configuration
const API_BASE_URL = 'https://pokeapi.co/api/v2';
const POKEMON_PER_PAGE = 20;

// State
let currentOffset = 0;
let allPokemon = [];
let filteredPokemon = [];
let selectedType = '';

// DOM Elements
const pokemonGrid = document.getElementById('pokemonGrid');
const loading = document.getElementById('loading');
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modalBody');
const closeBtn = document.querySelector('.close-btn');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const typeFilter = document.getElementById('typeFilter');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const themeToggle = document.getElementById('themeToggle');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    loadPokemon();
    setupEventListeners();
});

// Theme Functions
function initializeTheme() {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('pokedex-theme') || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
}

function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('pokedex-theme', isDark ? 'dark' : 'light');
}

// Event Listeners
function setupEventListeners() {
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    searchInput.addEventListener('input', handleSearch);
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
    
    typeFilter.addEventListener('change', handleTypeFilter);
    loadMoreBtn.addEventListener('click', loadMorePokemon);
    themeToggle.addEventListener('click', toggleTheme);
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

// API Functions
async function loadPokemon() {
    showLoading();
    try {
        const response = await fetch(`${API_BASE_URL}/pokemon?limit=${POKEMON_PER_PAGE}&offset=${currentOffset}`);
        const data = await response.json();
        
        // Fetch detailed data for each Pokemon
        const pokemonPromises = data.results.map(pokemon => 
            fetch(pokemon.url).then(res => res.json())
        );
        
        const pokemonData = await Promise.all(pokemonPromises);
        allPokemon = [...allPokemon, ...pokemonData];
        filteredPokemon = allPokemon;
        
        displayPokemon(pokemonData);
        currentOffset += POKEMON_PER_PAGE;
    } catch (error) {
        console.error('Erreur lors du chargement des Pokémon:', error);
        pokemonGrid.innerHTML = '<p style="color: white; text-align: center;">Erreur de chargement. Veuillez réessayer.</p>';
    } finally {
        hideLoading();
    }
}

async function loadMorePokemon() {
    await loadPokemon();
}

async function fetchPokemonDetails(id) {
    showLoading();
    try {
        const response = await fetch(`${API_BASE_URL}/pokemon/${id}`);
        const data = await response.json();
        
        // Fetch species data for additional information
        const speciesResponse = await fetch(data.species.url);
        const speciesData = await speciesResponse.json();
        
        displayPokemonDetails(data, speciesData);
    } catch (error) {
        console.error('Erreur lors du chargement des détails:', error);
        modalBody.innerHTML = '<p>Erreur de chargement des détails.</p>';
    } finally {
        hideLoading();
    }
}

// Display Functions
function displayPokemon(pokemonList, append = true) {
    if (!append) {
        pokemonGrid.innerHTML = '';
    }
    
    pokemonList.forEach(pokemon => {
        const card = createPokemonCard(pokemon);
        pokemonGrid.appendChild(card);
    });
}

function createPokemonCard(pokemon) {
    const card = document.createElement('div');
    card.className = 'pokemon-card';
    card.style.animationDelay = `${Math.random() * 0.3}s`;
    
    const types = pokemon.types.map(type => type.type.name);
    const primaryType = types[0];
    
    card.innerHTML = `
        <div class="pokemon-id">#${String(pokemon.id).padStart(3, '0')}</div>
        <img src="${pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}" 
             alt="${pokemon.name}" 
             class="pokemon-image">
        <h3 class="pokemon-name">${pokemon.name}</h3>
        <div class="pokemon-types">
            ${types.map(type => `<span class="type-badge type-${type}">${getTypeName(type)}</span>`).join('')}
        </div>
    `;
    
    // Add background color based on primary type
    card.style.setProperty('--type-color', getTypeColor(primaryType));
    card.querySelector('.pokemon-card::before')?.style.setProperty('background', getTypeColor(primaryType));
    
    card.addEventListener('click', () => showPokemonDetails(pokemon.id));
    
    return card;
}

function displayPokemonDetails(pokemon, speciesData) {
    const types = pokemon.types.map(type => type.type.name);
    
    // Get French description
    const frenchDescription = speciesData.flavor_text_entries.find(
        entry => entry.language.name === 'fr'
    );
    
    const description = frenchDescription ? 
        frenchDescription.flavor_text.replace(/\f/g, ' ') : 
        'Aucune description disponible.';
    
    modalBody.innerHTML = `
        <div class="modal-header">
            <img src="${pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}" 
                 alt="${pokemon.name}" 
                 class="modal-pokemon-image">
            <h2 class="modal-pokemon-name">${pokemon.name}</h2>
            <p class="modal-pokemon-id">#${String(pokemon.id).padStart(3, '0')}</p>
            <div class="pokemon-types">
                ${types.map(type => `<span class="type-badge type-${type}">${getTypeName(type)}</span>`).join('')}
            </div>
        </div>
        
        <div class="info-container">
            <h3 class="section-title">Description</h3>
            <p style="text-align: left; line-height: 1.6; color: #666; margin-bottom: 20px;">${description}</p>
        </div>
        
        <div class="info-container">
            <h3 class="section-title">Informations</h3>
            <div class="info-grid">
                <div class="info-item">
                    <div class="info-label">Taille</div>
                    <div class="info-value">${(pokemon.height / 10).toFixed(1)} m</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Poids</div>
                    <div class="info-value">${(pokemon.weight / 10).toFixed(1)} kg</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Expérience de base</div>
                    <div class="info-value">${pokemon.base_experience}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Habitat</div>
                    <div class="info-value">${speciesData.habitat?.name || 'Inconnu'}</div>
                </div>
            </div>
        </div>
        
        <div class="abilities-container">
            <h3 class="section-title">Capacités</h3>
            <div class="abilities-list">
                ${pokemon.abilities.map(ability => 
                    `<span class="ability-badge">${ability.ability.name.replace('-', ' ')}</span>`
                ).join('')}
            </div>
        </div>
        
        <div class="stats-container">
            <h3 class="stats-title">Statistiques</h3>
            ${pokemon.stats.map(stat => `
                <div class="stat-row">
                    <span class="stat-name">${getStatName(stat.stat.name)}</span>
                    <div class="stat-bar-container">
                        <div class="stat-bar" style="width: ${(stat.base_stat / 255) * 100}%">
                            ${stat.base_stat > 30 ? stat.base_stat : ''}
                        </div>
                    </div>
                    <span class="stat-value">${stat.base_stat}</span>
                </div>
            `).join('')}
        </div>
    `;
    
    openModal();
}

// Search and Filter Functions
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        filteredPokemon = selectedType ? 
            allPokemon.filter(p => p.types.some(t => t.type.name === selectedType)) : 
            allPokemon;
    } else {
        filteredPokemon = allPokemon.filter(pokemon => 
            pokemon.name.toLowerCase().includes(searchTerm) || 
            String(pokemon.id).includes(searchTerm)
        );
        
        if (selectedType) {
            filteredPokemon = filteredPokemon.filter(p => 
                p.types.some(t => t.type.name === selectedType)
            );
        }
    }
    
    displayPokemon(filteredPokemon, false);
}

function handleTypeFilter() {
    selectedType = typeFilter.value;
    
    if (selectedType === '') {
        filteredPokemon = allPokemon;
    } else {
        filteredPokemon = allPokemon.filter(pokemon => 
            pokemon.types.some(type => type.type.name === selectedType)
        );
    }
    
    // Apply search filter if active
    const searchTerm = searchInput.value.toLowerCase().trim();
    if (searchTerm) {
        filteredPokemon = filteredPokemon.filter(pokemon => 
            pokemon.name.toLowerCase().includes(searchTerm) || 
            String(pokemon.id).includes(searchTerm)
        );
    }
    
    displayPokemon(filteredPokemon, false);
}

// Modal Functions
function showPokemonDetails(id) {
    fetchPokemonDetails(id);
}

function openModal() {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Utility Functions
function showLoading() {
    loading.classList.add('active');
}

function hideLoading() {
    loading.classList.remove('active');
}

function getTypeColor(type) {
    const colors = {
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
    return colors[type] || '#777';
}

function getTypeName(type) {
    const typeNames = {
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
    return typeNames[type] || type;
}

function getStatName(stat) {
    const statNames = {
        hp: 'PV',
        attack: 'Attaque',
        defense: 'Défense',
        'special-attack': 'Attaque Spé.',
        'special-defense': 'Défense Spé.',
        speed: 'Vitesse'
    };
    return statNames[stat] || stat;
}
