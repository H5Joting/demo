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
  
  const systemConfigs: { [code: string]: { 
    wxEps: number; 
    nfEps: number;
    wxEpsPeak: number;
    nfEpsPeak: number;
    wxInsight: string; 
    nfInsight: string;
    wxDescription: string;
    nfDescription: string;
    status: 'normal' | 'warning' | 'critical';
    statusText: string;
    systemInsight: string;
  } } = {
    'unified-log': {
      wxEps: 78,
      nfEps: 66,
      wxEpsPeak: 11,
      nfEpsPeak: 6,
      wxInsight: '统一日志平台主集群运行正常，EPS峰值较上一交易日下跌5.51%，流量有所回落。',
      nfInsight: '南方集群指标平稳，弹性良好，无明显瓶颈。',
      wxDescription: '较上一交易日下跌 5.51%，流量有所回落。',
      nfDescription: '集群指标平稳，弹性良好，无明显瓶颈。',
      status: 'normal',
      statusText: '系统运行正常',
      systemInsight: '无高风险告警，所有指标正常，但需关注磁盘使用率趋势以防潜在容量风险。'
    },
    'payment-center': {
      wxEps: 85,
      nfEps: 72,
      wxEpsPeak: 8,
      nfEpsPeak: 4,
      wxInsight: '支付中心主集群交易量稳定，响应时间在正常范围内，建议关注高峰期资源使用。',
      nfInsight: '支付备集群运行正常，可作为主集群的容灾备份。',
      wxDescription: '交易量稳定，响应时间正常，建议关注高峰期资源使用。',
      nfDescription: '备集群运行正常，可作为主集群的容灾备份。',
      status: 'normal',
      statusText: '系统运行正常',
      systemInsight: '交易成功率保持在99.9%以上，但CPU使用率偏高，建议关注高峰期资源分配。'
    },
    'order-system': {
      wxEps: 92,
      nfEps: 58,
      wxEpsPeak: 9.5,
      nfEpsPeak: 4.8,
      wxInsight: '订单系统主集群负载较高，建议在促销活动前进行容量评估。',
      nfInsight: '订单备集群资源利用率偏低，可考虑优化资源配置。',
      wxDescription: '主集群负载较高，建议在促销活动前进行容量评估。',
      nfDescription: '备集群资源利用率偏低，可考虑优化资源配置。',
      status: 'warning',
      statusText: '系统运行预警',
      systemInsight: '主集群负载较高，订单处理响应时间偏长，建议优化数据库查询并扩容资源。'
    }
  };
  
  businessSystems.forEach(system => {
    const config = systemConfigs[system.code] || {
      wxEps: Math.floor(Math.random() * 20) + 70,
      nfEps: Math.floor(Math.random() * 15) + 55,
      wxEpsPeak: Math.round((Math.random() * 5 + 8) * 10) / 10,
      nfEpsPeak: Math.round((Math.random() * 3 + 4) * 10) / 10,
      wxInsight: `${system.name}主集群运行正常，各项指标稳定。`,
      nfInsight: `${system.name}备集群运行正常。`,
      wxDescription: '集群运行正常，各项指标稳定。',
      nfDescription: '备集群运行正常。',
      status: 'normal' as const,
      statusText: '系统运行正常',
      systemInsight: '系统运行平稳，无异常告警。'
    };
    
    reports.push({
      id: `mock-${system.id}-${dateStr}`,
      report_date: dateStr,
      business_system_id: system.id,
      system_status: config.status,
      system_status_text: config.statusText,
      system_insight: config.systemInsight,
      wx_cluster_eps_rate: config.wxEps,
      wx_cluster_eps_peak: config.wxEpsPeak,
      wx_cluster_eps_peak_date: dateStr,
      wx_cluster_insight: config.wxInsight,
      wx_cluster_description: config.wxDescription,
      nf_cluster_eps_rate: config.nfEps,
      nf_cluster_eps_peak: config.nfEpsPeak,
      nf_cluster_eps_peak_date: dateStr,
      nf_cluster_insight: config.nfInsight,
      nf_cluster_description: config.nfDescription,
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
  
  const metricTemplates: { [systemCode: string]: { name: string; nameEn: string; layer: 'access' | 'buffer' | 'storage' | 'application'; unit: string; baseValue: number }[] } = {
    'unified-log': [
      { name: '请求量', nameEn: 'Request Count', layer: 'access', unit: '次', baseValue: 120000 },
      { name: '响应时间', nameEn: 'Response Time', layer: 'application', unit: 'ms', baseValue: 50 },
      { name: 'CPU使用率', nameEn: 'CPU Usage', layer: 'application', unit: '%', baseValue: 75 },
      { name: '内存使用率', nameEn: 'Memory Usage', layer: 'application', unit: '%', baseValue: 80 },
      { name: 'Collector EPS', nameEn: 'Collector EPS', layer: 'application', unit: 'w/s', baseValue: 11 },
      { name: '平均搜索耗时', nameEn: 'Avg Search Time', layer: 'storage', unit: 'ms', baseValue: 120 },
      { name: '日志入库耗时', nameEn: 'Log Ingest Time', layer: 'buffer', unit: 'ms', baseValue: 85 },
      { name: '监控延迟', nameEn: 'Monitor Latency', layer: 'application', unit: 'ms', baseValue: 35 },
    ],
    'payment-center': [
      { name: '交易量', nameEn: 'Transaction Count', layer: 'access', unit: '次', baseValue: 90000 },
      { name: '响应时间', nameEn: 'Response Time', layer: 'application', unit: 'ms', baseValue: 180 },
      { name: 'CPU使用率', nameEn: 'CPU Usage', layer: 'application', unit: '%', baseValue: 85 },
      { name: '内存使用率', nameEn: 'Memory Usage', layer: 'application', unit: '%', baseValue: 72 },
      { name: '交易TPS', nameEn: 'Transaction TPS', layer: 'application', unit: 'w/s', baseValue: 8 },
      { name: '平均搜索耗时', nameEn: 'Avg Search Time', layer: 'storage', unit: 'ms', baseValue: 95 },
      { name: '日志入库耗时', nameEn: 'Log Ingest Time', layer: 'buffer', unit: 'ms', baseValue: 68 },
      { name: '监控延迟', nameEn: 'Monitor Latency', layer: 'application', unit: 'ms', baseValue: 42 },
    ],
    'order-system': [
      { name: '订单量', nameEn: 'Order Count', layer: 'access', unit: '次', baseValue: 105000 },
      { name: '响应时间', nameEn: 'Response Time', layer: 'application', unit: 'ms', baseValue: 220 },
      { name: 'CPU使用率', nameEn: 'CPU Usage', layer: 'application', unit: '%', baseValue: 78 },
      { name: '内存使用率', nameEn: 'Memory Usage', layer: 'application', unit: '%', baseValue: 85 },
      { name: '订单TPS', nameEn: 'Order TPS', layer: 'application', unit: 'w/s', baseValue: 9.5 },
      { name: '平均搜索耗时', nameEn: 'Avg Search Time', layer: 'storage', unit: 'ms', baseValue: 145 },
      { name: '日志入库耗时', nameEn: 'Log Ingest Time', layer: 'buffer', unit: 'ms', baseValue: 92 },
      { name: '监控延迟', nameEn: 'Monitor Latency', layer: 'application', unit: 'ms', baseValue: 28 },
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
      const isEpsMetric = ['Collector EPS', '交易TPS', '订单TPS'].includes(template.name);
      const roundFn = isEpsMetric ? (n: number) => Math.round(n * 10) / 10 : Math.round;
      
      metrics.push({
        id: `mock-metric-${cluster.id}-${index}`,
        cluster_id: cluster.id,
        report_date: dateStr,
        metric_name: template.name,
        metric_name_en: template.nameEn,
        layer: template.layer,
        today_max: roundFn(baseValue + variance * (Math.random() * 0.5 + 0.5)),
        today_avg: roundFn(baseValue),
        yesterday_max: roundFn(baseValue + variance * (Math.random() * 0.5 + 0.3)),
        yesterday_avg: roundFn(baseValue - variance * 0.2),
        historical_max: roundFn(baseValue + variance * 1.5),
        historical_max_date: '2026-03-15',
        sla_threshold: roundFn(baseValue * 0.8),
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
  
  const regionTemplatesBySystem: { [code: string]: { name: string; baseTraffic: number }[] } = {
    'unified-log': [
      { name: '华东-上海', baseTraffic: 12500 },
      { name: '华北-北京', baseTraffic: 9800 },
      { name: '华南-广州', baseTraffic: 8200 },
      { name: '西南-成都', baseTraffic: 6500 },
      { name: '华中-武汉', baseTraffic: 5200 },
    ],
    'payment-center': [
      { name: '华东-上海', baseTraffic: 15800 },
      { name: '华北-北京', baseTraffic: 11200 },
      { name: '华南-广州', baseTraffic: 9500 },
      { name: '西南-成都', baseTraffic: 7800 },
      { name: '西北-西安', baseTraffic: 4500 },
    ],
    'order-system': [
      { name: '华东-上海', baseTraffic: 18200 },
      { name: '华北-北京', baseTraffic: 13500 },
      { name: '华南-广州', baseTraffic: 10800 },
      { name: '西南-成都', baseTraffic: 8200 },
      { name: '东北-沈阳', baseTraffic: 3800 },
    ]
  };
  
  clusters.forEach(cluster => {
    const system = businessSystems.find(s => s.id === cluster.business_system_id);
    if (!system) return;
    
    const regionTemplates = regionTemplatesBySystem[system.code] || [
      { name: '华东-上海', baseTraffic: 8500 },
      { name: '华北-北京', baseTraffic: 7200 },
      { name: '华南-广州', baseTraffic: 6800 },
    ];
    
    const isMain = cluster.type === 'wx';
    const multiplier = isMain ? 1.5 : 0.6;
    
    regionTemplates.forEach((template, index) => {
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
  
  const categoriesBySystem: { [code: string]: { category: string; content: string; status: 'normal' | 'warning' | 'critical' }[] } = {
    'unified-log': [
      { category: '系统稳定性', content: '统一日志平台运行稳定，无异常告警。', status: 'normal' },
      { category: '性能评估', content: '日志收集和处理性能正常，EPS峰值略有下降。', status: 'normal' },
      { category: '资源使用', content: 'CPU和内存使用率在合理范围内，存储空间充足。', status: 'normal' },
      { category: '数据处理', content: '日志入库延迟正常，无积压现象。', status: 'normal' },
    ],
    'payment-center': [
      { category: '系统稳定性', content: '支付中心运行稳定，交易成功率保持在99.9%以上。', status: 'normal' },
      { category: '性能评估', content: '交易响应时间略有波动，建议关注高峰期表现。', status: 'warning' },
      { category: '资源使用', content: '主集群CPU使用率偏高，建议扩容或优化。', status: 'warning' },
      { category: '数据处理', content: '交易数据处理正常，备集群同步延迟在可接受范围。', status: 'normal' },
    ],
    'order-system': [
      { category: '系统稳定性', content: '订单系统整体稳定，但主集群负载较高。', status: 'warning' },
      { category: '性能评估', content: '订单处理响应时间偏长，需优化数据库查询。', status: 'warning' },
      { category: '资源使用', content: '主集群资源紧张，备集群利用率偏低。', status: 'warning' },
      { category: '数据处理', content: '订单数据处理正常，但高峰期存在轻微延迟。', status: 'normal' },
    ]
  };
  
  reports.forEach(report => {
    const system = businessSystems.find(s => s.id === report.business_system_id);
    if (!system) return;
    
    const categories = categoriesBySystem[system.code] || [
      { category: '系统稳定性', content: '系统运行稳定，无异常告警。', status: 'normal' },
      { category: '性能评估', content: '平均响应时间正常，性能表现良好。', status: 'normal' },
      { category: '资源使用', content: 'CPU和内存使用率在合理范围内。', status: 'normal' },
      { category: '数据处理', content: '数据处理效率正常，无积压。', status: 'normal' },
    ];
    
    categories.forEach((cat, index) => {
      assessments.push({
        id: `mock-assessment-${report.id}-${index}`,
        report_id: report.id,
        category: cat.category,
        content: cat.content,
        status: cat.status,
        created_at: report.created_at
      });
    });
  });
  
  return assessments;
};

const generateActionPlans = (reports: MockDailyReport[]): MockActionPlan[] => {
  const plans: MockActionPlan[] = [];
  
  const planTemplatesBySystem: { [code: string]: { priority: string; items: string[]; insight: string }[] } = {
    'unified-log': [
      { priority: '高', items: ['持续监控EPS变化趋势', '关注存储空间增长'], insight: '日志量增长平稳，建议提前规划存储扩容。' },
      { priority: '中', items: ['优化日志查询性能', '完善日志分类策略'], insight: '查询性能良好，可进一步优化索引策略。' },
      { priority: '低', items: ['更新告警阈值配置', '完善日志分析报表'], insight: '系统运行平稳，可按计划进行功能迭代。' },
    ],
    'payment-center': [
      { priority: '高', items: ['优化高峰期资源分配', '加强交易监控告警'], insight: '交易高峰期资源紧张，建议提前扩容或优化。' },
      { priority: '中', items: ['优化数据库查询性能', '完善容灾切换流程'], insight: '数据库查询存在优化空间，建议进行索引优化。' },
      { priority: '低', items: ['更新监控大盘配置', '完善交易分析报表'], insight: '系统整体稳定，可按计划进行功能迭代。' },
    ],
    'order-system': [
      { priority: '高', items: ['扩容主集群资源', '优化数据库查询'], insight: '主集群负载较高，建议在促销前完成扩容。' },
      { priority: '中', items: ['均衡主备集群负载', '优化订单处理流程'], insight: '备集群利用率偏低，可考虑负载均衡优化。' },
      { priority: '低', items: ['更新监控告警配置', '完善订单分析报表'], insight: '系统整体稳定，建议关注促销活动期间的资源使用。' },
    ]
  };
  
  reports.forEach(report => {
    const system = businessSystems.find(s => s.id === report.business_system_id);
    if (!system) return;
    
    const planTemplates = planTemplatesBySystem[system.code] || [
      { priority: '高', items: ['持续监控系统运行状态', '关注资源使用趋势'], insight: '建议关注系统负载变化，做好容量规划。' },
      { priority: '中', items: ['定期检查存储空间使用情况', '优化查询性能'], insight: '存储空间充足，建议定期进行性能优化。' },
      { priority: '低', items: ['更新监控告警配置', '完善报表功能'], insight: '系统运行平稳，可按计划进行功能迭代。' },
    ];
    
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

let cachedReportDate: string | null = null;
let cachedDailyReports = dailyReports;
let cachedLogMetrics = logMetrics;
let cachedCloudRegions = cloudRegions;
let cachedAssessments = assessments;
let cachedActionPlans = actionPlans;

const getOrCreateDailyData = (targetDate: string) => {
  if (cachedReportDate === targetDate) {
    return {
      reports: cachedDailyReports,
      metrics: cachedLogMetrics,
      regions: cachedCloudRegions,
      assessments: cachedAssessments,
      actionPlans: cachedActionPlans
    };
  }

  const originalDateFn = () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split('T')[0];
  };

  const originalGenerateDailyReports = (): MockDailyReport[] => {
    const reports: MockDailyReport[] = [];
    const dateStr = targetDate;
    
    const systemConfigs: { [code: string]: { 
      wxEps: number; 
      nfEps: number;
      wxEpsPeak: number;
      nfEpsPeak: number;
      wxInsight: string; 
      nfInsight: string;
      wxDescription: string;
      nfDescription: string;
      status: 'normal' | 'warning' | 'critical';
      statusText: string;
      systemInsight: string;
    } } = {
      'unified-log': {
        wxEps: 78, nfEps: 66, wxEpsPeak: 11, nfEpsPeak: 6,
        wxInsight: '统一日志平台主集群运行正常，EPS峰值较上一交易日下跌5.51%，流量有所回落。',
        nfInsight: '南方集群指标平稳，弹性良好，无明显瓶颈。',
        wxDescription: '较上一交易日下跌 5.51%，流量有所回落。',
        nfDescription: '集群指标平稳，弹性良好，无明显瓶颈。',
        status: 'normal', statusText: '系统运行正常',
        systemInsight: '无高风险告警，所有指标正常，但需关注磁盘使用率趋势以防潜在容量风险。'
      },
      'payment-center': {
        wxEps: 85, nfEps: 72, wxEpsPeak: 8, nfEpsPeak: 4,
        wxInsight: '支付中心主集群交易量稳定，响应时间在正常范围内，建议关注高峰期资源使用。',
        nfInsight: '支付备集群运行正常，可作为主集群的容灾备份。',
        wxDescription: '交易量稳定，响应时间正常，建议关注高峰期资源使用。',
        nfDescription: '备集群运行正常，可作为主集群的容灾备份。',
        status: 'normal', statusText: '系统运行正常',
        systemInsight: '交易成功率保持在99.9%以上，但CPU使用率偏高，建议关注高峰期资源分配。'
      },
      'order-system': {
        wxEps: 92, nfEps: 58, wxEpsPeak: 9.5, nfEpsPeak: 4.8,
        wxInsight: '订单系统主集群负载较高，建议在促销活动前进行容量评估。',
        nfInsight: '订单备集群资源利用率偏低，可考虑优化资源配置。',
        wxDescription: '主集群负载较高，建议在促销活动前进行容量评估。',
        nfDescription: '备集群资源利用率偏低，可考虑优化资源配置。',
        status: 'warning', statusText: '系统运行预警',
        systemInsight: '主集群负载较高，订单处理响应时间偏长，建议优化数据库查询并扩容资源。'
      }
    };
    
    businessSystems.forEach(system => {
      const config = systemConfigs[system.code] || {
        wxEps: Math.floor(Math.random() * 20) + 70,
        nfEps: Math.floor(Math.random() * 15) + 55,
        wxEpsPeak: Math.round((Math.random() * 5 + 8) * 10) / 10,
        nfEpsPeak: Math.round((Math.random() * 3 + 4) * 10) / 10,
        wxInsight: `${system.name}主集群运行正常，各项指标稳定。`,
        nfInsight: `${system.name}备集群运行正常。`,
        wxDescription: '集群运行正常，各项指标稳定。',
        nfDescription: '备集群运行正常。',
        status: 'normal' as const,
        statusText: '系统运行正常',
        systemInsight: '系统运行平稳，无异常告警。'
      };
      
      reports.push({
        id: `mock-${system.id}-${dateStr}`,
        report_date: dateStr,
        business_system_id: system.id,
        system_status: config.status,
        system_status_text: config.statusText,
        system_insight: config.systemInsight,
        wx_cluster_eps_rate: config.wxEps,
        wx_cluster_eps_peak: config.wxEpsPeak,
        wx_cluster_eps_peak_date: dateStr,
        wx_cluster_insight: config.wxInsight,
        wx_cluster_description: config.wxDescription,
        nf_cluster_eps_rate: config.nfEps,
        nf_cluster_eps_peak: config.nfEpsPeak,
        nf_cluster_eps_peak_date: dateStr,
        nf_cluster_insight: config.nfInsight,
        nf_cluster_description: config.nfDescription,
        created_at: `${dateStr}T08:00:00Z`,
        updated_at: `${dateStr}T08:00:00Z`
      });
    });
    
    return reports;
  };

  const newReports = originalGenerateDailyReports();
  
  const originalGenerateLogMetrics = (): MockLogMetric[] => {
    const metrics: MockLogMetric[] = [];
    const dateStr = targetDate;
    
    const metricTemplates: { [systemCode: string]: { name: string; nameEn: string; layer: 'access' | 'buffer' | 'storage' | 'application'; unit: string; baseValue: number }[] } = {
      'unified-log': [
        { name: '请求量', nameEn: 'Request Count', layer: 'access', unit: '次', baseValue: 120000 },
        { name: '响应时间', nameEn: 'Response Time', layer: 'application', unit: 'ms', baseValue: 50 },
        { name: 'CPU使用率', nameEn: 'CPU Usage', layer: 'application', unit: '%', baseValue: 75 },
        { name: '内存使用率', nameEn: 'Memory Usage', layer: 'application', unit: '%', baseValue: 80 },
        { name: 'Collector EPS', nameEn: 'Collector EPS', layer: 'application', unit: 'w/s', baseValue: 11 },
        { name: '平均搜索耗时', nameEn: 'Avg Search Time', layer: 'storage', unit: 'ms', baseValue: 120 },
        { name: '日志入库耗时', nameEn: 'Log Ingest Time', layer: 'buffer', unit: 'ms', baseValue: 85 },
        { name: '监控延迟', nameEn: 'Monitor Latency', layer: 'application', unit: 'ms', baseValue: 35 },
      ],
      'payment-center': [
        { name: '交易量', nameEn: 'Transaction Count', layer: 'access', unit: '次', baseValue: 90000 },
        { name: '响应时间', nameEn: 'Response Time', layer: 'application', unit: 'ms', baseValue: 180 },
        { name: 'CPU使用率', nameEn: 'CPU Usage', layer: 'application', unit: '%', baseValue: 85 },
        { name: '内存使用率', nameEn: 'Memory Usage', layer: 'application', unit: '%', baseValue: 72 },
        { name: '交易TPS', nameEn: 'Transaction TPS', layer: 'application', unit: 'w/s', baseValue: 8 },
        { name: '平均搜索耗时', nameEn: 'Avg Search Time', layer: 'storage', unit: 'ms', baseValue: 95 },
        { name: '日志入库耗时', nameEn: 'Log Ingest Time', layer: 'buffer', unit: 'ms', baseValue: 68 },
        { name: '监控延迟', nameEn: 'Monitor Latency', layer: 'application', unit: 'ms', baseValue: 42 },
      ],
      'order-system': [
        { name: '订单量', nameEn: 'Order Count', layer: 'access', unit: '次', baseValue: 105000 },
        { name: '响应时间', nameEn: 'Response Time', layer: 'application', unit: 'ms', baseValue: 220 },
        { name: 'CPU使用率', nameEn: 'CPU Usage', layer: 'application', unit: '%', baseValue: 78 },
        { name: '内存使用率', nameEn: 'Memory Usage', layer: 'application', unit: '%', baseValue: 85 },
        { name: '订单TPS', nameEn: 'Order TPS', layer: 'application', unit: 'w/s', baseValue: 9.5 },
        { name: '平均搜索耗时', nameEn: 'Avg Search Time', layer: 'storage', unit: 'ms', baseValue: 145 },
        { name: '日志入库耗时', nameEn: 'Log Ingest Time', layer: 'buffer', unit: 'ms', baseValue: 92 },
        { name: '监控延迟', nameEn: 'Monitor Latency', layer: 'application', unit: 'ms', baseValue: 28 },
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
        const isEpsMetric = ['Collector EPS', '交易TPS', '订单TPS'].includes(template.name);
        const roundFn = isEpsMetric ? (n: number) => Math.round(n * 10) / 10 : Math.round;
        
        metrics.push({
          id: `mock-metric-${cluster.id}-${index}`,
          cluster_id: cluster.id,
          report_date: dateStr,
          metric_name: template.name,
          metric_name_en: template.nameEn,
          layer: template.layer,
          today_max: roundFn(baseValue + variance * (Math.random() * 0.5 + 0.5)),
          today_avg: roundFn(baseValue),
          yesterday_max: roundFn(baseValue + variance * (Math.random() * 0.5 + 0.3)),
          yesterday_avg: roundFn(baseValue - variance * 0.2),
          historical_max: roundFn(baseValue + variance * 1.5),
          historical_max_date: '2026-03-15',
          sla_threshold: roundFn(baseValue * 0.8),
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
  
  const newMetrics = originalGenerateLogMetrics();

  const originalGenerateCloudRegions = (): MockCloudRegion[] => {
    const regions: MockCloudRegion[] = [];
    const dateStr = targetDate;
    
    const regionTemplatesBySystem: { [code: string]: { name: string; baseTraffic: number }[] } = {
      'unified-log': [
        { name: '华东-上海', baseTraffic: 12500 },
        { name: '华北-北京', baseTraffic: 9800 },
        { name: '华南-广州', baseTraffic: 8200 },
        { name: '西南-成都', baseTraffic: 6500 },
        { name: '华中-武汉', baseTraffic: 5200 },
      ],
      'payment-center': [
        { name: '华东-上海', baseTraffic: 15800 },
        { name: '华北-北京', baseTraffic: 11200 },
        { name: '华南-广州', baseTraffic: 9500 },
        { name: '西南-成都', baseTraffic: 7800 },
        { name: '西北-西安', baseTraffic: 4500 },
      ],
      'order-system': [
        { name: '华东-上海', baseTraffic: 18200 },
        { name: '华北-北京', baseTraffic: 13500 },
        { name: '华南-广州', baseTraffic: 10800 },
        { name: '西南-成都', baseTraffic: 8200 },
        { name: '东北-沈阳', baseTraffic: 3800 },
      ]
    };
    
    clusters.forEach(cluster => {
      const system = businessSystems.find(s => s.id === cluster.business_system_id);
      if (!system) return;
      
      const regionTemplates = regionTemplatesBySystem[system.code] || [
        { name: '华东-上海', baseTraffic: 8500 },
        { name: '华北-北京', baseTraffic: 7200 },
        { name: '华南-广州', baseTraffic: 6800 },
      ];
      
      const isMain = cluster.type === 'wx';
      const multiplier = isMain ? 1.5 : 0.6;
      
      regionTemplates.forEach((template, index) => {
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

  const newRegions = originalGenerateCloudRegions();

  const newAssessments = generateAssessments(newReports);
  const newPlans = generateActionPlans(newReports);

  cachedReportDate = targetDate;
  cachedDailyReports = newReports;
  cachedLogMetrics = newMetrics;
  cachedCloudRegions = newRegions;
  cachedAssessments = newAssessments;
  cachedActionPlans = newPlans;

  return {
    reports: newReports,
    metrics: newMetrics,
    regions: newRegions,
    assessments: newAssessments,
    actionPlans: newPlans
  };
};

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
export const getMockDailyReports = (targetDate?: string) => {
  if (!targetDate) {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    targetDate = d.toISOString().split('T')[0];
  }
  return getOrCreateDailyData(targetDate).reports;
};

export const getMockLogMetrics = (targetDate?: string) => {
  if (!targetDate) {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    targetDate = d.toISOString().split('T')[0];
  }
  return getOrCreateDailyData(targetDate).metrics;
};

export const getMockCloudRegions = (targetDate?: string) => {
  if (!targetDate) {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    targetDate = d.toISOString().split('T')[0];
  }
  return getOrCreateDailyData(targetDate).regions;
};

export const getMockAssessments = (targetDate?: string) => {
  if (!targetDate) {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    targetDate = d.toISOString().split('T')[0];
  }
  return getOrCreateDailyData(targetDate).assessments;
};

export const getMockActionPlans = (targetDate?: string) => {
  if (!targetDate) {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    targetDate = d.toISOString().split('T')[0];
  }
  return getOrCreateDailyData(targetDate).actionPlans;
};

export const getMockBusinessSystemById = (id: string) => 
  businessSystems.find(s => s.id === id);

export const getMockClustersByBusinessSystem = (businessSystemId: string) =>
  clusters.filter(c => c.business_system_id === businessSystemId);

export const getMockDailyReportByDateAndSystem = (date: string, businessSystemId: string) => {
  const reports = getMockDailyReports(date);
  return reports.find(r => r.report_date === date && r.business_system_id === businessSystemId);
};

export const getMockLogMetricsByReport = (dailyReportId: string) => {
  const match = dailyReportId.match(/^mock-([a-f0-9-]+)-(\d{4}-\d{2}-\d{2})$/);
  if (match) {
    const [, , dateStr] = match;
    const allMetrics = getMockLogMetrics(dateStr);
    const bsId = match[1];
    const systemClusters = clusters.filter(c => c.business_system_id === bsId);
    const clusterIds = systemClusters.map(c => c.id);
    return allMetrics.filter(m => clusterIds.includes(m.cluster_id));
  }
  
  const reports = getMockDailyReports();
  const report = reports.find(r => r.id === dailyReportId);
  if (!report) return [];
  const systemClusters = clusters.filter(c => c.business_system_id === report.business_system_id);
  const clusterIds = systemClusters.map(c => c.id);
  const allMetrics = getMockLogMetrics(report.report_date);
  return allMetrics.filter(m => m.report_date === report.report_date && clusterIds.includes(m.cluster_id));
};

export const getMockCloudRegionsByReport = (dailyReportId: string) => {
  const match = dailyReportId.match(/^mock-([a-f0-9-]+)-(\d{4}-\d{2}-\d{2})$/);
  if (match) {
    const [, , dateStr] = match;
    const allRegions = getMockCloudRegions(dateStr);
    const bsId = match[1];
    const systemClusters = clusters.filter(c => c.business_system_id === bsId);
    const clusterIds = systemClusters.map(c => c.id);
    return allRegions.filter(r => clusterIds.includes(r.cluster_id));
  }
  
  const reports = getMockDailyReports();
  const report = reports.find(r => r.id === dailyReportId);
  if (!report) return [];
  const systemClusters = clusters.filter(c => c.business_system_id === report.business_system_id);
  const clusterIds = systemClusters.map(c => c.id);
  const allRegions = getMockCloudRegions(report.report_date);
  return allRegions.filter(r => r.report_date === report.report_date && clusterIds.includes(r.cluster_id));
};

export const getMockAssessmentsByReport = (dailyReportId: string) => {
  const reports = getMockDailyReports();
  const report = reports.find(r => r.id === dailyReportId);
  if (report) {
    const allAssessments = getMockAssessments(report.report_date);
    return allAssessments.filter(a => a.report_id === dailyReportId);
  }
  
  const match = dailyReportId.match(/^mock-([a-f0-9-]+)-(\d{4}-\d{2}-\d{2})$/);
  if (match) {
    const [, bsId, dateStr] = match;
    const system = businessSystems.find(s => s.id === bsId);
    if (!system) return [];
    
    const categoriesBySystem: { [code: string]: { category: string; content: string; status: 'normal' | 'warning' | 'critical' }[] } = {
      'unified-log': [
        { category: '系统稳定性', content: '统一日志平台运行稳定，无异常告警。', status: 'normal' },
        { category: '性能评估', content: '日志收集和处理性能正常，EPS峰值略有下降。', status: 'normal' },
        { category: '资源使用', content: 'CPU和内存使用率在合理范围内，存储空间充足。', status: 'normal' },
        { category: '数据处理', content: '日志入库延迟正常，无积压现象。', status: 'normal' },
      ],
      'payment-center': [
        { category: '系统稳定性', content: '支付中心运行稳定，交易成功率保持在99.9%以上。', status: 'normal' },
        { category: '性能评估', content: '交易响应时间略有波动，建议关注高峰期表现。', status: 'warning' },
        { category: '资源使用', content: '主集群CPU使用率偏高，建议扩容或优化。', status: 'warning' },
        { category: '数据处理', content: '交易数据处理正常，备集群同步延迟在可接受范围。', status: 'normal' },
      ],
      'order-system': [
        { category: '系统稳定性', content: '订单系统整体稳定，但主集群负载较高。', status: 'warning' },
        { category: '性能评估', content: '订单处理响应时间偏长，需优化数据库查询。', status: 'warning' },
        { category: '资源使用', content: '主集群资源紧张，备集群利用率偏低。', status: 'warning' },
        { category: '数据处理', content: '订单数据处理正常，但高峰期存在轻微延迟。', status: 'normal' },
      ]
    };
    
    const categories = categoriesBySystem[system.code] || [
      { category: '系统稳定性', content: '系统运行稳定，无异常告警。', status: 'normal' },
      { category: '性能评估', content: '平均响应时间正常，性能表现良好。', status: 'normal' },
      { category: '资源使用', content: 'CPU和内存使用率在合理范围内。', status: 'normal' },
      { category: '数据处理', content: '数据处理效率正常，无积压。', status: 'normal' },
    ];
    
    return categories.map((cat, index) => ({
      id: `mock-assessment-${dailyReportId}-${index}`,
      report_id: dailyReportId,
      category: cat.category,
      content: cat.content,
      status: cat.status,
      created_at: `${dateStr}T08:00:00Z`
    }));
  }
  
  return [];
};

export const getMockActionPlansByReport = (dailyReportId: string) => {
  const reports = getMockDailyReports();
  const report = reports.find(r => r.id === dailyReportId);
  if (report) {
    const allPlans = getMockActionPlans(report.report_date);
    return allPlans.filter(p => p.report_id === dailyReportId);
  }
  
  const match = dailyReportId.match(/^mock-([a-f0-9-]+)-(\d{4}-\d{2}-\d{2})$/);
  if (match) {
    const [, bsId, dateStr] = match;
    const system = businessSystems.find(s => s.id === bsId);
    if (!system) return [];
    
    const planTemplatesBySystem: { [code: string]: { priority: string; items: string[]; insight: string }[] } = {
      'unified-log': [
        { priority: '高', items: ['持续监控EPS变化趋势', '关注存储空间增长'], insight: '日志量增长平稳，建议提前规划存储扩容。' },
        { priority: '中', items: ['优化日志查询性能', '完善日志分类策略'], insight: '查询性能良好，可进一步优化索引策略。' },
        { priority: '低', items: ['更新告警阈值配置', '完善日志分析报表'], insight: '系统运行平稳，可按计划进行功能迭代。' },
      ],
      'payment-center': [
        { priority: '高', items: ['优化高峰期资源分配', '加强交易监控告警'], insight: '交易高峰期资源紧张，建议提前扩容或优化。' },
        { priority: '中', items: ['优化数据库查询性能', '完善容灾切换流程'], insight: '数据库查询存在优化空间，建议进行索引优化。' },
        { priority: '低', items: ['更新监控大盘配置', '完善交易分析报表'], insight: '系统整体稳定，可按计划进行功能迭代。' },
      ],
      'order-system': [
        { priority: '高', items: ['扩容主集群资源', '优化数据库查询'], insight: '主集群负载较高，建议在促销前完成扩容。' },
        { priority: '中', items: ['均衡主备集群负载', '优化订单处理流程'], insight: '备集群利用率偏低，可考虑负载均衡优化。' },
        { priority: '低', items: ['更新监控告警配置', '完善订单分析报表'], insight: '系统整体稳定，建议关注促销活动期间的资源使用。' },
      ]
    };
    
    const planTemplates = planTemplatesBySystem[system.code] || [
      { priority: '高', items: ['持续监控系统运行状态', '关注资源使用趋势'], insight: '建议关注系统负载变化，做好容量规划。' },
      { priority: '中', items: ['定期检查存储空间使用情况', '优化查询性能'], insight: '存储空间充足，建议定期进行性能优化。' },
      { priority: '低', items: ['更新监控告警配置', '完善报表功能'], insight: '系统运行平稳，可按计划进行功能迭代。' },
    ];
    
    return planTemplates.map((template, index) => ({
      id: `mock-plan-${dailyReportId}-${index}`,
      report_id: dailyReportId,
      priority: template.priority,
      items: template.items,
      insight: template.insight,
      created_at: `${dateStr}T08:00:00Z`
    }));
  }
  
  return [];
};

export const getMockAvailableDates = (businessSystemId: string) => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const yesterday = d.toISOString().split('T')[0];
  
  const reports = getMockDailyReports(yesterday);
  const dates = reports
    .filter(r => r.business_system_id === businessSystemId)
    .map(r => r.report_date)
    .sort((a, b) => b.localeCompare(a));
  return [...new Set(dates)];
};
