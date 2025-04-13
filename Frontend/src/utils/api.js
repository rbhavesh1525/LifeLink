import axios from 'axios';

// Set the base URL for all API requests
axios.defaults.baseURL = 'http://localhost:5000';

// Add a request interceptor to automatically add the token to all requests
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      console.error('Unauthorized request. Token may be invalid or expired.');
      // Optionally redirect to login or clear token
      // window.location.href = '/hospital-signin';
    }
    return Promise.reject(error);
  }
);

export default axios; 