export interface BusinessSystem {
  id: string;
  name: string;
  code: string;
  description: string;
  status: 'active' | 'inactive';
  datasource_reference?: {
    original_uid: string;
    datasource_type: string;
    panels?: GrafanaPanel[];
    imported_at: string;
  } | null;
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

/**
 * 导出元数据
 * 
 * 遵循 Grafana Dashboard 导出规范
 */
export interface ExportMetadata {
  exported_at: string;
  exporter_version: string;
  schema_version: number;
  type: 'dashboard';
  grafana_version?: string;
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

export interface GrafanaPanelDatasource {
  type: 'api' | 'database';
  endpoint?: string;
  method?: 'GET' | 'POST';
  params?: Record<string, any>;
  endpoints?: {
    assessment?: GrafanaPanelDatasource;
    actionPlan?: GrafanaPanelDatasource;
  };
}

export interface GrafanaPanel {
  id: string;
  type: 'summary_status' | 'sla_metrics' | 'cluster_metrics' | 'region_traffic' | 'assessment_action';
  title: string;
  description?: string;
  datasource: GrafanaPanelDatasource;
  gridPos: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  options?: Record<string, any>;
}

/**
 * Grafana 模板变量
 */
export interface GrafanaTemplatingVariable {
  name: string;
  type: 'custom' | 'query' | 'constant' | 'datasource' | 'interval';
  label?: string;
  current: {
    value: string;
    text: string;
  };
  options: any[];
  query?: string;
  datasource?: {
    type: string;
    uid: string;
  };
  refresh?: number;
  includeAll?: boolean;
  multi?: boolean;
}

/**
 * Grafana 注释配置
 */
export interface GrafanaAnnotation {
  name: string;
  type: 'dashboard' | 'alert' | 'annotation';
  datasource?: {
    type: string;
    uid: string;
  };
  expr?: string;
  step?: string;
  titleFormat?: string;
  textFormat?: string;
  enable?: boolean;
  hide?: boolean;
}

/**
 * Grafana 链接配置
 */
export interface GrafanaLink {
  title: string;
  url: string;
  type: 'link' | 'dashboards';
  targetBlank?: boolean;
  icon?: string;
  asDropdown?: boolean;
  tags?: string[];
}

/**
 * Grafana 面板配置
 */
export interface GrafanaPanel {
  id: string;
  title: string;
  description?: string;
  type: 'summary_status' | 'sla_metrics' | 'cluster_metrics' | 'region_traffic' | 'assessment_action';
  datasource: GrafanaPanelDatasource;
  gridPos: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  fieldConfig?: {
    defaults?: {
      unit?: string;
      thresholds?: {
        mode: 'absolute' | 'percentage';
        steps: Array<{
          color: string;
          value: number | null;
        }>;
      };
      custom?: Record<string, any>;
    };
    overrides?: any[];
  };
  options?: Record<string, any>;
  targets?: any[];
  transparent?: boolean;
}

/**
 * Grafana Dashboard 配置
 * 
 * 完全遵循 Grafana Dashboard JSON 规范
 */
export interface GrafanaDashboard {
  uid: string;
  title: string;
  description?: string;
  tags?: string[];
  style?: 'dark' | 'light';
  timezone?: 'browser' | 'utc';
  editable?: boolean;
  graphTooltip?: 0 | 1 | 2;
  refresh?: string;
  time?: {
    from: string;
    to: string;
  };
  timepicker?: {
    refresh_intervals?: string[];
    nowDelay?: string;
  };
  templating?: {
    list: GrafanaTemplatingVariable[];
  };
  annotations?: {
    list: GrafanaAnnotation[];
  };
  links?: GrafanaLink[];
  panels: GrafanaPanel[];
  clusters?: {
    wx_cluster: ExportClusterConfig | null;
    nf_cluster: ExportClusterConfig | null;
  };
  version?: number;
  schemaVersion?: number;
}

export interface ExportJSON {
  __meta: ExportMetadata;
  dashboard: GrafanaDashboard;
  overwrite?: boolean;
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
