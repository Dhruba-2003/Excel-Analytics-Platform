import axios from 'axios';

// Create a new axios instance
const axiosInstance = axios.create({
  // This line checks if the app is in production (live on Netlify).
  // If it is, it uses the live backend URL from the environment variables.
  // If not (in local development), it uses an empty string to work with the proxy.
  baseURL: import.meta.env.PROD ? import.meta.env.VITE_API_URL : '',
});

export default axiosInstance;