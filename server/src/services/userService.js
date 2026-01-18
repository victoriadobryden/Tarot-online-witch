const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const prisma = require('../config/database');
const config = require('../config/config');

class UserService {
  /**
   * Register a new user
   */
  async register({ email, username, password, preferredLanguage = 'uk' }) {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        id: crypto.randomUUID(),
        email,
        username,
        passwordHash,
        preferredLanguage
      }
    });

    // Generate JWT token
    const token = this.generateToken(user.id);

    return {
      user: this.sanitizeUser(user),
      token
    };
  }

  /**
   * Login user
   */
  async login({ email, password }) {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);

    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    // Generate JWT token
    const token = this.generateToken(user.id);

    return {
      user: this.sanitizeUser(user),
      token
    };
  }

  /**
   * Get user by ID
   */
  async getUserById(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new Error('User not found');
    }

    return this.sanitizeUser(user);
  }

  /**
   * Update user profile
   */
  async updateProfile(userId, updates) {
    const allowedUpdates = ['username', 'preferredLanguage'];
    const filteredUpdates = {};

    for (const key of allowedUpdates) {
      if (updates[key] !== undefined) {
        filteredUpdates[key] = updates[key];
      }
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: filteredUpdates
    });

    return this.sanitizeUser(user);
  }

  /**
   * Change user password
   */
  async changePassword(userId, currentPassword, newPassword) {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.passwordHash);

    if (!isValidPassword) {
      throw new Error('Current password is incorrect');
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash }
    });

    return { message: 'Password changed successfully' };
  }

  /**
   * Get user statistics
   */
  async getUserStatistics(userId) {
    const readingsCount = await prisma.reading.count({
      where: { userId }
    });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        createdAt: true,
        preferredLanguage: true
      }
    });

    return {
      totalReadings: readingsCount,
      memberSince: user.createdAt,
      preferredLanguage: user.preferredLanguage
    };
  }

  /**
   * Generate JWT token
   */
  generateToken(userId) {
    return jwt.sign(
      { userId },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );
  }

  /**
   * Verify JWT token
   */
  verifyToken(token) {
    try {
      return jwt.verify(token, config.jwtSecret);
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  /**
   * Remove sensitive data from user object
   */
  sanitizeUser(user) {
    const { passwordHash, ...sanitized } = user;
    return sanitized;
  }
}

module.exports = new UserService();
