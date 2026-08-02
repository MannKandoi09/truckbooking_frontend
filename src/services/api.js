import axios from 'axios';

// Backend ka base URL
const api = axios.create({
  baseURL: 'http://localhost:8080/api', 
});

// Request Interceptor: Ye har API call se pehle automatically Token attach kar dega
api.interceptors.request.use(
  (config) => {
    // LocalStorage se token nikalna (Ensure kar ki login ke baad tu token yahi save kar raha hai)
    const token = localStorage.getItem('token'); 
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;