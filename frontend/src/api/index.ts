import axios from 'axios';
import { ApiResponse, DashboardSummary, LogMetric, CloudRegion, Cluster, BusinessSystem } from '@/types';

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
});

export const fetchBusinessSystems = async (): Promise<BusinessSystem[]> => {
  const response = await api.get<ApiResponse<BusinessSystem[]>>('/business-systems');
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to fetch business systems');
  }
  return response.data.data;
};

export const fetchBusinessSystem = async (id: string): Promise<BusinessSystem> => {
  const response = await api.get<ApiResponse<BusinessSystem>>(`/business-systems/${id}`);
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to fetch business system');
  }
  return response.data.data;
};

export const fetchDashboardSummary = async (date: string, businessSystemId?: string): Promise<DashboardSummary> => {
  const params: Record<string, string> = { date };
  if (businessSystemId) {
    params.businessSystemId = businessSystemId;
  }
  const response = await api.get<ApiResponse<DashboardSummary>>('/dashboard/summary', { params });
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to fetch dashboard summary');
  }
  return response.data.data;
};

export const fetchAvailableDates = async (businessSystemId?: string): Promise<{ report_date: string; system_status: string }[]> => {
  const params: Record<string, string> = {};
  if (businessSystemId) {
    params.businessSystemId = businessSystemId;
  }
  const response = await api.get<ApiResponse<{ report_date: string; system_status: string }[]>>('/available-dates', { params });
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to fetch available dates');
  }
  return response.data.data;
};

export interface SystemMetric {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
}

export interface BusinessSystemOverview {
  id: string;
  name: string;
  code: string;
  description: string;
  status: 'active' | 'inactive';
  metrics: SystemMetric[];
  report_date: string;
}

export const fetchBusinessSystemsOverview = async (): Promise<BusinessSystemOverview[]> => {
  const response = await api.get<ApiResponse<BusinessSystemOverview[]>>('/business-systems-overview');
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to fetch business systems overview');
  }
  return response.data.data;
};

export const fetchClusters = async (businessSystemId?: string): Promise<Cluster[]> => {
  const params: Record<string, string> = {};
  if (businessSystemId) {
    params.businessSystemId = businessSystemId;
  }
  const response = await api.get<ApiResponse<Cluster[]>>('/clusters', { params });
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to fetch clusters');
  }
  return response.data.data;
};

export const fetchMetrics = async (clusterId: string, date?: string): Promise<LogMetric[]> => {
  const params: Record<string, string> = {};
  if (date) {
    params.date = date;
  }
  const response = await api.get<ApiResponse<LogMetric[]>>(`/metrics/${clusterId}`, { params });
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to fetch metrics');
  }
  return response.data.data;
};

export const fetchRegions = async (date?: string, businessSystemId?: string): Promise<CloudRegion[]> => {
  const params: Record<string, string> = {};
  if (date) {
    params.date = date;
  }
  if (businessSystemId) {
    params.businessSystemId = businessSystemId;
  }
  const response = await api.get<ApiResponse<CloudRegion[]>>('/regions', { params });
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to fetch regions');
  }
  return response.data.data;
};

export interface ReportDetailData {
  system: BusinessSystem;
  metrics: SystemMetric[];
  clusters: Cluster[];
  dailyReport: any;
  reportDate: string;
}

export const fetchReportDetail = async (systemId: string, date?: string): Promise<ReportDetailData> => {
  const params: Record<string, string> = {};
  if (date) {
    params.date = date;
  }
  const response = await api.get<ApiResponse<ReportDetailData>>(`/report-detail/${systemId}`, { params });
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to fetch report detail');
  }
  return response.data.data;
};

export interface DataSourceStatus {
  enabled: boolean;
  source: 'supabase' | 'mock';
  connected: boolean;
}

export const fetchDataSourceStatus = async (): Promise<DataSourceStatus> => {
  const response = await api.get<ApiResponse<DataSourceStatus>>('/data-source');
  if (!response.data.success || !response.data.data) {
    return { enabled: false, source: 'mock', connected: false };
  }
  return response.data.data;
};

export const toggleDataSource = async (enabled: boolean): Promise<DataSourceStatus> => {
  const response = await api.post<ApiResponse<DataSourceStatus>>('/data-source/toggle', { enabled });
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to toggle data source');
  }
  return response.data.data;
};

export default api;
