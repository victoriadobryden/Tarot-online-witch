// Backup of original App.tsx
import { useState } from 'react';
import './App.css';
import api from './services/api';

function App() {
  const [language, setLanguage] = useState('uk');
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const getRandomCards = async () => {
    setLoading(true);
    try {
      const response = await api.getRandomCards();
      setCards(response.cards);
    } catch (error) {
      console.error('Error getting cards:', error);
    } finally {
      setLoading(false);
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

            <div className="cta-buttons">
              <button className="btn-primary" onClick={getRandomCards} disabled={loading}>
                {loading
                  ? (language === 'uk' ? 'Завантаження...' : 'Loading...')
                  : (language === 'uk' ? 'Почати гадання' : 'Start Reading')
                }
              </button>
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
