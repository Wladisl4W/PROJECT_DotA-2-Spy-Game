// UIManager class to handle all UI-related functionality
class UIManager {
    constructor(gameState, characterManager) {
        this.gameState = gameState;
        this.characterManager = characterManager;
        
        // DOM Elements
        this.playerCountSlider = document.getElementById('playerCountSlider');
        this.playerCountDisplay = document.getElementById('playerCountDisplay');
        this.startGameBtn = document.getElementById('startGameBtn');
        this.cardInner = document.getElementById('cardInner');
        this.cardFront = document.getElementById('cardFront');
        this.cardBack = document.getElementById('cardBack');
        this.characterImage = document.getElementById('characterImage');
        this.characterName = document.getElementById('characterName');
        this.nextPlayerBtn = document.getElementById('nextPlayerBtn');
        this.startGameFinalBtn = document.getElementById('startGameFinalBtn');
        this.resetGameBtn = document.getElementById('resetGameBtn');
        this.playerNumber = document.getElementById('playerNumber');
        this.totalPlayers = document.getElementById('totalPlayers');
        this.currentPlayerIndicator = document.getElementById('currentPlayer');

        // Screens
        this.playerCountScreen = document.getElementById('player-count-screen');
        this.cardScreen = document.getElementById('card-screen');
        this.gameStartedScreen = document.getElementById('game-started-screen');

        // Timers
        this.flipTimer = null;
        this.showNextButtonTimer = null;

        // Bind event handlers
        this.bindEvents();
    }

    /**
     * Bind all UI event handlers
     */
    bindEvents() {
        // Player count slider
        this.playerCountSlider.addEventListener('input', (e) => {
            this.onPlayerCountChange(e);
        });

        // Start game button
        this.startGameBtn.addEventListener('click', () => {
            this.onStartGameClick();
        });

        // Card front click (to reveal character)
        this.cardFront.addEventListener('click', () => {
            this.onCardFrontClick();
        });

        // Next player button
        this.nextPlayerBtn.addEventListener('click', () => {
            this.onNextPlayerClick();
        });

        // Start game final button
        this.startGameFinalBtn.addEventListener('click', () => {
            this.onStartGameFinalClick();
        });

        // Reset game button
        this.resetGameBtn.addEventListener('click', () => {
            this.onResetGameClick();
        });
    }

    /**
     * Handle player count slider change
     */
    onPlayerCountChange(event) {
        this.playerCountDisplay.textContent = event.target.value;
        // Save the value to localStorage
        localStorage.setItem('playerCount', event.target.value);
    }

    /**
     * Handle start game button click
     */
    onStartGameClick() {
        const playerCount = parseInt(this.playerCountSlider.value);
        this.gameState.initializeGame(playerCount, this.characterManager);
        this.showCardScreen();
    }

    /**
     * Handle card front click (reveal character)
     */
    onCardFrontClick() {
        this.revealCharacter();
    }

    /**
     * Handle next player button click
     */
    onNextPlayerClick() {
        // Clear the button timer to prevent conflicts
        if (this.showNextButtonTimer) clearTimeout(this.showNextButtonTimer);

        // Move to next player
        this.gameState.nextPlayer();

        if (this.gameState.getCurrentPlayer() < this.gameState.getPlayerCount()) {
            // Reset card for next player
            this.resetCard();
        } else {
            // This shouldn't happen with our new logic, but just in case
            this.nextPlayerBtn.classList.add('hidden');
            this.startGameFinalBtn.classList.remove('hidden');
            this.startGameFinalBtn.classList.remove('disabled');
        }
    }

    /**
     * Handle final start game button click
     */
    onStartGameFinalClick() {
        // Move to next player (which should be beyond the last player)
        this.gameState.nextPlayer();
        this.showGameStartedScreen();
    }

    /**
     * Handle reset game button click
     */
    onResetGameClick() {
        this.resetGame();
    }

    /**
     * Reveal character on the card
     */
    revealCharacter() {
        // Check if card is already revealed to prevent multiple clicks
        if (this.cardInner.classList.contains('flipped')) {
            return;
        }

        // Get character info for current player
        const imageSrc = this.gameState.getCurrentPlayerImageSrc();
        const characterName = this.gameState.getCurrentPlayerCharacterName();

        // Set up the character image based on whether player is spy
        if (this.gameState.isPlayerSpy(this.gameState.getCurrentPlayer())) {
            // Show spy icon for the spy player
            this.characterImage.alt = 'ШПИОН';
            this.characterImage.src = imageSrc;
        } else {
            // Show selected character for other players
            this.characterImage.alt = this.gameState.getGameCharacterDisplayName();
            this.characterImage.src = imageSrc;
        }

        this.characterName.textContent = characterName;

        // Set proper display properties for the image
        this.characterImage.style.display = 'block';
        this.characterImage.style.width = '100%';
        this.characterImage.style.height = 'auto';
        this.characterImage.style.maxHeight = '320px';
        this.characterImage.style.borderRadius = '4px';

        // Set error handler for character images (not needed for spy SVG)
        if (!this.gameState.isPlayerSpy(this.gameState.getCurrentPlayer())) {
            this.characterManager.setCharacterImageErrorHandling(
                this.characterImage, 
                this.gameState.getGameCharacter()
            );
        }

        // Update player indicator
        this.playerNumber.textContent = this.gameState.getCurrentPlayer() + 1;
        this.totalPlayers.textContent = this.gameState.getPlayerCount();

        // Clear any existing timers to prevent conflicts
        if (this.flipTimer) clearTimeout(this.flipTimer);
        if (this.showNextButtonTimer) clearTimeout(this.showNextButtonTimer);

        // Flip the card to show the back
        this.flipTimer = setTimeout(() => {
            this.cardInner.classList.add('flipped');

            // Show appropriate button after a short delay to allow animation
            this.showNextButtonTimer = setTimeout(() => {
                if (this.gameState.isCurrentPlayerLast()) {
                    // Last player - show "Start Game" button
                    this.startGameFinalBtn.classList.remove('disabled'); // Enable the button
                } else {
                    // Other players - show "Next Player" button
                    this.nextPlayerBtn.classList.remove('disabled'); // Enable the button
                }
            }, 300);
        }, 100);
    }

    /**
     * Reset card for next player
     */
    resetCard() {
        // Clear timers to prevent conflicts
        if (this.flipTimer) clearTimeout(this.flipTimer);
        if (this.showNextButtonTimer) clearTimeout(this.showNextButtonTimer);

        // Flip card back to front
        this.cardInner.classList.remove('flipped');

        // Update player indicator
        this.playerNumber.textContent = this.gameState.getCurrentPlayer() + 1;
        this.totalPlayers.textContent = this.gameState.getPlayerCount();

        // Determine which button to show based on player position
        if (this.gameState.isCurrentPlayerLast()) {
            // Last player - show "Start Game" button (disabled initially)
            this.nextPlayerBtn.classList.add('hidden');
            this.startGameFinalBtn.classList.remove('hidden');
            this.startGameFinalBtn.classList.add('disabled'); // Keep button disabled initially
        } else {
            // Other players (including first) - show "Next Player" button (disabled initially)
            this.nextPlayerBtn.classList.remove('hidden');
            this.nextPlayerBtn.classList.add('disabled'); // Keep button disabled initially
            this.startGameFinalBtn.classList.add('hidden');
        }

        // Reset character info
        this.characterImage.src = '';
        this.characterImage.alt = ''; // Clear alt attribute to prevent showing text
        this.characterImage.style.display = 'none'; // Hide the image element until new content is set
        this.characterImage.style.backgroundColor = '';
        this.characterImage.style.width = '';
        this.characterImage.style.height = '';
        this.characterImage.style.borderRadius = '';
        this.characterImage.innerHTML = '';
        this.characterImage.fallbackAttempt = 0; // Reset fallback counter
        this.characterImage.onerror = null; // Remove error handler
        this.characterName.textContent = '';
    }

    /**
     * Show the player count selection screen
     */
    showPlayerCountScreen() {
        this.playerCountScreen.classList.remove('hidden');
        this.cardScreen.classList.add('hidden');
        this.gameStartedScreen.classList.add('hidden');
    }

    /**
     * Show the card screen
     */
    showCardScreen() {
        this.playerCountScreen.classList.add('hidden');
        this.cardScreen.classList.remove('hidden');
        this.gameStartedScreen.classList.add('hidden');

        // Update player indicator
        this.playerNumber.textContent = this.gameState.getCurrentPlayer() + 1;
        this.totalPlayers.textContent = this.gameState.getPlayerCount();

        // For the first player, show "Next Player" button (disabled initially)
        // since gameState.currentPlayer starts at 0
        this.nextPlayerBtn.classList.remove('hidden');
        this.nextPlayerBtn.classList.add('disabled'); // Keep button disabled initially
        this.startGameFinalBtn.classList.add('hidden');
    }

    /**
     * Show the game started screen
     */
    showGameStartedScreen() {
        this.playerCountScreen.classList.add('hidden');
        this.cardScreen.classList.add('hidden');
        this.gameStartedScreen.classList.remove('hidden');

        // Update player indicator to show the final player
        this.playerNumber.textContent = this.gameState.getPlayerCount();
        this.totalPlayers.textContent = this.gameState.getPlayerCount();

        // Explicitly hide buttons to ensure clean state
        this.nextPlayerBtn.classList.add('hidden');
        this.startGameFinalBtn.classList.add('hidden');
    }

    /**
     * Reset game to initial state
     */
    resetGame() {
        // Clear timers to prevent conflicts
        if (this.flipTimer) clearTimeout(this.flipTimer);
        if (this.showNextButtonTimer) clearTimeout(this.showNextButtonTimer);

        this.showPlayerCountScreen();

        // Reset game state
        this.gameState.reset();

        // Keep the player count that was previously selected
        // Do not reset the slider value as it should remember the last selection

        // Update the display to match the slider value
        this.playerCountDisplay.textContent = this.playerCountSlider.value;
        
        // Update player indicator to default values
        this.playerNumber.textContent = '1';
        this.totalPlayers.textContent = this.playerCountSlider.value;
        
        this.resetCard();
        // Buttons will be set correctly in resetCard() based on currentPlayer
    }

    /**
     * Initialize the UI with saved player count if exists
     */
    initialize() {
        // Load saved player count from localStorage if it exists
        const savedPlayerCount = localStorage.getItem('playerCount');
        if (savedPlayerCount) {
            this.playerCountSlider.value = parseInt(savedPlayerCount);
            this.playerCountDisplay.textContent = savedPlayerCount;
        }
    }
}

// Export for module systems if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UIManager;
}