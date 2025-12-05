// DotA 2 Spy Game - JavaScript
// NOTE: This file is deprecated. The application now uses a modular architecture.
// See js/characters.js, js/gameState.js, js/ui.js, and js/main.js instead.
// This file is kept for backward compatibility only.
    // Game state
    let gameState = {
        players: [],
        spyIndex: -1,
        selectedCharacter: '',
        currentPlayer: 0
    };

    // Timers for animations
    let flipTimer = null;
    let showNextButtonTimer = null;

    // DotA 2 characters list
    const dotaCharacters = [
        'abaddon', 'alchemist', 'ancient-apparition', 'anti-mage', 'arc-warden', 'axe', 'bane', 'batrider',
        'beastmaster', 'bloodseeker', 'bounty-hunter', 'brewmaster', 'bristleback', 'broodmother', 'centaur-warrunner',
        'chaos-knight', 'chen', 'clinkz', 'clockwerk', 'crystal-maiden', 'dark-seer', 'dark-willow', 'dawnbreaker',
        'dazzle', 'death-prophet', 'disruptor', 'doom', 'dragon-knight', 'drow-ranger', 'earthshaker', 'earth-spirit',
        'elder-titan', 'ember-spirit', 'enchantress', 'enigma', 'faceless-void', 'grimstroke', 'gyrocopter', 'hoodwink',
        'huskar', 'invoker', 'io', 'jakiro', 'juggernaut', 'keeper-of-the-light', 'kunkka', 'legion-commander',
        'leshrac', 'lich', 'lifestealer', 'lina', 'lion', 'lone-druid', 'luna', 'lycan', 'magnus', 'marci', 'mars',
        'medusa', 'meepo', 'mirana', 'monkey-king', 'morphling', 'muerta', 'naga-siren', "nature's-prophet", 'necrophos',
        'night-stalker', 'nyx-assassin', 'ogre-magi', 'omniknight', 'oracle', 'outworld-destroyer', 'pangolier', 'phantom-assassin',
        'phantom-lancer', 'phoenix', 'primal-beast', 'puck', 'pudge', 'pugna', 'queen-of-pain', 'razor', 'riki',
        'ringmaster', 'rubick', 'sand-king', 'shadow-demon', 'shadow-fiend', 'shadow-shaman', 'silencer', 'skywrath-mage',
        'slardar', 'slark', 'snapfire', 'sniper', 'spectre', 'spirit-breaker', 'storm-spirit', 'sven', 'techies',
        'templar-assassin', 'terrorblade', 'tidehunter', 'timbersaw', 'tinker', 'tiny', 'treant-protector', 'troll-warlord',
        'tusk', 'underlord', 'undying', 'ursa', 'vengeful-spirit', 'venomancer', 'viper', 'visage', 'void-spirit',
        'warlock', 'weaver', 'windranger', 'winter-wyvern', 'witch-doctor', 'wraith-king', 'zeus'
    ];

    // DOM Elements
    const playerCountSlider = document.getElementById('playerCountSlider');
    const playerCountDisplay = document.getElementById('playerCountDisplay');
    const startGameBtn = document.getElementById('startGameBtn');
    const cardInner = document.getElementById('cardInner');
    const cardFront = document.getElementById('cardFront');
    const cardBack = document.getElementById('cardBack');
    const characterImage = document.getElementById('characterImage');
    const characterName = document.getElementById('characterName');
    const nextPlayerBtn = document.getElementById('nextPlayerBtn');
    const startGameFinalBtn = document.getElementById('startGameFinalBtn');
    const resetGameBtn = document.getElementById('resetGameBtn');
    const playerNumber = document.getElementById('playerNumber');
    const totalPlayers = document.getElementById('totalPlayers');

    // Load saved player count from localStorage if it exists
    const savedPlayerCount = localStorage.getItem('playerCount');
    if (savedPlayerCount) {
        playerCountSlider.value = parseInt(savedPlayerCount);
        playerCountDisplay.textContent = savedPlayerCount;
    }

    // Player count screen elements
    const playerCountScreen = document.getElementById('player-count-screen');
    const cardScreen = document.getElementById('card-screen');
    const gameStartedScreen = document.getElementById('game-started-screen');

    // Update player count display when slider changes
    playerCountSlider.addEventListener('input', function() {
        playerCountDisplay.textContent = this.value;
        // Save the value to localStorage
        localStorage.setItem('playerCount', this.value);
    });

    // Start game button click event
    startGameBtn.addEventListener('click', function() {
        const playerCount = parseInt(playerCountSlider.value);
        initializeGame(playerCount);
        showCardScreen();
    });

    // Card front click event (to reveal character)
    cardFront.addEventListener('click', function() {
        revealCharacter();
    });

    // Next player button click event
    nextPlayerBtn.addEventListener('click', function() {
        // Clear the button timer to prevent conflicts
        if (showNextButtonTimer) clearTimeout(showNextButtonTimer);

        // Move to next player
        gameState.currentPlayer++;

        if (gameState.currentPlayer < gameState.players.length) {
            // Reset card for next player
            resetCard();
        } else {
            // This condition shouldn't happen with our new logic, but just in case
            nextPlayerBtn.classList.add('hidden');
            startGameFinalBtn.classList.remove('hidden');
            startGameFinalBtn.classList.remove('disabled');
        }
    });

    // Final start game button click event
    startGameFinalBtn.addEventListener('click', function() {
        // Move to next player (which should be beyond the last player)
        gameState.currentPlayer++;
        showGameStartedScreen();
    });

    // Reset game button click event
    resetGameBtn.addEventListener('click', function() {
        resetGame();
    });

    // Initialize the game
    function initializeGame(playerCount) {
        gameState.players = Array.from({length: playerCount}, (_, i) => i);

        // Randomly select spy
        gameState.spyIndex = Math.floor(Math.random() * playerCount);

        // Randomly select character
        const randomIndex = Math.floor(Math.random() * dotaCharacters.length);
        gameState.selectedCharacter = dotaCharacters[randomIndex];

        gameState.currentPlayer = 0;
    }

    // Reveal character on the card
    function revealCharacter() {
        // Check if card is already revealed to prevent multiple clicks
        if (cardInner.classList.contains('flipped')) {
            return;
        }

        if (gameState.currentPlayer === gameState.spyIndex) {
            // Show spy icon for the spy player
            characterImage.alt = 'ШПИОН';
            characterImage.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24">
                    <rect width="24" height="24" fill="#2a2a2a" rx="4"/>
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2V7zm0 8h2v2h-2v-2z" fill="white"/>
                </svg>
            `);
            characterName.textContent = 'ШПИОН';
        } else {
            // Show selected character for other players
            characterImage.alt = gameState.selectedCharacter.replace(/-/g, ' ');

            // Map special character name variations for the CDN
            let cdnCharacterName = gameState.selectedCharacter;
            const nameVariations = {
                'shadow-fiend': 'nevermore',  // Shadow Fiend's internal name is nevermore
                'wraith-king': 'wraith_king', // Wraith King's underscore format for CDN
                "nature's-prophet": 'furion',  // Nature's Prophet's internal name is furion
                'windranger': 'windrunner',  // Windranger is internally called windrunner
                'underlord': 'abyssal_underlord',  // Underlord's full name is abyssal_underlord
                'zeus': 'zuus',  // Zeus is internally called zuus in some Valve systems
                'vengeful-spirit': 'vengefulspirit',  // Vengeful Spirit might be stored without underscore
                'centaur-warrunner': 'centaur',  // Centaur Warrunner might be stored as just centaur
                'treant-protector': 'treant',  // Treant Protector might be stored as treant
                'timbersaw': 'shredder',  // Timbersaw's original name was Shredder
                'anti-mage': 'antimage',  // Anti-Mage is internally called antimage (no hyphen)
                'clockwerk': 'rattletrap',  // Clockwerk's internal/old name is rattletrap
                'doom': 'doom_bringer',  // Doom's full internal name might be doom_bringer
                'io': 'wisp',  // Io was previously called Wisp
                'lifestealer': 'life_stealer',  // Lifestealer might be stored with underscore
                'magnus': 'magnataur',  // Magnus is internally called magnataur
                'necrophos': 'necrolyte',  // Necrophos might be stored as necrolyte (old name)
                'outworld-destroyer': 'obsidian_destroyer',  // Outworld Destroyer's internal name is obsidian_destroyer
                'queen-of-pain': 'queenofpain'  // Queen of Pain might be stored without hyphens
            };

            if (nameVariations[gameState.selectedCharacter]) {
                cdnCharacterName = nameVariations[gameState.selectedCharacter];
            }

            // Try the primary CDN URL format first
            characterImage.src = `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${cdnCharacterName}.png`;
            characterName.textContent = gameState.selectedCharacter.replace(/-/g, ' ').toUpperCase();
        }

        // Set proper display properties for the image
        characterImage.style.display = 'block';
        characterImage.style.width = '100%';
        characterImage.style.height = 'auto';
        characterImage.style.maxHeight = '320px';
        characterImage.style.borderRadius = '4px';

        // Debug: log the image properties
        console.log('Image properties set:', {
            src: characterImage.src,
            display: characterImage.style.display,
            alt: characterImage.alt
        });

        // Set error handler for character images (not needed for spy SVG)
        // Create a closure to capture gameState.selectedCharacter
        const selectedCharacter = gameState.selectedCharacter;
        characterImage.onerror = function() {
            // Initialize fallback counter on the image element if it doesn't exist
            if (typeof this.fallbackAttempt === 'undefined') {
                this.fallbackAttempt = 0;
            }

            const originalName = selectedCharacter;  // Use captured variable

            // Define multiple fallback sources and naming conventions to try
            const fallbacks = [
                // Try underscore format on primary CDN
                `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${originalName.replace(/-/g, '_')}.png`,
                // Alternative Steam CDN
                `https://steamcdn-a.akamaihd.net/apps/dota2/images/dota_react/heroes/${originalName}.png`,
                // Alternative underscore format on Steam CDN
                `https://steamcdn-a.akamaihd.net/apps/dota2/images/dota_react/heroes/${originalName.replace(/-/g, '_')}.png`,
                // Alternative Steam CDN 2
                `https://media.st.dota2.com/apps/dota2/images/dota_react/heroes/${originalName}.png`,
                // Try the old Valve CDN with full suffix
                `http://cdn.dota2.com/apps/dota2/images/heroes/${originalName}_full.png`,
                // Try the old Valve CDN with portrait suffix
                `http://cdn.dota2.com/apps/dota2/images/heroes/${originalName}_vert.jpg`,
                // Try underscore with old CDN
                `http://cdn.dota2.com/apps/dota2/images/heroes/${originalName.replace(/-/g, '_')}_full.png`,
                // Try special name variations on old CDN
                originalName === 'shadow-fiend' ? `http://cdn.dota2.com/apps/dota2/images/heroes/nevermore_full.png` :
                originalName === 'wraith-king' ? `http://cdn.dota2.com/apps/dota2/images/heroes/skeleton_king_full.png` :
                originalName === "nature's-prophet" ? `http://cdn.dota2.com/apps/dota2/images/heroes/furion_full.png` : null,
                // Additional special cases that need specific handling
                originalName === 'windranger' ? `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/windrunner.png` :
                originalName === 'brewmaster' ? `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/brewmaster_storm.png` :
                originalName === 'wraith-king' ? `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/skeleton_king.png` :
                originalName === 'vengeful-spirit' ? `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/vengefulspirit.png` :
                originalName === 'centaur-warrunner' ? `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/centaur.png` :
                originalName === 'treant-protector' ? `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/treant.png` :
                originalName === 'timbersaw' ? `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/shredder.png` :
                originalName === 'anti-mage' ? `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/antimage.png` :
                originalName === 'clockwerk' ? `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/rattletrap.png` :
                originalName === 'doom' ? `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/doom_bringer.png` :
                originalName === 'io' ? `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/wisp.png` :
                originalName === 'lifestealer' ? `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/life_stealer.png` :
                originalName === 'magnus' ? `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/magnataur.png` :
                originalName === 'necrophos' ? `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/necrolyte.png` :
                originalName === 'outworld-destroyer' ? `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/obsidian_destroyer.png` :
                originalName === 'queen-of-pain' ? `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/queenofpain.png` : null,
                // Liquipedia fallback - these are reliable community-maintained images
                `https://liquipedia.net/dota2/images/${originalName.replace(/^./, originalName[0].toUpperCase())}.png`, // Capitalize first letter
                // Alternative Liquipedia pattern
                `https://liquipedia.net/dota2/images/thumb/${originalName.replace(/^./, originalName[0].toUpperCase())}.png/200px-${originalName.replace(/^./, originalName[0].toUpperCase())}.png`,
                // Fandom/Wiki alternative
                `https://dota2.gamepedia.com/images/thumb/${originalName.replace(/^./, originalName[0].toUpperCase())}.png/200px-${originalName.replace(/^./, originalName[0].toUpperCase())}.png`,
                // Another Fandom/Wiki pattern
                `https://dota2.fandom.com/wiki/File:${originalName.replace(/^./, originalName[0].toUpperCase())}.png`,
                // Additional wiki pattern
                `https://static.wikia.nocookie.net/dota2_gamepedia/images/thumb/${originalName.replace(/^./, originalName[0].toUpperCase())}.png/200px-${originalName.replace(/^./, originalName[0].toUpperCase())}.png`,
            ].filter(Boolean); // Remove null values

            // Try the next fallback if available
            if (this.fallbackAttempt < fallbacks.length) {
                this.src = fallbacks[this.fallbackAttempt];
                this.fallbackAttempt++;
            } else {
                // Final fallback to SVG with character name
                this.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(`
                    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
                        <rect width="200" height="200" fill="#333" rx="4"/>
                        <text x="100" y="100" font-family="Arial" font-size="14" fill="white" text-anchor="middle" dominant-baseline="middle">
                            ${originalName.replace(/-/g, ' ').toUpperCase()}
                        </text>
                    </svg>
                `);
                // If the fallback SVG also fails, then hide the element
                this.onerror = function() {
                    this.style.display = 'none';
                };
            }
        };

        // Update player indicator
        playerNumber.textContent = gameState.currentPlayer + 1;
        totalPlayers.textContent = gameState.players.length;

        // Clear any existing timers to prevent conflicts
        if (flipTimer) clearTimeout(flipTimer);
        if (showNextButtonTimer) clearTimeout(showNextButtonTimer);

        // Flip the card to show the back
        flipTimer = setTimeout(() => {
            cardInner.classList.add('flipped');

            // Show appropriate button after a short delay to allow animation
            showNextButtonTimer = setTimeout(() => {
                if (gameState.currentPlayer === gameState.players.length - 1) {
                    // Last player - show "Start Game" button
                    startGameFinalBtn.classList.remove('disabled'); // Enable the button
                } else {
                    // Other players - show "Next Player" button
                    nextPlayerBtn.classList.remove('disabled'); // Enable the button
                }
            }, 300);
        }, 100);
    }

    // Reset card for next player
    function resetCard() {
        // Clear timers to prevent conflicts
        if (flipTimer) clearTimeout(flipTimer);
        if (showNextButtonTimer) clearTimeout(showNextButtonTimer);

        // Flip card back to front
        cardInner.classList.remove('flipped');

        // Update player indicator
        playerNumber.textContent = gameState.currentPlayer + 1;
        totalPlayers.textContent = gameState.players.length;

        // Determine which button to show based on player position
        if (gameState.currentPlayer === gameState.players.length - 1) {
            // Last player - show "Start Game" button (disabled initially)
            nextPlayerBtn.classList.add('hidden');
            startGameFinalBtn.classList.remove('hidden');
            startGameFinalBtn.classList.add('disabled'); // Keep button disabled initially
        } else {
            // Other players (including first) - show "Next Player" button (disabled initially)
            nextPlayerBtn.classList.remove('hidden');
            nextPlayerBtn.classList.add('disabled'); // Keep button disabled initially
            startGameFinalBtn.classList.add('hidden');
        }

        // Reset character info
        characterImage.src = '';
        characterImage.alt = ''; // Clear alt attribute to prevent showing text
        characterImage.style.display = 'none'; // Hide the image element until new content is set
        characterImage.style.backgroundColor = '';
        characterImage.style.width = '';
        characterImage.style.height = '';
        characterImage.style.borderRadius = '';
        characterImage.innerHTML = '';
        characterImage.fallbackAttempt = 0; // Reset fallback counter
        characterImage.onerror = null; // Remove error handler
        characterName.textContent = '';
    }


    // Show card screen
    function showCardScreen() {
        playerCountScreen.classList.add('hidden');
        cardScreen.classList.remove('hidden');
        gameStartedScreen.classList.add('hidden');

        // Update player indicator
        playerNumber.textContent = gameState.currentPlayer + 1;
        totalPlayers.textContent = gameState.players.length;

        // For the first player, show "Next Player" button (disabled initially)
        // since gameState.currentPlayer starts at 0
        nextPlayerBtn.classList.remove('hidden');
        nextPlayerBtn.classList.add('disabled'); // Keep button disabled initially
        startGameFinalBtn.classList.add('hidden');
    }

    // Show game started screen
    function showGameStartedScreen() {
        playerCountScreen.classList.add('hidden');
        cardScreen.classList.add('hidden');
        gameStartedScreen.classList.remove('hidden');

        // Update player indicator to show the final player
        playerNumber.textContent = gameState.players.length;
        totalPlayers.textContent = gameState.players.length;

        // Explicitly hide buttons to ensure clean state
        nextPlayerBtn.classList.add('hidden');
        startGameFinalBtn.classList.add('hidden');
    }

    // Reset game to initial state
    function resetGame() {
        // Clear timers to prevent conflicts
        if (flipTimer) clearTimeout(flipTimer);
        if (showNextButtonTimer) clearTimeout(showNextButtonTimer);

        playerCountScreen.classList.remove('hidden');
        cardScreen.classList.add('hidden');
        gameStartedScreen.classList.add('hidden');

        // Reset game state
        gameState = {
            players: [],
            spyIndex: -1,
            selectedCharacter: '',
            currentPlayer: 0
        };

        // Keep the player count that was previously selected
        // Do not reset the slider value as it should remember the last selection

        // Update the display to match the slider value
        playerCountDisplay.textContent = playerCountSlider.value;
        // Update player indicator to default values
        playerNumber.textContent = '1';
        totalPlayers.textContent = playerCountSlider.value;
        resetCard();
        // Buttons will be set correctly in resetCard() based on currentPlayer
    }
});