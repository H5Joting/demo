const axios = require('axios');

const API_BASE = 'http://localhost:3010/api';

const BUSINESS_SYSTEMS = {
  LOG_PLATFORM: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  PAYMENT_CENTER: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  ORDER_SYSTEM: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
};

const CLUSTERS = {
  WX_CLUSTER: '11111111-1111-1111-1111-111111111111',
  NF_CLUSTER: '22222222-2222-2222-2222-222222222222',
  PAYMENT_PRIMARY: '33333333-3333-3333-3333-333333333333',
  PAYMENT_BACKUP: '44444444-4444-4444-4444-444444444444',
  ORDER_PRIMARY: '55555555-5555-5555-5555-555555555555',
  ORDER_BACKUP: '66666666-6666-6666-6666-666666666666',
};

function getYesterday() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split('T')[0];
}

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

async function enableSupabase() {
  try {
    const response = await axios.post(`${API_BASE}/data-source/toggle`, { enabled: true });
    console.log('✓ 已启用 Supabase 数据源');
    return response.data.success;
  } catch (error) {
    console.error('✗ 启用 Supabase 失败:', error.response?.data || error.message);
    return false;
  }
}

async function checkYesterdayData(date) {
  try {
    const response = await axios.get(`${API_BASE}/daily-reports/${date}`);
    return response.data.data && response.data.data.length > 0;
  } catch (error) {
    return false;
  }
}

async function insertDailyReports(date) {
  console.log(`\n插入日报数据 (${date})...`);

  const reports = [
    {
      id: `${BUSINESS_SYSTEMS.LOG_PLATFORM}-${date}`,
      report_date: date,
      business_system_id: BUSINESS_SYSTEMS.LOG_PLATFORM,
      system_status: 'normal',
      system_status_text: '系统运行正常',
      system_insight: '统一日志平台运行稳定，日志采集和处理正常，无明显瓶颈。',
      wx_cluster_eps_rate: 75 + Math.floor(Math.random() * 10),
      wx_cluster_eps_peak: 10 + Math.round(Math.random() * 3 * 10) / 10,
      wx_cluster_eps_peak_date: date,
      wx_cluster_insight: '威新集群运行正常，日志采集稳定，处理效率良好。',
      wx_cluster_description: '集群运行正常，各项指标稳定。',
      nf_cluster_eps_rate: 55 + Math.floor(Math.random() * 10),
      nf_cluster_eps_peak: 5 + Math.round(Math.random() * 2 * 10) / 10,
      nf_cluster_eps_peak_date: date,
      nf_cluster_insight: '南方集群运行正常，备份功能正常。',
      nf_cluster_description: '备集群运行正常。',
      created_at: `${date}T08:00:00Z`,
      updated_at: `${date}T08:00:00Z`
    },
    {
      id: `${BUSINESS_SYSTEMS.PAYMENT_CENTER}-${date}`,
      report_date: date,
      business_system_id: BUSINESS_SYSTEMS.PAYMENT_CENTER,
      system_status: 'normal',
      system_status_text: '系统运行正常',
      system_insight: '支付中心运行稳定，交易成功率保持在99.9%以上，响应时间正常。',
      wx_cluster_eps_rate: 85 + Math.floor(Math.random() * 10),
      wx_cluster_eps_peak: 8 + Math.round(Math.random() * 2 * 10) / 10,
      wx_cluster_eps_peak_date: date,
      wx_cluster_insight: '支付主集群运行平稳，交易处理正常，响应时间稳定。',
      wx_cluster_description: '交易量稳定，响应时间正常。',
      nf_cluster_eps_rate: 65 + Math.floor(Math.random() * 10),
      nf_cluster_eps_peak: 4 + Math.round(Math.random() * 2 * 10) / 10,
      nf_cluster_eps_peak_date: date,
      nf_cluster_insight: '支付备集群运行正常，作为灾备节点随时可用。',
      nf_cluster_description: '备集群运行正常。',
      created_at: `${date}T08:00:00Z`,
      updated_at: `${date}T08:00:00Z`
    },
    {
      id: `${BUSINESS_SYSTEMS.ORDER_SYSTEM}-${date}`,
      report_date: date,
      business_system_id: BUSINESS_SYSTEMS.ORDER_SYSTEM,
      system_status: 'normal',
      system_status_text: '系统运行正常',
      system_insight: '订单系统运行稳定，订单处理效率正常，无明显延迟。',
      wx_cluster_eps_rate: 90 + Math.floor(Math.random() * 10),
      wx_cluster_eps_peak: 9 + Math.round(Math.random() * 2 * 10) / 10,
      wx_cluster_eps_peak_date: date,
      wx_cluster_insight: '订单主集群运行正常，订单处理效率稳定，无明显延迟。',
      wx_cluster_description: '主集群运行正常，订单处理稳定。',
      nf_cluster_eps_rate: 65 + Math.floor(Math.random() * 10),
      nf_cluster_eps_peak: 5 + Math.round(Math.random() * 2 * 10) / 10,
      nf_cluster_eps_peak_date: date,
      nf_cluster_insight: '订单备集群运行正常。',
      nf_cluster_description: '备集群运行正常。',
      created_at: `${date}T08:00:00Z`,
      updated_at: `${date}T08:00:00Z`
    }
  ];

  for (const report of reports) {
    try {
      await axios.post(`${API_BASE}/daily-reports`, report);
      console.log(`  ✓ 日报 ${report.business_system_id}`);
    } catch (error) {
      console.log(`  ✗ 日报 ${report.business_system_id}: ${error.response?.data?.error || error.message}`);
    }
  }
}

async function insertLogMetrics(date) {
  console.log(`\n插入日志指标数据 (${date})...`);

  const metrics = [
    {
      id: generateUUID(),
      cluster_id: CLUSTERS.WX_CLUSTER,
      report_date: date,
      metric_name: '请求量',
      metric_name_en: 'Request Count',
      layer: 'access',
      today_max: 120000 + Math.floor(Math.random() * 10000),
      today_avg: 100000 + Math.floor(Math.random() * 5000),
      yesterday_max: 115000 + Math.floor(Math.random() * 5000),
      yesterday_avg: 95000 + Math.floor(Math.random() * 5000),
      historical_max: 150000,
      historical_max_date: '2026-03-15',
      sla_threshold: 180000,
      unit: '次',
      change_rate: Math.round((Math.random() * 6 - 3) * 10) / 10,
      health_status: 'healthy',
      created_at: `${date}T08:00:00Z`,
      updated_at: `${date}T08:00:00Z`
    },
    {
      id: generateUUID(),
      cluster_id: CLUSTERS.WX_CLUSTER,
      report_date: date,
      metric_name: '响应时间',
      metric_name_en: 'Response Time',
      layer: 'application',
      today_max: 50 + Math.floor(Math.random() * 10),
      today_avg: 45 + Math.floor(Math.random() * 5),
      yesterday_max: 55 + Math.floor(Math.random() * 10),
      yesterday_avg: 48 + Math.floor(Math.random() * 5),
      historical_max: 80,
      historical_max_date: '2026-03-15',
      sla_threshold: 100,
      unit: 'ms',
      change_rate: Math.round((Math.random() * 6 - 3) * 10) / 10,
      health_status: 'healthy',
      created_at: `${date}T08:00:00Z`,
      updated_at: `${date}T08:00:00Z`
    },
    {
      id: generateUUID(),
      cluster_id: CLUSTERS.WX_CLUSTER,
      report_date: date,
      metric_name: 'CPU使用率',
      metric_name_en: 'CPU Usage',
      layer: 'application',
      today_max: 75 + Math.floor(Math.random() * 10),
      today_avg: 65 + Math.floor(Math.random() * 5),
      yesterday_max: 78 + Math.floor(Math.random() * 10),
      yesterday_avg: 68 + Math.floor(Math.random() * 5),
      historical_max: 90,
      historical_max_date: '2026-03-15',
      sla_threshold: 95,
      unit: '%',
      change_rate: Math.round((Math.random() * 6 - 3) * 10) / 10,
      health_status: 'healthy',
      created_at: `${date}T08:00:00Z`,
      updated_at: `${date}T08:00:00Z`
    },
    {
      id: generateUUID(),
      cluster_id: CLUSTERS.PAYMENT_PRIMARY,
      report_date: date,
      metric_name: '交易TPS',
      metric_name_en: 'Transaction TPS',
      layer: 'application',
      today_max: 15000 + Math.floor(Math.random() * 2000),
      today_avg: 12000 + Math.floor(Math.random() * 1000),
      yesterday_max: 14500 + Math.floor(Math.random() * 1000),
      yesterday_avg: 11500 + Math.floor(Math.random() * 500),
      historical_max: 18000,
      historical_max_date: '2026-03-27',
      sla_threshold: 20000,
      unit: 'tps',
      change_rate: Math.round((Math.random() * 6 - 3) * 10) / 10,
      health_status: 'healthy',
      created_at: `${date}T08:00:00Z`,
      updated_at: `${date}T08:00:00Z`
    },
    {
      id: generateUUID(),
      cluster_id: CLUSTERS.ORDER_PRIMARY,
      report_date: date,
      metric_name: '订单TPS',
      metric_name_en: 'Order TPS',
      layer: 'application',
      today_max: 20000 + Math.floor(Math.random() * 3000),
      today_avg: 16000 + Math.floor(Math.random() * 1500),
      yesterday_max: 19500 + Math.floor(Math.random() * 1500),
      yesterday_avg: 15500 + Math.floor(Math.random() * 1000),
      historical_max: 25000,
      historical_max_date: '2026-03-26',
      sla_threshold: 30000,
      unit: 'tps',
      change_rate: Math.round((Math.random() * 6 - 3) * 10) / 10,
      health_status: 'healthy',
      created_at: `${date}T08:00:00Z`,
      updated_at: `${date}T08:00:00Z`
    }
  ];

  try {
    await axios.post(`${API_BASE}/log-metrics/batch`, { metrics });
    console.log(`  ✓ 插入 ${metrics.length} 条日志指标`);
  } catch (error) {
    console.log(`  ✗ 指标插入失败: ${error.response?.data?.error || error.message}`);
  }
}

async function insertCloudRegions(date) {
  console.log(`\n插入云区域数据 (${date})...`);

  const regions = [
    {
      id: generateUUID(),
      cluster_id: CLUSTERS.WX_CLUSTER,
      report_date: date,
      name: '华东-上海',
      node_count: 120 + Math.floor(Math.random() * 20),
      current_traffic: 12 + Math.floor(Math.random() * 3),
      peak_traffic: 18 + Math.floor(Math.random() * 5),
      region_type: 'wx',
      created_at: `${date}T08:00:00Z`,
      updated_at: `${date}T08:00:00Z`
    },
    {
      id: generateUUID(),
      cluster_id: CLUSTERS.WX_CLUSTER,
      report_date: date,
      name: '华北-北京',
      node_count: 100 + Math.floor(Math.random() * 15),
      current_traffic: 9 + Math.floor(Math.random() * 2),
      peak_traffic: 14 + Math.floor(Math.random() * 3),
      region_type: 'wx',
      created_at: `${date}T08:00:00Z`,
      updated_at: `${date}T08:00:00Z`
    },
    {
      id: generateUUID(),
      cluster_id: CLUSTERS.NF_CLUSTER,
      report_date: date,
      name: '华南-广州',
      node_count: 80 + Math.floor(Math.random() * 10),
      current_traffic: 8 + Math.floor(Math.random() * 2),
      peak_traffic: 12 + Math.floor(Math.random() * 3),
      region_type: 'nf',
      created_at: `${date}T08:00:00Z`,
      updated_at: `${date}T08:00:00Z`
    }
  ];

  try {
    await axios.post(`${API_BASE}/cloud-regions/batch`, { regions });
    console.log(`  ✓ 插入 ${regions.length} 个云区域`);
  } catch (error) {
    console.log(`  ✗ 云区域插入失败: ${error.response?.data?.error || error.message}`);
  }
}

async function insertAssessments(date) {
  console.log(`\n插入评估数据 (${date})...`);

  const assessments = [
    {
      id: generateUUID(),
      report_id: `${BUSINESS_SYSTEMS.LOG_PLATFORM}-${date}`,
      category: '系统稳定性',
      content: '统一日志平台运行稳定，无异常告警。',
      status: 'normal',
      created_at: `${date}T08:00:00Z`
    },
    {
      id: generateUUID(),
      report_id: `${BUSINESS_SYSTEMS.LOG_PLATFORM}-${date}`,
      category: '性能评估',
      content: '日志收集和处理性能正常，EPS峰值略有下降。',
      status: 'normal',
      created_at: `${date}T08:00:00Z`
    },
    {
      id: generateUUID(),
      report_id: `${BUSINESS_SYSTEMS.PAYMENT_CENTER}-${date}`,
      category: '系统稳定性',
      content: '支付中心运行稳定，交易成功率保持在99.9%以上。',
      status: 'normal',
      created_at: `${date}T08:00:00Z`
    },
    {
      id: generateUUID(),
      report_id: `${BUSINESS_SYSTEMS.ORDER_SYSTEM}-${date}`,
      category: '系统稳定性',
      content: '订单系统整体稳定，主集群运行正常。',
      status: 'normal',
      created_at: `${date}T08:00:00Z`
    }
  ];

  try {
    await axios.post(`${API_BASE}/assessments/batch`, { assessments });
    console.log(`  ✓ 插入 ${assessments.length} 条评估`);
  } catch (error) {
    console.log(`  ✗ 评估插入失败: ${error.response?.data?.error || error.message}`);
  }
}

async function insertActionPlans(date) {
  console.log(`\n插入行动计划数据 (${date})...`);

  const plans = [
    {
      id: generateUUID(),
      report_id: `${BUSINESS_SYSTEMS.LOG_PLATFORM}-${date}`,
      priority: '高',
      items: ['持续监控EPS变化趋势', '关注存储空间增长'],
      insight: '日志量增长平稳，建议提前规划存储扩容。',
      created_at: `${date}T08:00:00Z`
    },
    {
      id: generateUUID(),
      report_id: `${BUSINESS_SYSTEMS.PAYMENT_CENTER}-${date}`,
      priority: '高',
      items: ['优化高峰期资源分配', '加强交易监控告警'],
      insight: '交易高峰期资源紧张，建议提前扩容或优化。',
      created_at: `${date}T08:00:00Z`
    },
    {
      id: generateUUID(),
      report_id: `${BUSINESS_SYSTEMS.ORDER_SYSTEM}-${date}`,
      priority: '高',
      items: ['持续监控系统运行状态', '关注资源使用趋势'],
      insight: '建议关注系统负载变化，做好容量规划。',
      created_at: `${date}T08:00:00Z`
    }
  ];

  try {
    await axios.post(`${API_BASE}/action-plans/batch`, { plans });
    console.log(`  ✓ 插入 ${plans.length} 条行动计划`);
  } catch (error) {
    console.log(`  ✗ 行动计划插入失败: ${error.response?.data?.error || error.message}`);
  }
}

async function main() {
  console.log('========================================');
  console.log('  Supabase 昨日数据插入工具 (通过 API)');
  console.log('========================================');
  
  const yesterday = getYesterday();
  console.log(`\n目标日期: ${yesterday}`);
  
  const enabled = await enableSupabase();
  if (!enabled) {
    console.error('\n❌ 无法启用 Supabase，请检查后端服务是否正常运行');
    process.exit(1);
  }
  
  const hasData = await checkYesterdayData(yesterday);
  if (hasData) {
    console.log(`\n⚠️  数据库中已存在 ${yesterday} 的数据`);
    console.log('如需重新插入，请先删除现有数据。');
    return;
  }
  
  console.log('\n开始插入昨日数据...');
  
  try {
    await insertDailyReports(yesterday);
    await insertLogMetrics(yesterday);
    await insertCloudRegions(yesterday);
    await insertAssessments(yesterday);
    await insertActionPlans(yesterday);
    
    console.log('\n========================================');
    console.log('  ✅ 昨日数据插入完成！');
    console.log('========================================');
  } catch (error) {
    console.error('\n❌ 插入失败:', error.message);
    process.exit(1);
  }
}

main().catch(console.error);
