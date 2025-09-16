import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import { formatApiError } from '../services/api';

// 通用API调用hook
export function useApi<T>(
  apiCall: () => Promise<T>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
    } catch (err) {
      const errorMsg = formatApiError(err);
      setError(errorMsg);
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    execute();
  }, [execute]);

  const refetch = useCallback(() => {
    execute();
  }, [execute]);

  return { data, loading, error, refetch };
}

// 分页数据hook
export function usePaginatedApi<T>(
  apiCall: (params?: any) => Promise<{ data: { items: T[]; total: number; page: number; size: number } }>,
  initialParams: any = {}
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 50,
    total: 0,
  });
  const [params, setParams] = useState(initialParams);

  const fetchData = useCallback(async (newParams?: any) => {
    try {
      setLoading(true);
      setError(null);
      const finalParams = { ...params, ...newParams };
      const result = await apiCall({
        page: pagination.current,
        size: pagination.pageSize,
        ...finalParams,
      });
      
      setData(result.data.items);
      setPagination(prev => ({
        ...prev,
        total: result.data.total,
        current: result.data.page,
        pageSize: result.data.size,
      }));
    } catch (err) {
      const errorMsg = formatApiError(err);
      setError(errorMsg);
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [params, pagination.current, pagination.pageSize]);

  useEffect(() => {
    fetchData();
  }, []);

  const handleTableChange = useCallback((newPagination: any, filters: any, sorter: any) => {
    setPagination(prev => ({
      ...prev,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    }));
    
    // 构建新的查询参数
    const newParams = { ...params };
    
    // 处理筛选
    Object.keys(filters).forEach(key => {
      if (filters[key] && filters[key].length > 0) {
        newParams[key] = filters[key];
      } else {
        delete newParams[key];
      }
    });

    // 处理排序
    if (sorter && sorter.order) {
      newParams.sortField = sorter.field;
      newParams.sortOrder = sorter.order;
    } else {
      delete newParams.sortField;
      delete newParams.sortOrder;
    }

    setParams(newParams);
  }, [params]);

  const updateParams = useCallback((newParams: any) => {
    setParams(prev => ({ ...prev, ...newParams }));
    setPagination(prev => ({ ...prev, current: 1 })); // 重置到第一页
  }, []);

  const refetch = useCallback(() => {
    fetchData(params);
  }, [fetchData, params]);

  return {
    data,
    loading,
    error,
    pagination,
    params,
    handleTableChange,
    updateParams,
    refetch,
  };
}

// 数据更新hook
export function useApiMutation<T, P = any>(
  apiCall: (params: P) => Promise<T>
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(async (params: P): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall(params);
      message.success('操作成功');
      return result;
    } catch (err) {
      const errorMsg = formatApiError(err);
      setError(errorMsg);
      message.error(errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  return { mutate, loading, error };
}

// 批量操作hook
export function useBatchOperation<T>(
  batchApiCall: (updates: any) => Promise<T[]>
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeBatch = useCallback(async (updates: any[]): Promise<T[] | null> => {
    if (updates.length === 0) {
      message.warning('没有需要更新的数据');
      return null;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await batchApiCall({ updates });
      message.success(`批量操作成功，更新了 ${updates.length} 条记录`);
      return result;
    } catch (err) {
      const errorMsg = formatApiError(err);
      setError(errorMsg);
      message.error(errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  }, [batchApiCall]);

  return { executeBatch, loading, error };
}

// 文件上传hook
export function useFileUpload(
  uploadApiCall: (file: File) => Promise<any>
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(async (file: File) => {
    try {
      setLoading(true);
      setError(null);
      const result = await uploadApiCall(file);
      
      if (result.data.failed > 0) {
        message.warning(`导入完成：成功 ${result.data.success} 条，失败 ${result.data.failed} 条`);
        if (result.data.errors.length > 0) {
          console.error('导入错误:', result.data.errors);
        }
      } else {
        message.success(`导入成功：${result.data.success} 条记录`);
      }
      
      return result;
    } catch (err) {
      const errorMsg = formatApiError(err);
      setError(errorMsg);
      message.error(errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  }, [uploadApiCall]);

  return { upload, loading, error };
}

// 防抖更新hook
export function useDebouncedUpdate<T>(
  updateApiCall: (id: string, data: Partial<T>) => Promise<T>,
  delay: number = 500
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedUpdate = useCallback(
    debounce(async (id: string, data: Partial<T>) => {
      try {
        setLoading(true);
        setError(null);
        await updateApiCall(id, data);
        // 不显示成功消息，避免频繁提示
      } catch (err) {
        const errorMsg = formatApiError(err);
        setError(errorMsg);
        message.error(errorMsg);
      } finally {
        setLoading(false);
      }
    }, delay),
    [updateApiCall, delay]
  );

  return { debouncedUpdate, loading, error };
}

// 防抖函数
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}