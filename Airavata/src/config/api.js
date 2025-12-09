const API_BASE_URL = 'https://sih-saksham.onrender.com';

export const API_ENDPOINTS = {
  // Auth
  REGISTER: `${API_BASE_URL}/api/auth/register`,
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  REFRESH: `${API_BASE_URL}/api/auth/refresh`,
  ME: `${API_BASE_URL}/api/auth/me`,
  LOGOUT: `${API_BASE_URL}/api/auth/logout`,
  
  // Users
  USERS: `${API_BASE_URL}/api/users`,
  
  // Devices
  DEVICES: `${API_BASE_URL}/api/devices`,
  
  // Events
  EVENTS: `${API_BASE_URL}/api/events`,
  
  // Hotspots
  HOTSPOTS: `${API_BASE_URL}/api/hotspots`,
  
  // Notifications
  NOTIFICATIONS: `${API_BASE_URL}/api/notifications`,
};

export default API_BASE_URL;
