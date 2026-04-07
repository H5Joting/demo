export interface MockBusinessSystem {
  id: string;
  name: string;
  code: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface MockCluster {
  id: string;
  name: string;
  name_en: string;
  type: 'wx' | 'nf';
  business_system_id: string;
  created_at: string;
  updated_at: string;
}

export interface MockDailyReport {
  id: string;
  report_date: string;
  business_system_id: string;
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

export interface MockLogMetric {
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

export interface MockCloudRegion {
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

export interface MockAssessment {
  id: string;
  report_id: string;
  category: string;
  content: string;
  status: 'normal' | 'warning' | 'critical';
  created_at: string;
}

export interface MockActionPlan {
  id: string;
  report_id: string;
  priority: string;
  items: string[];
  insight: string;
  created_at: string;
}

const businessSystems: MockBusinessSystem[] = [
  {
    id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    name: '统一日志平台',
    code: 'unified-log',
    description: '统一日志收集、存储和分析平台，支持多集群日志聚合',
    status: 'active',
    created_at: '2026-03-01T00:00:00Z',
    updated_at: '2026-04-06T08:00:00Z'
  },
  {
    id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    name: '支付中心',
    code: 'payment-center',
    description: '支付交易处理核心系统，支持多种支付渠道',
    status: 'active',
    created_at: '2026-03-01T00:00:00Z',
    updated_at: '2026-04-06T08:10:00Z'
  },
  {
    id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
    name: '订单系统',
    code: 'order-system',
    description: '订单全生命周期管理系统，包含订单创建、流转、完成',
    status: 'active',
    created_at: '2026-03-01T00:00:00Z',
    updated_at: '2026-04-06T08:30:00Z'
  }
];

const clusters: MockCluster[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    name: '威新集群',
    name_en: 'WX CLUSTER',
    type: 'wx',
    business_system_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    created_at: '2026-03-01T00:00:00Z',
    updated_at: '2026-04-06T08:00:00Z'
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    name: '南方集群',
    name_en: 'NF CLUSTER',
    type: 'nf',
    business_system_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    created_at: '2026-03-01T00:00:00Z',
    updated_at: '2026-04-06T08:00:00Z'
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    name: '支付主集群',
    name_en: 'PAYMENT MAIN CLUSTER',
    type: 'wx',
    business_system_id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    created_at: '2026-03-01T00:00:00Z',
    updated_at: '2026-04-06T08:10:00Z'
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    name: '支付备集群',
    name_en: 'PAYMENT BACKUP CLUSTER',
    type: 'nf',
    business_system_id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    created_at: '2026-03-01T00:00:00Z',
    updated_at: '2026-04-06T08:10:00Z'
  },
  {
    id: '55555555-5555-5555-5555-555555555555',
    name: '订单主集群',
    name_en: 'ORDER MAIN CLUSTER',
    type: 'wx',
    business_system_id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
    created_at: '2026-03-01T00:00:00Z',
    updated_at: '2026-04-06T08:30:00Z'
  },
  {
    id: '66666666-6666-6666-6666-666666666666',
    name: '订单备集群',
    name_en: 'ORDER BACKUP CLUSTER',
    type: 'nf',
    business_system_id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
    created_at: '2026-03-01T00:00:00Z',
    updated_at: '2026-04-06T08:30:00Z'
  }
];

const generateDailyReports = (): MockDailyReport[] => {
  const reports: MockDailyReport[] = [];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const dateStr = yesterday.toISOString().split('T')[0];
  
  businessSystems.forEach(system => {
    reports.push({
      id: `mock-${system.id}-${dateStr}`,
      report_date: dateStr,
      business_system_id: system.id,
      system_status: 'normal',
      wx_cluster_eps_rate: Math.floor(Math.random() * 20) + 70,
      wx_cluster_eps_peak_date: dateStr,
      wx_cluster_insight: `${system.name}主集群运行正常，各项指标稳定。`,
      nf_cluster_eps_rate: Math.floor(Math.random() * 15) + 55,
      nf_cluster_eps_peak_date: dateStr,
      nf_cluster_insight: `${system.name}备集群运行正常。`,
      created_at: `${dateStr}T08:00:00Z`,
      updated_at: `${dateStr}T08:00:00Z`
    });
  });
  
  return reports;
};

const generateLogMetrics = (): MockLogMetric[] => {
  const metrics: MockLogMetric[] = [];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const dateStr = yesterday.toISOString().split('T')[0];
  
  const metricTemplates: { [systemCode: string]: { name: string; nameEn: string; layer: 'access' | 'application'; unit: string; baseValue: number }[] } = {
    'unified-log': [
      { name: '请求量', nameEn: 'Request Count', layer: 'access', unit: '次', baseValue: 120000 },
      { name: '响应时间', nameEn: 'Response Time', layer: 'application', unit: 'ms', baseValue: 50 },
      { name: 'CPU使用率', nameEn: 'CPU Usage', layer: 'application', unit: '%', baseValue: 75 },
      { name: '内存使用率', nameEn: 'Memory Usage', layer: 'application', unit: '%', baseValue: 80 },
      { name: 'Collector EPS', nameEn: 'Collector EPS', layer: 'application', unit: 'w/s', baseValue: 10 },
    ],
    'payment-center': [
      { name: '交易量', nameEn: 'Transaction Count', layer: 'access', unit: '次', baseValue: 90000 },
      { name: '响应时间', nameEn: 'Response Time', layer: 'application', unit: 'ms', baseValue: 180 },
      { name: 'CPU使用率', nameEn: 'CPU Usage', layer: 'application', unit: '%', baseValue: 85 },
      { name: '内存使用率', nameEn: 'Memory Usage', layer: 'application', unit: '%', baseValue: 72 },
      { name: '交易TPS', nameEn: 'Transaction TPS', layer: 'application', unit: 'tps', baseValue: 8000 },
    ],
    'order-system': [
      { name: '订单量', nameEn: 'Order Count', layer: 'access', unit: '次', baseValue: 105000 },
      { name: '响应时间', nameEn: 'Response Time', layer: 'application', unit: 'ms', baseValue: 220 },
      { name: 'CPU使用率', nameEn: 'CPU Usage', layer: 'application', unit: '%', baseValue: 78 },
      { name: '内存使用率', nameEn: 'Memory Usage', layer: 'application', unit: '%', baseValue: 85 },
      { name: '订单TPS', nameEn: 'Order TPS', layer: 'application', unit: 'tps', baseValue: 9500 },
    ]
  };
  
  clusters.forEach(cluster => {
    const system = businessSystems.find(s => s.id === cluster.business_system_id);
    if (!system) return;
    
    const templates = metricTemplates[system.code] || [];
    const isMain = cluster.type === 'wx';
    const multiplier = isMain ? 1 : 0.5;
    
    templates.forEach((template, index) => {
      const baseValue = template.baseValue * multiplier;
      const variance = template.baseValue * 0.1;
      
      metrics.push({
        id: `mock-metric-${cluster.id}-${index}`,
        cluster_id: cluster.id,
        report_date: dateStr,
        metric_name: template.name,
        metric_name_en: template.nameEn,
        layer: template.layer,
        today_max: Math.round(baseValue + variance * (Math.random() * 0.5 + 0.5)),
        today_avg: Math.round(baseValue),
        yesterday_max: Math.round(baseValue + variance * (Math.random() * 0.5 + 0.3)),
        yesterday_avg: Math.round(baseValue - variance * 0.2),
        historical_max: Math.round(baseValue + variance * 1.5),
        historical_max_date: '2026-03-15',
        sla_threshold: Math.round(baseValue * 0.8),
        unit: template.unit,
        change_rate: Math.round((Math.random() * 6 - 3) * 10) / 10,
        health_status: 'healthy',
        created_at: `${dateStr}T08:00:00Z`,
        updated_at: `${dateStr}T08:00:00Z`
      });
    });
  });
  
  return metrics;
};

const generateCloudRegions = (): MockCloudRegion[] => {
  const regions: MockCloudRegion[] = [];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const dateStr = yesterday.toISOString().split('T')[0];
  
  const regionTemplates = [
    { name: '华东-上海', baseTraffic: 8500 },
    { name: '华北-北京', baseTraffic: 7200 },
    { name: '华南-广州', baseTraffic: 6800 },
  ];
  
  clusters.forEach(cluster => {
    regionTemplates.forEach((template, index) => {
      const isMain = cluster.type === 'wx';
      const multiplier = isMain ? 1.5 : 0.6;
      
      regions.push({
        id: `mock-region-${cluster.id}-${index}`,
        cluster_id: cluster.id,
        report_date: dateStr,
        name: template.name,
        node_count: Math.floor((Math.random() * 10 + 10) * (isMain ? 1.2 : 0.7)),
        current_traffic: Math.round(template.baseTraffic * multiplier),
        peak_traffic: Math.round(template.baseTraffic * multiplier * 1.3),
        region_type: cluster.type,
        created_at: `${dateStr}T08:00:00Z`,
        updated_at: `${dateStr}T08:00:00Z`
      });
    });
  });
  
  return regions;
};

const generateAssessments = (reports: MockDailyReport[]): MockAssessment[] => {
  const assessments: MockAssessment[] = [];
  
  const categories = [
    { category: '系统稳定性', content: '系统运行稳定，无异常告警。' },
    { category: '性能评估', content: '平均响应时间正常，性能表现良好。' },
    { category: '资源使用', content: 'CPU和内存使用率在合理范围内。' },
    { category: '数据处理', content: '数据处理效率正常，无积压。' },
  ];
  
  reports.forEach(report => {
    categories.forEach((cat, index) => {
      assessments.push({
        id: `mock-assessment-${report.id}-${index}`,
        report_id: report.id,
        category: cat.category,
        content: cat.content,
        status: 'normal',
        created_at: report.created_at
      });
    });
  });
  
  return assessments;
};

const generateActionPlans = (reports: MockDailyReport[]): MockActionPlan[] => {
  const plans: MockActionPlan[] = [];
  
  const planTemplates = [
    { priority: '高', items: ['持续监控系统运行状态', '关注资源使用趋势'], insight: '建议关注系统负载变化，做好容量规划。' },
    { priority: '中', items: ['定期检查存储空间使用情况', '优化查询性能'], insight: '存储空间充足，建议定期进行性能优化。' },
    { priority: '低', items: ['更新监控告警配置', '完善报表功能'], insight: '系统运行平稳，可按计划进行功能迭代。' },
  ];
  
  reports.forEach(report => {
    planTemplates.forEach((template, index) => {
      plans.push({
        id: `mock-plan-${report.id}-${index}`,
        report_id: report.id,
        priority: template.priority,
        items: template.items,
        insight: template.insight,
        created_at: report.created_at
      });
    });
  });
  
  return plans;
};

const dailyReports = generateDailyReports();
const logMetrics = generateLogMetrics();
const cloudRegions = generateCloudRegions();
const assessments = generateAssessments(dailyReports);
const actionPlans = generateActionPlans(dailyReports);

export const mockData = {
  businessSystems,
  clusters,
  dailyReports,
  logMetrics,
  cloudRegions,
  assessments,
  actionPlans
};

export const getMockBusinessSystems = () => businessSystems;
export const getMockClusters = () => clusters;
export const getMockDailyReports = () => dailyReports;
export const getMockLogMetrics = () => logMetrics;
export const getMockCloudRegions = () => cloudRegions;
export const getMockAssessments = () => assessments;
export const getMockActionPlans = () => actionPlans;

export const getMockBusinessSystemById = (id: string) => 
  businessSystems.find(s => s.id === id);

export const getMockClustersByBusinessSystem = (businessSystemId: string) =>
  clusters.filter(c => c.business_system_id === businessSystemId);

export const getMockDailyReportByDateAndSystem = (date: string, businessSystemId: string) =>
  dailyReports.find(r => r.report_date === date && r.business_system_id === businessSystemId);

export const getMockLogMetricsByReport = (dailyReportId: string) => {
  const report = dailyReports.find(r => r.id === dailyReportId);
  if (!report) return [];
  return logMetrics.filter(m => m.report_date === report.report_date);
};

export const getMockCloudRegionsByReport = (dailyReportId: string) => {
  const report = dailyReports.find(r => r.id === dailyReportId);
  if (!report) return [];
  return cloudRegions.filter(r => r.report_date === report.report_date);
};

export const getMockAssessmentsByReport = (dailyReportId: string) =>
  assessments.filter(a => a.report_id === dailyReportId);

export const getMockActionPlansByReport = (dailyReportId: string) =>
  actionPlans.filter(p => p.report_id === dailyReportId);

export const getMockAvailableDates = (businessSystemId: string) => {
  const dates = dailyReports
    .filter(r => r.business_system_id === businessSystemId)
    .map(r => r.report_date)
    .sort((a, b) => b.localeCompare(a));
  return [...new Set(dates)];
};
