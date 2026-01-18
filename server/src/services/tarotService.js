const { tarotCards } = require('../utils/tarotData');

class TarotService {
  constructor() {
    this.cards = tarotCards;
  }

  /**
   * Get all tarot cards
   * @returns {Array} All 78 tarot cards
   */
  getAllCards() {
    return this.cards;
  }

  /**
   * Get a specific card by ID
   * @param {Number} id - Card ID
   * @returns {Object} Tarot card
   */
  getCardById(id) {
    return this.cards.find(card => card.id === id);
  }

  /**
   * Get random cards for reading (with no duplicates)
   * @param {Number} count - Number of cards to draw (default 3)
   * @param {String} spreadType - Type of spread ('temporal' for past/present/future, 'question' for question-based)
   * @returns {Array} Random cards with position and reversed status
   */
  getRandomCards(count = 3, spreadType = 'temporal') {
    if (count > this.cards.length) {
      throw new Error(`Cannot draw ${count} cards from deck of ${this.cards.length}`);
    }

    // Shuffle and pick cards
    const shuffled = this.shuffleArray([...this.cards]);
    const drawnCards = shuffled.slice(0, count);

    // Define positions based on spread type
    let positions, positionsUk;

    if (spreadType === 'temporal') {
      // Past/Present/Future spread
      positions = ['past', 'present', 'future'];
      positionsUk = ['минуле', 'теперішнє', 'майбутнє'];
    } else if (spreadType === 'question') {
      // Question-based spread (cards 1, 2, 3)
      positions = ['card_1', 'card_2', 'card_3'];
      positionsUk = ['карта_1', 'карта_2', 'карта_3'];
    }

    return drawnCards.map((card, index) => {
      const reversed = Math.random() < 0.33; // 33% chance of being reversed

      return {
        ...card,
        position: positions[index] || `position_${index + 1}`,
        positionUk: positionsUk[index] || `позиція_${index + 1}`,
        reversed,
        meaning: reversed ? card.meaningReversed : card.meaningUpright,
        meaningUk: reversed ? card.meaningReversedUk : card.meaningUprightUk,
        spreadType,
      };
    });
  }

  /**
   * Fisher-Yates shuffle algorithm
   * @param {Array} array - Array to shuffle
   * @returns {Array} Shuffled array
   */
  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  /**
   * Get cards by suit
   * @param {String} suit - Suit name (Major Arcana, Cups, Swords, Wands, Pentacles)
   * @returns {Array} Cards of the specified suit
   */
  getCardsBySuit(suit) {
    return this.cards.filter(card => card.suit === suit);
  }

  /**
   * Search cards by name
   * @param {String} query - Search query
   * @param {String} language - Language (uk/en)
   * @returns {Array} Matching cards
   */
  searchCards(query, language = 'en') {
    const lowerQuery = query.toLowerCase();

    return this.cards.filter(card => {
      if (language === 'uk') {
        return card.nameUk.toLowerCase().includes(lowerQuery);
      }
      return card.name.toLowerCase().includes(lowerQuery);
    });
  }

  /**
   * Prepare cards for reading (convert from user selection)
   * @param {Array} selectedIds - Array of selected card IDs
   * @returns {Array} Cards with positions and reversed status
   */
  prepareCardsFromSelection(selectedIds) {
    if (!selectedIds || selectedIds.length !== 3) {
      throw new Error('Exactly 3 card IDs are required');
    }

    const positions = ['past', 'present', 'future'];
    const positionsUk = ['минуле', 'теперішнє', 'майбутнє'];

    return selectedIds.map((selection, index) => {
      const cardId = typeof selection === 'object' ? selection.id : selection;
      const reversed = typeof selection === 'object' ? selection.reversed : Math.random() < 0.33;

      const card = this.getCardById(cardId);
      if (!card) {
        throw new Error(`Card with ID ${cardId} not found`);
      }

      return {
        ...card,
        position: positions[index],
        positionUk: positionsUk[index],
        reversed,
        meaning: reversed ? card.meaningReversed : card.meaningUpright,
        meaningUk: reversed ? card.meaningReversedUk : card.meaningUprightUk,
      };
    });
  }
}

module.exports = new TarotService();
