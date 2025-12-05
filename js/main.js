// Main application module
class DotA2SpyGame {
    constructor() {
        this.characterManager = new CharacterManager();
        this.gameState = new GameState();
        this.uiManager = new UIManager(this.gameState, this.characterManager);
    }

    /**
     * Initialize the game application
     */
    init() {
        // Initialize the UI with any saved state
        this.uiManager.initialize();
    }
}

// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.game = new DotA2SpyGame();
    window.game.init();
    
    // Also expose individual components for testing
    window.characterManager = window.game.characterManager;
    window.gameState = window.game.gameState;
    window.uiManager = window.game.uiManager;
});