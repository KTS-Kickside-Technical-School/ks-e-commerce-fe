import axios from 'axios';
export const BACKEND_URL = import.meta.env.VITE_API_BASE_URL
const axiosInstance = axios.create({
  baseURL: BACKEND_URL,
  timeout: 100000,
  headers: {
    "Content-Type": "application/json"
  }
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data';
    } else {
      config.headers['Content-Type'] = 'application/json';
    }

    return config;
  },
  (error) => Promise.reject(error)
);

const getToken = () => {
  return sessionStorage.getItem('token');
};

const getProfile =  () => {
  return  sessionStorage.getItem('profile');
}

export {
  axiosInstance,
  getToken,
  getProfile
};