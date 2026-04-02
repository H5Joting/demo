import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;

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

const DATES = ['2026-03-24', '2026-03-25', '2026-03-26', '2026-03-27', '2026-03-28', '2026-03-29', '2026-03-30'];

async function insertClusters() {
  console.log('Inserting clusters...');
  
  const clusters = [
    { id: CLUSTERS.PAYMENT_PRIMARY, name: '支付主集群', name_en: 'PAYMENT PRIMARY', type: 'wx', business_system_id: BUSINESS_SYSTEMS.PAYMENT_CENTER },
    { id: CLUSTERS.PAYMENT_BACKUP, name: '支付备集群', name_en: 'PAYMENT BACKUP', type: 'nf', business_system_id: BUSINESS_SYSTEMS.PAYMENT_CENTER },
    { id: CLUSTERS.ORDER_PRIMARY, name: '订单主集群', name_en: 'ORDER PRIMARY', type: 'wx', business_system_id: BUSINESS_SYSTEMS.ORDER_SYSTEM },
    { id: CLUSTERS.ORDER_BACKUP, name: '订单备集群', name_en: 'ORDER BACKUP', type: 'nf', business_system_id: BUSINESS_SYSTEMS.ORDER_SYSTEM },
  ];

  for (const cluster of clusters) {
    const { error } = await supabase.from('clusters').upsert(cluster, { onConflict: 'id' });
    if (error) console.log(`Cluster ${cluster.name}: ${error.message}`);
    else console.log(`  ✓ Cluster ${cluster.name}`);
  }
}

async function insertDailyReports() {
  console.log('Inserting daily reports...');

  const paymentReports = [
    { report_date: '2026-03-30', system_status: 'normal', wx_cluster_eps_rate: 88, wx_cluster_eps_peak_date: '2026-03-28', wx_cluster_insight: '支付主集群运行平稳，交易处理正常，响应时间稳定。', nf_cluster_eps_rate: 65, nf_cluster_eps_peak_date: '2026-03-28', nf_cluster_insight: '支付备集群运行正常，作为灾备节点随时可用。', business_system_id: BUSINESS_SYSTEMS.PAYMENT_CENTER },
    { report_date: '2026-03-29', system_status: 'normal', wx_cluster_eps_rate: 85, wx_cluster_eps_peak_date: '2026-03-28', wx_cluster_insight: '支付主集群运行平稳，交易处理正常。', nf_cluster_eps_rate: 62, nf_cluster_eps_peak_date: '2026-03-28', nf_cluster_insight: '支付备集群运行正常。', business_system_id: BUSINESS_SYSTEMS.PAYMENT_CENTER },
    { report_date: '2026-03-28', system_status: 'normal', wx_cluster_eps_rate: 82, wx_cluster_eps_peak_date: '2026-03-28', wx_cluster_insight: '支付主集群运行平稳。', nf_cluster_eps_rate: 60, nf_cluster_eps_peak_date: '2026-03-28', nf_cluster_insight: '支付备集群运行正常。', business_system_id: BUSINESS_SYSTEMS.PAYMENT_CENTER },
    { report_date: '2026-03-27', system_status: 'warning', wx_cluster_eps_rate: 95, wx_cluster_eps_peak_date: '2026-03-27', wx_cluster_insight: '支付主集群今日交易量激增，CPU使用率接近阈值，建议关注。', nf_cluster_eps_rate: 72, nf_cluster_eps_peak_date: '2026-03-27', nf_cluster_insight: '支付备集群已启用部分流量分担。', business_system_id: BUSINESS_SYSTEMS.PAYMENT_CENTER },
    { report_date: '2026-03-26', system_status: 'normal', wx_cluster_eps_rate: 78, wx_cluster_eps_peak_date: '2026-03-25', wx_cluster_insight: '支付主集群运行平稳。', nf_cluster_eps_rate: 58, nf_cluster_eps_peak_date: '2026-03-25', nf_cluster_insight: '支付备集群运行正常。', business_system_id: BUSINESS_SYSTEMS.PAYMENT_CENTER },
    { report_date: '2026-03-25', system_status: 'normal', wx_cluster_eps_rate: 75, wx_cluster_eps_peak_date: '2026-03-25', wx_cluster_insight: '支付主集群运行平稳。', nf_cluster_eps_rate: 55, nf_cluster_eps_peak_date: '2026-03-25', nf_cluster_insight: '支付备集群运行正常。', business_system_id: BUSINESS_SYSTEMS.PAYMENT_CENTER },
    { report_date: '2026-03-24', system_status: 'normal', wx_cluster_eps_rate: 72, wx_cluster_eps_peak_date: '2026-03-24', wx_cluster_insight: '支付主集群运行平稳。', nf_cluster_eps_rate: 52, nf_cluster_eps_peak_date: '2026-03-24', nf_cluster_insight: '支付备集群运行正常。', business_system_id: BUSINESS_SYSTEMS.PAYMENT_CENTER },
  ];

  const orderReports = [
    { report_date: '2026-03-30', system_status: 'normal', wx_cluster_eps_rate: 92, wx_cluster_eps_peak_date: '2026-03-29', wx_cluster_insight: '订单主集群运行正常，订单处理效率稳定，无明显延迟。', nf_cluster_eps_rate: 68, nf_cluster_eps_peak_date: '2026-03-29', nf_cluster_insight: '订单备集群运行正常。', business_system_id: BUSINESS_SYSTEMS.ORDER_SYSTEM },
    { report_date: '2026-03-29', system_status: 'normal', wx_cluster_eps_rate: 90, wx_cluster_eps_peak_date: '2026-03-29', wx_cluster_insight: '订单主集群运行正常。', nf_cluster_eps_rate: 65, nf_cluster_eps_peak_date: '2026-03-29', nf_cluster_insight: '订单备集群运行正常。', business_system_id: BUSINESS_SYSTEMS.ORDER_SYSTEM },
    { report_date: '2026-03-28', system_status: 'normal', wx_cluster_eps_rate: 88, wx_cluster_eps_peak_date: '2026-03-28', wx_cluster_insight: '订单主集群运行正常。', nf_cluster_eps_rate: 62, nf_cluster_eps_peak_date: '2026-03-28', nf_cluster_insight: '订单备集群运行正常。', business_system_id: BUSINESS_SYSTEMS.ORDER_SYSTEM },
    { report_date: '2026-03-27', system_status: 'normal', wx_cluster_eps_rate: 85, wx_cluster_eps_peak_date: '2026-03-27', wx_cluster_insight: '订单主集群运行正常。', nf_cluster_eps_rate: 60, nf_cluster_eps_peak_date: '2026-03-27', nf_cluster_insight: '订单备集群运行正常。', business_system_id: BUSINESS_SYSTEMS.ORDER_SYSTEM },
    { report_date: '2026-03-26', system_status: 'warning', wx_cluster_eps_rate: 98, wx_cluster_eps_peak_date: '2026-03-26', wx_cluster_insight: '订单主集群今日订单量达到峰值，数据库连接池使用率较高。', nf_cluster_eps_rate: 75, nf_cluster_eps_peak_date: '2026-03-26', nf_cluster_insight: '订单备集群已启用分担流量。', business_system_id: BUSINESS_SYSTEMS.ORDER_SYSTEM },
    { report_date: '2026-03-25', system_status: 'normal', wx_cluster_eps_rate: 82, wx_cluster_eps_peak_date: '2026-03-25', wx_cluster_insight: '订单主集群运行正常。', nf_cluster_eps_rate: 58, nf_cluster_eps_peak_date: '2026-03-25', nf_cluster_insight: '订单备集群运行正常。', business_system_id: BUSINESS_SYSTEMS.ORDER_SYSTEM },
    { report_date: '2026-03-24', system_status: 'normal', wx_cluster_eps_rate: 80, wx_cluster_eps_peak_date: '2026-03-24', wx_cluster_insight: '订单主集群运行正常。', nf_cluster_eps_rate: 55, nf_cluster_eps_peak_date: '2026-03-24', nf_cluster_insight: '订单备集群运行正常。', business_system_id: BUSINESS_SYSTEMS.ORDER_SYSTEM },
  ];

  const logReports = [
    { report_date: '2026-03-30', system_status: 'normal', wx_cluster_eps_rate: 75, wx_cluster_eps_peak_date: '2026-03-28', wx_cluster_insight: '威新集群运行正常，日志采集稳定，处理效率良好。', nf_cluster_eps_rate: 55, nf_cluster_eps_peak_date: '2026-03-28', nf_cluster_insight: '南方集群运行正常，备份功能正常。', business_system_id: BUSINESS_SYSTEMS.LOG_PLATFORM },
    { report_date: '2026-03-29', system_status: 'normal', wx_cluster_eps_rate: 72, wx_cluster_eps_peak_date: '2026-03-28', wx_cluster_insight: '威新集群运行正常。', nf_cluster_eps_rate: 52, nf_cluster_eps_peak_date: '2026-03-28', nf_cluster_insight: '南方集群运行正常。', business_system_id: BUSINESS_SYSTEMS.LOG_PLATFORM },
  ];

  const allReports = [...paymentReports, ...orderReports, ...logReports];
  
  for (const report of allReports) {
    const { error } = await supabase.from('daily_reports').upsert(report, { onConflict: 'report_date' });
    if (error) console.log(`  Report ${report.report_date}: ${error.message}`);
  }
  console.log(`  ✓ Inserted ${allReports.length} daily reports`);
}

async function insertLogMetrics() {
  console.log('Inserting log metrics...');

  const paymentMetrics = [
    { cluster_id: CLUSTERS.PAYMENT_PRIMARY, report_date: '2026-03-30', metric_name: '交易TPS', metric_name_en: 'Transaction TPS', layer: 'application', today_max: 15000, today_avg: 12000, yesterday_max: 14500, yesterday_avg: 11500, historical_max: 18000, historical_max_date: '2026-03-27', sla_threshold: 20000, unit: 'tps', change_rate: 3.45, health_status: 'healthy' },
    { cluster_id: CLUSTERS.PAYMENT_PRIMARY, report_date: '2026-03-30', metric_name: '响应时间', metric_name_en: 'Response Time', layer: 'application', today_max: 25, today_avg: 18, yesterday_max: 28, yesterday_avg: 20, historical_max: 35, historical_max_date: '2026-03-27', sla_threshold: 50, unit: 'ms', change_rate: -10.71, health_status: 'healthy' },
    { cluster_id: CLUSTERS.PAYMENT_PRIMARY, report_date: '2026-03-30', metric_name: '成功率', metric_name_en: 'Success Rate', layer: 'application', today_max: 99.9, today_avg: 99.8, yesterday_max: 99.9, yesterday_avg: 99.7, historical_max: 99.9, historical_max_date: '2026-03-27', sla_threshold: 99.5, unit: '%', change_rate: 0.1, health_status: 'healthy' },
    { cluster_id: CLUSTERS.PAYMENT_PRIMARY, report_date: '2026-03-30', metric_name: 'CPU使用率', metric_name_en: 'CPU Usage', layer: 'application', today_max: 55, today_avg: 45, yesterday_max: 58, yesterday_avg: 48, historical_max: 75, historical_max_date: '2026-03-27', sla_threshold: 80, unit: '%', change_rate: -5.17, health_status: 'healthy' },
    { cluster_id: CLUSTERS.PAYMENT_PRIMARY, report_date: '2026-03-30', metric_name: '内存使用率', metric_name_en: 'Memory Usage', layer: 'application', today_max: 68, today_avg: 62, yesterday_max: 70, yesterday_avg: 65, historical_max: 80, historical_max_date: '2026-03-27', sla_threshold: 85, unit: '%', change_rate: -2.86, health_status: 'healthy' },
    { cluster_id: CLUSTERS.PAYMENT_PRIMARY, report_date: '2026-03-30', metric_name: '数据库连接数', metric_name_en: 'DB Connections', layer: 'storage', today_max: 450, today_avg: 380, yesterday_max: 480, yesterday_avg: 400, historical_max: 600, historical_max_date: '2026-03-27', sla_threshold: 800, unit: '个', change_rate: -6.25, health_status: 'healthy' },
    { cluster_id: CLUSTERS.PAYMENT_PRIMARY, report_date: '2026-03-30', metric_name: '消息队列积压', metric_name_en: 'MQ Backlog', layer: 'buffer', today_max: 1200, today_avg: 800, yesterday_max: 1500, yesterday_avg: 1000, historical_max: 3000, historical_max_date: '2026-03-27', sla_threshold: 5000, unit: '条', change_rate: -20.0, health_status: 'healthy' },
  ];

  const orderMetrics = [
    { cluster_id: CLUSTERS.ORDER_PRIMARY, report_date: '2026-03-30', metric_name: '订单TPS', metric_name_en: 'Order TPS', layer: 'application', today_max: 20000, today_avg: 16000, yesterday_max: 19500, yesterday_avg: 15500, historical_max: 25000, historical_max_date: '2026-03-26', sla_threshold: 30000, unit: 'tps', change_rate: 2.56, health_status: 'healthy' },
    { cluster_id: CLUSTERS.ORDER_PRIMARY, report_date: '2026-03-30', metric_name: '响应时间', metric_name_en: 'Response Time', layer: 'application', today_max: 35, today_avg: 28, yesterday_max: 38, yesterday_avg: 30, historical_max: 45, historical_max_date: '2026-03-26', sla_threshold: 60, unit: 'ms', change_rate: -7.89, health_status: 'healthy' },
    { cluster_id: CLUSTERS.ORDER_PRIMARY, report_date: '2026-03-30', metric_name: '成功率', metric_name_en: 'Success Rate', layer: 'application', today_max: 99.8, today_avg: 99.7, yesterday_max: 99.8, yesterday_avg: 99.6, historical_max: 99.9, historical_max_date: '2026-03-26', sla_threshold: 99.5, unit: '%', change_rate: 0.1, health_status: 'healthy' },
    { cluster_id: CLUSTERS.ORDER_PRIMARY, report_date: '2026-03-30', metric_name: 'CPU使用率', metric_name_en: 'CPU Usage', layer: 'application', today_max: 52, today_avg: 42, yesterday_max: 55, yesterday_avg: 45, historical_max: 70, historical_max_date: '2026-03-26', sla_threshold: 80, unit: '%', change_rate: -5.45, health_status: 'healthy' },
    { cluster_id: CLUSTERS.ORDER_PRIMARY, report_date: '2026-03-30', metric_name: '内存使用率', metric_name_en: 'Memory Usage', layer: 'application', today_max: 65, today_avg: 58, yesterday_max: 68, yesterday_avg: 62, historical_max: 75, historical_max_date: '2026-03-26', sla_threshold: 85, unit: '%', change_rate: -4.41, health_status: 'healthy' },
    { cluster_id: CLUSTERS.ORDER_PRIMARY, report_date: '2026-03-30', metric_name: '数据库连接数', metric_name_en: 'DB Connections', layer: 'storage', today_max: 550, today_avg: 480, yesterday_max: 580, yesterday_avg: 510, historical_max: 700, historical_max_date: '2026-03-26', sla_threshold: 1000, unit: '个', change_rate: -5.17, health_status: 'healthy' },
    { cluster_id: CLUSTERS.ORDER_PRIMARY, report_date: '2026-03-30', metric_name: '缓存命中率', metric_name_en: 'Cache Hit Rate', layer: 'buffer', today_max: 95, today_avg: 92, yesterday_max: 94, yesterday_avg: 90, historical_max: 98, historical_max_date: '2026-03-26', sla_threshold: 85, unit: '%', change_rate: 1.06, health_status: 'healthy' },
  ];

  const allMetrics = [...paymentMetrics, ...orderMetrics];
  
  const { error } = await supabase.from('log_metrics').insert(allMetrics);
  if (error) console.log(`  Metrics error: ${error.message}`);
  else console.log(`  ✓ Inserted ${allMetrics.length} log metrics`);
}

async function insertCloudRegions() {
  console.log('Inserting cloud regions...');

  const regions = [
    { cluster_id: CLUSTERS.PAYMENT_PRIMARY, report_date: '2026-03-30', name: '华东支付区', node_count: 150, current_traffic: 28, peak_traffic: 38, region_type: 'domestic' },
    { cluster_id: CLUSTERS.PAYMENT_PRIMARY, report_date: '2026-03-30', name: '华南支付区', node_count: 100, current_traffic: 20, peak_traffic: 28, region_type: 'domestic' },
    { cluster_id: CLUSTERS.PAYMENT_PRIMARY, report_date: '2026-03-30', name: '华北支付区', node_count: 80, current_traffic: 16, peak_traffic: 24, region_type: 'domestic' },
    { cluster_id: CLUSTERS.PAYMENT_BACKUP, report_date: '2026-03-30', name: '西南支付区', node_count: 60, current_traffic: 12, peak_traffic: 18, region_type: 'domestic' },
    { cluster_id: CLUSTERS.PAYMENT_BACKUP, report_date: '2026-03-30', name: '海外支付区', node_count: 35, current_traffic: 8, peak_traffic: 12, region_type: 'overseas' },
    { cluster_id: CLUSTERS.ORDER_PRIMARY, report_date: '2026-03-30', name: '华东订单区', node_count: 180, current_traffic: 32, peak_traffic: 45, region_type: 'domestic' },
    { cluster_id: CLUSTERS.ORDER_PRIMARY, report_date: '2026-03-30', name: '华南订单区', node_count: 120, current_traffic: 24, peak_traffic: 34, region_type: 'domestic' },
    { cluster_id: CLUSTERS.ORDER_PRIMARY, report_date: '2026-03-30', name: '华北订单区', node_count: 90, current_traffic: 18, peak_traffic: 28, region_type: 'domestic' },
    { cluster_id: CLUSTERS.ORDER_BACKUP, report_date: '2026-03-30', name: '西南订单区', node_count: 70, current_traffic: 14, peak_traffic: 22, region_type: 'domestic' },
    { cluster_id: CLUSTERS.ORDER_BACKUP, report_date: '2026-03-30', name: '海外订单区', node_count: 40, current_traffic: 10, peak_traffic: 16, region_type: 'overseas' },
  ];

  const { error } = await supabase.from('cloud_regions').insert(regions);
  if (error) console.log(`  Regions error: ${error.message}`);
  else console.log(`  ✓ Inserted ${regions.length} cloud regions`);
}

async function main() {
  console.log('Starting mock data insertion...\n');
  
  await insertClusters();
  await insertDailyReports();
  await insertLogMetrics();
  await insertCloudRegions();
  
  console.log('\n✅ Mock data insertion completed!');
}

main().catch(console.error);
