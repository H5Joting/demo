import axios from 'axios';
import { ApiResponse, DashboardSummary, LogMetric, CloudRegion, Cluster } from '@/types';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

export const fetchDashboardSummary = async (date?: string): Promise<DashboardSummary> => {
  const params = date ? { date } : {};
  const response = await api.get<ApiResponse<DashboardSummary>>('/dashboard/summary', { params });
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to fetch dashboard summary');
  }
  return response.data.data;
};

export const fetchAvailableDates = async (): Promise<{ report_date: string; system_status: string }[]> => {
  const response = await api.get<ApiResponse<{ report_date: string; system_status: string }[]>>('/available-dates');
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to fetch available dates');
  }
  return response.data.data;
};

export const fetchClusters = async (): Promise<Cluster[]> => {
  const response = await api.get<ApiResponse<Cluster[]>>('/clusters');
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to fetch clusters');
  }
  return response.data.data;
};

export const fetchMetrics = async (clusterId: string): Promise<LogMetric[]> => {
  const response = await api.get<ApiResponse<LogMetric[]>>(`/metrics/${clusterId}`);
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to fetch metrics');
  }
  return response.data.data;
};

export const fetchAllMetrics = async (): Promise<LogMetric[]> => {
  const response = await api.get<ApiResponse<LogMetric[]>>('/metrics/all');
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to fetch all metrics');
  }
  return response.data.data;
};

export const fetchSlaMetrics = async (): Promise<LogMetric[]> => {
  const response = await api.get<ApiResponse<LogMetric[]>>('/sla-metrics');
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to fetch SLA metrics');
  }
  return response.data.data;
};

export const fetchRegions = async (clusterId: string): Promise<CloudRegion[]> => {
  const response = await api.get<ApiResponse<CloudRegion[]>>(`/regions/${clusterId}`);
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to fetch regions');
  }
  return response.data.data;
};

export const fetchTopRegions = async (limit: number = 5): Promise<CloudRegion[]> => {
  const response = await api.get<ApiResponse<CloudRegion[]>>(`/regions/top/${limit}`);
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to fetch top regions');
  }
  return response.data.data;
};

export default api;
