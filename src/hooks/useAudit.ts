import { usePaginatedApi, useApiMutation, useBatchOperation, useDebouncedUpdate } from './useApi';
import api from '../services/api';
import { PNAuditData, FilterParams } from '../types';

// PN审核相关hooks

export function useAuditList(initialParams?: FilterParams) {
  return usePaginatedApi(
    (params) => api.audit.getList(params),
    initialParams
  );
}

export function useUpdateAudit() {
  return useApiMutation(({ id, data }: { id: string; data: Partial<PNAuditData> }) => 
    api.audit.update(id, data)
  );
}

export function useBatchUpdateAudit() {
  return useBatchOperation((updates) => 
    api.audit.batchUpdate(updates)
  );
}

export function useDebouncedAuditUpdate() {
  return useDebouncedUpdate(
    (id: string, data: Partial<PNAuditData>) => api.audit.update(id, data),
    200 // 200ms防抖
  );
}