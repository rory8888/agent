import { usePaginatedApi, useApiMutation, useBatchOperation, useFileUpload, useDebouncedUpdate } from './useApi';
import api from '../services/api';
import { ForecastEntryData, FilterParams } from '../types';

// PN快速填写 (预测收集) 相关hooks

export function useForecastList(initialParams?: FilterParams) {
  return usePaginatedApi(
    (params) => api.forecast.getList(params),
    initialParams
  );
}

export function useCreateForecast() {
  return useApiMutation((data: Omit<ForecastEntryData, 'key'>) => 
    api.forecast.create(data)
  );
}

export function useUpdateForecast() {
  return useApiMutation(({ id, data }: { id: string; data: Partial<ForecastEntryData> }) => 
    api.forecast.update(id, data)
  );
}

export function useBatchUpdateForecast() {
  return useBatchOperation((updates) => 
    api.forecast.batchUpdate(updates)
  );
}

export function useImportForecast() {
  return useFileUpload((file: File) => 
    api.forecast.import(file)
  );
}

export function useDebouncedForecastUpdate() {
  return useDebouncedUpdate(
    (id: string, data: Partial<ForecastEntryData>) => api.forecast.update(id, data),
    200 // 200ms防抖
  );
}