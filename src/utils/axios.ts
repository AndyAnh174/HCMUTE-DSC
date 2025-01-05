import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://dining-scientific-shanghai-demonstrates.trycloudflare.com',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 10000,
});

instance.interceptors.response.use(
  response => response,
  error => {
    console.error('Axios Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        data: error.config?.data
      }
    });
    return Promise.reject(error);
  }
);

export default instance; 