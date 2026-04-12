import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

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

function getYesterday(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split('T')[0];
}

async function checkYesterdayData(date: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('daily_reports')
    .select('id')
    .eq('report_date', date)
    .limit(1);
  
  if (error) {
    console.error('检查数据失败:', error.message);
    return false;
  }
  
  return data && data.length > 0;
}

async function insertDailyReports(date: string) {
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
    const { error } = await supabase
      .from('daily_reports')
      .upsert(report, { onConflict: 'id' });
    
    if (error) {
      console.log(`  ✗ 日报 ${report.business_system_id}: ${error.message}`);
    } else {
      console.log(`  ✓ 日报 ${report.business_system_id}`);
    }
  }
}

async function insertLogMetrics(date: string) {
  console.log(`\n插入日志指标数据 (${date})...`);

  const metrics = [
    {
      id: uuidv4(),
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
      id: uuidv4(),
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
      id: uuidv4(),
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
      id: uuidv4(),
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
      id: uuidv4(),
      cluster_id: CLUSTERS.PAYMENT_PRIMARY,
      report_date: date,
      metric_name: '响应时间',
      metric_name_en: 'Response Time',
      layer: 'application',
      today_max: 25 + Math.floor(Math.random() * 5),
      today_avg: 18 + Math.floor(Math.random() * 3),
      yesterday_max: 28 + Math.floor(Math.random() * 5),
      yesterday_avg: 20 + Math.floor(Math.random() * 3),
      historical_max: 35,
      historical_max_date: '2026-03-27',
      sla_threshold: 50,
      unit: 'ms',
      change_rate: Math.round((Math.random() * 6 - 3) * 10) / 10,
      health_status: 'healthy',
      created_at: `${date}T08:00:00Z`,
      updated_at: `${date}T08:00:00Z`
    },
    {
      id: uuidv4(),
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
    },
    {
      id: uuidv4(),
      cluster_id: CLUSTERS.ORDER_PRIMARY,
      report_date: date,
      metric_name: '响应时间',
      metric_name_en: 'Response Time',
      layer: 'application',
      today_max: 35 + Math.floor(Math.random() * 5),
      today_avg: 28 + Math.floor(Math.random() * 3),
      yesterday_max: 38 + Math.floor(Math.random() * 5),
      yesterday_avg: 30 + Math.floor(Math.random() * 3),
      historical_max: 45,
      historical_max_date: '2026-03-26',
      sla_threshold: 60,
      unit: 'ms',
      change_rate: Math.round((Math.random() * 6 - 3) * 10) / 10,
      health_status: 'healthy',
      created_at: `${date}T08:00:00Z`,
      updated_at: `${date}T08:00:00Z`
    }
  ];

  const { error } = await supabase.from('log_metrics').insert(metrics);
  if (error) {
    console.log(`  ✗ 指标插入失败: ${error.message}`);
  } else {
    console.log(`  ✓ 插入 ${metrics.length} 条日志指标`);
  }
}

async function insertCloudRegions(date: string) {
  console.log(`\n插入云区域数据 (${date})...`);

  const regions = [
    {
      id: uuidv4(),
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
      id: uuidv4(),
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
      id: uuidv4(),
      cluster_id: CLUSTERS.NF_CLUSTER,
      report_date: date,
      name: '华南-广州',
      node_count: 80 + Math.floor(Math.random() * 10),
      current_traffic: 8 + Math.floor(Math.random() * 2),
      peak_traffic: 12 + Math.floor(Math.random() * 3),
      region_type: 'nf',
      created_at: `${date}T08:00:00Z`,
      updated_at: `${date}T08:00:00Z`
    },
    {
      id: uuidv4(),
      cluster_id: CLUSTERS.PAYMENT_PRIMARY,
      report_date: date,
      name: '华东支付区',
      node_count: 150 + Math.floor(Math.random() * 20),
      current_traffic: 28 + Math.floor(Math.random() * 5),
      peak_traffic: 38 + Math.floor(Math.random() * 8),
      region_type: 'wx',
      created_at: `${date}T08:00:00Z`,
      updated_at: `${date}T08:00:00Z`
    },
    {
      id: uuidv4(),
      cluster_id: CLUSTERS.PAYMENT_BACKUP,
      report_date: date,
      name: '华南支付区',
      node_count: 100 + Math.floor(Math.random() * 15),
      current_traffic: 20 + Math.floor(Math.random() * 3),
      peak_traffic: 28 + Math.floor(Math.random() * 5),
      region_type: 'nf',
      created_at: `${date}T08:00:00Z`,
      updated_at: `${date}T08:00:00Z`
    },
    {
      id: uuidv4(),
      cluster_id: CLUSTERS.ORDER_PRIMARY,
      report_date: date,
      name: '华东订单区',
      node_count: 180 + Math.floor(Math.random() * 25),
      current_traffic: 32 + Math.floor(Math.random() * 6),
      peak_traffic: 45 + Math.floor(Math.random() * 10),
      region_type: 'wx',
      created_at: `${date}T08:00:00Z`,
      updated_at: `${date}T08:00:00Z`
    },
    {
      id: uuidv4(),
      cluster_id: CLUSTERS.ORDER_BACKUP,
      report_date: date,
      name: '华南订单区',
      node_count: 120 + Math.floor(Math.random() * 18),
      current_traffic: 24 + Math.floor(Math.random() * 4),
      peak_traffic: 34 + Math.floor(Math.random() * 6),
      region_type: 'nf',
      created_at: `${date}T08:00:00Z`,
      updated_at: `${date}T08:00:00Z`
    }
  ];

  const { error } = await supabase.from('cloud_regions').insert(regions);
  if (error) {
    console.log(`  ✗ 云区域插入失败: ${error.message}`);
  } else {
    console.log(`  ✓ 插入 ${regions.length} 个云区域`);
  }
}

async function insertAssessments(date: string) {
  console.log(`\n插入评估数据 (${date})...`);

  const assessments = [
    {
      id: uuidv4(),
      report_id: `${BUSINESS_SYSTEMS.LOG_PLATFORM}-${date}`,
      category: '系统稳定性',
      content: '统一日志平台运行稳定，无异常告警。',
      status: 'normal',
      created_at: `${date}T08:00:00Z`
    },
    {
      id: uuidv4(),
      report_id: `${BUSINESS_SYSTEMS.LOG_PLATFORM}-${date}`,
      category: '性能评估',
      content: '日志收集和处理性能正常，EPS峰值略有下降。',
      status: 'normal',
      created_at: `${date}T08:00:00Z`
    },
    {
      id: uuidv4(),
      report_id: `${BUSINESS_SYSTEMS.LOG_PLATFORM}-${date}`,
      category: '资源使用',
      content: 'CPU和内存使用率在合理范围内，存储空间充足。',
      status: 'normal',
      created_at: `${date}T08:00:00Z`
    },
    {
      id: uuidv4(),
      report_id: `${BUSINESS_SYSTEMS.PAYMENT_CENTER}-${date}`,
      category: '系统稳定性',
      content: '支付中心运行稳定，交易成功率保持在99.9%以上。',
      status: 'normal',
      created_at: `${date}T08:00:00Z`
    },
    {
      id: uuidv4(),
      report_id: `${BUSINESS_SYSTEMS.PAYMENT_CENTER}-${date}`,
      category: '性能评估',
      content: '交易响应时间略有波动，建议关注高峰期表现。',
      status: 'normal',
      created_at: `${date}T08:00:00Z`
    },
    {
      id: uuidv4(),
      report_id: `${BUSINESS_SYSTEMS.ORDER_SYSTEM}-${date}`,
      category: '系统稳定性',
      content: '订单系统整体稳定，主集群运行正常。',
      status: 'normal',
      created_at: `${date}T08:00:00Z`
    },
    {
      id: uuidv4(),
      report_id: `${BUSINESS_SYSTEMS.ORDER_SYSTEM}-${date}`,
      category: '性能评估',
      content: '订单处理响应时间正常，性能表现良好。',
      status: 'normal',
      created_at: `${date}T08:00:00Z`
    }
  ];

  const { error } = await supabase.from('assessments').insert(assessments);
  if (error) {
    console.log(`  ✗ 评估插入失败: ${error.message}`);
  } else {
    console.log(`  ✓ 插入 ${assessments.length} 条评估`);
  }
}

async function insertActionPlans(date: string) {
  console.log(`\n插入行动计划数据 (${date})...`);

  const plans = [
    {
      id: uuidv4(),
      report_id: `${BUSINESS_SYSTEMS.LOG_PLATFORM}-${date}`,
      priority: '高',
      items: ['持续监控EPS变化趋势', '关注存储空间增长'],
      insight: '日志量增长平稳，建议提前规划存储扩容。',
      created_at: `${date}T08:00:00Z`
    },
    {
      id: uuidv4(),
      report_id: `${BUSINESS_SYSTEMS.LOG_PLATFORM}-${date}`,
      priority: '中',
      items: ['优化日志查询性能', '完善日志分类策略'],
      insight: '查询性能良好，可进一步优化索引策略。',
      created_at: `${date}T08:00:00Z`
    },
    {
      id: uuidv4(),
      report_id: `${BUSINESS_SYSTEMS.PAYMENT_CENTER}-${date}`,
      priority: '高',
      items: ['优化高峰期资源分配', '加强交易监控告警'],
      insight: '交易高峰期资源紧张，建议提前扩容或优化。',
      created_at: `${date}T08:00:00Z`
    },
    {
      id: uuidv4(),
      report_id: `${BUSINESS_SYSTEMS.PAYMENT_CENTER}-${date}`,
      priority: '中',
      items: ['优化数据库查询性能', '完善容灾切换流程'],
      insight: '数据库查询存在优化空间，建议进行索引优化。',
      created_at: `${date}T08:00:00Z`
    },
    {
      id: uuidv4(),
      report_id: `${BUSINESS_SYSTEMS.ORDER_SYSTEM}-${date}`,
      priority: '高',
      items: ['持续监控系统运行状态', '关注资源使用趋势'],
      insight: '建议关注系统负载变化，做好容量规划。',
      created_at: `${date}T08:00:00Z`
    },
    {
      id: uuidv4(),
      report_id: `${BUSINESS_SYSTEMS.ORDER_SYSTEM}-${date}`,
      priority: '中',
      items: ['定期检查存储空间使用情况', '优化查询性能'],
      insight: '存储空间充足，建议定期进行性能优化。',
      created_at: `${date}T08:00:00Z`
    }
  ];

  const { error } = await supabase.from('action_plans').insert(plans);
  if (error) {
    console.log(`  ✗ 行动计划插入失败: ${error.message}`);
  } else {
    console.log(`  ✓ 插入 ${plans.length} 条行动计划`);
  }
}

async function main() {
  console.log('========================================');
  console.log('  Supabase 昨日数据插入工具');
  console.log('========================================');
  
  const yesterday = getYesterday();
  console.log(`\n目标日期: ${yesterday}`);
  
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
  } catch (error: any) {
    console.error('\n❌ 插入失败:', error.message);
    process.exit(1);
  }
}

main().catch(console.error);
