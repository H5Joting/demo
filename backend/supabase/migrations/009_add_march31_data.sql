-- 补充 2026-03-31 的模拟数据

-- ============================================
-- 1. 为三个系统创建 3月31日 日报数据
-- ============================================
INSERT INTO daily_reports (report_date, system_status, wx_cluster_eps_rate, wx_cluster_eps_peak_date, wx_cluster_insight, nf_cluster_eps_rate, nf_cluster_eps_peak_date, nf_cluster_insight, business_system_id) VALUES
-- 统一日志平台
('2026-03-31', 'normal', 78, '2026-03-30', '威新集群运行正常，日志采集稳定，处理效率良好。', 58, '2026-03-30', '南方集群运行正常，备份功能正常。', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
-- 支付中心
('2026-03-31', 'normal', 90, '2026-03-30', '支付主集群运行平稳，交易处理正常，响应时间稳定。', 68, '2026-03-30', '支付备集群运行正常，作为灾备节点随时可用。', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
-- 订单系统
('2026-03-31', 'normal', 94, '2026-03-30', '订单主集群运行正常，订单处理效率稳定，无明显延迟。', 70, '2026-03-30', '订单备集群运行正常。', 'cccccccc-cccc-cccc-cccc-cccccccccccc');

-- ============================================
-- 2. 为统一日志平台创建 3月31日 日志指标数据
-- ============================================
INSERT INTO log_metrics (cluster_id, report_date, metric_name, metric_name_en, layer, today_max, today_avg, yesterday_max, yesterday_avg, historical_max, historical_max_date, sla_threshold, unit, change_rate, health_status) VALUES
-- 威新集群
('11111111-1111-1111-1111-111111111111', '2026-03-31', 'Collector EPS', 'Collector EPS', 'access', 68, 55, 65, 52, 80, '2025-03-22', 100, 'w', 4.62, 'healthy'),
('11111111-1111-1111-1111-111111111111', '2026-03-31', 'Kafka写入流量', 'Kafka Write Traffic', 'buffer', 120, 95, 115, 90, 150, '2025-03-22', 200, 'MB/s', 4.35, 'healthy'),
('11111111-1111-1111-1111-111111111111', '2026-03-31', '磁盘使用率', 'Disk Usage', 'storage', 72, 67, 70, 65, 85, '2025-03-22', 80, '%', 2.86, 'healthy'),
('11111111-1111-1111-1111-111111111111', '2026-03-31', 'CPU使用率', 'CPU Usage', 'application', 44, 37, 42, 35, 60, '2025-03-22', 70, '%', 4.76, 'healthy'),
('11111111-1111-1111-1111-111111111111', '2026-03-31', '平均搜索耗时', 'Avg Search Latency', 'application', 13, 10, 14, 11, 20, '2025-03-22', 30, 'ms', -7.14, 'healthy'),
('11111111-1111-1111-1111-111111111111', '2026-03-31', '日志入库耗时', 'Log Ingest Latency', 'storage', 6, 5, 7, 5, 12, '2025-03-22', 15, 'ms', -14.29, 'healthy'),
('11111111-1111-1111-1111-111111111111', '2026-03-31', '监控延迟', 'Monitor Latency', 'application', 4, 3, 4, 3, 8, '2025-03-22', 10, 'ms', 0.0, 'healthy'),
-- 南方集群
('22222222-2222-2222-2222-222222222222', '2026-03-31', 'Collector EPS', 'Collector EPS', 'access', 42, 35, 40, 33, 50, '2025-03-22', 60, 'w', 5.0, 'healthy'),
('22222222-2222-2222-2222-222222222222', '2026-03-31', 'Kafka写入流量', 'Kafka Write Traffic', 'buffer', 85, 70, 82, 68, 100, '2025-03-22', 120, 'MB/s', 3.66, 'healthy'),
('22222222-2222-2222-2222-222222222222', '2026-03-31', '磁盘使用率', 'Disk Usage', 'storage', 64, 60, 62, 58, 75, '2025-03-22', 80, '%', 3.23, 'healthy'),
('22222222-2222-2222-2222-222222222222', '2026-03-31', 'CPU使用率', 'CPU Usage', 'application', 37, 31, 35, 30, 50, '2025-03-22', 70, '%', 5.71, 'healthy'),
('22222222-2222-2222-2222-222222222222', '2026-03-31', '平均搜索耗时', 'Avg Search Latency', 'application', 10, 8, 11, 9, 18, '2025-03-22', 30, 'ms', -9.09, 'healthy'),
('22222222-2222-2222-2222-222222222222', '2026-03-31', '日志入库耗时', 'Log Ingest Latency', 'storage', 5, 4, 5, 4, 10, '2025-03-22', 15, 'ms', 0.0, 'healthy'),
('22222222-2222-2222-2222-222222222222', '2026-03-31', '监控延迟', 'Monitor Latency', 'application', 3, 2, 3, 2, 7, '2025-03-22', 10, 'ms', 0.0, 'healthy');

-- ============================================
-- 3. 为支付中心创建 3月31日 日志指标数据
-- ============================================
INSERT INTO log_metrics (cluster_id, report_date, metric_name, metric_name_en, layer, today_max, today_avg, yesterday_max, yesterday_avg, historical_max, historical_max_date, sla_threshold, unit, change_rate, health_status) VALUES
-- 支付主集群
('33333333-3333-3333-3333-333333333333', '2026-03-31', '交易TPS', 'Transaction TPS', 'application', 15500, 12500, 15000, 12000, 18000, '2026-03-27', 20000, 'tps', 3.33, 'healthy'),
('33333333-3333-3333-3333-333333333333', '2026-03-31', '响应时间', 'Response Time', 'application', 24, 17, 25, 18, 35, '2026-03-27', 50, 'ms', -4.0, 'healthy'),
('33333333-3333-3333-3333-333333333333', '2026-03-31', '成功率', 'Success Rate', 'application', 99.9, 99.8, 99.9, 99.8, 99.9, '2026-03-27', 99.5, '%', 0.0, 'healthy'),
('33333333-3333-3333-3333-333333333333', '2026-03-31', 'CPU使用率', 'CPU Usage', 'application', 52, 43, 55, 45, 75, '2026-03-27', 80, '%', -5.45, 'healthy'),
('33333333-3333-3333-3333-333333333333', '2026-03-31', '内存使用率', 'Memory Usage', 'application', 66, 60, 68, 62, 80, '2026-03-27', 85, '%', -2.94, 'healthy'),
('33333333-3333-3333-3333-333333333333', '2026-03-31', '数据库连接数', 'DB Connections', 'storage', 430, 370, 450, 380, 600, '2026-03-27', 800, '个', -4.44, 'healthy'),
('33333333-3333-3333-3333-333333333333', '2026-03-31', '消息队列积压', 'MQ Backlog', 'buffer', 1100, 750, 1200, 800, 3000, '2026-03-27', 5000, '条', -8.33, 'healthy'),
-- 支付备集群
('44444444-4444-4444-4444-444444444444', '2026-03-31', '交易TPS', 'Transaction TPS', 'application', 8500, 6500, 8000, 6000, 10000, '2026-03-27', 12000, 'tps', 6.25, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-31', '响应时间', 'Response Time', 'application', 28, 21, 30, 22, 40, '2026-03-27', 60, 'ms', -6.67, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-31', '成功率', 'Success Rate', 'application', 99.8, 99.7, 99.8, 99.7, 99.9, '2026-03-27', 99.5, '%', 0.0, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-31', 'CPU使用率', 'CPU Usage', 'application', 40, 33, 42, 35, 60, '2026-03-27', 70, '%', -4.76, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-31', '内存使用率', 'Memory Usage', 'application', 53, 46, 55, 48, 70, '2026-03-27', 80, '%', -3.64, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-31', '数据库连接数', 'DB Connections', 'storage', 270, 210, 280, 220, 400, '2026-03-27', 500, '个', -3.57, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-31', '消息队列积压', 'MQ Backlog', 'buffer', 550, 380, 600, 400, 1500, '2026-03-27', 3000, '条', -8.33, 'healthy');

-- ============================================
-- 4. 为订单系统创建 3月31日 日志指标数据
-- ============================================
INSERT INTO log_metrics (cluster_id, report_date, metric_name, metric_name_en, layer, today_max, today_avg, yesterday_max, yesterday_avg, historical_max, historical_max_date, sla_threshold, unit, change_rate, health_status) VALUES
-- 订单主集群
('55555555-5555-5555-5555-555555555555', '2026-03-31', '订单TPS', 'Order TPS', 'application', 20500, 16500, 20000, 16000, 25000, '2026-03-26', 30000, 'tps', 2.5, 'healthy'),
('55555555-5555-5555-5555-555555555555', '2026-03-31', '响应时间', 'Response Time', 'application', 33, 26, 35, 28, 45, '2026-03-26', 60, 'ms', -5.71, 'healthy'),
('55555555-5555-5555-5555-555555555555', '2026-03-31', '成功率', 'Success Rate', 'application', 99.8, 99.7, 99.8, 99.7, 99.9, '2026-03-26', 99.5, '%', 0.0, 'healthy'),
('55555555-5555-5555-5555-555555555555', '2026-03-31', 'CPU使用率', 'CPU Usage', 'application', 50, 40, 52, 42, 70, '2026-03-26', 80, '%', -3.85, 'healthy'),
('55555555-5555-5555-5555-555555555555', '2026-03-31', '内存使用率', 'Memory Usage', 'application', 63, 56, 65, 58, 75, '2026-03-26', 85, '%', -3.08, 'healthy'),
('55555555-5555-5555-5555-555555555555', '2026-03-31', '数据库连接数', 'DB Connections', 'storage', 530, 460, 550, 480, 700, '2026-03-26', 1000, '个', -3.64, 'healthy'),
('55555555-5555-5555-5555-555555555555', '2026-03-31', '缓存命中率', 'Cache Hit Rate', 'buffer', 96, 93, 95, 92, 98, '2026-03-26', 85, '%', 1.05, 'healthy'),
-- 订单备集群
('66666666-6666-6666-6666-666666666666', '2026-03-31', '订单TPS', 'Order TPS', 'application', 10500, 8500, 10000, 8000, 12000, '2026-03-26', 15000, 'tps', 5.0, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-31', '响应时间', 'Response Time', 'application', 40, 32, 42, 34, 55, '2026-03-26', 70, 'ms', -4.76, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-31', '成功率', 'Success Rate', 'application', 99.7, 99.6, 99.7, 99.6, 99.9, '2026-03-26', 99.5, '%', 0.0, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-31', 'CPU使用率', 'CPU Usage', 'application', 38, 30, 40, 32, 55, '2026-03-26', 70, '%', -5.0, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-31', '内存使用率', 'Memory Usage', 'application', 50, 43, 52, 45, 60, '2026-03-26', 75, '%', -3.85, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-31', '数据库连接数', 'DB Connections', 'storage', 310, 250, 320, 260, 400, '2026-03-26', 600, '个', -3.13, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-31', '缓存命中率', 'Cache Hit Rate', 'buffer', 94, 91, 93, 90, 96, '2026-03-26', 80, '%', 1.08, 'healthy');

-- ============================================
-- 5. 为统一日志平台创建 3月31日 云区域数据
-- ============================================
INSERT INTO cloud_regions (cluster_id, report_date, name, node_count, current_traffic, peak_traffic, region_type) VALUES
('11111111-1111-1111-1111-111111111111', '2026-03-31', '华东区域', 120, 25, 35, 'domestic'),
('11111111-1111-1111-1111-111111111111', '2026-03-31', '华南区域', 85, 18, 25, 'domestic'),
('11111111-1111-1111-1111-111111111111', '2026-03-31', '华北区域', 70, 15, 22, 'domestic'),
('22222222-2222-2222-2222-222222222222', '2026-03-31', '西南区域', 55, 12, 18, 'domestic'),
('22222222-2222-2222-2222-222222222222', '2026-03-31', '海外区域', 30, 8, 12, 'overseas');

-- ============================================
-- 6. 为支付中心创建 3月31日 云区域数据
-- ============================================
INSERT INTO cloud_regions (cluster_id, report_date, name, node_count, current_traffic, peak_traffic, region_type) VALUES
('33333333-3333-3333-3333-333333333333', '2026-03-31', '华东支付区', 150, 30, 40, 'domestic'),
('33333333-3333-3333-3333-333333333333', '2026-03-31', '华南支付区', 100, 22, 30, 'domestic'),
('33333333-3333-3333-3333-333333333333', '2026-03-31', '华北支付区', 80, 18, 26, 'domestic'),
('44444444-4444-4444-4444-444444444444', '2026-03-31', '西南支付区', 60, 14, 20, 'domestic'),
('44444444-4444-4444-4444-444444444444', '2026-03-31', '海外支付区', 35, 9, 13, 'overseas');

-- ============================================
-- 7. 为订单系统创建 3月31日 云区域数据
-- ============================================
INSERT INTO cloud_regions (cluster_id, report_date, name, node_count, current_traffic, peak_traffic, region_type) VALUES
('55555555-5555-5555-5555-555555555555', '2026-03-31', '华东订单区', 180, 34, 48, 'domestic'),
('55555555-5555-5555-5555-555555555555', '2026-03-31', '华南订单区', 120, 26, 36, 'domestic'),
('55555555-5555-5555-5555-555555555555', '2026-03-31', '华北订单区', 90, 20, 30, 'domestic'),
('66666666-6666-6666-6666-666666666666', '2026-03-31', '西南订单区', 70, 16, 24, 'domestic'),
('66666666-6666-6666-6666-666666666666', '2026-03-31', '海外订单区', 40, 12, 18, 'overseas');

-- ============================================
-- 8. 为三个系统创建 3月31日 评估数据
-- ============================================
INSERT INTO assessments (report_id, category, content, status)
SELECT id, '集群健康', '威新集群运行正常，日志采集稳定。', 'normal' FROM daily_reports WHERE report_date = '2026-03-31' AND business_system_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

INSERT INTO assessments (report_id, category, content, status)
SELECT id, '性能评估', '日志处理效率良好，无明显瓶颈。', 'normal' FROM daily_reports WHERE report_date = '2026-03-31' AND business_system_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

INSERT INTO assessments (report_id, category, content, status)
SELECT id, '集群健康', '支付主集群运行正常，交易处理稳定。', 'normal' FROM daily_reports WHERE report_date = '2026-03-31' AND business_system_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

INSERT INTO assessments (report_id, category, content, status)
SELECT id, '性能评估', '交易响应时间稳定，平均延迟低于18ms。', 'normal' FROM daily_reports WHERE report_date = '2026-03-31' AND business_system_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

INSERT INTO assessments (report_id, category, content, status)
SELECT id, '容量规划', '系统容量充足，可应对日常交易峰值。', 'normal' FROM daily_reports WHERE report_date = '2026-03-31' AND business_system_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

INSERT INTO assessments (report_id, category, content, status)
SELECT id, '集群健康', '订单主集群运行正常，订单处理效率稳定。', 'normal' FROM daily_reports WHERE report_date = '2026-03-31' AND business_system_id = 'cccccccc-cccc-cccc-cccc-cccccccccccc';

INSERT INTO assessments (report_id, category, content, status)
SELECT id, '性能评估', '订单处理响应时间稳定，无明显延迟。', 'normal' FROM daily_reports WHERE report_date = '2026-03-31' AND business_system_id = 'cccccccc-cccc-cccc-cccc-cccccccccccc';

INSERT INTO assessments (report_id, category, content, status)
SELECT id, '容量规划', '数据库连接池使用率正常，缓存命中率良好。', 'normal' FROM daily_reports WHERE report_date = '2026-03-31' AND business_system_id = 'cccccccc-cccc-cccc-cccc-cccccccccccc';

-- ============================================
-- 9. 为三个系统创建 3月31日 行动计划数据
-- ============================================
INSERT INTO action_plans (report_id, priority, items, insight)
SELECT id, 'P2', '["持续监控日志采集核心指标。", "关注存储使用趋势。"]', '维持日常监控，确保日志系统稳定运行。' FROM daily_reports WHERE report_date = '2026-03-31' AND business_system_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

INSERT INTO action_plans (report_id, priority, items, insight)
SELECT id, 'P2', '["持续监控交易处理核心指标。", "关注成功率变化趋势。"]', '维持日常监控，确保交易系统稳定运行。' FROM daily_reports WHERE report_date = '2026-03-31' AND business_system_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

INSERT INTO action_plans (report_id, priority, items, insight)
SELECT id, 'P2', '["持续监控订单处理核心指标。", "关注数据库连接池使用情况。"]', '维持日常监控，确保订单系统稳定运行。' FROM daily_reports WHERE report_date = '2026-03-31' AND business_system_id = 'cccccccc-cccc-cccc-cccc-cccccccccccc';

-- 完成
SELECT '2026-03-31 mock data inserted successfully!' as message;
