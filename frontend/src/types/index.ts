export interface BusinessSystem {
  id: string;
  name: string;
  code: string;
  description: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface Cluster {
  id: string;
  name: string;
  name_en: string;
  type: 'wx' | 'nf';
  created_at: string;
  updated_at: string;
}

export interface LogMetric {
  id: string;
  cluster_id: string;
  cluster_name?: string;
  cluster_type?: string;
  report_date: string;
  metric_name: string;
  metric_name_en: string;
  layer: 'access' | 'buffer' | 'storage' | 'application';
  today_max: number;
  today_avg: number;
  yesterday_max: number;
  yesterday_avg: number;
  historical_max: number;
  historical_max_date: string;
  sla_threshold: number;
  unit: string;
  change_rate: number;
  health_status: 'healthy' | 'warning' | 'critical';
  created_at: string;
  updated_at: string;
}

export interface CloudRegion {
  id: string;
  cluster_id: string;
  cluster_name?: string;
  cluster_type?: string;
  report_date: string;
  name: string;
  node_count: number;
  current_traffic: number;
  peak_traffic: number;
  region_type: string;
  created_at: string;
  updated_at: string;
}

export interface DailyReport {
  id: string;
  report_date: string;
  system_status: 'normal' | 'warning' | 'critical';
  system_status_text: string;
  system_insight: string;
  wx_cluster_eps_rate: number;
  wx_cluster_eps_peak: number;
  wx_cluster_eps_peak_date: string;
  wx_cluster_insight: string;
  wx_cluster_description: string;
  nf_cluster_eps_rate: number;
  nf_cluster_eps_peak: number;
  nf_cluster_eps_peak_date: string;
  nf_cluster_insight: string;
  nf_cluster_description: string;
  created_at: string;
  updated_at: string;
}

export interface Assessment {
  id: string;
  report_id: string;
  category: string;
  content: string;
  status: 'normal' | 'warning' | 'critical';
  created_at: string;
}

export interface ActionPlan {
  id: string;
  report_id: string;
  priority: string;
  items: string[];
  insight: string;
  created_at: string;
}

export interface RegionStats {
  total_regions: number;
  nf_regions: number;
  wx_regions: number;
  avg_traffic: number;
}

export interface DashboardSummary {
  report: DailyReport | null;
  wxCluster: Cluster | null;
  nfCluster: Cluster | null;
  wxMetrics: LogMetric[];
  nfMetrics: LogMetric[];
  slaMetrics: LogMetric[];
  topRegions: CloudRegion[];
  regionStats: RegionStats;
  assessments: Assessment[];
  actionPlans: ActionPlan[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
