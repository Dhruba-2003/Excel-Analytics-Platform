import axios from 'axios';
const axiosInstance = axios.create({
  baseURL: import.meta.env.PROD ? import.meta.env.VITE_API_URL : '',
});

// Attach JWT from localStorage to every request if available
axiosInstance.interceptors.request.use(
  (config) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (userInfo?.token) {
        config.headers = config.headers || {};
        // Avoid overwriting an explicitly provided Authorization header
        if (!config.headers.Authorization && !config.headers.authorization) {
          config.headers.Authorization = `Bearer ${userInfo.token}`;
        }
      }
    } catch (e) {
      // ignore JSON parse errors
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global response handler: on 401, clear local auth and redirect to login
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 401) {
      try {
        localStorage.removeItem('userInfo');
      } catch (e) {}
      // Redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;