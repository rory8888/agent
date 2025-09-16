import apiClient, { API_ENDPOINTS } from '../config/api';
import {
  PDTForecast,
  PNData,
  ForecastTemplate,
  ForecastEntryData,
  PNAuditData,
  KPIMetric,
  ApiResponse,
  PaginatedResponse,
  FilterParams,
  BatchUpdateRequest,
} from '../types';

// ============= 数据总览相关 API =============

export const dashboardApi = {
  // 获取总览数据
  getSummary: async (): Promise<ApiResponse<{
    totalRevenue: number;
    totalProducts: number;
    forecastAccuracy: number;
    activePNs: number;
    kpiMetrics: KPIMetric[];
  }>> => {
    return apiClient.get(API_ENDPOINTS.dashboard.summary);
  },

  // 获取销售趋势数据
  getSalesTrend: async (timeRange: string = '6months'): Promise<ApiResponse<{
    chartData: Array<{
      month: string;
      forecast: number;
      actual: number;
    }>;
  }>> => {
    return apiClient.get(API_ENDPOINTS.dashboard.salesTrend, {
      params: { timeRange },
    });
  },

  // 获取产品状态分布
  getProductStatus: async (): Promise<ApiResponse<Array<{
    status: string;
    count: number;
    percentage: number;
  }>>> => {
    return apiClient.get(API_ENDPOINTS.dashboard.productStatus);
  },
};

// ============= PN快速填写 (预测收集) API =============

export const forecastApi = {
  // 获取预测数据列表
  getList: async (params?: FilterParams): Promise<ApiResponse<PaginatedResponse<ForecastEntryData>>> => {
    return apiClient.get(API_ENDPOINTS.forecast.list, { params });
  },

  // 创建预测记录
  create: async (data: Omit<ForecastEntryData, 'key'>): Promise<ApiResponse<ForecastEntryData>> => {
    return apiClient.post(API_ENDPOINTS.forecast.create, data);
  },

  // 更新预测记录
  update: async (id: string, data: Partial<ForecastEntryData>): Promise<ApiResponse<ForecastEntryData>> => {
    return apiClient.put(API_ENDPOINTS.forecast.update(id), data);
  },

  // 删除预测记录
  delete: async (id: string): Promise<ApiResponse<null>> => {
    return apiClient.delete(API_ENDPOINTS.forecast.delete(id));
  },

  // 批量更新预测数据
  batchUpdate: async (updates: BatchUpdateRequest): Promise<ApiResponse<ForecastEntryData[]>> => {
    return apiClient.put(API_ENDPOINTS.forecast.batchUpdate, updates);
  },

  // 导出预测数据
  export: async (params?: FilterParams): Promise<Blob> => {
    const response = await apiClient.get(`${API_ENDPOINTS.forecast.list}/export`, {
      params,
      responseType: 'blob',
    });
    return response;
  },

  // 导入预测数据
  import: async (file: File): Promise<ApiResponse<{
    success: number;
    failed: number;
    errors: string[];
  }>> => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post(`${API_ENDPOINTS.forecast.list}/import`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// ============= PN审核 API =============

export const auditApi = {
  // 获取审核数据列表
  getList: async (params?: FilterParams): Promise<ApiResponse<PaginatedResponse<PNAuditData>>> => {
    return apiClient.get(API_ENDPOINTS.audit.list, { params });
  },

  // 更新审核记录
  update: async (id: string, data: Partial<PNAuditData>): Promise<ApiResponse<PNAuditData>> => {
    return apiClient.put(API_ENDPOINTS.audit.update(id), data);
  },

  // 批量更新审核数据
  batchUpdate: async (updates: BatchUpdateRequest): Promise<ApiResponse<PNAuditData[]>> => {
    return apiClient.put(API_ENDPOINTS.audit.batchUpdate, updates);
  },

  // 导出审核数据
  export: async (params?: FilterParams): Promise<Blob> => {
    const response = await apiClient.get(`${API_ENDPOINTS.audit.list}/export`, {
      params,
      responseType: 'blob',
    });
    return response;
  },
};

// ============= PN数据 API =============

export const pnDataApi = {
  // 获取PN数据列表
  getList: async (params?: FilterParams): Promise<ApiResponse<PaginatedResponse<PNData>>> => {
    return apiClient.get(API_ENDPOINTS.pnData.list, { params });
  },

  // 获取PN数据详情
  getDetail: async (id: string): Promise<ApiResponse<PNData>> => {
    return apiClient.get(API_ENDPOINTS.pnData.detail(id));
  },

  // 更新PN数据
  update: async (id: string, data: Partial<PNData>): Promise<ApiResponse<PNData>> => {
    return apiClient.put(API_ENDPOINTS.pnData.update(id), data);
  },

  // 导出PN数据
  export: async (params?: FilterParams): Promise<Blob> => {
    const response = await apiClient.get(`${API_ENDPOINTS.pnData.list}/export`, {
      params,
      responseType: 'blob',
    });
    return response;
  },
};

// ============= PDT预测 API =============

export const pdtForecastApi = {
  // 获取PDT预测列表
  getList: async (params?: FilterParams): Promise<ApiResponse<PaginatedResponse<PDTForecast>>> => {
    return apiClient.get(API_ENDPOINTS.pdtForecast.list, { params });
  },

  // 创建PDT预测
  create: async (data: Omit<PDTForecast, 'key'>): Promise<ApiResponse<PDTForecast>> => {
    return apiClient.post(API_ENDPOINTS.pdtForecast.create, data);
  },

  // 更新PDT预测
  update: async (id: string, data: Partial<PDTForecast>): Promise<ApiResponse<PDTForecast>> => {
    return apiClient.put(API_ENDPOINTS.pdtForecast.update(id), data);
  },
};

// ============= 预测模板 API =============

export const forecastTemplateApi = {
  // 获取预测模板列表
  getList: async (params?: FilterParams): Promise<ApiResponse<PaginatedResponse<ForecastTemplate>>> => {
    return apiClient.get(API_ENDPOINTS.forecastTemplate.list, { params });
  },

  // 创建预测模板
  create: async (data: Omit<ForecastTemplate, 'key'>): Promise<ApiResponse<ForecastTemplate>> => {
    return apiClient.post(API_ENDPOINTS.forecastTemplate.create, data);
  },

  // 更新预测模板
  update: async (id: string, data: Partial<ForecastTemplate>): Promise<ApiResponse<ForecastTemplate>> => {
    return apiClient.put(API_ENDPOINTS.forecastTemplate.update(id), data);
  },
};

// ============= 基础数据 API =============

export const metadataApi = {
  // 获取PDT列表
  getPDTs: async (): Promise<ApiResponse<string[]>> => {
    return apiClient.get(API_ENDPOINTS.metadata.pdts);
  },

  // 获取渠道列表
  getChannels: async (): Promise<ApiResponse<string[]>> => {
    return apiClient.get(API_ENDPOINTS.metadata.channels);
  },

  // 获取奇点细分列表
  getSingularities: async (): Promise<ApiResponse<string[]>> => {
    return apiClient.get(API_ENDPOINTS.metadata.singularities);
  },

  // 获取品类列表
  getCategories: async (): Promise<ApiResponse<string[]>> => {
    return apiClient.get(API_ENDPOINTS.metadata.categories);
  },
};

// ============= 工具函数 =============

// 处理文件下载
export const downloadFile = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

// 格式化API错误消息
export const formatApiError = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return '操作失败，请稍后重试';
};

// 导出所有API
export default {
  dashboard: dashboardApi,
  forecast: forecastApi,
  audit: auditApi,
  pnData: pnDataApi,
  pdtForecast: pdtForecastApi,
  forecastTemplate: forecastTemplateApi,
  metadata: metadataApi,
};