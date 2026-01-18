const userService = require('../services/userService');

class UsersController {
  async updateProfile(req, res) {
    try {
      const userId = req.userId;
      const updates = req.body;

      const user = await userService.updateProfile(userId, updates);

      res.json({ user });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(400).json({ error: error.message });
    }
  }

  async changePassword(req, res) {
    try {
      const userId = req.userId;
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: 'Current password and new password are required' });
      }

      if (newPassword.length < 8) {
        return res.status(400).json({ error: 'New password must be at least 8 characters long' });
      }

      const result = await userService.changePassword(userId, currentPassword, newPassword);

      res.json(result);
    } catch (error) {
      console.error('Change password error:', error);
      res.status(400).json({ error: error.message });
    }
  }

  async getStatistics(req, res) {
    try {
      const userId = req.userId;
      const stats = await userService.getUserStatistics(userId);

      res.json({ statistics: stats });
    } catch (error) {
      console.error('Get statistics error:', error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new UsersController();
