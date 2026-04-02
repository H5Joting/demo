export interface MockBusinessSystem {
  id: string;
  name: string;
  code: string;
  description: string;
  status: string;
  created_at: string;
}

export interface MockCluster {
  id: string;
  name: string;
  code: string;
  description: string;
  business_system_id: string;
  created_at: string;
}

export interface MockDailyReport {
  id: string;
  report_date: string;
  business_system_id: string;
  cluster_id: string;
  overall_health_score: number;
  summary: string;
  created_at: string;
}

export interface MockLogMetric {
  id: string;
  daily_report_id: string;
  metric_name: string;
  metric_value: number;
  unit: string;
  created_at: string;
}

export interface MockCloudRegion {
  id: string;
  daily_report_id: string;
  region_name: string;
  status: string;
  cpu_usage: number;
  memory_usage: number;
  disk_usage: number;
  created_at: string;
}

export interface MockAssessment {
  id: string;
  daily_report_id: string;
  category: string;
  score: number;
  details: string;
  created_at: string;
}

export interface MockActionPlan {
  id: string;
  daily_report_id: string;
  priority: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
}

const businessSystems: MockBusinessSystem[] = [
  {
    id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    name: '统一日志平台',
    code: 'unified-log',
    description: '统一日志收集、存储和分析平台，支持多集群日志聚合',
    status: 'active',
    created_at: '2026-03-01T00:00:00Z'
  },
  {
    id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    name: '支付中心',
    code: 'payment-center',
    description: '支付交易处理核心系统，支持多种支付渠道',
    status: 'active',
    created_at: '2026-03-01T00:00:00Z'
  },
  {
    id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
    name: '订单系统',
    code: 'order-system',
    description: '订单全生命周期管理系统，包含订单创建、流转、完成',
    status: 'active',
    created_at: '2026-03-01T00:00:00Z'
  }
];

const clusters: MockCluster[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    name: '无锡集群',
    code: 'wx-cluster',
    description: '无锡数据中心主集群',
    business_system_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    created_at: '2026-03-01T00:00:00Z'
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    name: '南方集群',
    code: 'nf-cluster',
    description: '南方数据中心备用集群',
    business_system_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    created_at: '2026-03-01T00:00:00Z'
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    name: '支付主集群',
    code: 'pay-main',
    description: '支付核心交易集群',
    business_system_id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    created_at: '2026-03-01T00:00:00Z'
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    name: '订单主集群',
    code: 'order-main',
    description: '订单处理主集群',
    business_system_id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
    created_at: '2026-03-01T00:00:00Z'
  }
];

const generateDailyReports = (): MockDailyReport[] => {
  const reports: MockDailyReport[] = [];
  const dates = ['2026-03-29', '2026-03-30', '2026-03-31'];
  
  businessSystems.forEach(system => {
    dates.forEach(date => {
      const cluster = clusters.find(c => c.business_system_id === system.id);
      if (cluster) {
        reports.push({
          id: `${system.id}-${date}`,
          report_date: date,
          business_system_id: system.id,
          cluster_id: cluster.id,
          overall_health_score: Math.floor(Math.random() * 20) + 80,
          summary: `${system.name} ${date} 运行正常，各项指标稳定`,
          created_at: `${date}T08:00:00Z`
        });
      }
    });
  });
  
  return reports;
};

const generateLogMetrics = (reports: MockDailyReport[]): MockLogMetric[] => {
  const metrics: MockLogMetric[] = [];
  
  reports.forEach(report => {
    const baseMetrics = [
      { name: 'Collector EPS', value: Math.floor(Math.random() * 50000) + 100000, unit: 'events/s' },
      { name: 'Indexer EPS', value: Math.floor(Math.random() * 30000) + 80000, unit: 'events/s' },
      { name: 'Search Latency', value: Math.floor(Math.random() * 50) + 100, unit: 'ms' },
      { name: 'Storage Used', value: Math.floor(Math.random() * 20) + 70, unit: '%' },
    ];
    
    if (report.business_system_id === 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb') {
      baseMetrics.push(
        { name: '交易TPS', value: Math.floor(Math.random() * 5000) + 10000, unit: 'tps' },
        { name: '交易成功率', value: Math.floor(Math.random() * 5) + 95, unit: '%' }
      );
    }
    
    if (report.business_system_id === 'cccccccc-cccc-cccc-cccc-cccccccccccc') {
      baseMetrics.push(
        { name: '订单TPS', value: Math.floor(Math.random() * 3000) + 8000, unit: 'tps' },
        { name: '订单成功率', value: Math.floor(Math.random() * 3) + 97, unit: '%' }
      );
    }
    
    baseMetrics.forEach((metric, index) => {
      metrics.push({
        id: `${report.id}-metric-${index}`,
        daily_report_id: report.id,
        metric_name: metric.name,
        metric_value: metric.value,
        unit: metric.unit,
        created_at: report.created_at
      });
    });
  });
  
  return metrics;
};

const generateCloudRegions = (reports: MockDailyReport[]): MockCloudRegion[] => {
  const regions: MockCloudRegion[] = [];
  const regionNames = ['华东-上海', '华南-广州', '华北-北京'];
  
  reports.forEach(report => {
    regionNames.forEach((name, index) => {
      regions.push({
        id: `${report.id}-region-${index}`,
        daily_report_id: report.id,
        region_name: name,
        status: Math.random() > 0.1 ? 'healthy' : 'warning',
        cpu_usage: Math.floor(Math.random() * 30) + 40,
        memory_usage: Math.floor(Math.random() * 25) + 50,
        disk_usage: Math.floor(Math.random() * 20) + 60,
        created_at: report.created_at
      });
    });
  });
  
  return regions;
};

const generateAssessments = (reports: MockDailyReport[]): MockAssessment[] => {
  const assessments: MockAssessment[] = [];
  const categories = [
    { name: '系统稳定性', details: '系统运行稳定，无重大故障' },
    { name: '性能表现', details: '响应时间正常，吞吐量达标' },
    { name: '资源利用', details: '资源使用合理，无瓶颈' },
    { name: '安全合规', details: '安全策略执行到位' }
  ];
  
  reports.forEach(report => {
    categories.forEach((cat, index) => {
      assessments.push({
        id: `${report.id}-assessment-${index}`,
        daily_report_id: report.id,
        category: cat.name,
        score: Math.floor(Math.random() * 15) + 85,
        details: cat.details,
        created_at: report.created_at
      });
    });
  });
  
  return assessments;
};

const generateActionPlans = (reports: MockDailyReport[]): MockActionPlan[] => {
  const plans: MockActionPlan[] = [];
  
  reports.forEach(report => {
    if (Math.random() > 0.5) {
      plans.push({
        id: `${report.id}-plan-1`,
        daily_report_id: report.id,
        priority: 'high',
        title: '优化数据库查询性能',
        description: '针对慢查询进行索引优化',
        status: 'pending',
        created_at: report.created_at
      });
    }
    if (Math.random() > 0.7) {
      plans.push({
        id: `${report.id}-plan-2`,
        daily_report_id: report.id,
        priority: 'medium',
        title: '扩容存储容量',
        description: '预计下月存储需求增长，提前扩容',
        status: 'in_progress',
        created_at: report.created_at
      });
    }
  });
  
  return plans;
};

const dailyReports = generateDailyReports();
const logMetrics = generateLogMetrics(dailyReports);
const cloudRegions = generateCloudRegions(dailyReports);
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

export const getMockLogMetricsByReport = (dailyReportId: string) =>
  logMetrics.filter(m => m.daily_report_id === dailyReportId);

export const getMockCloudRegionsByReport = (dailyReportId: string) =>
  cloudRegions.filter(r => r.daily_report_id === dailyReportId);

export const getMockAssessmentsByReport = (dailyReportId: string) =>
  assessments.filter(a => a.daily_report_id === dailyReportId);

export const getMockActionPlansByReport = (dailyReportId: string) =>
  actionPlans.filter(p => p.daily_report_id === dailyReportId);

export const getMockAvailableDates = (businessSystemId: string) => {
  const dates = dailyReports
    .filter(r => r.business_system_id === businessSystemId)
    .map(r => r.report_date)
    .sort((a, b) => b.localeCompare(a));
  return [...new Set(dates)];
};
