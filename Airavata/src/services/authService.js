import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ENDPOINTS } from '../config/api';

const api = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await axios.post(API_ENDPOINTS.REFRESH);
        const { accessToken } = response.data;
        
        await AsyncStorage.setItem('accessToken', accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        
        return api(originalRequest);
      } catch (refreshError) {
        await AsyncStorage.multiRemove(['accessToken', 'user']);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const authService = {
  register: async (name, email, password, role = 'user') => {
    const response = await api.post(API_ENDPOINTS.REGISTER, {
      name,
      email,
      password,
      role,
    });
    
    if (response.data.accessToken) {
      await AsyncStorage.setItem('accessToken', response.data.accessToken);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
      await AsyncStorage.setItem('loginTimestamp', Date.now().toString());
    }
    
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post(API_ENDPOINTS.LOGIN, {
      email,
      password,
    });
    
    if (response.data.accessToken) {
      await AsyncStorage.setItem('accessToken', response.data.accessToken);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
      await AsyncStorage.setItem('loginTimestamp', Date.now().toString());
    }
    
    return response.data;
  },

  logout: async () => {
    try {
      await api.post(API_ENDPOINTS.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await AsyncStorage.multiRemove(['accessToken', 'user', 'loginTimestamp']);
    }
  },

  getProfile: async () => {
    const response = await api.get(API_ENDPOINTS.ME);
    return response.data;
  },

  checkSession: async () => {
    const loginTimestamp = await AsyncStorage.getItem('loginTimestamp');
    if (!loginTimestamp) return false;

    const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
    const isValid = Date.now() - parseInt(loginTimestamp) < sevenDaysInMs;

    if (!isValid) {
      await AsyncStorage.multiRemove(['accessToken', 'user', 'loginTimestamp']);
    }

    return isValid;
  },
};

export default api;
