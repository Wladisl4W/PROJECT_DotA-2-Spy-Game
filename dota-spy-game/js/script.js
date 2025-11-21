// DotA 2 Spy Game - JavaScript
document.addEventListener('DOMContentLoaded', function() {
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
        'beastmaster', 'bloodseeker', 'bounty-hunter', 'brewmaster', 'bristleback', 'broodmother', 'centaur', 
        'chaos-knight', 'chen', 'clinkz', 'clockwerk', 'crystal-maiden', 'dark-seer', 'dark-willow', 'dawnbreaker', 
        'dazzle', 'death-prophet', 'disruptor', 'doom', 'dragon-knight', 'drow-ranger', 'earth-shaker', 'earth-spirit', 
        'elder-titan', 'ember-spirit', 'enchantress', 'enigma', 'faceless-void', 'grimstroke', 'gyrocopter', 'hoodwink', 
        'huskar', 'invoker', 'io', 'jakiro', 'juggernaut', 'keeper-of-the-light', 'kunkka', 'legion-commander', 
        'leshrac', 'lich', 'lifestealer', 'lina', 'lion', 'lone-druid', 'luna', 'lycan', 'magnus', 'marci', 'mars', 
        'medusa', 'meepo', 'mirana', 'monkey-king', 'morphling', 'muerta', 'naga-siren', 'natures-prophet', 'necrophos', 
        'night-stalker', 'nyx-assassin', 'ogre-magi', 'omniknight', 'oracle', 'pangolier', 'phantom-assassin', 
        'phantom-lancer', 'phoenix', 'primal-beast', 'puck', 'pudge', 'pugna', 'queen-of-pain', 'razor', 'riki', 
        'rubick', 'sand-king', 'shadow-demon', 'shadow-fiend', 'shadow-shaman', 'silencer', 'skeleton-king', 'skywrath-mage', 
        'slardar', 'slark', 'snapfire', 'sniper', 'spectre', 'spirit-breaker', 'storm-spirit', 'sven', 'techies', 
        'templar-assassin', 'terrorblade', 'tidehunter', 'timbersaw', 'tinker', 'tiny', 'treant-protector', 'troll-warlord', 
        'tusk', 'underlord', 'undying', 'ursa', 'vengeful-spirit', 'venomancer', 'viper', 'visage', 'void-spirit', 
        'warlock', 'weaver', 'windranger', 'winter-wyvern', 'wisp', 'witch-doctor', 'wraith-king', 'zeus'
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
            characterImage.style.display = ''; // Show the image element
            characterImage.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24">
                    <rect width="24" height="24" fill="#2a2a2a" rx="4"/>
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2V7zm0 8h2v2h-2v-2z" fill="white"/>
                </svg>
            `);
            characterImage.style.backgroundColor = '#2a2a2a'; // Dark gray background
            characterImage.style.width = '200px';
            characterImage.style.height = '200px';
            characterImage.style.borderRadius = '5px';
            characterImage.innerHTML = '';
            characterImage.onerror = function() {
                // Fallback for spy icon if SVG fails
                this.style.display = 'flex';
                this.style.alignItems = 'center';
                this.style.justifyContent = 'center';
                this.style.backgroundColor = '#2a2a2a';
                this.innerHTML = '<span style="color: white; font-size: 1.2rem; font-weight: bold;">ШПИОН</span>';
            };
            characterName.textContent = 'ШПИОН';
        } else {
            // Show selected character for other players
            characterImage.alt = gameState.selectedCharacter.replace(/-/g, ' ');
            characterImage.style.display = ''; // Show the image element
            characterImage.src = `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${gameState.selectedCharacter}.png`;
            characterImage.style.backgroundColor = '';
            characterImage.style.width = '200px';
            characterImage.style.height = '200px';
            characterImage.style.borderRadius = '5px';
            characterImage.innerHTML = '';
            characterImage.onerror = function() {
                // Fallback if image fails to load - just hide the image
                this.style.display = 'none'; // Hide broken image
            };
            characterName.textContent = gameState.selectedCharacter.replace(/-/g, ' ').toUpperCase();
        }

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
        characterImage.style.backgroundColor = '';
        characterImage.style.width = '200px'; // Keep consistent width
        characterImage.style.height = '200px'; // Keep consistent height
        characterImage.style.display = 'none'; // Hide the image element until new content is set
        characterImage.style.borderRadius = '5px'; // Reset border radius
        characterImage.innerHTML = '';
        characterImage.onerror = null; // Remove error handler
        characterName.textContent = '';
    }
    
    
    // Show card screen
    function showCardScreen() {
        playerCountScreen.classList.add('hidden');
        cardScreen.classList.remove('hidden');
        gameStartedScreen.classList.add('hidden');

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
        resetCard();
        // Buttons will be set correctly in resetCard() based on currentPlayer
    }
});