import { useApi } from './useApi';
import api from '../services/api';

// 数据总览相关hooks

export function useDashboardSummary() {
  return useApi(() => api.dashboard.getSummary());
}

export function useSalesTrend(timeRange: string = '6months') {
  return useApi(
    () => api.dashboard.getSalesTrend(timeRange),
    [timeRange]
  );
}

export function useProductStatus() {
  return useApi(() => api.dashboard.getProductStatus());
}

// 基础数据hooks
export function useMetadata() {
  const pdts = useApi(() => api.metadata.getPDTs());
  const channels = useApi(() => api.metadata.getChannels());
  const singularities = useApi(() => api.metadata.getSingularities());
  const categories = useApi(() => api.metadata.getCategories());

  return {
    pdts: pdts.data?.data || [],
    channels: channels.data?.data || [],
    singularities: singularities.data?.data || [],
    categories: categories.data?.data || [],
    loading: pdts.loading || channels.loading || singularities.loading || categories.loading,
    error: pdts.error || channels.error || singularities.error || categories.error,
    refetch: () => {
      pdts.refetch();
      channels.refetch();
      singularities.refetch();
      categories.refetch();
    },
  };
}