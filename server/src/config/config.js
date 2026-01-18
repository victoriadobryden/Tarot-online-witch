require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || 'change-this-secret',
  geminiApiKey: process.env.GEMINI_API_KEY,
  openaiApiKey: process.env.OPENAI_API_KEY,
  aiProvider: process.env.AI_PROVIDER || 'gemini', // 'openai' or 'gemini' - default to gemini (free)
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtExpiresIn: '7d',
};
