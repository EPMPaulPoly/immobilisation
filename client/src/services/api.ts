import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse,AxiosInstance } from 'axios';


let api:AxiosInstance;
if (process.env.REACT_APP_BE_USER && process.env.REACT_APP_BE_PASSWORD) {
  console.log('env:',process.env);
  console.log('Backend User:',process.env.REACT_APP_BE_USER,'\nBackend Password:', process.env.REACT_APP_BE_PASSWORD,'\nAPI URL:',process.env.REACT_APP_API_URL);
  api = axios.create({
    baseURL:  `${process.env.REACT_APP_API_URL}/api` || 'http://localhost:5000/api', //
    headers: {
      'Content-Type': 'application/json'
    },
    auth:{
      username: process.env.REACT_APP_BE_USER,
      password: process.env.REACT_APP_BE_PASSWORD
    }
  });
} else{
  console.log('Backend User:',process.env.REACT_APP_BE_USER,'\n Backend Password:', process.env.REACT_APP_BE_PASSWORD,'\n API URL:',process.env.REACT_APP_API_URL);
  console.log('env:',process.env);
  api = axios.create({
    baseURL:  `${process.env.REACT_APP_API_URL}/api` || 'http://localhost:5000/api', //
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
// Request interceptor with correct typing
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const user = process.env.REACT_APP_BE_USER;
    const password = process.env.REACT_APP_BE_PASSWORD;

    if (user && password) {
      const token = btoa(`${user}:${password}`);

      config.headers = config.headers ?? {};
      config.headers.Authorization = `Basic ${token}`;
    }

    return config;
  }
);

// Response interceptor with correct typing
api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('Response:', response);
    return response;
  },
  (error: AxiosError) => {
    console.log('Response Error:', {
      url: error.config?.url,
      message: error.message,
      response: error.response?.data
    });
    return Promise.reject(error);
  }
);


export default api;