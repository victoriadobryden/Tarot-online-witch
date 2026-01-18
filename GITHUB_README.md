# 🔮 Tarot Online Witch - AI Tarot Reading Website

<div align="center">

![Tarot Cards](https://img.shields.io/badge/Tarot-78%20Cards-9d4edd?style=for-the-badge&logo=sparkles)
![AI Powered](https://img.shields.io/badge/AI-Google%20Gemini%202.5-ffd700?style=for-the-badge&logo=google)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**Містичний веб-додаток для гадання на картах Таро з AI інтерпретацією**

[Demo](#-features) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Tech Stack](#-tech-stack)

</div>

---

## ✨ Features

🎴 **78 Tarot Cards** - Complete Rider-Waite deck with descriptions
- 22 Major Arcana
- 56 Minor Arcana (Cups, Swords, Wands, Pentacles)
- Full descriptions in Ukrainian and English
- Upright and reversed meanings

🤖 **AI Interpretation**
- **Google Gemini 2.5 Flash** (Free, recommended)
- **OpenAI GPT-4o-mini** (Paid alternative)
- Detailed 3-4 paragraph interpretations
- Context-aware responses

🔮 **Two Spread Types**
- **Question Spread**: 3 cards answer your specific question
- **Past-Present-Future**: Classic timeline spread

🎨 **Beautiful UI**
- Mystical dark theme with purple/gold gradients
- CSS animations and transitions
- Card images with 180° rotation for reversed cards
- Responsive design for all devices

🌍 **Multilingual**
- Full Ukrainian support
- English translations
- Easy language switching

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ installed
- Google Gemini API key (free) or OpenAI API key

### Installation

```bash
# Clone the repository
git clone https://github.com/victoriadobryden/Tarot-online-witch.git
cd Tarot-online-witch

# Install dependencies
cd server && npm install
cd ../client && npm install

# Set up environment variables
# Copy .env.example files and add your API keys
cp server/.env.example server/.env
cp client/.env.example client/.env

# Initialize database
cd server
npx prisma generate
npx prisma migrate dev

# Start backend
npm start

# In another terminal, start frontend
cd client
npm run dev
```

Open http://localhost:5174 and start your tarot journey! 🎉

## 📖 Documentation

- [Getting Google Gemini API Key](HOW_TO_GET_GEMINI_KEY.md) - Free AI provider
- [Getting OpenAI API Key](HOW_TO_GET_OPENAI_KEY.md) - Premium AI provider
- [AI Provider Comparison](AI_PROVIDER_SETUP.md) - Choose the right AI
- [Adding Tarot Card Images](HOW_TO_ADD_TAROT_IMAGES.md) - Custom card visuals
- [Quick Start Guide](QUICKSTART.md) - Detailed setup
- [Project Completion Report](PROJECT_COMPLETE.md) - Full documentation

## 🛠 Tech Stack

### Backend
- **Node.js** 20+ & **Express** 5
- **Prisma ORM** 5+ & **SQLite**
- **Google Gemini 2.5 Flash** AI
- **OpenAI GPT-4o-mini** (optional)
- JWT authentication & bcrypt
- CORS, dotenv

### Frontend
- **React** 18 & **TypeScript**
- **Vite** 7 (fast build tool)
- CSS Modules & animations
- i18next for translations

## 🎯 Usage

### 1. Choose Your Spread
- **Question Spread**: Ask a specific question
- **Timeline Spread**: Past, Present, Future

### 2. Get Your Cards
- Receive 3 randomly selected cards
- See card names, positions, and meanings
- View card images with visual effects

### 3. AI Interpretation
- Click "Get AI Interpretation"
- Receive detailed, personalized reading
- Switch between languages (UK/EN)

## 🔐 Security

- ✅ `.env` files excluded from Git
- ✅ API keys never committed
- ✅ Database files ignored
- ✅ `.env.example` templates provided

**Never commit sensitive data!** Use the `.env.example` files as templates.

## 📊 API Endpoints

### Readings
- `GET /api/readings/cards/random?spreadType=question` - Get 3 random cards
- `POST /api/readings/interpret` - Get AI interpretation
- `POST /api/readings/create` - Save reading with AI
- `GET /api/readings/history` - User's reading history

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Sign in
- `GET /api/auth/me` - Current user info

See full API documentation in [README.md](README.md#-api-endpoints)

## 🎨 Screenshots

### Main Interface
Two spread options with mystical design and smooth animations.

### AI Interpretation
Detailed, context-aware tarot readings powered by AI.

### Card Display
Beautiful card images with rotation animation for reversed cards.

## 🤝 Contributing

This is a personal project, but suggestions and feedback are welcome!

## 📝 License

MIT License - feel free to use this code for your own projects!

## 🙏 Acknowledgments

- **Rider-Waite Tarot Deck** (Public Domain)
- **Google Gemini API** for free AI interpretations
- **Claude Code** for development assistance

## 📧 Contact

Created by Victoria Dobryden

GitHub: [@victoriadobryden](https://github.com/victoriadobryden)

---

<div align="center">

**Made with 💜 and ✨ mystical energy**

⭐ Star this repo if you believe in the power of Tarot! ⭐

</div>
