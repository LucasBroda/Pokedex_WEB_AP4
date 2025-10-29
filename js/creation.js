import { etat, dom } from './config.js';
import { sauvegarderPersonnalises } from './storage.js';
import { afficherPokemon } from './cartes.js';

// Permet d'ouvrir la modale de création de Pokémon
export function ouvrirModaleCreation() {
    dom.modaleCreation.classList.add('actif');
    document.body.style.overflow = 'hidden';
    dom.formulaireCreation.reset();
    reinitialiserErreurs();
}

// Permet de fermer la modale de création
export function fermerModaleCreation() {
    // On retire la classe 'actif' de la modale afin de la fermer
    dom.modaleCreation.classList.remove('actif');
    // Permet de réactiver le scroll de la page
    document.body.style.overflow = 'auto';
    // Permet de réinitialiser le formulaire afin de vider les champs
    dom.formulaireCreation.reset();
    reinitialiserErreurs();
}

// Permet de réinitialiser tous les messages d'erreur du formulaire
function reinitialiserErreurs() {
    // .message-erreur désigne ici la classe css des messages d'erreur
    const messagesErreur = document.querySelectorAll('.message-erreur');
    for (const message of messagesErreur) {
        message.textContent = '';
    }
    
    const champs = document.querySelectorAll('.champ-saisie');
    for (const champ of champs) {
        // .champ-saisie désigne ici la classe css des champs du formulaire, on enlève la classe 'invalide' de ces éléments
        champ.classList.remove('invalide');
    }
    
    document.getElementById('compteurCaracteres').textContent = '0';
    
    // Réinitialiser l'aperçu de l'image
    dom.apercuImage.style.display = 'none';
    dom.imageApercu.src = '';
    dom.champImagePokemon.value = '';
}

// Permet l'affichage d'un message d'erreur pour un champ
function afficherErreur(idChamp, idErreur, message) {
    const champ = document.getElementById(idChamp);
    const erreur = document.getElementById(idErreur);
    champ.classList.add('invalide');
    erreur.textContent = message;
    return false;
}

// Permet de supprimer le message d'erreur pour un champ précis
function effacerErreur(idChamp, idErreur) {
    const champ = document.getElementById(idChamp);
    const erreur = document.getElementById(idErreur);
    champ.classList.remove('invalide');
    erreur.textContent = '';
    return true;
}

// Permet de valider le nom du Pokémon
export function validerNom() {
    // Le .trim() permet de supprimer les espaces avant et après le texte
    const nom = document.getElementById('nomPokemon').value.trim();
    
    if (nom.length === 0) {
        return afficherErreur('nomPokemon', 'erreurNom', 'Le nom est requis');
    }
    
    if (nom.length < 3) {
        return afficherErreur('nomPokemon', 'erreurNom', 'Le nom doit contenir au moins 3 caractères');
    }
    
    if (nom.length > 20) {
        return afficherErreur('nomPokemon', 'erreurNom', 'Le nom ne peut pas dépasser 20 caractères');
    }
    
    // Trouvé sur internet, représente un regex, le .test() prend en paramètre le nom du Pokémon, et vérifie qu'il ne contient que des lettres (majuscules, minuscules, accents), des espaces et des tirets
    if (!/^[a-zA-ZÀ-ÿ\s-]+$/.test(nom)) {
        return afficherErreur('nomPokemon', 'erreurNom', 'Le nom ne peut contenir que des lettres, espaces et tirets');
    }
    
    return effacerErreur('nomPokemon', 'erreurNom');
}

// Permet de valider le type du Pokémon lors de la création
export function validerType() {
    const type = document.getElementById('typePokemon').value;
    
    if (!type) {
        return afficherErreur('typePokemon', 'erreurType', 'Veuillez sélectionner un type');
    }
    
    return effacerErreur('typePokemon', 'erreurType');
}

// Permet de valider la taille du Pokémon
export function validerTaille() {
    const taille = document.getElementById('taillePokemon').value;
    
    if (!taille) {
        return afficherErreur('taillePokemon', 'erreurTaille', 'La taille est requise');
    }
    
    // Permet de convertir la taille en nombre à virgule flottante
    const tailleNum = Number.parseFloat(taille);
    
    if (Number.isNaN(tailleNum) || tailleNum < 0.1) {
        return afficherErreur('taillePokemon', 'erreurTaille', 'La taille minimum est 0.1m');
    }
    
    if (tailleNum > 20) {
        return afficherErreur('taillePokemon', 'erreurTaille', 'La taille maximum est 20m');
    }
    
    return effacerErreur('taillePokemon', 'erreurTaille');
}

// Permet de valider le poids du Pokémon
export function validerPoids() {
    const poids = document.getElementById('poidsPokemon').value;
    
    if (!poids) {
        return afficherErreur('poidsPokemon', 'erreurPoids', 'Le poids est requis');
    }
    
    const poidsNum = Number.parseFloat(poids);
    
    if (Number.isNaN(poidsNum) || poidsNum < 0.1) {
        return afficherErreur('poidsPokemon', 'erreurPoids', 'Le poids minimum est 0.1kg');
    }
    
    if (poidsNum > 1000) {
        return afficherErreur('poidsPokemon', 'erreurPoids', 'Le poids maximum est 1000kg');
    }
    
    return effacerErreur('poidsPokemon', 'erreurPoids');
}

// Permet de valider la description du Pokémon
export function validerDescription() {
    const description = document.getElementById('descriptionPokemon').value.trim();
    const compteur = document.getElementById('compteurCaracteres');
    
    compteur.textContent = description.length;
    
    if (description.length === 0) {
        return afficherErreur('descriptionPokemon', 'erreurDescription', 'La description est requise');
    }
    
    if (description.length < 20) {
        return afficherErreur('descriptionPokemon', 'erreurDescription', `La description doit contenir au moins 20 caractères (${description.length}/20)`);
    }
    
    if (description.length > 200) {
        return afficherErreur('descriptionPokemon', 'erreurDescription', 'La description ne peut pas dépasser 200 caractères');
    }
    
    return effacerErreur('descriptionPokemon', 'erreurDescription');
}

// Gère la sélection de l'image du Pokémon
export function gererSelectionImage(e) {
    const fichier = e.target.files[0];
    
    if (!fichier) {
        return;
    }
    
    // Vérifie le type de fichier afin de n'accepter que les images
    const typesAutorises = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
    if (!typesAutorises.includes(fichier.type)) {
        afficherErreur('imagePokemon', 'erreurImage', 'Format non supporté. Utilisez PNG, JPG, GIF ou WEBP');
        dom.champImagePokemon.value = '';
        return;
    }
    
    // Vérifie la taille (max 5 Mo) afin de ne pas surcharger le localStorage
    const tailleMax = 5 * 1024 * 1024; // 5 Mo en octets, trouvé sur internet
    if (fichier.size > tailleMax) {
        afficherErreur('imagePokemon', 'erreurImage', 'L\'image est trop volumineuse (max 5 Mo)');
        dom.champImagePokemon.value = '';
        return;
    }
    
    // Lire et afficher l'aperçu
    const lecteur = new FileReader();
    lecteur.addEventListener('load', (event) => {
        dom.imageApercu.src = event.target.result;
        dom.apercuImage.style.display = 'block';
        effacerErreur('imagePokemon', 'erreurImage');
    });
    lecteur.readAsDataURL(fichier);
}

// Permet de supprimer l'image sélectionnée
export function supprimerImage() {
    dom.champImagePokemon.value = '';
    // Permet de cacher l'aperçu de l'image
    dom.apercuImage.style.display = 'none';
    dom.imageApercu.src = '';
    effacerErreur('imagePokemon', 'erreurImage');
}

// Permet de valider l'ensemble du formulaire en appellant chaque fonction de validation créée précédemment
function validerFormulaire() {
    const validations = [
        validerNom(),
        validerType(),
        validerTaille(),
        validerPoids(),
        validerDescription()
    ];
    
    // Retourne true si toutes les validations sont vraies, sinon false
    return validations.every(v => v === true);
}

// Permet de gérer la soumission du formulaire de création de Pokémon personnalisé
export function gererSoumissionFormulaire(e) {
    e.preventDefault();
    
    if (!validerFormulaire()) {
        return;
    }
    
    // Récupère les valeurs du formulaire
    const nom = document.getElementById('nomPokemon').value.trim();
    const type = document.getElementById('typePokemon').value;
    const taille = Number.parseFloat(document.getElementById('taillePokemon').value);
    const poids = Number.parseFloat(document.getElementById('poidsPokemon').value);
    const description = document.getElementById('descriptionPokemon').value.trim();

    // Récupère l'image (soit celle téléchargée, soit une par défaut) mais ça marche pas mdr
    let urlImage = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/0.png';
    
    // Si une image a été sélectionnée, on utilise son URL en base64
    if (dom.imageApercu.src?.startsWith('data:')) {
        urlImage = dom.imageApercu.src; // Utiliser l'image en base64
    }
    
    // Crée le Pokémon personnalisé avec les données saisies plus haut ainsi que des valeurs par défaut pour les autres propriétés
    const pokemonPersonnalise = {
        id: etat.prochainIdPersonnalise++,
        name: nom.toLowerCase(),
        height: Math.round(taille * 10),
        weight: Math.round(poids * 10),
        base_experience: 100,
        sprites: {
            front_default: urlImage,
            other: {
                'official-artwork': {
                    front_default: urlImage
                }
            }
        },
        types: [
            {
                type: {
                    name: type
                }
            }
        ],
        abilities: [
            {
                ability: {
                    name: 'personnalise'
                }
            }
        ],
        stats: [
            { stat: { name: 'hp' }, base_stat: 80 },
            { stat: { name: 'attack' }, base_stat: 80 },
            { stat: { name: 'defense' }, base_stat: 80 },
            { stat: { name: 'special-attack' }, base_stat: 80 },
            { stat: { name: 'special-defense' }, base_stat: 80 },
            { stat: { name: 'speed' }, base_stat: 80 }
        ],
        species: {
            url: 'custom'
        },
        description: description,
        personnalise: true
    };
    
    // Ajoute aux listes
    etat.pokemonPersonnalises.push(pokemonPersonnalise);
    
    // Vérifie si le Pokémon personnalisé n'est pas déjà dans tousLesPokemon
    const existeDeja = etat.tousLesPokemon.some(p => p.id === pokemonPersonnalise.id);
    if (!existeDeja) {
        etat.tousLesPokemon.unshift(pokemonPersonnalise); // Ajoute au début grâce à unshift
    }
    
    etat.pokemonFiltres = etat.tousLesPokemon;
    
    // Sauvegarde les Pokémon personnalisés dans le localStorage dédié
    sauvegarderPersonnalises();
    
    // Affiche le nouveau Pokémon
    afficherPokemon(etat.tousLesPokemon, false);

    // Ferme la modale
    fermerModaleCreation();
    
    // Message de succès
    alert(`✨ ${nom} a été créé avec succès !`);
}

// Permet de configurer les écouteurs d'événements liés à la création de Pokémon personnalisé
export function configurerEcouteursCreation() {
    dom.boutonCreerPokemon.addEventListener('click', ouvrirModaleCreation);
    dom.boutonFermerCreation.addEventListener('click', fermerModaleCreation);
    dom.boutonAnnuler.addEventListener('click', fermerModaleCreation);
    dom.modaleCreation.addEventListener('click', (e) => {
        if (e.target === dom.modaleCreation) fermerModaleCreation();
    });
    dom.formulaireCreation.addEventListener('submit', gererSoumissionFormulaire);
    
    // Validation en temps réel
    document.getElementById('nomPokemon').addEventListener('input', validerNom);
    document.getElementById('typePokemon').addEventListener('change', validerType);
    document.getElementById('taillePokemon').addEventListener('input', validerTaille);
    document.getElementById('poidsPokemon').addEventListener('input', validerPoids);
    document.getElementById('descriptionPokemon').addEventListener('input', validerDescription);
    dom.champImagePokemon.addEventListener('change', gererSelectionImage);
    dom.boutonSupprimerImage.addEventListener('click', supprimerImage);
}
