import api from './axios';

export const authApi = {
  // Register a new user
  register: async (userData) => {
    console.log('🔵 authApi.register called with:', userData);
    const response = await api.post('/register/', userData);
    console.log('🔵 Register response:', response.data);
    
    // Check if tokens are in response.data.tokens (nested) or response.data (flat)
    const access = response.data.access || response.data.tokens?.access;
    const refresh = response.data.refresh || response.data.tokens?.refresh;
    
    if (access && refresh) {
      console.log('💾 Saving tokens to localStorage...');
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      console.log('✅ Tokens saved successfully');
    } else {
      console.warn('⚠️ No access token in response!');
    }
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    console.log('🔵 authApi.login called with:', credentials);
    const response = await api.post('/login/', credentials);
    console.log('🔵 Login response:', response.data);
    
    // Check if tokens are in response.data.tokens (nested) or response.data (flat)
    const access = response.data.access || response.data.tokens?.access;
    const refresh = response.data.refresh || response.data.tokens?.refresh;
    
    if (access && refresh) {
      console.log('💾 Saving tokens to localStorage...');
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      console.log('✅ Tokens saved successfully');
      console.log('🔑 Access token:', access.substring(0, 20) + '...');
    } else {
      console.warn('⚠️ No access token in response!', response.data);
    }
    return response.data;
  },

  // Logout user
  logout: () => {
    console.log('🔵 authApi.logout called');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    console.log('✅ Tokens removed from localStorage');
  },

  // Get current user info
  getCurrentUser: async () => {
    console.log('🔵 authApi.getCurrentUser called');
    const token = localStorage.getItem('accessToken');
    console.log('🔑 Current access token:', token ? token.substring(0, 20) + '...' : 'NONE');
    const response = await api.get('/me/');
    console.log('🔵 getCurrentUser response:', response.data);
    return response.data;
  },

  // Get list of companies (for registration dropdown)
  getCompanies: async () => {
    console.log('🔵 authApi.getCompanies called');
    const response = await api.get('/companies/');
    console.log('🔵 getCompanies response:', response.data);
    return response.data;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const hasToken = !!localStorage.getItem('accessToken');
    console.log('🔵 authApi.isAuthenticated:', hasToken);
    return hasToken;
  },

  // Get access token
  getAccessToken: () => {
    const token = localStorage.getItem('accessToken');
    console.log('🔵 authApi.getAccessToken:', token ? 'EXISTS' : 'NONE');
    return token;
  },
};

export default authApi;