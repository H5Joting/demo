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
  wx_cluster_eps_rate: number;
  wx_cluster_eps_peak_date: string;
  wx_cluster_insight: string;
  nf_cluster_eps_rate: number;
  nf_cluster_eps_peak_date: string;
  nf_cluster_insight: string;
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
  items: string[] | any;
  insight: string;
  created_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ExportMetadata {
  exported_at: string;
  exporter_version: string;
  schema_version: number;
}

export interface ExportClusterConfig {
  name: string;
  name_en: string;
  type: 'wx' | 'nf';
  description?: string;
}

export interface ExportMetricConfig {
  metric_name: string;
  metric_name_en: string;
  layer: 'access' | 'buffer' | 'storage' | 'application';
  unit: string;
  sla_threshold: number;
}

export interface ExportPanelConfig {
  type: 'metrics_table' | 'region_traffic' | 'assessment' | 'action_plan';
  title: string;
  description?: string;
  visible: boolean;
  order: number;
}

export interface ExportDatasourceRef {
  type: 'supabase' | 'mock';
  uid: string;
  description: string;
}

export interface ExportQueryConfig {
  table: string;
  filters?: Record<string, string[]>;
  sort?: {
    field: string;
    order: 'asc' | 'desc';
  };
  limit?: number;
}

export interface ExportPanelDatasource {
  panel_type: string;
  title: string;
  datasource: ExportDatasourceRef;
  query: ExportQueryConfig;
  visible: boolean;
  order: number;
}

export interface ExportJSON {
  __meta: ExportMetadata;
  uid?: string;
  overwrite?: boolean;
  datasource: ExportDatasourceRef;
  report: {
    title: string;
    description: string;
    code: string;
    status: 'active' | 'inactive';
    tags: string[];
    refresh_interval?: string;
    time_range?: {
      from: string;
      to: string;
    };
  };
  clusters: {
    wx_cluster: ExportClusterConfig | null;
    nf_cluster: ExportClusterConfig | null;
  };
  panels: ExportPanelConfig[];
  templating: {
    variables: {
      name: string;
      type: 'custom' | 'query';
      default: string;
      options: string[];
    }[];
  };
  data_queries: ExportPanelDatasource[];
}

export interface ImportResult {
  message: string;
  mode: 'created' | 'updated';
  imported: {
    business_system: number;
    clusters: number;
  };
  details: {
    business_system: BusinessSystem;
    clusters: Cluster[];
  };
}
