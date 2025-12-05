// GameState class to handle game state management
class GameState {
    constructor() {
        this.players = [];
        this.spyIndex = -1;
        this.selectedCharacter = '';
        this.currentPlayer = 0;
        this.totalPlayers = 0;
        this.characterManager = null;
    }

    /**
     * Initialize the game with the specified number of players
     * @param {number} playerCount - Number of players in the game
     * @param {CharacterManager} characterManager - Instance of CharacterManager
     */
    initializeGame(playerCount, characterManager) {
        if (!characterManager) {
            throw new Error('CharacterManager is required for game initialization');
        }
        
        this.characterManager = characterManager;
        this.players = Array.from({length: playerCount}, (_, i) => i);
        this.totalPlayers = playerCount;

        // Randomly select spy
        this.spyIndex = Math.floor(Math.random() * playerCount);

        // Randomly select character
        const characters = characterManager.getCharacters();
        const randomIndex = Math.floor(Math.random() * characters.length);
        this.selectedCharacter = characters[randomIndex];

        this.currentPlayer = 0;
    }

    /**
     * Check if the current player is the spy
     * @param {number} playerIndex - Index of the player to check
     * @returns {boolean} True if the player is the spy, false otherwise
     */
    isPlayerSpy(playerIndex) {
        return playerIndex === this.spyIndex;
    }

    /**
     * Get the character assigned to the game
     * @returns {string} The character name
     */
    getGameCharacter() {
        return this.selectedCharacter;
    }

    /**
     * Get the display name for the character
     * @returns {string} The formatted character name
     */
    getGameCharacterDisplayName() {
        if (!this.characterManager) {
            return this.selectedCharacter.replace(/-/g, ' ').toUpperCase();
        }
        return this.characterManager.getCharacterDisplayName(this.selectedCharacter);
    }

    /**
     * Get the total number of players
     * @returns {number} Number of players in the game
     */
    getPlayerCount() {
        return this.totalPlayers;
    }

    /**
     * Get the index of the spy player
     * @returns {number} Index of the spy player
     */
    getSpyIndex() {
        return this.spyIndex;
    }

    /**
     * Get the current player index
     * @returns {number} Current player index
     */
    getCurrentPlayer() {
        return this.currentPlayer;
    }

    /**
     * Set the current player index
     * @param {number} playerIndex - The index to set as current player
     */
    setCurrentPlayer(playerIndex) {
        if (playerIndex >= 0 && playerIndex < this.totalPlayers) {
            this.currentPlayer = playerIndex;
        }
    }

    /**
     * Move to the next player
     * @returns {number} New current player index
     */
    nextPlayer() {
        if (this.currentPlayer < this.totalPlayers - 1) {
            this.currentPlayer++;
        }
        return this.currentPlayer;
    }

    /**
     * Check if all players have seen their cards
     * @returns {boolean} True if all players have seen their cards
     */
    isAllPlayersDone() {
        return this.currentPlayer >= this.totalPlayers - 1;
    }

    /**
     * Reset the game state to initial values
     */
    reset() {
        this.players = [];
        this.spyIndex = -1;
        this.selectedCharacter = '';
        this.currentPlayer = 0;
        this.totalPlayers = 0;
    }

    /**
     * Get the character image source for the current player
     * @returns {string} Image source URL
     */
    getCurrentPlayerImageSrc() {
        if (!this.characterManager) {
            throw new Error('CharacterManager is not initialized');
        }
        
        if (this.isPlayerSpy(this.currentPlayer)) {
            // Return SVG for spy
            return 'data:image/svg+xml;utf8,' + encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24">
                    <rect width="24" height="24" fill="#2a2a2a" rx="4"/>
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2V7zm0 8h2v2h-2v-2z" fill="white"/>
                </svg>
            `);
        } else {
            // Return character image
            return this.characterManager.getCharacterImageSrc(this.selectedCharacter);
        }
    }

    /**
     * Get the character name for the current player (or 'SPY' for spy)
     * @returns {string} Character name or 'SPY'
     */
    getCurrentPlayerCharacterName() {
        if (this.isPlayerSpy(this.currentPlayer)) {
            return 'ШПИОН';
        } else {
            return this.getGameCharacterDisplayName();
        }
    }

    /**
     * Check if the current player is the last player
     * @returns {boolean} True if current player is the last one
     */
    isCurrentPlayerLast() {
        return this.currentPlayer === this.totalPlayers - 1;
    }
}

// Export for module systems if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameState;
}