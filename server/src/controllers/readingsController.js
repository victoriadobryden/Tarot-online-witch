const crypto = require('crypto');
const prisma = require('../config/database');
const tarotService = require('../services/tarotService');
const aiService = require('../services/aiService');

class ReadingsController {
  /**
   * Get random 3 cards for reading
   */
  async getRandomCards(req, res) {
    try {
      const { spreadType } = req.query; // 'temporal' or 'question'
      const cards = tarotService.getRandomCards(3, spreadType || 'temporal');
      res.json({ cards });
    } catch (error) {
      console.error('Get random cards error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get all cards (for displaying the deck)
   */
  async getAllCards(req, res) {
    try {
      const cards = tarotService.getAllCards();
      res.json({ cards });
    } catch (error) {
      console.error('Get all cards error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Create a new reading with interpretation
   */
  async createReading(req, res) {
    try {
      const { cards, question, language } = req.body;
      const userId = req.userId || null;
      const sessionId = req.sessionId || crypto.randomUUID();

      if (!cards || cards.length !== 3) {
        return res.status(400).json({ error: 'Exactly 3 cards are required' });
      }

      // Prepare cards (convert from user selection)
      const preparedCards = tarotService.prepareCardsFromSelection(cards);

      // Generate AI interpretation
      const interpretation = await aiService.generateInterpretation(
        preparedCards,
        question,
        language || 'uk'
      );

      // Save reading to database
      const reading = await prisma.reading.create({
        data: {
          id: crypto.randomUUID(),
          userId,
          sessionId: userId ? null : sessionId,
          cards: JSON.stringify(preparedCards),
          question: question || null,
          interpretation
        }
      });

      res.status(201).json({
        reading: {
          ...reading,
          cards: preparedCards
        }
      });
    } catch (error) {
      console.error('Create reading error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get interpretation for existing cards
   */
  async getInterpretation(req, res) {
    try {
      const { cards, question, language, spreadType } = req.body;

      if (!cards || cards.length !== 3) {
        return res.status(400).json({ error: 'Exactly 3 cards are required' });
      }

      const preparedCards = tarotService.prepareCardsFromSelection(cards);
      const interpretation = await aiService.generateInterpretation(
        preparedCards,
        question,
        language || 'uk',
        spreadType || 'temporal'
      );

      res.json({ interpretation, cards: preparedCards });
    } catch (error) {
      console.error('Get interpretation error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get reading history (authenticated users only)
   */
  async getHistory(req, res) {
    try {
      const userId = req.userId;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const [readings, total] = await Promise.all([
        prisma.reading.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit
        }),
        prisma.reading.count({ where: { userId } })
      ]);

      // Parse cards JSON for each reading
      const parsedReadings = readings.map(reading => ({
        ...reading,
        cards: JSON.parse(reading.cards)
      }));

      res.json({
        readings: parsedReadings,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Get history error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get specific reading by ID
   */
  async getReading(req, res) {
    try {
      const { id } = req.params;
      const userId = req.userId;

      const reading = await prisma.reading.findUnique({
        where: { id }
      });

      if (!reading) {
        return res.status(404).json({ error: 'Reading not found' });
      }

      // Check if user has access to this reading
      if (reading.userId && reading.userId !== userId) {
        return res.status(403).json({ error: 'Access denied' });
      }

      res.json({
        reading: {
          ...reading,
          cards: JSON.parse(reading.cards)
        }
      });
    } catch (error) {
      console.error('Get reading error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Delete reading (authenticated users only)
   */
  async deleteReading(req, res) {
    try {
      const { id } = req.params;
      const userId = req.userId;

      const reading = await prisma.reading.findUnique({
        where: { id }
      });

      if (!reading) {
        return res.status(404).json({ error: 'Reading not found' });
      }

      // Check if user owns this reading
      if (reading.userId !== userId) {
        return res.status(403).json({ error: 'Access denied' });
      }

      await prisma.reading.delete({
        where: { id }
      });

      res.json({ message: 'Reading deleted successfully' });
    } catch (error) {
      console.error('Delete reading error:', error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new ReadingsController();
