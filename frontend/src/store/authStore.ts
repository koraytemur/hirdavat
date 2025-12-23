import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  role: 'user' | 'admin' | 'superadmin';
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, phone?: string) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,
  isAdmin: false,
  isSuperAdmin: false,

  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    const { access_token, user } = response.data;
    
    await AsyncStorage.setItem('token', access_token);
    api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
    
    set({
      user,
      token: access_token,
      isAuthenticated: true,
      isAdmin: user.role === 'admin' || user.role === 'superadmin',
      isSuperAdmin: user.role === 'superadmin',
    });
  },

  register: async (email: string, password: string, name: string, phone?: string) => {
    const response = await api.post('/auth/register', { email, password, name, phone });
    const { access_token, user } = response.data;
    
    await AsyncStorage.setItem('token', access_token);
    api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
    
    set({
      user,
      token: access_token,
      isAuthenticated: true,
      isAdmin: user.role === 'admin' || user.role === 'superadmin',
      isSuperAdmin: user.role === 'superadmin',
    });
  },

  logout: async () => {
    await AsyncStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isAdmin: false,
      isSuperAdmin: false,
    });
  },

  loadUser: async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        set({ isLoading: false });
        return;
      }

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await api.get('/auth/me');
      const user = response.data;

      set({
        user,
        token,
        isAuthenticated: true,
        isAdmin: user.role === 'admin' || user.role === 'superadmin',
        isSuperAdmin: user.role === 'superadmin',
        isLoading: false,
      });
    } catch (error) {
      await AsyncStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      set({ isLoading: false });
    }
  },

  updateProfile: async (data: Partial<User>) => {
    const response = await api.put('/auth/profile', data);
    set({ user: response.data });
  },
}));
