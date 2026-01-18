const { GoogleGenerativeAI } = require('@google/generative-ai');
const OpenAI = require('openai');
const config = require('../config/config');

class AIService {
  constructor() {
    this.provider = config.aiProvider;
    this.maxRetries = 3;
    this.timeout = 30000; // 30 seconds

    // Initialize providers
    if (config.geminiApiKey) {
      const genAI = new GoogleGenerativeAI(config.geminiApiKey);
      this.geminiModel = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    }

    if (config.openaiApiKey) {
      this.openaiClient = new OpenAI({ apiKey: config.openaiApiKey });
    }
  }

  /**
   * Generate tarot interpretation using AI
   * @param {Array} cards - Array of 3 cards with their positions
   * @param {String} question - User's question (optional)
   * @param {String} language - Language for interpretation (uk/en)
   * @param {String} spreadType - Type of spread ('temporal' or 'question')
   * @returns {Promise<String>} - AI interpretation
   */
  async generateInterpretation(cards, question = '', language = 'uk', spreadType = 'temporal') {
    if (!cards || cards.length !== 3) {
      throw new Error('Exactly 3 cards are required');
    }

    const prompt = this.buildPrompt(cards, question, language, spreadType);

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        let interpretation;

        if (this.provider === 'openai' && this.openaiClient) {
          interpretation = await this.getOpenAIInterpretation(prompt);
        } else if (this.provider === 'gemini' && this.geminiModel) {
          interpretation = await this.getGeminiInterpretation(prompt);
        } else {
          throw new Error(`AI provider ${this.provider} not configured`);
        }

        return interpretation;
      } catch (error) {
        console.error(`AI Service attempt ${attempt} failed:`, error.message);

        if (attempt === this.maxRetries) {
          // Return fallback interpretation on final failure
          return this.getFallbackInterpretation(cards, language, spreadType, question);
        }

        // Wait before retry (exponential backoff)
        await this.delay(1000 * attempt);
      }
    }
  }

  async getOpenAIInterpretation(prompt) {
    const response = await Promise.race([
      this.openaiClient.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.8,
        max_tokens: 1000,
      }),
      this.createTimeout()
    ]);

    return response.choices[0].message.content;
  }

  async getGeminiInterpretation(prompt) {
    const result = await Promise.race([
      this.geminiModel.generateContent(prompt),
      this.createTimeout()
    ]);

    if (!result || !result.response) {
      throw new Error('Invalid response from Gemini AI');
    }

    return result.response.text();
  }

  buildPrompt(cards, question, language, spreadType = 'temporal') {
    const isUkrainian = language === 'uk';

    const systemPrompt = isUkrainian
      ? `Ти - досвідчений таролог з глибоким розумінням символіки карт Таро. Твоя мета - надати змістовну, співчутливу та проникливу інтерпретацію розкладу з трьох карт.`
      : `You are an experienced tarot reader with deep understanding of Tarot symbolism. Your goal is to provide meaningful, compassionate, and insightful interpretation of a three-card spread.`;

    let cardsInfo;

    if (spreadType === 'question') {
      // Question-based spread
      const [card1, card2, card3] = cards;

      cardsInfo = isUkrainian
        ? `Користувач поставив питання: "${question}"

Для відповіді на це питання було витягнуто 3 карти Таро:

🔮 Карта 1: ${card1.nameUk || card1.name} ${card1.reversed ? '(перевернута)' : '(пряма)'}
   Значення карти: ${card1.reversed ? card1.meaningReversedUk : card1.meaningUprightUk}
   Роль: Основний аспект відповіді, ключова енергія

🔮 Карта 2: ${card2.nameUk || card2.name} ${card2.reversed ? '(перевернута)' : '(пряма)'}
   Значення карти: ${card2.reversed ? card2.meaningReversedUk : card2.meaningUprightUk}
   Роль: Додатковий контекст, що потрібно врахувати

🔮 Карта 3: ${card3.nameUk || card3.name} ${card3.reversed ? '(перевернута)' : '(пряма)'}
   Значення карти: ${card3.reversed ? card3.meaningReversedUk : card3.meaningUprightUk}
   Роль: Порада або результат, напрямок дії`
        : `The user asked a question: "${question}"

To answer this question, 3 Tarot cards were drawn:

🔮 Card 1: ${card1.name} ${card1.reversed ? '(reversed)' : '(upright)'}
   Card meaning: ${card1.reversed ? card1.meaningReversed : card1.meaningUpright}
   Role: Main aspect of the answer, key energy

🔮 Card 2: ${card2.name} ${card2.reversed ? '(reversed)' : '(upright)'}
   Card meaning: ${card2.reversed ? card2.meaningReversed : card2.meaningUpright}
   Role: Additional context to consider

🔮 Card 3: ${card3.name} ${card3.reversed ? '(reversed)' : '(upright)'}
   Card meaning: ${card3.reversed ? card3.meaningReversed : card3.meaningUpright}
   Role: Advice or outcome, direction of action`;

    } else {
      // Temporal spread (Past-Present-Future)
      const [past, present, future] = cards;

      cardsInfo = isUkrainian
        ? `Користувач витягнув 3 карти Таро у розкладі Минуле-Теперішнє-Майбутнє:

🔮 Минуле: ${past.nameUk || past.name} ${past.reversed ? '(перевернута)' : '(пряма)'}
   Значення: ${past.reversed ? past.meaningReversedUk : past.meaningUprightUk}
   Позиція: Те, що сформувало поточну ситуацію

🔮 Теперішнє: ${present.nameUk || present.name} ${present.reversed ? '(перевернута)' : '(пряма)'}
   Значення: ${present.reversed ? present.meaningReversedUk : present.meaningUprightUk}
   Позиція: Поточний стан справ, енергії зараз

🔮 Майбутнє: ${future.nameUk || future.name} ${future.reversed ? '(перевернута)' : '(пряма)'}
   Значення: ${future.reversed ? future.meaningReversedUk : future.meaningUprightUk}
   Позиція: Можливий результат, якщо продовжувати поточним шляхом`
        : `The user drew 3 Tarot cards in a Past-Present-Future spread:

🔮 Past: ${past.name} ${past.reversed ? '(reversed)' : '(upright)'}
   Meaning: ${past.reversed ? past.meaningReversed : past.meaningUpright}
   Position: What has shaped the current situation

🔮 Present: ${present.name} ${present.reversed ? '(reversed)' : '(upright)'}
   Meaning: ${present.reversed ? present.meaningReversed : present.meaningUpright}
   Position: Current state of affairs, energies now

🔮 Future: ${future.name} ${future.reversed ? '(reversed)' : '(upright)'}
   Meaning: ${future.reversed ? future.meaningReversed : future.meaningUpright}
   Position: Likely outcome if continuing on current path`;
    }

    const questionText = spreadType === 'temporal' && question
      ? isUkrainian
        ? `\n\nКонтекст від користувача: "${question}"`
        : `\n\nContext from user: "${question}"`
      : '';

    let instructions;

    if (spreadType === 'question') {
      instructions = isUkrainian
        ? `\n\nНадай детальну відповідь на питання користувача (3-4 абзаци), яка включає:
1. Пряму відповідь на питання користувача на основі всіх трьох карт
2. Як кожна карта відповідає на питання та що вона каже про ситуацію
3. Які енергії, обставини та фактори впливають на відповідь
4. Конкретні поради та рекомендації щодо дії в контексті питання
5. Практичні кроки що можна зробити прямо зараз

ВАЖЛИВО: Зосередься ВИКЛЮЧНО на відповіді на конкретне питання "${question}". Інтерпретуй карти саме в контексті цього питання. Використовуй теплий, підтримуючий тон. Пам'ятай, що Таро - це інструмент для саморефлексії та особистого зростання.`
        : `\n\nProvide a detailed answer to the user's question (3-4 paragraphs) that includes:
1. A direct answer to the user's question based on all three cards
2. How each card answers the question and what it says about the situation
3. What energies, circumstances, and factors influence the answer
4. Specific advice and recommendations for action in the context of the question
5. Practical steps that can be taken right now

IMPORTANT: Focus EXCLUSIVELY on answering the specific question "${question}". Interpret the cards specifically in the context of this question. Use a warm, supportive tone. Remember that Tarot is a tool for self-reflection and personal growth.`;
    } else {
      instructions = isUkrainian
        ? `\n\nНадай детальну інтерпретацію (3-4 абзаци), яка включає:
1. Загальний огляд того, що розповідають ці три карти разом
2. Як минуле вплинуло на теперішнє
3. Що означає поточна ситуація
4. Який можливий шлях у майбутньому та які поради
5. Практичні рекомендації або питання для роздумів

Використовуй теплий, підтримуючий тон. Пам'ятай, що Таро - це інструмент для саморефлексії та особистого зростання. Уникай категоричних прогнозів, натомість говори про можливості та тенденції.`
        : `\n\nProvide a detailed interpretation (3-4 paragraphs) that includes:
1. An overall view of what these three cards tell together
2. How the past has influenced the present
3. What the current situation means
4. What the possible path forward is and what advice to offer
5. Practical recommendations or questions for reflection

Use a warm, supportive tone. Remember that Tarot is a tool for self-reflection and personal growth. Avoid categorical predictions; instead, speak about possibilities and tendencies.`;
    }

    return systemPrompt + '\n\n' + cardsInfo + questionText + instructions;
  }

  getFallbackInterpretation(cards, language, spreadType = 'temporal', question = '') {
    const isUkrainian = language === 'uk';

    if (spreadType === 'question' && question) {
      // Question-based fallback with actual question context
      if (isUkrainian) {
        return `Відповідь на ваше питання "${question}" через карти Таро:

Перша карта ${cards[0].nameUk} ${cards[0].reversed ? '(перевернута)' : '(пряма)'} вказує на ${cards[0].reversed ? cards[0].meaningReversedUk.toLowerCase() : cards[0].meaningUprightUk.toLowerCase()}. Це основна енергія, що впливає на вашу ситуацію.

Друга карта ${cards[1].nameUk} ${cards[1].reversed ? '(перевернута)' : '(пряма)'} додає контекст: ${cards[1].reversed ? cards[1].meaningReversedUk.toLowerCase() : cards[1].meaningUprightUk.toLowerCase()}. Це те, що потрібно врахувати при прийнятті рішення.

Третя карта ${cards[2].nameUk} ${cards[2].reversed ? '(перевернута)' : '(пряма)'} радить: ${cards[2].reversed ? cards[2].meaningReversedUk.toLowerCase() : cards[2].meaningUprightUk.toLowerCase()}. Це напрямок для ваших дій.

Ці карти разом говорять про важливість усвідомленого підходу до вашого питання. Прислухайтеся до свого внутрішнього голосу та довіряйте своїй інтуїції.`;
      } else {
        return `Answer to your question "${question}" through Tarot cards:

The first card ${cards[0].name} ${cards[0].reversed ? '(reversed)' : '(upright)'} indicates ${cards[0].reversed ? cards[0].meaningReversed.toLowerCase() : cards[0].meaningUpright.toLowerCase()}. This is the main energy influencing your situation.

The second card ${cards[1].name} ${cards[1].reversed ? '(reversed)' : '(upright)'} adds context: ${cards[1].reversed ? cards[1].meaningReversed.toLowerCase() : cards[1].meaningUpright.toLowerCase()}. This is what needs to be considered when making a decision.

The third card ${cards[2].name} ${cards[2].reversed ? '(reversed)' : '(upright)'} advises: ${cards[2].reversed ? cards[2].meaningReversed.toLowerCase() : cards[2].meaningUpright.toLowerCase()}. This is the direction for your actions.

Together, these cards speak about the importance of a conscious approach to your question. Listen to your inner voice and trust your intuition.`;
      }
    } else {
      // Temporal spread fallback
      if (isUkrainian) {
        return `Ваш розклад показує цікаву комбінацію енергій:

Минуле представлене картою ${cards[0].nameUk}, що ${cards[0].reversed ? 'у перевернутому положенні може вказувати на ' + cards[0].meaningReversedUk.toLowerCase() : 'символізує ' + cards[0].meaningUprightUk.toLowerCase()}.

У теперішньому момент ви маєте ${cards[1].nameUk}, що ${cards[1].reversed ? 'у перевернутому стані означає ' + cards[1].meaningReversedUk.toLowerCase() : 'представляє ' + cards[1].meaningUprightUk.toLowerCase()}.

Майбутнє освітлене картою ${cards[2].nameUk}, яка ${cards[2].reversed ? 'перевернута і може принести ' + cards[2].meaningReversedUk.toLowerCase() : 'обіцяє ' + cards[2].meaningUprightUk.toLowerCase()}.

Ці карти разом радять вам бути уважними до своїх внутрішніх відчуттів і довіряти процесу. Пам'ятайте, що майбутнє не є фіксованим - воно формується вашими рішеннями сьогодні.`;
      } else {
        return `Your spread reveals an interesting combination of energies:

The Past is represented by ${cards[0].name}, which ${cards[0].reversed ? 'in reversed position may indicate ' + cards[0].meaningReversed.toLowerCase() : 'symbolizes ' + cards[0].meaningUpright.toLowerCase()}.

In the Present moment, you have ${cards[1].name}, which ${cards[1].reversed ? 'reversed means ' + cards[1].meaningReversed.toLowerCase() : 'represents ' + cards[1].meaningUpright.toLowerCase()}.

The Future is illuminated by ${cards[2].name}, which ${cards[2].reversed ? 'reversed may bring ' + cards[2].meaningReversed.toLowerCase() : 'promises ' + cards[2].meaningUpright.toLowerCase()}.

Together, these cards advise you to be attentive to your inner feelings and trust the process. Remember that the future is not fixed - it is shaped by your decisions today.`;
      }
    }
  }

  createTimeout() {
    return new Promise((_, reject) =>
      setTimeout(() => reject(new Error('AI request timeout')), this.timeout)
    );
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = new AIService();
