-- 统一日志分析系统 - 必要数据插入脚本
-- 请在 Supabase SQL Editor 中执行

-- 1. 插入集群数据
INSERT INTO clusters (id, name, name_en, type) VALUES
('11111111-1111-1111-1111-111111111111', '威新集群', 'WX CLUSTER', 'wx'),
('22222222-2222-2222-2222-222222222222', '南方集群', 'NF CLUSTER', 'nf')
ON CONFLICT (id) DO NOTHING;

-- 2. 插入日报数据
INSERT INTO daily_reports (report_date, system_status, wx_cluster_eps_rate, wx_cluster_eps_peak_date, wx_cluster_insight, nf_cluster_eps_rate, nf_cluster_eps_peak_date, nf_cluster_insight) VALUES
('2026-03-28', 'normal', 85, '2025-03-22', '威新集群今日流量较上一交易日下跌5.51%，流量有所回落。集群指标平稳，弹性良好，无明显瓶颈。', 62, '2025-03-22', '南方集群指标平稳，弹性良好，无明显瓶颈。'),
('2026-03-27', 'normal', 82, '2025-03-22', '威新集群今日流量平稳，集群指标正常。', 60, '2025-03-22', '南方集群指标平稳，弹性良好。'),
('2026-03-26', 'normal', 78, '2025-03-22', '威新集群今日流量有所上升，需关注。', 58, '2025-03-22', '南方集群指标正常。'),
('2026-03-25', 'warning', 92, '2025-03-22', '威新集群今日流量达到近期峰值，CPU使用率接近告警阈值，建议关注。', 70, '2025-03-22', '南方集群流量较高，需关注磁盘使用率。'),
('2026-03-24', 'normal', 75, '2025-03-22', '威新集群指标正常。', 55, '2025-03-22', '南方集群指标正常。'),
('2026-03-23', 'normal', 72, '2025-03-22', '威新集群指标正常。', 52, '2025-03-22', '南方集群指标正常。'),
('2026-03-22', 'normal', 68, '2025-03-22', '威新集群指标正常。', 50, '2025-03-22', '南方集群指标正常。')
ON CONFLICT (report_date) DO NOTHING;

-- 3. 插入SLA核心指标数据 (2026-03-28 威新集群)
INSERT INTO log_metrics (cluster_id, report_date, metric_name, metric_name_en, layer, today_max, today_avg, yesterday_max, yesterday_avg, historical_max, historical_max_date, sla_threshold, unit, change_rate, health_status) VALUES
('11111111-1111-1111-1111-111111111111', '2026-03-28', '平均搜索耗时', 'Avg Search Latency', 'application', 15, 12, 16, 13, 20, '2025-03-22', 30, 'ms', -6.67, 'healthy'),
('11111111-1111-1111-1111-111111111111', '2026-03-28', 'CPU使用率', 'CPU Usage', 'application', 45, 38, 48, 40, 60, '2025-03-22', 70, '%', -6.25, 'healthy'),
('11111111-1111-1111-1111-111111111111', '2026-03-28', '日志入库耗时', 'Log Ingest Latency', 'storage', 8, 6, 9, 7, 12, '2025-03-22', 15, 'ms', -11.11, 'healthy'),
('11111111-1111-1111-1111-111111111111', '2026-03-28', '监控延迟', 'Monitor Latency', 'application', 5, 4, 6, 5, 8, '2025-03-22', 10, 'ms', -16.67, 'healthy'),
('11111111-1111-1111-1111-111111111111', '2026-03-28', 'Collector EPS', 'Collector EPS', 'access', 68, 55, 72, 58, 80, '2025-03-22', 100, 'w', -5.51, 'healthy'),
('11111111-1111-1111-1111-111111111111', '2026-03-28', 'Kafka写入流量', 'Kafka Write Traffic', 'buffer', 120, 95, 125, 100, 150, '2025-03-22', 200, 'MB/s', -4.0, 'healthy'),
('11111111-1111-1111-1111-111111111111', '2026-03-28', '磁盘使用率', 'Disk Usage', 'storage', 72, 68, 70, 65, 85, '2025-03-22', 80, '%', 2.86, 'healthy')
ON CONFLICT (cluster_id, report_date, metric_name) DO NOTHING;

-- 4. 插入SLA核心指标数据 (2026-03-28 南方集群)
INSERT INTO log_metrics (cluster_id, report_date, metric_name, metric_name_en, layer, today_max, today_avg, yesterday_max, yesterday_avg, historical_max, historical_max_date, sla_threshold, unit, change_rate, health_status) VALUES
('22222222-2222-2222-2222-222222222222', '2026-03-28', '平均搜索耗时', 'Avg Search Latency', 'application', 12, 10, 13, 11, 18, '2025-03-22', 30, 'ms', -7.69, 'healthy'),
('22222222-2222-2222-2222-222222222222', '2026-03-28', 'CPU使用率', 'CPU Usage', 'application', 38, 32, 40, 34, 50, '2025-03-22', 70, '%', -5.0, 'healthy'),
('22222222-2222-2222-2222-222222222222', '2026-03-28', '日志入库耗时', 'Log Ingest Latency', 'storage', 6, 5, 7, 6, 10, '2025-03-22', 15, 'ms', -14.29, 'healthy'),
('22222222-2222-2222-2222-222222222222', '2026-03-28', '监控延迟', 'Monitor Latency', 'application', 4, 3, 5, 4, 7, '2025-03-22', 10, 'ms', -20.0, 'healthy'),
('22222222-2222-2222-2222-222222222222', '2026-03-28', 'Collector EPS', 'Collector EPS', 'access', 42, 35, 45, 38, 50, '2025-03-22', 60, 'w', -6.67, 'healthy'),
('22222222-2222-2222-2222-222222222222', '2026-03-28', 'Kafka写入流量', 'Kafka Write Traffic', 'buffer', 85, 70, 90, 75, 100, '2025-03-22', 120, 'MB/s', -5.56, 'healthy'),
('22222222-2222-2222-2222-222222222222', '2026-03-28', '磁盘使用率', 'Disk Usage', 'storage', 65, 60, 62, 58, 75, '2025-03-22', 80, '%', 4.84, 'healthy')
ON CONFLICT (cluster_id, report_date, metric_name) DO NOTHING;

-- 5. 插入云区域数据
INSERT INTO cloud_regions (cluster_id, report_date, name, node_count, current_traffic, peak_traffic, region_type) VALUES
('11111111-1111-1111-1111-111111111111', '2026-03-28', '华东区域', 120, 25, 35, 'domestic'),
('11111111-1111-1111-1111-111111111111', '2026-03-28', '华南区域', 85, 18, 25, 'domestic'),
('11111111-1111-1111-1111-111111111111', '2026-03-28', '华北区域', 70, 15, 22, 'domestic'),
('22222222-2222-2222-2222-222222222222', '2026-03-28', '西南区域', 55, 12, 18, 'domestic'),
('22222222-2222-2222-2222-222222222222', '2026-03-28', '海外区域', 30, 8, 12, 'overseas')
ON CONFLICT (cluster_id, report_date, name) DO NOTHING;

-- 6. 插入评估数据
INSERT INTO assessments (report_id, category, content, status)
SELECT id, '集群健康', '威新集群运行正常，所有指标在正常范围内。', 'normal' FROM daily_reports WHERE report_date = '2026-03-28';

INSERT INTO assessments (report_id, category, content, status)
SELECT id, '集群健康', '南方集群运行正常，所有指标在正常范围内。', 'normal' FROM daily_reports WHERE report_date = '2026-03-28';

INSERT INTO assessments (report_id, category, content, status)
SELECT id, '容量规划', '磁盘使用率趋势稳定，预计未来30天内不会触及阈值。', 'normal' FROM daily_reports WHERE report_date = '2026-03-28';

INSERT INTO assessments (report_id, category, content, status)
SELECT id, '性能评估', 'CPU使用率较昨日有所下降，系统负载正常。', 'normal' FROM daily_reports WHERE report_date = '2026-03-28';

-- 7. 插入行动计划数据
INSERT INTO action_plans (report_id, priority, items, insight)
SELECT id, 'P2', '["持续监控各集群核心指标。", "关注流量变化趋势。"]', '维持日常监控，确保系统稳定运行。' FROM daily_reports WHERE report_date = '2026-03-28';

-- 验证数据
SELECT 'Clusters:' as type, COUNT(*) as count FROM clusters
UNION ALL
SELECT 'Daily Reports:', COUNT(*) FROM daily_reports
UNION ALL
SELECT 'Log Metrics:', COUNT(*) FROM log_metrics
UNION ALL
SELECT 'Cloud Regions:', COUNT(*) FROM cloud_regions
UNION ALL
SELECT 'Assessments:', COUNT(*) FROM assessments
UNION ALL
SELECT 'Action Plans:', COUNT(*) FROM action_plans;
