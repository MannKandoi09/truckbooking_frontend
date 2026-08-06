import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api', 
});

api.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem('token'); 
    
    if (token) {
      // 🚀 TRICK: Agar token ke aage-peeche double quotes ("") hain, toh usko hata dega
      token = token.replace(/['"]+/g, ''); 
      
      config.headers['Authorization'] = `Bearer ${token}`; 
      
      // Ye humein console me dikhayega ki token jaa raha hai ya nahi
      console.log("➡️ Interceptor ne token bheja:", config.headers['Authorization']); 
    } else {
      console.log("❌ Interceptor ko token nahi mila!");
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;