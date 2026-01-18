import { useState } from 'react';
import './App.css';

function App() {
  const [language, setLanguage] = useState('uk');
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [interpretation, setInterpretation] = useState('');
  const [interpretationLoading, setInterpretationLoading] = useState(false);
  const [question, setQuestion] = useState('');
  const [spreadType, setSpreadType] = useState<'temporal' | 'question'>('temporal');

  const getRandomCards = async (type: 'temporal' | 'question') => {
    setLoading(true);
    setInterpretation('');
    setSpreadType(type);
    try {
      const response = await fetch(`http://localhost:5000/api/readings/cards/random?spreadType=${type}`);
      const data = await response.json();
      setCards(data.cards);
    } catch (error) {
      console.error('Error getting cards:', error);
      alert('Error: ' + error);
    } finally {
      setLoading(false);
    }
  };

  const getAIInterpretation = async () => {
    if (cards.length !== 3) return;

    setInterpretationLoading(true);
    try {
      const cardsForAPI = cards.map(card => ({
        id: card.id,
        reversed: card.reversed
      }));

      const response = await fetch('http://localhost:5000/api/readings/interpret', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cards: cardsForAPI,
          question: spreadType === 'question' ? question : undefined,
          language: language,
          spreadType: spreadType
        })
      });

      const data = await response.json();
      setInterpretation(data.interpretation);
    } catch (error) {
      console.error('Error getting interpretation:', error);
      alert('Помилка отримання інтерпретації. Переконайтеся, що ви додали GEMINI_API_KEY у файл server/.env');
    } finally {
      setInterpretationLoading(false);
    }
  };

  return (
    <div className="app">
        <header className="app-header">
          <h1>🔮 {language === 'uk' ? 'Гадання на Таро' : 'Tarot Reading'}</h1>
          <button
            onClick={() => setLanguage(language === 'uk' ? 'en' : 'uk')}
            className="lang-switch"
          >
            {language === 'uk' ? 'EN' : 'UK'}
          </button>
        </header>

        <main className="app-main">
          <div className="hero">
            <h2>
              {language === 'uk'
                ? 'Відкрийте свій шлях з мудрістю карт'
                : 'Discover your path with the wisdom of the cards'}
            </h2>
            <p>
              {language === 'uk'
                ? 'Карти Таро - це древній інструмент для саморефлексії та особистого зростання.'
                : 'Tarot cards are an ancient tool for self-reflection and personal growth.'}
            </p>

            <div className="spread-type-selector">
              <div className="spread-option">
                <h3>{language === 'uk' ? '🔮 Розклад з питанням' : '🔮 Question Spread'}</h3>
                <p>{language === 'uk' ? 'Задайте питання і отримайте 3 карти-відповіді' : 'Ask a question and get 3 answer cards'}</p>
                <div className="question-input">
                  <input
                    type="text"
                    placeholder={language === 'uk' ? 'Ваше питання...' : 'Your question...'}
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="question-field"
                  />
                </div>
                <button
                  className="btn-primary"
                  onClick={() => getRandomCards('question')}
                  disabled={loading || !question.trim()}
                >
                  {loading && spreadType === 'question'
                    ? (language === 'uk' ? 'Завантаження...' : 'Loading...')
                    : (language === 'uk' ? 'Отримати відповідь' : 'Get Answer')
                  }
                </button>
              </div>

              <div className="spread-divider">
                {language === 'uk' ? 'АБО' : 'OR'}
              </div>

              <div className="spread-option">
                <h3>{language === 'uk' ? '⏳ Розклад Минуле-Теперішнє-Майбутнє' : '⏳ Past-Present-Future Spread'}</h3>
                <p>{language === 'uk' ? 'Класичний розклад на три часові періоди' : 'Classic three-time-period spread'}</p>
                <button
                  className="btn-secondary"
                  onClick={() => getRandomCards('temporal')}
                  disabled={loading}
                >
                  {loading && spreadType === 'temporal'
                    ? (language === 'uk' ? 'Завантаження...' : 'Loading...')
                    : (language === 'uk' ? 'Почати розклад' : 'Start Spread')
                  }
                </button>
              </div>
            </div>

            {cards.length > 0 && (
              <div className="cards-display">
                <h3>{language === 'uk' ? 'Ваші карти:' : 'Your cards:'}</h3>
                <div className="cards-grid">
                  {cards.map((card) => (
                    <div key={card.id} className="card-item">
                      <div className="card-position">
                        {language === 'uk' ? card.positionUk : card.position}
                      </div>
                      <div className={`card-image-container ${card.reversed ? 'reversed' : ''}`}>
                        <img
                          src={card.image}
                          alt={language === 'uk' ? card.nameUk : card.name}
                          className="card-image"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                        <div className="card-image-fallback hidden">
                          🎴
                        </div>
                      </div>
                      <div className="card-name">
                        {language === 'uk' ? card.nameUk : card.name}
                      </div>
                      <div className="card-status">
                        {card.reversed
                          ? (language === 'uk' ? '(перевернута)' : '(reversed)')
                          : (language === 'uk' ? '(пряма)' : '(upright)')
                        }
                      </div>
                      <div className="card-meaning">
                        {language === 'uk' ? card.meaningUk : card.meaning}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="interpretation-section">
                  {!interpretation && (
                    <button
                      className="btn-primary"
                      onClick={getAIInterpretation}
                      disabled={interpretationLoading}
                    >
                      {interpretationLoading
                        ? (language === 'uk' ? '🤖 Отримання інтерпретації AI...' : '🤖 Getting AI interpretation...')
                        : (language === 'uk' ? '🤖 Отримати інтерпретацію AI' : '🤖 Get AI Interpretation')
                      }
                    </button>
                  )}

                  {interpretation && (
                    <div className="ai-interpretation">
                      <h3>🔮 {language === 'uk' ? 'AI Інтерпретація' : 'AI Interpretation'}</h3>
                      <p className="interpretation-text">{interpretation}</p>
                      <div className="action-buttons">
                        <button
                          className="btn-secondary"
                          onClick={() => {
                            setCards([]);
                            setInterpretation('');
                            setQuestion('');
                          }}
                        >
                          {language === 'uk' ? '✨ Нове гадання' : '✨ New Reading'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="features">
            <div className="feature">
              <div className="feature-icon">🤖</div>
              <h3>{language === 'uk' ? 'AI Інтерпретація' : 'AI Interpretation'}</h3>
              <p>
                {language === 'uk'
                  ? 'Отримайте інтерпретацію від Google Gemini AI'
                  : 'Get interpretation from Google Gemini AI'}
              </p>
            </div>

            <div className="feature">
              <div className="feature-icon">📚</div>
              <h3>{language === 'uk' ? 'Історія гадань' : 'Reading History'}</h3>
              <p>
                {language === 'uk'
                  ? 'Зберігайте попередні розклади'
                  : 'Save your previous spreads'}
              </p>
            </div>

            <div className="feature">
              <div className="feature-icon">🌍</div>
              <h3>{language === 'uk' ? 'Багатомовність' : 'Multilingual'}</h3>
              <p>
                {language === 'uk'
                  ? 'Українська та англійська'
                  : 'Ukrainian and English'}
              </p>
            </div>
          </div>

          <footer className="app-footer">
            <p>
              {language === 'uk'
                ? 'Створено за допомогою Claude Code 💜'
                : 'Created with Claude Code 💜'}
            </p>
          </footer>
        </main>
      </div>
  );
}

export default App;
