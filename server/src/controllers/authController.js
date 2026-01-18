const userService = require('../services/userService');

class AuthController {
  async register(req, res) {
    try {
      const { email, username, password, preferredLanguage } = req.body;

      // Validation
      if (!email || !username || !password) {
        return res.status(400).json({ error: 'Email, username, and password are required' });
      }

      if (password.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters long' });
      }

      const result = await userService.register({
        email,
        username,
        password,
        preferredLanguage: preferredLanguage || 'uk'
      });

      res.status(201).json(result);
    } catch (error) {
      console.error('Register error:', error);
      res.status(400).json({ error: error.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Validation
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const result = await userService.login({ email, password });

      res.json(result);
    } catch (error) {
      console.error('Login error:', error);
      res.status(401).json({ error: error.message });
    }
  }

  async getMe(req, res) {
    try {
      const user = await userService.getUserById(req.userId);
      res.json({ user });
    } catch (error) {
      console.error('Get me error:', error);
      res.status(404).json({ error: error.message });
    }
  }
}

module.exports = new AuthController();
