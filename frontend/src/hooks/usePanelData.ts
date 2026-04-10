import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

/**
 * Panel 数据源配置接口
 */
export interface PanelDatasource {
  type: 'api' | 'database';
  endpoint: string;
  method?: 'GET' | 'POST';
  params?: Record<string, any>;
  refreshInterval?: number;
}

/**
 * Panel 数据获取状态
 */
export interface PanelDataState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * 通用 Panel 数据获取 Hook
 * 
 * 遵循 Grafana 的配置与数据分离原则：
 * - Panel 只存储数据源配置（endpoint, params）
 * - 数据在打开 Panel 时实时从 API 获取
 * - 支持自动刷新和手动刷新
 * 
 * @param datasource - 数据源配置
 * @param params - 额外的查询参数（如日期、系统ID等）
 * @returns Panel 数据状态
 */
export function usePanelData<T>(
  datasource: PanelDatasource | null,
  params?: Record<string, any>
): PanelDataState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const paramsKey = useMemo(() => JSON.stringify(params || {}), [params]);
  const datasourceKey = useMemo(() => 
    datasource ? `${datasource.endpoint}-${datasource.method}` : '', 
    [datasource]
  );

  const fetchData = useCallback(async () => {
    if (!datasource) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const url = new URL(datasource.endpoint, window.location.origin);
      
      const queryParams = { ...datasource.params, ...params };
      Object.entries(queryParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });

      const response = await fetch(url.toString(), {
        method: datasource.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setData(result.data);
      } else {
        throw new Error(result.error || '获取数据失败');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '获取数据失败';
      setError(errorMessage);
      console.error('Panel data fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [datasourceKey, paramsKey]);

  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchData();
    }

    if (datasource?.refreshInterval && datasource.refreshInterval > 0) {
      const interval = setInterval(fetchData, datasource.refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchData, datasource?.refreshInterval]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}

/**
 * Panel 数据源配置预设
 */
export const PANEL_DATASOURCES = {
  slaMetrics: {
    type: 'api' as const,
    endpoint: '/api/panel/sla-metrics',
    method: 'GET' as const,
  },
  clusterMetrics: {
    type: 'api' as const,
    endpoint: '/api/panel/cluster-metrics',
    method: 'GET' as const,
  },
  regionTraffic: {
    type: 'api' as const,
    endpoint: '/api/panel/region-traffic',
    method: 'GET' as const,
  },
  summary: {
    type: 'api' as const,
    endpoint: '/api/panel/summary',
    method: 'GET' as const,
  },
  assessment: {
    type: 'api' as const,
    endpoint: '/api/panel/assessment',
    method: 'GET' as const,
  },
  actionPlan: {
    type: 'api' as const,
    endpoint: '/api/panel/action-plan',
    method: 'GET' as const,
  },
};
