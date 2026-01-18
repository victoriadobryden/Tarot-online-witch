import axios, { AxiosInstance, AxiosError } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add token to requests if available
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Handle 401 errors (unauthorized)
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async register(data: { email: string; username: string; password: string; preferredLanguage?: string }) {
    const response = await this.client.post('/api/auth/register', data);
    return response.data;
  }

  async login(data: { email: string; password: string }) {
    const response = await this.client.post('/api/auth/login', data);
    return response.data;
  }

  async getMe() {
    const response = await this.client.get('/api/auth/me');
    return response.data;
  }

  // Readings endpoints
  async getAllCards() {
    const response = await this.client.get('/api/readings/cards');
    return response.data;
  }

  async getRandomCards() {
    const response = await this.client.get('/api/readings/cards/random');
    return response.data;
  }

  async createReading(data: { cards: any[]; question?: string; language?: string }) {
    const response = await this.client.post('/api/readings/create', data);
    return response.data;
  }

  async getInterpretation(data: { cards: any[]; question?: string; language?: string }) {
    const response = await this.client.post('/api/readings/interpret', data);
    return response.data;
  }

  async getReadingHistory(page = 1, limit = 10) {
    const response = await this.client.get('/api/readings/history', {
      params: { page, limit },
    });
    return response.data;
  }

  async getReading(id: string) {
    const response = await this.client.get(`/api/readings/${id}`);
    return response.data;
  }

  async deleteReading(id: string) {
    const response = await this.client.delete(`/api/readings/${id}`);
    return response.data;
  }

  // Users endpoints
  async updateProfile(data: { username?: string; preferredLanguage?: string }) {
    const response = await this.client.patch('/api/users/profile', data);
    return response.data;
  }

  async changePassword(data: { currentPassword: string; newPassword: string }) {
    const response = await this.client.patch('/api/users/password', data);
    return response.data;
  }

  async getUserStatistics() {
    const response = await this.client.get('/api/users/statistics');
    return response.data;
  }
}

export default new ApiClient();
