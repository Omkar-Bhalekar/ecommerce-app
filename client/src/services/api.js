import axios from 'axios';
import { handleMockRequest } from './standaloneStore';

const isBrowser = typeof window !== 'undefined';
const isLocalhost = isBrowser && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
const configuredUrl = import.meta.env.VITE_API_URL;

// On Vercel / production or when no remote API is provided, use standalone mode
const hasExternalApi = configuredUrl && !configuredUrl.includes('localhost') && configuredUrl !== 'mock';
const useStandalone = !hasExternalApi && (!isLocalhost || !configuredUrl || configuredUrl === 'mock');

const axiosInstance = axios.create({
  baseURL: configuredUrl || 'http://localhost:5000/api',
  timeout: 4000,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('ss_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('ss_token');
      localStorage.removeItem('ss_user');
    }
    return Promise.reject(err);
  }
);

const api = {
  get: async (url, config = {}) => {
    if (useStandalone) {
      return handleMockRequest('get', url, null, config.params);
    }
    try {
      return await axiosInstance.get(url, config);
    } catch (err) {
      if (!err.response) {
        return handleMockRequest('get', url, null, config.params);
      }
      throw err;
    }
  },
  post: async (url, data = {}, config = {}) => {
    if (useStandalone) {
      return handleMockRequest('post', url, data, config.params);
    }
    try {
      return await axiosInstance.post(url, data, config);
    } catch (err) {
      if (!err.response) {
        return handleMockRequest('post', url, data, config.params);
      }
      throw err;
    }
  },
  put: async (url, data = {}, config = {}) => {
    if (useStandalone) {
      return handleMockRequest('put', url, data, config.params);
    }
    try {
      return await axiosInstance.put(url, data, config);
    } catch (err) {
      if (!err.response) {
        return handleMockRequest('put', url, data, config.params);
      }
      throw err;
    }
  },
  delete: async (url, config = {}) => {
    if (useStandalone) {
      return handleMockRequest('delete', url, null, config.params);
    }
    try {
      return await axiosInstance.delete(url, config);
    } catch (err) {
      if (!err.response) {
        return handleMockRequest('delete', url, null, config.params);
      }
      throw err;
    }
  },
};

export default api;
