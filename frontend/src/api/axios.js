// import axios from 'axios';

// const API_BASE_URL = 'http://127.0.0.1:8000/api';

// // Create axios instance
// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Request interceptor - add token to every request
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('accessToken');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Response interceptor - handle token refresh automatically
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     // If 401 error and haven't retried yet
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         const refreshToken = localStorage.getItem('refreshToken');
//         if (!refreshToken) {
//           throw new Error('No refresh token');
//         }

//         // Refresh the token
//         const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
//           refresh: refreshToken,
//         });

//         const { access } = response.data;
//         localStorage.setItem('accessToken', access);

//         // Retry original request with new token
//         originalRequest.headers.Authorization = `Bearer ${access}`;
//         return api(originalRequest);
//       } catch (refreshError) {
//         // Refresh failed - clear tokens and redirect to login
//         localStorage.removeItem('accessToken');
//         localStorage.removeItem('refreshToken');
//         window.location.href = '/login';
//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default api;


import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    console.log('🔑 Request interceptor - Token:', token ? 'EXISTS' : 'MISSING');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ Authorization header added');
    } else {
      console.log('❌ No token found in localStorage');
    }
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - handle token refresh automatically
api.interceptors.response.use(
  (response) => {
    console.log('✅ Response received:', response.config.url, response.status);
    console.log('📦 Response data:', response.data);
    return response;
  },
  async (error) => {
    console.error('❌ Response error:', error.response?.status, error.config?.url);
    
    const originalRequest = error.config;

    // If 401 error and haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log('🔄 Attempting token refresh...');

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        // Refresh the token
        const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
          refresh: refreshToken,
        });

        const { access } = response.data;
        localStorage.setItem('accessToken', access);
        console.log('✅ Token refreshed successfully');

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error('❌ Token refresh failed:', refreshError);
        // Refresh failed - clear tokens and redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;