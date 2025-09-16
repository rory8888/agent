import { usePaginatedApi, useApiMutation, useApi } from './useApi';
import api from '../services/api';
import { PNData, FilterParams } from '../types';

// PN数据相关hooks

export function usePNDataList(initialParams?: FilterParams) {
  return usePaginatedApi(
    (params) => api.pnData.getList(params),
    initialParams
  );
}

export function usePNDataDetail(id: string) {
  return useApi(
    () => api.pnData.getDetail(id),
    [id]
  );
}

export function useUpdatePNData() {
  return useApiMutation(({ id, data }: { id: string; data: Partial<PNData> }) => 
    api.pnData.update(id, data)
  );
}