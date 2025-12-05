// CharacterManager class to handle all character-related functionality
class CharacterManager {
    constructor() {
        // DotA 2 characters list
        this.dotaCharacters = [
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
    }

    /**
     * Get the list of all available characters
     * @returns {Array} Array of character names
     */
    getCharacters() {
        return [...this.dotaCharacters]; // Return a copy to prevent modification
    }

    /**
     * Get display name for a character (converts hyphens to spaces)
     * @param {string} characterName - The character name (e.g. 'anti-mage')
     * @returns {string} The display name (e.g. 'anti mage')
     */
    getCharacterDisplayName(characterName) {
        return characterName.replace(/-/g, ' ').toUpperCase();
    }

    /**
     * Get special name variations for CDN compatibility
     * @returns {Object} Object mapping character names to variations
     */
    getSpecialNameVariations() {
        return {
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
    }

    /**
     * Generate a character image source URL
     * @param {string} characterName - The character name to get an image for
     * @returns {string} The image URL
     */
    getCharacterImageSrc(characterName) {
        // Map special character name variations for the CDN
        let cdnCharacterName = characterName;
        const nameVariations = this.getSpecialNameVariations();

        if (nameVariations[characterName]) {
            cdnCharacterName = nameVariations[characterName];
        }

        // Return the primary CDN URL format
        return `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${cdnCharacterName}.png`;
    }

    /**
     * Generate fallback URLs for a character image
     * @param {string} characterName - The character name to generate fallbacks for
     * @returns {Array} Array of fallback URLs
     */
    generateFallbacks(characterName) {
        const originalName = characterName;

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

        return fallbacks;
    }

    /**
     * Set up error handling for character image loading
     * @param {HTMLImageElement} img - The image element to set up error handling for
     * @param {string} characterName - The character name for this image
     */
    setCharacterImageErrorHandling(img, characterName) {
        img.fallbackAttempt = 0;
        const fallbacks = this.generateFallbacks(characterName);

        img.onerror = function() {
            // Initialize fallback counter on the image element if it doesn't exist
            if (typeof this.fallbackAttempt === 'undefined') {
                this.fallbackAttempt = 0;
            }

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
                            ${characterName.replace(/-/g, ' ').toUpperCase()}
                        </text>
                    </svg>
                `);
                // If the fallback SVG also fails, then hide the element
                this.onerror = function() {
                    this.style.display = 'none';
                };
            }
        };
    }
}

// Export for module systems if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CharacterManager;
}