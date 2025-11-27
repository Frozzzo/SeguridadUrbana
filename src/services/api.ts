import { API_URL } from '../config/api.config';

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData extends LoginData {
  name: string;
  address: string;
}

export const api = {
  async login(data: LoginData) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Login failed');
    return response.json();
  },

  async register(data: RegisterData) {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Registration failed');
    return response.json();
  },

  async getCameras(token: string) {
    const response = await fetch(`${API_URL}/cameras`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch cameras');
    return response.json();
  },

  async getAlerts(token: string) {
    const response = await fetch(`${API_URL}/alerts`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch alerts');
    return response.json();
  },

  async createAlert(token: string, data: { type: string; message: string; location: string }) {
    const response = await fetch(`${API_URL}/alerts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create alert');
    return response.json();
  },

  async getEmergencyContacts(token: string) {
    const response = await fetch(`${API_URL}/emergency-contacts`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch emergency contacts');
    return response.json();
  },
};
