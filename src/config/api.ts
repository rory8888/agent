import axios from 'axios';

// API基础配置
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const API_PREFIX = import.meta.env.VITE_API_PREFIX || '/api/v1';

// 创建axios实例
const apiClient = axios.create({
  baseURL: `${API_BASE_URL}${API_PREFIX}`,
  timeout: 10000, // 10秒超时
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    // 可以在这里添加认证token
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response.data;
  },
  (error) => {
    console.error('Response Error:', error);
    
    // 处理不同的错误状态
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // 未授权，可能需要重新登录
          console.error('Unauthorized access');
          break;
        case 403:
          // 禁止访问
          console.error('Forbidden access');
          break;
        case 404:
          // 资源不存在
          console.error('Resource not found');
          break;
        case 500:
          // 服务器错误
          console.error('Internal server error');
          break;
        default:
          console.error('API Error:', data?.message || error.message);
      }
    } else if (error.request) {
      // 网络错误
      console.error('Network Error:', error.message);
    } else {
      // 其他错误
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// API端点配置
export const API_ENDPOINTS = {
  // 数据总览
  dashboard: {
    summary: '/dashboard/summary',
    salesTrend: '/dashboard/sales-trend',
    productStatus: '/dashboard/product-status',
  },
  
  // PN快速填写 (预测收集)
  forecast: {
    list: '/forecast/entries',
    create: '/forecast/entries',
    update: (id: string) => `/forecast/entries/${id}`,
    delete: (id: string) => `/forecast/entries/${id}`,
    batchUpdate: '/forecast/entries/batch',
  },
  
  // PN审核
  audit: {
    list: '/audit/entries',
    update: (id: string) => `/audit/entries/${id}`,
    batchUpdate: '/audit/entries/batch',
  },
  
  // PN数据
  pnData: {
    list: '/pn-data',
    detail: (id: string) => `/pn-data/${id}`,
    update: (id: string) => `/pn-data/${id}`,
  },
  
  // PDT预测
  pdtForecast: {
    list: '/pdt-forecast',
    create: '/pdt-forecast',
    update: (id: string) => `/pdt-forecast/${id}`,
  },
  
  // 预测模板
  forecastTemplate: {
    list: '/forecast-template',
    create: '/forecast-template',
    update: (id: string) => `/forecast-template/${id}`,
  },
  
  // 基础数据
  metadata: {
    pdts: '/metadata/pdts',
    channels: '/metadata/channels',
    singularities: '/metadata/singularities',
    categories: '/metadata/categories',
  },
};

export default apiClient;