-- 为所有业务系统创建完整的模拟数据
-- 业务系统ID:
--   aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa: 统一日志平台
--   bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb: 支付中心
--   cccccccc-cccc-cccc-cccc-cccccccccccc: 订单系统

-- ============================================
-- 0. 清理已存在的数据（避免重复）
-- ============================================
DELETE FROM action_plans WHERE report_id IN (SELECT id FROM daily_reports WHERE business_system_id IN ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'));
DELETE FROM assessments WHERE report_id IN (SELECT id FROM daily_reports WHERE business_system_id IN ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'));
DELETE FROM cloud_regions WHERE cluster_id IN ('33333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444', '55555555-5555-5555-5555-555555555555', '66666666-6666-6666-6666-666666666666', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222');
DELETE FROM log_metrics WHERE cluster_id IN ('33333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444', '55555555-5555-5555-5555-555555555555', '66666666-6666-6666-6666-666666666666', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222');
DELETE FROM daily_reports WHERE business_system_id IN ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa');
DELETE FROM clusters WHERE id IN ('33333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444', '55555555-5555-5555-5555-555555555555', '66666666-6666-6666-6666-666666666666');

-- ============================================
-- 1. 为支付中心创建集群
-- ============================================
INSERT INTO clusters (id, name, name_en, type, business_system_id) VALUES
('33333333-3333-3333-3333-333333333333', '支付主集群', 'PAYMENT PRIMARY', 'wx', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
('44444444-4444-4444-4444-444444444444', '支付备集群', 'PAYMENT BACKUP', 'nf', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb');

-- ============================================
-- 2. 为订单系统创建集群
-- ============================================
INSERT INTO clusters (id, name, name_en, type, business_system_id) VALUES
('55555555-5555-5555-5555-555555555555', '订单主集群', 'ORDER PRIMARY', 'wx', 'cccccccc-cccc-cccc-cccc-cccccccccccc'),
('66666666-6666-6666-6666-666666666666', '订单备集群', 'ORDER BACKUP', 'nf', 'cccccccc-cccc-cccc-cccc-cccccccccccc');

-- ============================================
-- 3. 为支付中心创建日报数据（7天）
-- ============================================
INSERT INTO daily_reports (report_date, system_status, wx_cluster_eps_rate, wx_cluster_eps_peak_date, wx_cluster_insight, nf_cluster_eps_rate, nf_cluster_eps_peak_date, nf_cluster_insight, business_system_id) VALUES
('2026-03-30', 'normal', 88, '2026-03-28', '支付主集群运行平稳，交易处理正常，响应时间稳定。', 65, '2026-03-28', '支付备集群运行正常，作为灾备节点随时可用。', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
('2026-03-29', 'normal', 85, '2026-03-28', '支付主集群运行平稳，交易处理正常。', 62, '2026-03-28', '支付备集群运行正常。', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
('2026-03-28', 'normal', 82, '2026-03-28', '支付主集群运行平稳。', 60, '2026-03-28', '支付备集群运行正常。', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
('2026-03-27', 'warning', 95, '2026-03-27', '支付主集群今日交易量激增，CPU使用率接近阈值，建议关注。', 72, '2026-03-27', '支付备集群已启用部分流量分担。', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
('2026-03-26', 'normal', 78, '2026-03-25', '支付主集群运行平稳。', 58, '2026-03-25', '支付备集群运行正常。', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
('2026-03-25', 'normal', 75, '2026-03-25', '支付主集群运行平稳。', 55, '2026-03-25', '支付备集群运行正常。', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
('2026-03-24', 'normal', 72, '2026-03-24', '支付主集群运行平稳。', 52, '2026-03-24', '支付备集群运行正常。', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb');

-- ============================================
-- 4. 为订单系统创建日报数据（7天）
-- ============================================
INSERT INTO daily_reports (report_date, system_status, wx_cluster_eps_rate, wx_cluster_eps_peak_date, wx_cluster_insight, nf_cluster_eps_rate, nf_cluster_eps_peak_date, nf_cluster_insight, business_system_id) VALUES
('2026-03-30', 'normal', 92, '2026-03-29', '订单主集群运行正常，订单处理效率稳定，无明显延迟。', 68, '2026-03-29', '订单备集群运行正常。', 'cccccccc-cccc-cccc-cccc-cccccccccccc'),
('2026-03-29', 'normal', 90, '2026-03-29', '订单主集群运行正常。', 65, '2026-03-29', '订单备集群运行正常。', 'cccccccc-cccc-cccc-cccc-cccccccccccc'),
('2026-03-28', 'normal', 88, '2026-03-28', '订单主集群运行正常。', 62, '2026-03-28', '订单备集群运行正常。', 'cccccccc-cccc-cccc-cccc-cccccccccccc'),
('2026-03-27', 'normal', 85, '2026-03-27', '订单主集群运行正常。', 60, '2026-03-27', '订单备集群运行正常。', 'cccccccc-cccc-cccc-cccc-cccccccccccc'),
('2026-03-26', 'warning', 98, '2026-03-26', '订单主集群今日订单量达到峰值，数据库连接池使用率较高。', 75, '2026-03-26', '订单备集群已启用分担流量。', 'cccccccc-cccc-cccc-cccc-cccccccccccc'),
('2026-03-25', 'normal', 82, '2026-03-25', '订单主集群运行正常。', 58, '2026-03-25', '订单备集群运行正常。', 'cccccccc-cccc-cccc-cccc-cccccccccccc'),
('2026-03-24', 'normal', 80, '2026-03-24', '订单主集群运行正常。', 55, '2026-03-24', '订单备集群运行正常。', 'cccccccc-cccc-cccc-cccc-cccccccccccc');

-- ============================================
-- 5. 为统一日志平台补充最新日报数据
-- ============================================
INSERT INTO daily_reports (report_date, system_status, wx_cluster_eps_rate, wx_cluster_eps_peak_date, wx_cluster_insight, nf_cluster_eps_rate, nf_cluster_eps_peak_date, nf_cluster_insight, business_system_id) VALUES
('2026-03-30', 'normal', 75, '2026-03-28', '威新集群运行正常，日志采集稳定，处理效率良好。', 55, '2026-03-28', '南方集群运行正常，备份功能正常。', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
('2026-03-29', 'normal', 72, '2026-03-28', '威新集群运行正常。', 52, '2026-03-28', '南方集群运行正常。', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa');

-- ============================================
-- 6. 为支付中心创建日志指标数据（7天 x 2集群 x 7指标）
-- ============================================

-- 2026-03-30 支付主集群
INSERT INTO log_metrics (cluster_id, report_date, metric_name, metric_name_en, layer, today_max, today_avg, yesterday_max, yesterday_avg, historical_max, historical_max_date, sla_threshold, unit, change_rate, health_status) VALUES
('33333333-3333-3333-3333-333333333333', '2026-03-30', '交易TPS', 'Transaction TPS', 'application', 15000, 12000, 14500, 11500, 18000, '2026-03-27', 20000, 'tps', 3.45, 'healthy'),
('33333333-3333-3333-3333-333333333333', '2026-03-30', '响应时间', 'Response Time', 'application', 25, 18, 28, 20, 35, '2026-03-27', 50, 'ms', -10.71, 'healthy'),
('33333333-3333-3333-3333-333333333333', '2026-03-30', '成功率', 'Success Rate', 'application', 99.9, 99.8, 99.9, 99.7, 99.9, '2026-03-27', 99.5, '%', 0.1, 'healthy'),
('33333333-3333-3333-3333-333333333333', '2026-03-30', 'CPU使用率', 'CPU Usage', 'application', 55, 45, 58, 48, 75, '2026-03-27', 80, '%', -5.17, 'healthy'),
('33333333-3333-3333-3333-333333333333', '2026-03-30', '内存使用率', 'Memory Usage', 'application', 68, 62, 70, 65, 80, '2026-03-27', 85, '%', -2.86, 'healthy'),
('33333333-3333-3333-3333-333333333333', '2026-03-30', '数据库连接数', 'DB Connections', 'storage', 450, 380, 480, 400, 600, '2026-03-27', 800, '个', -6.25, 'healthy'),
('33333333-3333-3333-3333-333333333333', '2026-03-30', '消息队列积压', 'MQ Backlog', 'buffer', 1200, 800, 1500, 1000, 3000, '2026-03-27', 5000, '条', -20.0, 'healthy');

-- 2026-03-30 支付备集群
INSERT INTO log_metrics (cluster_id, report_date, metric_name, metric_name_en, layer, today_max, today_avg, yesterday_max, yesterday_avg, historical_max, historical_max_date, sla_threshold, unit, change_rate, health_status) VALUES
('44444444-4444-4444-4444-444444444444', '2026-03-30', '交易TPS', 'Transaction TPS', 'application', 8000, 6000, 7500, 5800, 10000, '2026-03-27', 12000, 'tps', 6.67, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-30', '响应时间', 'Response Time', 'application', 30, 22, 32, 24, 40, '2026-03-27', 60, 'ms', -6.25, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-30', '成功率', 'Success Rate', 'application', 99.8, 99.7, 99.8, 99.6, 99.9, '2026-03-27', 99.5, '%', 0.1, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-30', 'CPU使用率', 'CPU Usage', 'application', 42, 35, 45, 38, 60, '2026-03-27', 70, '%', -6.67, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-30', '内存使用率', 'Memory Usage', 'application', 55, 48, 58, 52, 70, '2026-03-27', 80, '%', -5.17, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-30', '数据库连接数', 'DB Connections', 'storage', 280, 220, 300, 250, 400, '2026-03-27', 500, '个', -6.67, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-30', '消息队列积压', 'MQ Backlog', 'buffer', 600, 400, 700, 500, 1500, '2026-03-27', 3000, '条', -14.29, 'healthy');

-- 2026-03-29 支付主集群
INSERT INTO log_metrics (cluster_id, report_date, metric_name, metric_name_en, layer, today_max, today_avg, yesterday_max, yesterday_avg, historical_max, historical_max_date, sla_threshold, unit, change_rate, health_status) VALUES
('33333333-3333-3333-3333-333333333333', '2026-03-29', '交易TPS', 'Transaction TPS', 'application', 14500, 11500, 14000, 11000, 18000, '2026-03-27', 20000, 'tps', 3.57, 'healthy'),
('33333333-3333-3333-3333-333333333333', '2026-03-29', '响应时间', 'Response Time', 'application', 28, 20, 30, 22, 35, '2026-03-27', 50, 'ms', -6.67, 'healthy'),
('33333333-3333-3333-3333-333333333333', '2026-03-29', '成功率', 'Success Rate', 'application', 99.9, 99.7, 99.8, 99.6, 99.9, '2026-03-27', 99.5, '%', 0.1, 'healthy'),
('33333333-3333-3333-3333-333333333333', '2026-03-29', 'CPU使用率', 'CPU Usage', 'application', 58, 48, 60, 50, 75, '2026-03-27', 80, '%', -3.33, 'healthy'),
('33333333-3333-3333-3333-333333333333', '2026-03-29', '内存使用率', 'Memory Usage', 'application', 70, 65, 72, 68, 80, '2026-03-27', 85, '%', -2.78, 'healthy'),
('33333333-3333-3333-3333-333333333333', '2026-03-29', '数据库连接数', 'DB Connections', 'storage', 480, 400, 500, 420, 600, '2026-03-27', 800, '个', -4.0, 'healthy'),
('33333333-3333-3333-3333-333333333333', '2026-03-29', '消息队列积压', 'MQ Backlog', 'buffer', 1500, 1000, 1800, 1200, 3000, '2026-03-27', 5000, '条', -16.67, 'healthy');

-- 2026-03-29 支付备集群
INSERT INTO log_metrics (cluster_id, report_date, metric_name, metric_name_en, layer, today_max, today_avg, yesterday_max, yesterday_avg, historical_max, historical_max_date, sla_threshold, unit, change_rate, health_status) VALUES
('44444444-4444-4444-4444-444444444444', '2026-03-29', '交易TPS', 'Transaction TPS', 'application', 7500, 5800, 7200, 5500, 10000, '2026-03-27', 12000, 'tps', 4.17, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-29', '响应时间', 'Response Time', 'application', 32, 24, 34, 26, 40, '2026-03-27', 60, 'ms', -5.88, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-29', '成功率', 'Success Rate', 'application', 99.8, 99.6, 99.7, 99.5, 99.9, '2026-03-27', 99.5, '%', 0.1, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-29', 'CPU使用率', 'CPU Usage', 'application', 45, 38, 48, 40, 60, '2026-03-27', 70, '%', -6.25, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-29', '内存使用率', 'Memory Usage', 'application', 58, 52, 60, 55, 70, '2026-03-27', 80, '%', -3.33, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-29', '数据库连接数', 'DB Connections', 'storage', 300, 250, 320, 270, 400, '2026-03-27', 500, '个', -6.25, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-29', '消息队列积压', 'MQ Backlog', 'buffer', 700, 500, 800, 600, 1500, '2026-03-27', 3000, '条', -12.5, 'healthy');

-- 2026-03-28 支付主集群
INSERT INTO log_metrics (cluster_id, report_date, metric_name, metric_name_en, layer, today_max, today_avg, yesterday_max, yesterday_avg, historical_max, historical_max_date, sla_threshold, unit, change_rate, health_status) VALUES
('33333333-3333-3333-3333-333333333333', '2026-03-28', '交易TPS', 'Transaction TPS', 'application', 14000, 11000, 13500, 10500, 18000, '2026-03-27', 20000, 'tps', 3.7, 'healthy'),
('33333333-3333-3333-3333-333333333333', '2026-03-28', '响应时间', 'Response Time', 'application', 30, 22, 32, 24, 35, '2026-03-27', 50, 'ms', -6.25, 'healthy'),
('33333333-3333-3333-3333-333333333333', '2026-03-28', '成功率', 'Success Rate', 'application', 99.8, 99.6, 99.7, 99.5, 99.9, '2026-03-27', 99.5, '%', 0.1, 'healthy'),
('33333333-3333-3333-3333-333333333333', '2026-03-28', 'CPU使用率', 'CPU Usage', 'application', 60, 50, 62, 52, 75, '2026-03-27', 80, '%', -3.23, 'healthy'),
('33333333-3333-3333-3333-333333333333', '2026-03-28', '内存使用率', 'Memory Usage', 'application', 72, 68, 75, 70, 80, '2026-03-27', 85, '%', -4.0, 'healthy'),
('33333333-3333-3333-3333-333333333333', '2026-03-28', '数据库连接数', 'DB Connections', 'storage', 500, 420, 520, 450, 600, '2026-03-27', 800, '个', -3.85, 'healthy'),
('33333333-3333-3333-3333-333333333333', '2026-03-28', '消息队列积压', 'MQ Backlog', 'buffer', 1800, 1200, 2000, 1400, 3000, '2026-03-27', 5000, '条', -10.0, 'healthy');

-- 2026-03-28 支付备集群
INSERT INTO log_metrics (cluster_id, report_date, metric_name, metric_name_en, layer, today_max, today_avg, yesterday_max, yesterday_avg, historical_max, historical_max_date, sla_threshold, unit, change_rate, health_status) VALUES
('44444444-4444-4444-4444-444444444444', '2026-03-28', '交易TPS', 'Transaction TPS', 'application', 7200, 5500, 7000, 5200, 10000, '2026-03-27', 12000, 'tps', 2.86, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-28', '响应时间', 'Response Time', 'application', 34, 26, 36, 28, 40, '2026-03-27', 60, 'ms', -5.56, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-28', '成功率', 'Success Rate', 'application', 99.7, 99.5, 99.6, 99.4, 99.9, '2026-03-27', 99.5, '%', 0.1, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-28', 'CPU使用率', 'CPU Usage', 'application', 48, 40, 50, 42, 60, '2026-03-27', 70, '%', -4.0, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-28', '内存使用率', 'Memory Usage', 'application', 60, 55, 62, 58, 70, '2026-03-27', 80, '%', -3.23, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-28', '数据库连接数', 'DB Connections', 'storage', 320, 270, 340, 290, 400, '2026-03-27', 500, '个', -5.88, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-28', '消息队列积压', 'MQ Backlog', 'buffer', 800, 600, 900, 700, 1500, '2026-03-27', 3000, '条', -11.11, 'healthy');

-- 2026-03-27 高流量日 支付主集群
INSERT INTO log_metrics (cluster_id, report_date, metric_name, metric_name_en, layer, today_max, today_avg, yesterday_max, yesterday_avg, historical_max, historical_max_date, sla_threshold, unit, change_rate, health_status) VALUES
('33333333-3333-3333-3333-333333333333', '2026-03-27', '交易TPS', 'Transaction TPS', 'application', 18000, 15000, 14000, 11000, 18000, '2026-03-27', 20000, 'tps', 28.57, 'warning'),
('33333333-3333-3333-3333-333333333333', '2026-03-27', '响应时间', 'Response Time', 'application', 35, 28, 30, 22, 35, '2026-03-27', 50, 'ms', 16.67, 'healthy'),
('33333333-3333-3333-3333-333333333333', '2026-03-27', '成功率', 'Success Rate', 'application', 99.8, 99.6, 99.8, 99.6, 99.9, '2026-03-27', 99.5, '%', 0.0, 'healthy'),
('33333333-3333-3333-3333-333333333333', '2026-03-27', 'CPU使用率', 'CPU Usage', 'application', 75, 65, 60, 50, 75, '2026-03-27', 80, '%', 25.0, 'warning'),
('33333333-3333-3333-3333-333333333333', '2026-03-27', '内存使用率', 'Memory Usage', 'application', 78, 72, 72, 68, 80, '2026-03-27', 85, '%', 8.33, 'healthy'),
('33333333-3333-3333-3333-333333333333', '2026-03-27', '数据库连接数', 'DB Connections', 'storage', 580, 500, 500, 420, 600, '2026-03-27', 800, '个', 16.0, 'healthy'),
('33333333-3333-3333-3333-333333333333', '2026-03-27', '消息队列积压', 'MQ Backlog', 'buffer', 2500, 1800, 1800, 1200, 3000, '2026-03-27', 5000, '条', 38.89, 'healthy');

-- 2026-03-27 支付备集群
INSERT INTO log_metrics (cluster_id, report_date, metric_name, metric_name_en, layer, today_max, today_avg, yesterday_max, yesterday_avg, historical_max, historical_max_date, sla_threshold, unit, change_rate, health_status) VALUES
('44444444-4444-4444-4444-444444444444', '2026-03-27', '交易TPS', 'Transaction TPS', 'application', 10000, 8000, 7200, 5500, 10000, '2026-03-27', 12000, 'tps', 38.89, 'warning'),
('44444444-4444-4444-4444-444444444444', '2026-03-27', '响应时间', 'Response Time', 'application', 38, 30, 34, 26, 40, '2026-03-27', 60, 'ms', 11.76, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-27', '成功率', 'Success Rate', 'application', 99.7, 99.5, 99.7, 99.5, 99.9, '2026-03-27', 99.5, '%', 0.0, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-27', 'CPU使用率', 'CPU Usage', 'application', 58, 50, 48, 40, 60, '2026-03-27', 70, '%', 20.83, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-27', '内存使用率', 'Memory Usage', 'application', 65, 60, 60, 55, 70, '2026-03-27', 80, '%', 8.33, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-27', '数据库连接数', 'DB Connections', 'storage', 380, 320, 320, 270, 400, '2026-03-27', 500, '个', 18.75, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-27', '消息队列积压', 'MQ Backlog', 'buffer', 1200, 900, 800, 600, 1500, '2026-03-27', 3000, '条', 50.0, 'healthy');

-- 2026-03-26 支付主集群
INSERT INTO log_metrics (cluster_id, report_date, metric_name, metric_name_en, layer, today_max, today_avg, yesterday_max, yesterday_avg, historical_max, historical_max_date, sla_threshold, unit, change_rate, health_status) VALUES
('33333333-3333-3333-3333-333333333333', '2026-03-26', '交易TPS', 'Transaction TPS', 'application', 13500, 10500, 13000, 10000, 18000, '2026-03-27', 20000, 'tps', 3.85, 'healthy'),
('33333333-3333-3333-3333-333333333333', '2026-03-26', '响应时间', 'Response Time', 'application', 32, 24, 34, 26, 35, '2026-03-27', 50, 'ms', -5.88, 'healthy'),
('33333333-3333-3333-3333-333333333333', '2026-03-26', '成功率', 'Success Rate', 'application', 99.7, 99.5, 99.6, 99.4, 99.9, '2026-03-27', 99.5, '%', 0.1, 'healthy'),
('33333333-3333-3333-3333-333333333333', '2026-03-26', 'CPU使用率', 'CPU Usage', 'application', 62, 52, 65, 55, 75, '2026-03-27', 80, '%', -4.62, 'healthy'),
('33333333-3333-3333-3333-333333333333', '2026-03-26', '内存使用率', 'Memory Usage', 'application', 75, 70, 78, 72, 80, '2026-03-27', 85, '%', -3.9, 'healthy'),
('33333333-3333-3333-3333-333333333333', '2026-03-26', '数据库连接数', 'DB Connections', 'storage', 520, 450, 550, 480, 600, '2026-03-27', 800, '个', -5.45, 'healthy'),
('33333333-3333-3333-3333-333333333333', '2026-03-26', '消息队列积压', 'MQ Backlog', 'buffer', 2000, 1400, 2200, 1600, 3000, '2026-03-27', 5000, '条', -9.09, 'healthy');

-- 2026-03-26 支付备集群
INSERT INTO log_metrics (cluster_id, report_date, metric_name, metric_name_en, layer, today_max, today_avg, yesterday_max, yesterday_avg, historical_max, historical_max_date, sla_threshold, unit, change_rate, health_status) VALUES
('44444444-4444-4444-4444-444444444444', '2026-03-26', '交易TPS', 'Transaction TPS', 'application', 7000, 5200, 6800, 5000, 10000, '2026-03-27', 12000, 'tps', 2.94, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-26', '响应时间', 'Response Time', 'application', 36, 28, 38, 30, 40, '2026-03-27', 60, 'ms', -5.26, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-26', '成功率', 'Success Rate', 'application', 99.6, 99.4, 99.5, 99.3, 99.9, '2026-03-27', 99.5, '%', 0.1, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-26', 'CPU使用率', 'CPU Usage', 'application', 50, 42, 52, 45, 60, '2026-03-27', 70, '%', -3.85, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-26', '内存使用率', 'Memory Usage', 'application', 62, 58, 65, 60, 70, '2026-03-27', 80, '%', -4.62, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-26', '数据库连接数', 'DB Connections', 'storage', 340, 290, 360, 310, 400, '2026-03-27', 500, '个', -5.56, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-26', '消息队列积压', 'MQ Backlog', 'buffer', 900, 700, 1000, 800, 1500, '2026-03-27', 3000, '条', -10.0, 'healthy');

-- 2026-03-25 支付主集群
INSERT INTO log_metrics (cluster_id, report_date, metric_name, metric_name_en, layer, today_max, today_avg, yesterday_max, yesterday_avg, historical_max, historical_max_date, sla_threshold, unit, change_rate, health_status) VALUES
('33333333-3333-3333-3333-333333333333', '2026-03-25', '交易TPS', 'Transaction TPS', 'application', 13000, 10000, 12500, 9500, 18000, '2026-03-27', 20000, 'tps', 4.0, 'healthy'),
('33333333-3333-3333-3333-333333333333', '2026-03-25', '响应时间', 'Response Time', 'application', 34, 26, 36, 28, 35, '2026-03-27', 50, 'ms', -5.56, 'healthy'),
('33333333-3333-3333-3333-333333333333', '2026-03-25', '成功率', 'Success Rate', 'application', 99.6, 99.4, 99.5, 99.3, 99.9, '2026-03-27', 99.5, '%', 0.1, 'healthy'),
('33333333-3333-3333-3333-333333333333', '2026-03-25', 'CPU使用率', 'CPU Usage', 'application', 65, 55, 68, 58, 75, '2026-03-27', 80, '%', -4.41, 'healthy'),
('33333333-3333-3333-3333-333333333333', '2026-03-25', '内存使用率', 'Memory Usage', 'application', 78, 72, 80, 75, 80, '2026-03-27', 85, '%', -2.5, 'healthy'),
('33333333-3333-3333-3333-333333333333', '2026-03-25', '数据库连接数', 'DB Connections', 'storage', 550, 480, 580, 510, 600, '2026-03-27', 800, '个', -5.17, 'healthy'),
('33333333-3333-3333-3333-333333333333', '2026-03-25', '消息队列积压', 'MQ Backlog', 'buffer', 2200, 1600, 2400, 1800, 3000, '2026-03-27', 5000, '条', -8.33, 'healthy');

-- 2026-03-25 支付备集群
INSERT INTO log_metrics (cluster_id, report_date, metric_name, metric_name_en, layer, today_max, today_avg, yesterday_max, yesterday_avg, historical_max, historical_max_date, sla_threshold, unit, change_rate, health_status) VALUES
('44444444-4444-4444-4444-444444444444', '2026-03-25', '交易TPS', 'Transaction TPS', 'application', 6800, 5000, 6500, 4800, 10000, '2026-03-27', 12000, 'tps', 4.62, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-25', '响应时间', 'Response Time', 'application', 38, 30, 40, 32, 40, '2026-03-27', 60, 'ms', -5.0, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-25', '成功率', 'Success Rate', 'application', 99.5, 99.3, 99.4, 99.2, 99.9, '2026-03-27', 99.5, '%', 0.1, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-25', 'CPU使用率', 'CPU Usage', 'application', 52, 45, 55, 48, 60, '2026-03-27', 70, '%', -5.45, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-25', '内存使用率', 'Memory Usage', 'application', 65, 60, 68, 62, 70, '2026-03-27', 80, '%', -4.41, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-25', '数据库连接数', 'DB Connections', 'storage', 360, 310, 380, 330, 400, '2026-03-27', 500, '个', -5.26, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-25', '消息队列积压', 'MQ Backlog', 'buffer', 1000, 800, 1100, 900, 1500, '2026-03-27', 3000, '条', -9.09, 'healthy');

-- 2026-03-24 支付主集群
INSERT INTO log_metrics (cluster_id, report_date, metric_name, metric_name_en, layer, today_max, today_avg, yesterday_max, yesterday_avg, historical_max, historical_max_date, sla_threshold, unit, change_rate, health_status) VALUES
('33333333-3333-3333-3333-333333333333', '2026-03-24', '交易TPS', 'Transaction TPS', 'application', 12500, 9500, 12000, 9000, 18000, '2026-03-27', 20000, 'tps', 4.17, 'healthy'),
('33333333-3333-3333-3333-333333333333', '2026-03-24', '响应时间', 'Response Time', 'application', 36, 28, 38, 30, 35, '2026-03-27', 50, 'ms', -5.26, 'healthy'),
('33333333-3333-3333-3333-333333333333', '2026-03-24', '成功率', 'Success Rate', 'application', 99.5, 99.3, 99.4, 99.2, 99.9, '2026-03-27', 99.5, '%', 0.1, 'healthy'),
('33333333-3333-3333-3333-333333333333', '2026-03-24', 'CPU使用率', 'CPU Usage', 'application', 68, 58, 70, 60, 75, '2026-03-27', 80, '%', -2.86, 'healthy'),
('33333333-3333-3333-3333-333333333333', '2026-03-24', '内存使用率', 'Memory Usage', 'application', 80, 75, 82, 78, 80, '2026-03-27', 85, '%', -2.44, 'healthy'),
('33333333-3333-3333-3333-333333333333', '2026-03-24', '数据库连接数', 'DB Connections', 'storage', 580, 510, 600, 540, 600, '2026-03-27', 800, '个', -3.33, 'healthy'),
('33333333-3333-3333-3333-333333333333', '2026-03-24', '消息队列积压', 'MQ Backlog', 'buffer', 2400, 1800, 2600, 2000, 3000, '2026-03-27', 5000, '条', -7.69, 'healthy');

-- 2026-03-24 支付备集群
INSERT INTO log_metrics (cluster_id, report_date, metric_name, metric_name_en, layer, today_max, today_avg, yesterday_max, yesterday_avg, historical_max, historical_max_date, sla_threshold, unit, change_rate, health_status) VALUES
('44444444-4444-4444-4444-444444444444', '2026-03-24', '交易TPS', 'Transaction TPS', 'application', 6500, 4800, 6200, 4500, 10000, '2026-03-27', 12000, 'tps', 4.84, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-24', '响应时间', 'Response Time', 'application', 40, 32, 42, 34, 40, '2026-03-27', 60, 'ms', -4.76, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-24', '成功率', 'Success Rate', 'application', 99.4, 99.2, 99.3, 99.1, 99.9, '2026-03-27', 99.5, '%', 0.1, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-24', 'CPU使用率', 'CPU Usage', 'application', 55, 48, 58, 50, 60, '2026-03-27', 70, '%', -5.17, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-24', '内存使用率', 'Memory Usage', 'application', 68, 62, 70, 65, 70, '2026-03-27', 80, '%', -2.86, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-24', '数据库连接数', 'DB Connections', 'storage', 380, 330, 400, 350, 400, '2026-03-27', 500, '个', -5.0, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-24', '消息队列积压', 'MQ Backlog', 'buffer', 1100, 900, 1200, 1000, 1500, '2026-03-27', 3000, '条', -8.33, 'healthy');

-- ============================================
-- 7. 为订单系统创建日志指标数据（7天 x 2集群 x 7指标）
-- ============================================

-- 2026-03-30 订单主集群
INSERT INTO log_metrics (cluster_id, report_date, metric_name, metric_name_en, layer, today_max, today_avg, yesterday_max, yesterday_avg, historical_max, historical_max_date, sla_threshold, unit, change_rate, health_status) VALUES
('55555555-5555-5555-5555-555555555555', '2026-03-30', '订单TPS', 'Order TPS', 'application', 20000, 16000, 19500, 15500, 25000, '2026-03-26', 30000, 'tps', 2.56, 'healthy'),
('55555555-5555-5555-5555-555555555555', '2026-03-30', '响应时间', 'Response Time', 'application', 35, 28, 38, 30, 45, '2026-03-26', 60, 'ms', -7.89, 'healthy'),
('55555555-5555-5555-5555-555555555555', '2026-03-30', '成功率', 'Success Rate', 'application', 99.8, 99.7, 99.8, 99.6, 99.9, '2026-03-26', 99.5, '%', 0.1, 'healthy'),
('55555555-5555-5555-5555-555555555555', '2026-03-30', 'CPU使用率', 'CPU Usage', 'application', 52, 42, 55, 45, 70, '2026-03-26', 80, '%', -5.45, 'healthy'),
('55555555-5555-5555-5555-555555555555', '2026-03-30', '内存使用率', 'Memory Usage', 'application', 65, 58, 68, 62, 75, '2026-03-26', 85, '%', -4.41, 'healthy'),
('55555555-5555-5555-5555-555555555555', '2026-03-30', '数据库连接数', 'DB Connections', 'storage', 550, 480, 580, 510, 700, '2026-03-26', 1000, '个', -5.17, 'healthy'),
('55555555-5555-5555-5555-555555555555', '2026-03-30', '缓存命中率', 'Cache Hit Rate', 'buffer', 95, 92, 94, 90, 98, '2026-03-26', 85, '%', 1.06, 'healthy');

-- 2026-03-30 订单备集群
INSERT INTO log_metrics (cluster_id, report_date, metric_name, metric_name_en, layer, today_max, today_avg, yesterday_max, yesterday_avg, historical_max, historical_max_date, sla_threshold, unit, change_rate, health_status) VALUES
('66666666-6666-6666-6666-666666666666', '2026-03-30', '订单TPS', 'Order TPS', 'application', 10000, 8000, 9500, 7500, 12000, '2026-03-26', 15000, 'tps', 5.26, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-30', '响应时间', 'Response Time', 'application', 42, 34, 45, 36, 55, '2026-03-26', 70, 'ms', -6.67, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-30', '成功率', 'Success Rate', 'application', 99.7, 99.6, 99.7, 99.5, 99.9, '2026-03-26', 99.5, '%', 0.1, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-30', 'CPU使用率', 'CPU Usage', 'application', 40, 32, 42, 35, 55, '2026-03-26', 70, '%', -4.76, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-30', '内存使用率', 'Memory Usage', 'application', 52, 45, 55, 48, 60, '2026-03-26', 75, '%', -5.45, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-30', '数据库连接数', 'DB Connections', 'storage', 320, 260, 340, 280, 400, '2026-03-26', 600, '个', -5.88, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-30', '缓存命中率', 'Cache Hit Rate', 'buffer', 93, 90, 92, 88, 96, '2026-03-26', 80, '%', 1.09, 'healthy');

-- 2026-03-29 订单主集群
INSERT INTO log_metrics (cluster_id, report_date, metric_name, metric_name_en, layer, today_max, today_avg, yesterday_max, yesterday_avg, historical_max, historical_max_date, sla_threshold, unit, change_rate, health_status) VALUES
('55555555-5555-5555-5555-555555555555', '2026-03-29', '订单TPS', 'Order TPS', 'application', 19500, 15500, 19000, 15000, 25000, '2026-03-26', 30000, 'tps', 2.63, 'healthy'),
('55555555-5555-5555-5555-555555555555', '2026-03-29', '响应时间', 'Response Time', 'application', 38, 30, 40, 32, 45, '2026-03-26', 60, 'ms', -5.0, 'healthy'),
('55555555-5555-5555-5555-555555555555', '2026-03-29', '成功率', 'Success Rate', 'application', 99.8, 99.6, 99.7, 99.5, 99.9, '2026-03-26', 99.5, '%', 0.1, 'healthy'),
('55555555-5555-5555-5555-555555555555', '2026-03-29', 'CPU使用率', 'CPU Usage', 'application', 55, 45, 58, 48, 70, '2026-03-26', 80, '%', -5.17, 'healthy'),
('55555555-5555-5555-5555-555555555555', '2026-03-29', '内存使用率', 'Memory Usage', 'application', 68, 62, 70, 65, 75, '2026-03-26', 85, '%', -2.86, 'healthy'),
('55555555-5555-5555-5555-555555555555', '2026-03-29', '数据库连接数', 'DB Connections', 'storage', 580, 510, 600, 540, 700, '2026-03-26', 1000, '个', -3.33, 'healthy'),
('55555555-5555-5555-5555-555555555555', '2026-03-29', '缓存命中率', 'Cache Hit Rate', 'buffer', 94, 90, 93, 89, 98, '2026-03-26', 85, '%', 1.08, 'healthy');

-- 2026-03-29 订单备集群
INSERT INTO log_metrics (cluster_id, report_date, metric_name, metric_name_en, layer, today_max, today_avg, yesterday_max, yesterday_avg, historical_max, historical_max_date, sla_threshold, unit, change_rate, health_status) VALUES
('66666666-6666-6666-6666-666666666666', '2026-03-29', '订单TPS', 'Order TPS', 'application', 9500, 7500, 9000, 7000, 12000, '2026-03-26', 15000, 'tps', 5.56, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-29', '响应时间', 'Response Time', 'application', 45, 36, 48, 38, 55, '2026-03-26', 70, 'ms', -6.25, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-29', '成功率', 'Success Rate', 'application', 99.7, 99.5, 99.6, 99.4, 99.9, '2026-03-26', 99.5, '%', 0.1, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-29', 'CPU使用率', 'CPU Usage', 'application', 42, 35, 45, 38, 55, '2026-03-26', 70, '%', -6.67, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-29', '内存使用率', 'Memory Usage', 'application', 55, 48, 58, 52, 60, '2026-03-26', 75, '%', -5.17, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-29', '数据库连接数', 'DB Connections', 'storage', 340, 280, 360, 300, 400, '2026-03-26', 600, '个', -5.56, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-29', '缓存命中率', 'Cache Hit Rate', 'buffer', 92, 88, 91, 87, 96, '2026-03-26', 80, '%', 1.1, 'healthy');

-- 2026-03-28 订单主集群
INSERT INTO log_metrics (cluster_id, report_date, metric_name, metric_name_en, layer, today_max, today_avg, yesterday_max, yesterday_avg, historical_max, historical_max_date, sla_threshold, unit, change_rate, health_status) VALUES
('55555555-5555-5555-5555-555555555555', '2026-03-28', '订单TPS', 'Order TPS', 'application', 19000, 15000, 18500, 14500, 25000, '2026-03-26', 30000, 'tps', 2.7, 'healthy'),
('55555555-5555-5555-5555-555555555555', '2026-03-28', '响应时间', 'Response Time', 'application', 40, 32, 42, 34, 45, '2026-03-26', 60, 'ms', -4.76, 'healthy'),
('55555555-5555-5555-5555-555555555555', '2026-03-28', '成功率', 'Success Rate', 'application', 99.7, 99.5, 99.6, 99.4, 99.9, '2026-03-26', 99.5, '%', 0.1, 'healthy'),
('55555555-5555-5555-5555-555555555555', '2026-03-28', 'CPU使用率', 'CPU Usage', 'application', 58, 48, 60, 50, 70, '2026-03-26', 80, '%', -3.33, 'healthy'),
('55555555-5555-5555-5555-555555555555', '2026-03-28', '内存使用率', 'Memory Usage', 'application', 70, 65, 72, 68, 75, '2026-03-26', 85, '%', -2.78, 'healthy'),
('55555555-5555-5555-5555-555555555555', '2026-03-28', '数据库连接数', 'DB Connections', 'storage', 600, 540, 620, 560, 700, '2026-03-26', 1000, '个', -3.23, 'healthy'),
('55555555-5555-5555-5555-555555555555', '2026-03-28', '缓存命中率', 'Cache Hit Rate', 'buffer', 93, 89, 92, 88, 98, '2026-03-26', 85, '%', 1.09, 'healthy');

-- 2026-03-28 订单备集群
INSERT INTO log_metrics (cluster_id, report_date, metric_name, metric_name_en, layer, today_max, today_avg, yesterday_max, yesterday_avg, historical_max, historical_max_date, sla_threshold, unit, change_rate, health_status) VALUES
('66666666-6666-6666-6666-666666666666', '2026-03-28', '订单TPS', 'Order TPS', 'application', 9000, 7000, 8500, 6500, 12000, '2026-03-26', 15000, 'tps', 5.88, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-28', '响应时间', 'Response Time', 'application', 48, 38, 50, 40, 55, '2026-03-26', 70, 'ms', -4.0, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-28', '成功率', 'Success Rate', 'application', 99.6, 99.4, 99.5, 99.3, 99.9, '2026-03-26', 99.5, '%', 0.1, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-28', 'CPU使用率', 'CPU Usage', 'application', 45, 38, 48, 40, 55, '2026-03-26', 70, '%', -6.25, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-28', '内存使用率', 'Memory Usage', 'application', 58, 52, 60, 55, 60, '2026-03-26', 75, '%', -3.33, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-28', '数据库连接数', 'DB Connections', 'storage', 360, 300, 380, 320, 400, '2026-03-26', 600, '个', -5.26, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-28', '缓存命中率', 'Cache Hit Rate', 'buffer', 91, 87, 90, 86, 96, '2026-03-26', 80, '%', 1.11, 'healthy');

-- 2026-03-27 订单主集群
INSERT INTO log_metrics (cluster_id, report_date, metric_name, metric_name_en, layer, today_max, today_avg, yesterday_max, yesterday_avg, historical_max, historical_max_date, sla_threshold, unit, change_rate, health_status) VALUES
('55555555-5555-5555-5555-555555555555', '2026-03-27', '订单TPS', 'Order TPS', 'application', 18500, 14500, 18000, 14000, 25000, '2026-03-26', 30000, 'tps', 2.78, 'healthy'),
('55555555-5555-5555-5555-555555555555', '2026-03-27', '响应时间', 'Response Time', 'application', 42, 34, 45, 36, 45, '2026-03-26', 60, 'ms', -6.67, 'healthy'),
('55555555-5555-5555-5555-555555555555', '2026-03-27', '成功率', 'Success Rate', 'application', 99.6, 99.4, 99.5, 99.3, 99.9, '2026-03-26', 99.5, '%', 0.1, 'healthy'),
('55555555-5555-5555-5555-555555555555', '2026-03-27', 'CPU使用率', 'CPU Usage', 'application', 60, 50, 62, 52, 70, '2026-03-26', 80, '%', -3.23, 'healthy'),
('55555555-5555-5555-5555-555555555555', '2026-03-27', '内存使用率', 'Memory Usage', 'application', 72, 68, 75, 70, 75, '2026-03-26', 85, '%', -4.0, 'healthy'),
('55555555-5555-5555-5555-555555555555', '2026-03-27', '数据库连接数', 'DB Connections', 'storage', 620, 560, 650, 590, 700, '2026-03-26', 1000, '个', -4.62, 'healthy'),
('55555555-5555-5555-5555-555555555555', '2026-03-27', '缓存命中率', 'Cache Hit Rate', 'buffer', 92, 88, 91, 87, 98, '2026-03-26', 85, '%', 1.1, 'healthy');

-- 2026-03-27 订单备集群
INSERT INTO log_metrics (cluster_id, report_date, metric_name, metric_name_en, layer, today_max, today_avg, yesterday_max, yesterday_avg, historical_max, historical_max_date, sla_threshold, unit, change_rate, health_status) VALUES
('66666666-6666-6666-6666-666666666666', '2026-03-27', '订单TPS', 'Order TPS', 'application', 8500, 6500, 8000, 6000, 12000, '2026-03-26', 15000, 'tps', 6.25, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-27', '响应时间', 'Response Time', 'application', 50, 40, 52, 42, 55, '2026-03-26', 70, 'ms', -3.85, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-27', '成功率', 'Success Rate', 'application', 99.5, 99.3, 99.4, 99.2, 99.9, '2026-03-26', 99.5, '%', 0.1, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-27', 'CPU使用率', 'CPU Usage', 'application', 48, 40, 50, 42, 55, '2026-03-26', 70, '%', -4.0, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-27', '内存使用率', 'Memory Usage', 'application', 60, 55, 62, 58, 60, '2026-03-26', 75, '%', -3.23, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-27', '数据库连接数', 'DB Connections', 'storage', 380, 320, 400, 340, 400, '2026-03-26', 600, '个', -5.0, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-27', '缓存命中率', 'Cache Hit Rate', 'buffer', 90, 86, 89, 85, 96, '2026-03-26', 80, '%', 1.12, 'healthy');

-- 2026-03-26 高流量日 订单主集群
INSERT INTO log_metrics (cluster_id, report_date, metric_name, metric_name_en, layer, today_max, today_avg, yesterday_max, yesterday_avg, historical_max, historical_max_date, sla_threshold, unit, change_rate, health_status) VALUES
('55555555-5555-5555-5555-555555555555', '2026-03-26', '订单TPS', 'Order TPS', 'application', 25000, 20000, 18500, 14500, 25000, '2026-03-26', 30000, 'tps', 35.14, 'warning'),
('55555555-5555-5555-5555-555555555555', '2026-03-26', '响应时间', 'Response Time', 'application', 45, 38, 42, 34, 45, '2026-03-26', 60, 'ms', 11.76, 'healthy'),
('55555555-5555-5555-5555-555555555555', '2026-03-26', '成功率', 'Success Rate', 'application', 99.6, 99.4, 99.6, 99.4, 99.9, '2026-03-26', 99.5, '%', 0.0, 'healthy'),
('55555555-5555-5555-5555-555555555555', '2026-03-26', 'CPU使用率', 'CPU Usage', 'application', 70, 60, 60, 50, 70, '2026-03-26', 80, '%', 16.67, 'warning'),
('55555555-5555-5555-5555-555555555555', '2026-03-26', '内存使用率', 'Memory Usage', 'application', 75, 70, 72, 68, 75, '2026-03-26', 85, '%', 4.17, 'healthy'),
('55555555-5555-5555-5555-555555555555', '2026-03-26', '数据库连接数', 'DB Connections', 'storage', 700, 620, 620, 560, 700, '2026-03-26', 1000, '个', 12.9, 'healthy'),
('55555555-5555-5555-5555-555555555555', '2026-03-26', '缓存命中率', 'Cache Hit Rate', 'buffer', 91, 87, 92, 88, 98, '2026-03-26', 85, '%', -1.09, 'healthy');

-- 2026-03-26 订单备集群
INSERT INTO log_metrics (cluster_id, report_date, metric_name, metric_name_en, layer, today_max, today_avg, yesterday_max, yesterday_avg, historical_max, historical_max_date, sla_threshold, unit, change_rate, health_status) VALUES
('66666666-6666-6666-6666-666666666666', '2026-03-26', '订单TPS', 'Order TPS', 'application', 12000, 10000, 8500, 6500, 12000, '2026-03-26', 15000, 'tps', 41.18, 'warning'),
('66666666-6666-6666-6666-666666666666', '2026-03-26', '响应时间', 'Response Time', 'application', 52, 44, 50, 40, 55, '2026-03-26', 70, 'ms', 4.0, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-26', '成功率', 'Success Rate', 'application', 99.4, 99.2, 99.5, 99.3, 99.9, '2026-03-26', 99.5, '%', -0.1, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-26', 'CPU使用率', 'CPU Usage', 'application', 55, 48, 48, 40, 55, '2026-03-26', 70, '%', 14.58, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-26', '内存使用率', 'Memory Usage', 'application', 62, 58, 60, 55, 60, '2026-03-26', 75, '%', 3.33, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-26', '数据库连接数', 'DB Connections', 'storage', 400, 350, 380, 320, 400, '2026-03-26', 600, '个', 5.26, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-26', '缓存命中率', 'Cache Hit Rate', 'buffer', 89, 85, 90, 86, 96, '2026-03-26', 80, '%', -1.11, 'healthy');

-- 2026-03-25 订单主集群
INSERT INTO log_metrics (cluster_id, report_date, metric_name, metric_name_en, layer, today_max, today_avg, yesterday_max, yesterday_avg, historical_max, historical_max_date, sla_threshold, unit, change_rate, health_status) VALUES
('55555555-5555-5555-5555-555555555555', '2026-03-25', '订单TPS', 'Order TPS', 'application', 18000, 14000, 17500, 13500, 25000, '2026-03-26', 30000, 'tps', 2.86, 'healthy'),
('55555555-5555-5555-5555-555555555555', '2026-03-25', '响应时间', 'Response Time', 'application', 45, 36, 48, 38, 45, '2026-03-26', 60, 'ms', -6.25, 'healthy'),
('55555555-5555-5555-5555-555555555555', '2026-03-25', '成功率', 'Success Rate', 'application', 99.5, 99.3, 99.4, 99.2, 99.9, '2026-03-26', 99.5, '%', 0.1, 'healthy'),
('55555555-5555-5555-5555-555555555555', '2026-03-25', 'CPU使用率', 'CPU Usage', 'application', 62, 52, 65, 55, 70, '2026-03-26', 80, '%', -4.62, 'healthy'),
('55555555-5555-5555-5555-555555555555', '2026-03-25', '内存使用率', 'Memory Usage', 'application', 75, 70, 78, 72, 75, '2026-03-26', 85, '%', -3.9, 'healthy'),
('55555555-5555-5555-5555-555555555555', '2026-03-25', '数据库连接数', 'DB Connections', 'storage', 650, 590, 680, 610, 700, '2026-03-26', 1000, '个', -4.41, 'healthy'),
('55555555-5555-5555-5555-555555555555', '2026-03-25', '缓存命中率', 'Cache Hit Rate', 'buffer', 92, 88, 91, 87, 98, '2026-03-26', 85, '%', 1.1, 'healthy');

-- 2026-03-25 订单备集群
INSERT INTO log_metrics (cluster_id, report_date, metric_name, metric_name_en, layer, today_max, today_avg, yesterday_max, yesterday_avg, historical_max, historical_max_date, sla_threshold, unit, change_rate, health_status) VALUES
('66666666-6666-6666-6666-666666666666', '2026-03-25', '订单TPS', 'Order TPS', 'application', 8000, 6000, 7500, 5500, 12000, '2026-03-26', 15000, 'tps', 6.67, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-25', '响应时间', 'Response Time', 'application', 52, 42, 55, 44, 55, '2026-03-26', 70, 'ms', -5.45, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-25', '成功率', 'Success Rate', 'application', 99.4, 99.2, 99.3, 99.1, 99.9, '2026-03-26', 99.5, '%', 0.1, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-25', 'CPU使用率', 'CPU Usage', 'application', 50, 42, 52, 45, 55, '2026-03-26', 70, '%', -3.85, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-25', '内存使用率', 'Memory Usage', 'application', 60, 55, 62, 58, 60, '2026-03-26', 75, '%', -3.23, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-25', '数据库连接数', 'DB Connections', 'storage', 400, 340, 420, 360, 400, '2026-03-26', 600, '个', -4.76, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-25', '缓存命中率', 'Cache Hit Rate', 'buffer', 90, 86, 89, 85, 96, '2026-03-26', 80, '%', 1.12, 'healthy');

-- 2026-03-24 订单主集群
INSERT INTO log_metrics (cluster_id, report_date, metric_name, metric_name_en, layer, today_max, today_avg, yesterday_max, yesterday_avg, historical_max, historical_max_date, sla_threshold, unit, change_rate, health_status) VALUES
('55555555-5555-5555-5555-555555555555', '2026-03-24', '订单TPS', 'Order TPS', 'application', 17500, 13500, 17000, 13000, 25000, '2026-03-26', 30000, 'tps', 2.94, 'healthy'),
('55555555-5555-5555-5555-555555555555', '2026-03-24', '响应时间', 'Response Time', 'application', 48, 38, 50, 40, 45, '2026-03-26', 60, 'ms', -4.0, 'healthy'),
('55555555-5555-5555-5555-555555555555', '2026-03-24', '成功率', 'Success Rate', 'application', 99.4, 99.2, 99.3, 99.1, 99.9, '2026-03-26', 99.5, '%', 0.1, 'healthy'),
('55555555-5555-5555-5555-555555555555', '2026-03-24', 'CPU使用率', 'CPU Usage', 'application', 65, 55, 68, 58, 70, '2026-03-26', 80, '%', -4.41, 'healthy'),
('55555555-5555-5555-5555-555555555555', '2026-03-24', '内存使用率', 'Memory Usage', 'application', 78, 72, 80, 75, 75, '2026-03-26', 85, '%', -2.5, 'healthy'),
('55555555-5555-5555-5555-555555555555', '2026-03-24', '数据库连接数', 'DB Connections', 'storage', 680, 610, 700, 640, 700, '2026-03-26', 1000, '个', -2.86, 'healthy'),
('55555555-5555-5555-5555-555555555555', '2026-03-24', '缓存命中率', 'Cache Hit Rate', 'buffer', 91, 87, 90, 86, 98, '2026-03-26', 85, '%', 1.11, 'healthy');

-- 2026-03-24 订单备集群
INSERT INTO log_metrics (cluster_id, report_date, metric_name, metric_name_en, layer, today_max, today_avg, yesterday_max, yesterday_avg, historical_max, historical_max_date, sla_threshold, unit, change_rate, health_status) VALUES
('66666666-6666-6666-6666-666666666666', '2026-03-24', '订单TPS', 'Order TPS', 'application', 7500, 5500, 7000, 5000, 12000, '2026-03-26', 15000, 'tps', 7.14, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-24', '响应时间', 'Response Time', 'application', 55, 44, 58, 46, 55, '2026-03-26', 70, 'ms', -5.17, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-24', '成功率', 'Success Rate', 'application', 99.3, 99.1, 99.2, 99.0, 99.9, '2026-03-26', 99.5, '%', 0.1, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-24', 'CPU使用率', 'CPU Usage', 'application', 52, 45, 55, 48, 55, '2026-03-26', 70, '%', -5.45, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-24', '内存使用率', 'Memory Usage', 'application', 62, 58, 65, 60, 60, '2026-03-26', 75, '%', -4.62, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-24', '数据库连接数', 'DB Connections', 'storage', 420, 360, 450, 380, 400, '2026-03-26', 600, '个', -6.67, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-24', '缓存命中率', 'Cache Hit Rate', 'buffer', 89, 85, 88, 84, 96, '2026-03-26', 80, '%', 1.13, 'healthy');

-- ============================================
-- 8. 为统一日志平台补充最新日志指标数据
-- ============================================

-- 2026-03-30 威新集群
INSERT INTO log_metrics (cluster_id, report_date, metric_name, metric_name_en, layer, today_max, today_avg, yesterday_max, yesterday_avg, historical_max, historical_max_date, sla_threshold, unit, change_rate, health_status) VALUES
('11111111-1111-1111-1111-111111111111', '2026-03-30', 'Collector EPS', 'Collector EPS', 'access', 65, 52, 68, 55, 80, '2025-03-22', 100, 'w', -5.8, 'healthy'),
('11111111-1111-1111-1111-111111111111', '2026-03-30', 'Kafka写入流量', 'Kafka Write Traffic', 'buffer', 115, 90, 120, 95, 150, '2025-03-22', 200, 'MB/s', -4.35, 'healthy'),
('11111111-1111-1111-1111-111111111111', '2026-03-30', '磁盘使用率', 'Disk Usage', 'storage', 70, 65, 72, 68, 85, '2025-03-22', 80, '%', -2.78, 'healthy'),
('11111111-1111-1111-1111-111111111111', '2026-03-30', 'CPU使用率', 'CPU Usage', 'application', 42, 35, 45, 38, 60, '2025-03-22', 70, '%', -6.67, 'healthy'),
('11111111-1111-1111-1111-111111111111', '2026-03-30', '平均搜索耗时', 'Avg Search Latency', 'application', 14, 11, 15, 12, 20, '2025-03-22', 30, 'ms', -6.67, 'healthy'),
('11111111-1111-1111-1111-111111111111', '2026-03-30', '日志入库耗时', 'Log Ingest Latency', 'storage', 7, 5, 8, 6, 12, '2025-03-22', 15, 'ms', -12.5, 'healthy'),
('11111111-1111-1111-1111-111111111111', '2026-03-30', '监控延迟', 'Monitor Latency', 'application', 4, 3, 5, 4, 8, '2025-03-22', 10, 'ms', -20.0, 'healthy');

-- 2026-03-30 南方集群
INSERT INTO log_metrics (cluster_id, report_date, metric_name, metric_name_en, layer, today_max, today_avg, yesterday_max, yesterday_avg, historical_max, historical_max_date, sla_threshold, unit, change_rate, health_status) VALUES
('22222222-2222-2222-2222-222222222222', '2026-03-30', 'Collector EPS', 'Collector EPS', 'access', 40, 33, 42, 35, 50, '2025-03-22', 60, 'w', -4.76, 'healthy'),
('22222222-2222-2222-2222-222222222222', '2026-03-30', 'Kafka写入流量', 'Kafka Write Traffic', 'buffer', 82, 68, 85, 70, 100, '2025-03-22', 120, 'MB/s', -3.53, 'healthy'),
('22222222-2222-2222-2222-222222222222', '2026-03-30', '磁盘使用率', 'Disk Usage', 'storage', 62, 58, 65, 60, 75, '2025-03-22', 80, '%', -4.62, 'healthy'),
('22222222-2222-2222-2222-222222222222', '2026-03-30', 'CPU使用率', 'CPU Usage', 'application', 35, 30, 38, 32, 50, '2025-03-22', 70, '%', -7.89, 'healthy'),
('22222222-2222-2222-2222-222222222222', '2026-03-30', '平均搜索耗时', 'Avg Search Latency', 'application', 11, 9, 12, 10, 18, '2025-03-22', 30, 'ms', -8.33, 'healthy'),
('22222222-2222-2222-2222-222222222222', '2026-03-30', '日志入库耗时', 'Log Ingest Latency', 'storage', 5, 4, 6, 5, 10, '2025-03-22', 15, 'ms', -16.67, 'healthy'),
('22222222-2222-2222-2222-222222222222', '2026-03-30', '监控延迟', 'Monitor Latency', 'application', 3, 2, 4, 3, 7, '2025-03-22', 10, 'ms', -25.0, 'healthy');

-- 2026-03-29 威新集群
INSERT INTO log_metrics (cluster_id, report_date, metric_name, metric_name_en, layer, today_max, today_avg, yesterday_max, yesterday_avg, historical_max, historical_max_date, sla_threshold, unit, change_rate, health_status) VALUES
('11111111-1111-1111-1111-111111111111', '2026-03-29', 'Collector EPS', 'Collector EPS', 'access', 68, 55, 70, 56, 80, '2025-03-22', 100, 'w', -3.57, 'healthy'),
('11111111-1111-1111-1111-111111111111', '2026-03-29', 'Kafka写入流量', 'Kafka Write Traffic', 'buffer', 120, 95, 125, 100, 150, '2025-03-22', 200, 'MB/s', -4.0, 'healthy'),
('11111111-1111-1111-1111-111111111111', '2026-03-29', '磁盘使用率', 'Disk Usage', 'storage', 72, 68, 75, 70, 85, '2025-03-22', 80, '%', -4.0, 'healthy'),
('11111111-1111-1111-1111-111111111111', '2026-03-29', 'CPU使用率', 'CPU Usage', 'application', 45, 38, 48, 40, 60, '2025-03-22', 70, '%', -6.25, 'healthy'),
('11111111-1111-1111-1111-111111111111', '2026-03-29', '平均搜索耗时', 'Avg Search Latency', 'application', 15, 12, 16, 13, 20, '2025-03-22', 30, 'ms', -6.25, 'healthy'),
('11111111-1111-1111-1111-111111111111', '2026-03-29', '日志入库耗时', 'Log Ingest Latency', 'storage', 8, 6, 9, 7, 12, '2025-03-22', 15, 'ms', -11.11, 'healthy'),
('11111111-1111-1111-1111-111111111111', '2026-03-29', '监控延迟', 'Monitor Latency', 'application', 5, 4, 6, 5, 8, '2025-03-22', 10, 'ms', -16.67, 'healthy');

-- 2026-03-29 南方集群
INSERT INTO log_metrics (cluster_id, report_date, metric_name, metric_name_en, layer, today_max, today_avg, yesterday_max, yesterday_avg, historical_max, historical_max_date, sla_threshold, unit, change_rate, health_status) VALUES
('22222222-2222-2222-2222-222222222222', '2026-03-29', 'Collector EPS', 'Collector EPS', 'access', 42, 35, 45, 38, 50, '2025-03-22', 60, 'w', -6.67, 'healthy'),
('22222222-2222-2222-2222-222222222222', '2026-03-29', 'Kafka写入流量', 'Kafka Write Traffic', 'buffer', 85, 70, 90, 75, 100, '2025-03-22', 120, 'MB/s', -5.56, 'healthy'),
('22222222-2222-2222-2222-222222222222', '2026-03-29', '磁盘使用率', 'Disk Usage', 'storage', 65, 60, 68, 63, 75, '2025-03-22', 80, '%', -4.41, 'healthy'),
('22222222-2222-2222-2222-222222222222', '2026-03-29', 'CPU使用率', 'CPU Usage', 'application', 38, 32, 40, 34, 50, '2025-03-22', 70, '%', -5.0, 'healthy'),
('22222222-2222-2222-2222-222222222222', '2026-03-29', '平均搜索耗时', 'Avg Search Latency', 'application', 12, 10, 13, 11, 18, '2025-03-22', 30, 'ms', -7.69, 'healthy'),
('22222222-2222-2222-2222-222222222222', '2026-03-29', '日志入库耗时', 'Log Ingest Latency', 'storage', 6, 5, 7, 6, 10, '2025-03-22', 15, 'ms', -14.29, 'healthy'),
('22222222-2222-2222-2222-222222222222', '2026-03-29', '监控延迟', 'Monitor Latency', 'application', 4, 3, 5, 4, 7, '2025-03-22', 10, 'ms', -20.0, 'healthy');

-- ============================================
-- 9. 为支付中心创建云区域数据（7天）
-- ============================================

-- 2026-03-30
INSERT INTO cloud_regions (cluster_id, report_date, name, node_count, current_traffic, peak_traffic, region_type) VALUES
('33333333-3333-3333-3333-333333333333', '2026-03-30', '华东支付区', 150, 28, 38, 'domestic'),
('33333333-3333-3333-3333-333333333333', '2026-03-30', '华南支付区', 100, 20, 28, 'domestic'),
('33333333-3333-3333-3333-333333333333', '2026-03-30', '华北支付区', 80, 16, 24, 'domestic'),
('44444444-4444-4444-4444-444444444444', '2026-03-30', '西南支付区', 60, 12, 18, 'domestic'),
('44444444-4444-4444-4444-444444444444', '2026-03-30', '海外支付区', 35, 8, 12, 'overseas');

-- 2026-03-29
INSERT INTO cloud_regions (cluster_id, report_date, name, node_count, current_traffic, peak_traffic, region_type) VALUES
('33333333-3333-3333-3333-333333333333', '2026-03-29', '华东支付区', 150, 30, 40, 'domestic'),
('33333333-3333-3333-3333-333333333333', '2026-03-29', '华南支付区', 100, 22, 30, 'domestic'),
('33333333-3333-3333-3333-333333333333', '2026-03-29', '华北支付区', 80, 18, 26, 'domestic'),
('44444444-4444-4444-4444-444444444444', '2026-03-29', '西南支付区', 60, 14, 20, 'domestic'),
('44444444-4444-4444-4444-444444444444', '2026-03-29', '海外支付区', 35, 9, 13, 'overseas');

-- 2026-03-28
INSERT INTO cloud_regions (cluster_id, report_date, name, node_count, current_traffic, peak_traffic, region_type) VALUES
('33333333-3333-3333-3333-333333333333', '2026-03-28', '华东支付区', 150, 26, 36, 'domestic'),
('33333333-3333-3333-3333-333333333333', '2026-03-28', '华南支付区', 100, 18, 26, 'domestic'),
('33333333-3333-3333-3333-333333333333', '2026-03-28', '华北支付区', 80, 15, 22, 'domestic'),
('44444444-4444-4444-4444-444444444444', '2026-03-28', '西南支付区', 60, 11, 17, 'domestic'),
('44444444-4444-4444-4444-444444444444', '2026-03-28', '海外支付区', 35, 7, 11, 'overseas');

-- 2026-03-27 高流量日
INSERT INTO cloud_regions (cluster_id, report_date, name, node_count, current_traffic, peak_traffic, region_type) VALUES
('33333333-3333-3333-3333-333333333333', '2026-03-27', '华东支付区', 150, 35, 48, 'domestic'),
('33333333-3333-3333-3333-333333333333', '2026-03-27', '华南支付区', 100, 25, 35, 'domestic'),
('33333333-3333-3333-3333-333333333333', '2026-03-27', '华北支付区', 80, 20, 30, 'domestic'),
('44444444-4444-4444-4444-444444444444', '2026-03-27', '西南支付区', 60, 16, 24, 'domestic'),
('44444444-4444-4444-4444-444444444444', '2026-03-27', '海外支付区', 35, 10, 16, 'overseas');

-- 2026-03-26
INSERT INTO cloud_regions (cluster_id, report_date, name, node_count, current_traffic, peak_traffic, region_type) VALUES
('33333333-3333-3333-3333-333333333333', '2026-03-26', '华东支付区', 150, 24, 34, 'domestic'),
('33333333-3333-3333-3333-333333333333', '2026-03-26', '华南支付区', 100, 17, 24, 'domestic'),
('33333333-3333-3333-3333-333333333333', '2026-03-26', '华北支付区', 80, 14, 21, 'domestic'),
('44444444-4444-4444-4444-444444444444', '2026-03-26', '西南支付区', 60, 10, 16, 'domestic'),
('44444444-4444-4444-4444-444444444444', '2026-03-26', '海外支付区', 35, 6, 10, 'overseas');

-- 2026-03-25
INSERT INTO cloud_regions (cluster_id, report_date, name, node_count, current_traffic, peak_traffic, region_type) VALUES
('33333333-3333-3333-3333-333333333333', '2026-03-25', '华东支付区', 150, 22, 32, 'domestic'),
('33333333-3333-3333-3333-333333333333', '2026-03-25', '华南支付区', 100, 16, 23, 'domestic'),
('33333333-3333-3333-3333-333333333333', '2026-03-25', '华北支付区', 80, 13, 20, 'domestic'),
('44444444-4444-4444-4444-444444444444', '2026-03-25', '西南支付区', 60, 9, 15, 'domestic'),
('44444444-4444-4444-4444-444444444444', '2026-03-25', '海外支付区', 35, 5, 9, 'overseas');

-- 2026-03-24
INSERT INTO cloud_regions (cluster_id, report_date, name, node_count, current_traffic, peak_traffic, region_type) VALUES
('33333333-3333-3333-3333-333333333333', '2026-03-24', '华东支付区', 150, 21, 31, 'domestic'),
('33333333-3333-3333-3333-333333333333', '2026-03-24', '华南支付区', 100, 15, 22, 'domestic'),
('33333333-3333-3333-3333-333333333333', '2026-03-24', '华北支付区', 80, 12, 19, 'domestic'),
('44444444-4444-4444-4444-444444444444', '2026-03-24', '西南支付区', 60, 8, 14, 'domestic'),
('44444444-4444-4444-4444-444444444444', '2026-03-24', '海外支付区', 35, 4, 8, 'overseas');

-- ============================================
-- 10. 为订单系统创建云区域数据（7天）
-- ============================================

-- 2026-03-30
INSERT INTO cloud_regions (cluster_id, report_date, name, node_count, current_traffic, peak_traffic, region_type) VALUES
('55555555-5555-5555-5555-555555555555', '2026-03-30', '华东订单区', 180, 32, 45, 'domestic'),
('55555555-5555-5555-5555-555555555555', '2026-03-30', '华南订单区', 120, 24, 34, 'domestic'),
('55555555-5555-5555-5555-555555555555', '2026-03-30', '华北订单区', 90, 18, 28, 'domestic'),
('66666666-6666-6666-6666-666666666666', '2026-03-30', '西南订单区', 70, 14, 22, 'domestic'),
('66666666-6666-6666-6666-666666666666', '2026-03-30', '海外订单区', 40, 10, 16, 'overseas');

-- 2026-03-29
INSERT INTO cloud_regions (cluster_id, report_date, name, node_count, current_traffic, peak_traffic, region_type) VALUES
('55555555-5555-5555-5555-555555555555', '2026-03-29', '华东订单区', 180, 34, 48, 'domestic'),
('55555555-5555-5555-5555-555555555555', '2026-03-29', '华南订单区', 120, 26, 36, 'domestic'),
('55555555-5555-5555-5555-555555555555', '2026-03-29', '华北订单区', 90, 20, 30, 'domestic'),
('66666666-6666-6666-6666-666666666666', '2026-03-29', '西南订单区', 70, 16, 24, 'domestic'),
('66666666-6666-6666-6666-666666666666', '2026-03-29', '海外订单区', 40, 11, 17, 'overseas');

-- 2026-03-28
INSERT INTO cloud_regions (cluster_id, report_date, name, node_count, current_traffic, peak_traffic, region_type) VALUES
('55555555-5555-5555-5555-555555555555', '2026-03-28', '华东订单区', 180, 30, 42, 'domestic'),
('55555555-5555-5555-5555-555555555555', '2026-03-28', '华南订单区', 120, 22, 32, 'domestic'),
('55555555-5555-5555-5555-555555555555', '2026-03-28', '华北订单区', 90, 17, 26, 'domestic'),
('66666666-6666-6666-6666-666666666666', '2026-03-28', '西南订单区', 70, 13, 20, 'domestic'),
('66666666-6666-6666-6666-666666666666', '2026-03-28', '海外订单区', 40, 9, 14, 'overseas');

-- 2026-03-27
INSERT INTO cloud_regions (cluster_id, report_date, name, node_count, current_traffic, peak_traffic, region_type) VALUES
('55555555-5555-5555-5555-555555555555', '2026-03-27', '华东订单区', 180, 28, 40, 'domestic'),
('55555555-5555-5555-5555-555555555555', '2026-03-27', '华南订单区', 120, 20, 30, 'domestic'),
('55555555-5555-5555-5555-555555555555', '2026-03-27', '华北订单区', 90, 16, 24, 'domestic'),
('66666666-6666-6666-6666-666666666666', '2026-03-27', '西南订单区', 70, 12, 18, 'domestic'),
('66666666-6666-6666-6666-666666666666', '2026-03-27', '海外订单区', 40, 8, 12, 'overseas');

-- 2026-03-26 高流量日
INSERT INTO cloud_regions (cluster_id, report_date, name, node_count, current_traffic, peak_traffic, region_type) VALUES
('55555555-5555-5555-5555-555555555555', '2026-03-26', '华东订单区', 180, 40, 55, 'domestic'),
('55555555-5555-5555-5555-555555555555', '2026-03-26', '华南订单区', 120, 30, 42, 'domestic'),
('55555555-5555-5555-5555-555555555555', '2026-03-26', '华北订单区', 90, 24, 35, 'domestic'),
('66666666-6666-6666-6666-666666666666', '2026-03-26', '西南订单区', 70, 18, 28, 'domestic'),
('66666666-6666-6666-6666-666666666666', '2026-03-26', '海外订单区', 40, 12, 20, 'overseas');

-- 2026-03-25
INSERT INTO cloud_regions (cluster_id, report_date, name, node_count, current_traffic, peak_traffic, region_type) VALUES
('55555555-5555-5555-5555-555555555555', '2026-03-25', '华东订单区', 180, 26, 38, 'domestic'),
('55555555-5555-5555-5555-555555555555', '2026-03-25', '华南订单区', 120, 19, 28, 'domestic'),
('55555555-5555-5555-5555-555555555555', '2026-03-25', '华北订单区', 90, 15, 23, 'domestic'),
('66666666-6666-6666-6666-666666666666', '2026-03-25', '西南订单区', 70, 11, 17, 'domestic'),
('66666666-6666-6666-6666-666666666666', '2026-03-25', '海外订单区', 40, 7, 11, 'overseas');

-- 2026-03-24
INSERT INTO cloud_regions (cluster_id, report_date, name, node_count, current_traffic, peak_traffic, region_type) VALUES
('55555555-5555-5555-5555-555555555555', '2026-03-24', '华东订单区', 180, 24, 36, 'domestic'),
('55555555-5555-5555-5555-555555555555', '2026-03-24', '华南订单区', 120, 18, 26, 'domestic'),
('55555555-5555-5555-5555-555555555555', '2026-03-24', '华北订单区', 90, 14, 21, 'domestic'),
('66666666-6666-6666-6666-666666666666', '2026-03-24', '西南订单区', 70, 10, 16, 'domestic'),
('66666666-6666-6666-6666-666666666666', '2026-03-24', '海外订单区', 40, 6, 10, 'overseas');

-- ============================================
-- 11. 为统一日志平台补充最新云区域数据
-- ============================================

INSERT INTO cloud_regions (cluster_id, report_date, name, node_count, current_traffic, peak_traffic, region_type) VALUES
('11111111-1111-1111-1111-111111111111', '2026-03-30', '华东区域', 120, 24, 34, 'domestic'),
('11111111-1111-1111-1111-111111111111', '2026-03-30', '华南区域', 85, 17, 24, 'domestic'),
('11111111-1111-1111-1111-111111111111', '2026-03-30', '华北区域', 70, 14, 21, 'domestic'),
('22222222-2222-2222-2222-222222222222', '2026-03-30', '西南区域', 55, 11, 17, 'domestic'),
('22222222-2222-2222-2222-222222222222', '2026-03-30', '海外区域', 30, 7, 11, 'overseas');

INSERT INTO cloud_regions (cluster_id, report_date, name, node_count, current_traffic, peak_traffic, region_type) VALUES
('11111111-1111-1111-1111-111111111111', '2026-03-29', '华东区域', 120, 25, 35, 'domestic'),
('11111111-1111-1111-1111-111111111111', '2026-03-29', '华南区域', 85, 18, 25, 'domestic'),
('11111111-1111-1111-1111-111111111111', '2026-03-29', '华北区域', 70, 15, 22, 'domestic'),
('22222222-2222-2222-2222-222222222222', '2026-03-29', '西南区域', 55, 12, 18, 'domestic'),
('22222222-2222-2222-2222-222222222222', '2026-03-29', '海外区域', 30, 8, 12, 'overseas');

-- ============================================
-- 12. 为支付中心创建评估数据
-- ============================================

INSERT INTO assessments (report_id, category, content, status)
SELECT id, '集群健康', '支付主集群运行正常，交易处理稳定。', 'normal' FROM daily_reports WHERE report_date = '2026-03-30' AND business_system_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

INSERT INTO assessments (report_id, category, content, status)
SELECT id, '性能评估', '交易响应时间稳定，平均延迟低于20ms。', 'normal' FROM daily_reports WHERE report_date = '2026-03-30' AND business_system_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

INSERT INTO assessments (report_id, category, content, status)
SELECT id, '容量规划', '系统容量充足，可应对日常交易峰值。', 'normal' FROM daily_reports WHERE report_date = '2026-03-30' AND business_system_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

INSERT INTO assessments (report_id, category, content, status)
SELECT id, '集群健康', '支付主集群今日交易量激增，CPU使用率接近阈值。', 'warning' FROM daily_reports WHERE report_date = '2026-03-27' AND business_system_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

INSERT INTO assessments (report_id, category, content, status)
SELECT id, '性能评估', '高流量期间响应时间略有上升，建议关注。', 'warning' FROM daily_reports WHERE report_date = '2026-03-27' AND business_system_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

-- ============================================
-- 13. 为订单系统创建评估数据
-- ============================================

INSERT INTO assessments (report_id, category, content, status)
SELECT id, '集群健康', '订单主集群运行正常，订单处理效率稳定。', 'normal' FROM daily_reports WHERE report_date = '2026-03-30' AND business_system_id = 'cccccccc-cccc-cccc-cccc-cccccccccccc';

INSERT INTO assessments (report_id, category, content, status)
SELECT id, '性能评估', '订单处理响应时间稳定，无明显延迟。', 'normal' FROM daily_reports WHERE report_date = '2026-03-30' AND business_system_id = 'cccccccc-cccc-cccc-cccc-cccccccccccc';

INSERT INTO assessments (report_id, category, content, status)
SELECT id, '容量规划', '数据库连接池使用率正常，缓存命中率良好。', 'normal' FROM daily_reports WHERE report_date = '2026-03-30' AND business_system_id = 'cccccccc-cccc-cccc-cccc-cccccccccccc';

INSERT INTO assessments (report_id, category, content, status)
SELECT id, '集群健康', '订单主集群今日订单量达到峰值，数据库连接池使用率较高。', 'warning' FROM daily_reports WHERE report_date = '2026-03-26' AND business_system_id = 'cccccccc-cccc-cccc-cccc-cccccccccccc';

INSERT INTO assessments (report_id, category, content, status)
SELECT id, '性能评估', '高流量期间CPU使用率接近阈值，建议关注。', 'warning' FROM daily_reports WHERE report_date = '2026-03-26' AND business_system_id = 'cccccccc-cccc-cccc-cccc-cccccccccccc';

-- ============================================
-- 14. 为支付中心创建行动计划数据
-- ============================================

INSERT INTO action_plans (report_id, priority, items, insight)
SELECT id, 'P2', '["持续监控交易处理核心指标。", "关注成功率变化趋势。"]', '维持日常监控，确保交易系统稳定运行。' FROM daily_reports WHERE report_date = '2026-03-30' AND business_system_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

INSERT INTO action_plans (report_id, priority, items, insight)
SELECT id, 'P2', '["持续监控交易处理核心指标。", "关注成功率变化趋势。"]', '维持日常监控，确保交易系统稳定运行。' FROM daily_reports WHERE report_date = '2026-03-29' AND business_system_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

INSERT INTO action_plans (report_id, priority, items, insight)
SELECT id, 'P1', '["紧急关注支付主集群CPU使用率，已接近告警阈值。", "评估是否需要临时扩容。", "检查交易来源，确认是否为正常业务增长。"]', '今日为高流量日，建议加强监控并准备应急预案。' FROM daily_reports WHERE report_date = '2026-03-27' AND business_system_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

INSERT INTO action_plans (report_id, priority, items, insight)
SELECT id, 'P2', '["持续监控交易处理核心指标。", "关注成功率变化趋势。"]', '维持日常监控，确保交易系统稳定运行。' FROM daily_reports WHERE report_date = '2026-03-26' AND business_system_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

INSERT INTO action_plans (report_id, priority, items, insight)
SELECT id, 'P2', '["持续监控交易处理核心指标。", "关注成功率变化趋势。"]', '维持日常监控，确保交易系统稳定运行。' FROM daily_reports WHERE report_date = '2026-03-25' AND business_system_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

INSERT INTO action_plans (report_id, priority, items, insight)
SELECT id, 'P2', '["持续监控交易处理核心指标。", "关注成功率变化趋势。"]', '维持日常监控，确保交易系统稳定运行。' FROM daily_reports WHERE report_date = '2026-03-24' AND business_system_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

-- ============================================
-- 15. 为订单系统创建行动计划数据
-- ============================================

INSERT INTO action_plans (report_id, priority, items, insight)
SELECT id, 'P2', '["持续监控订单处理核心指标。", "关注数据库连接池使用情况。"]', '维持日常监控，确保订单系统稳定运行。' FROM daily_reports WHERE report_date = '2026-03-30' AND business_system_id = 'cccccccc-cccc-cccc-cccc-cccccccccccc';

INSERT INTO action_plans (report_id, priority, items, insight)
SELECT id, 'P2', '["持续监控订单处理核心指标。", "关注数据库连接池使用情况。"]', '维持日常监控，确保订单系统稳定运行。' FROM daily_reports WHERE report_date = '2026-03-29' AND business_system_id = 'cccccccc-cccc-cccc-cccc-cccccccccccc';

INSERT INTO action_plans (report_id, priority, items, insight)
SELECT id, 'P2', '["持续监控订单处理核心指标。", "关注数据库连接池使用情况。"]', '维持日常监控，确保订单系统稳定运行。' FROM daily_reports WHERE report_date = '2026-03-28' AND business_system_id = 'cccccccc-cccc-cccc-cccc-cccccccccccc';

INSERT INTO action_plans (report_id, priority, items, insight)
SELECT id, 'P1', '["紧急关注订单主集群数据库连接池使用率。", "评估是否需要扩容数据库连接池。", "检查订单来源，确认是否为正常业务增长。"]', '今日为高流量日，建议加强监控并准备应急预案。' FROM daily_reports WHERE report_date = '2026-03-26' AND business_system_id = 'cccccccc-cccc-cccc-cccc-cccccccccccc';

INSERT INTO action_plans (report_id, priority, items, insight)
SELECT id, 'P2', '["持续监控订单处理核心指标。", "关注数据库连接池使用情况。"]', '维持日常监控，确保订单系统稳定运行。' FROM daily_reports WHERE report_date = '2026-03-25' AND business_system_id = 'cccccccc-cccc-cccc-cccc-cccccccccccc';

INSERT INTO action_plans (report_id, priority, items, insight)
SELECT id, 'P2', '["持续监控订单处理核心指标。", "关注数据库连接池使用情况。"]', '维持日常监控，确保订单系统稳定运行。' FROM daily_reports WHERE report_date = '2026-03-24' AND business_system_id = 'cccccccc-cccc-cccc-cccc-cccccccccccc';

-- ============================================
-- 16. 为统一日志平台补充评估和行动计划数据
-- ============================================

INSERT INTO assessments (report_id, category, content, status)
SELECT id, '集群健康', '威新集群运行正常，日志采集稳定。', 'normal' FROM daily_reports WHERE report_date = '2026-03-30' AND business_system_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

INSERT INTO assessments (report_id, category, content, status)
SELECT id, '性能评估', '日志处理效率良好，无明显瓶颈。', 'normal' FROM daily_reports WHERE report_date = '2026-03-30' AND business_system_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

INSERT INTO assessments (report_id, category, content, status)
SELECT id, '集群健康', '威新集群运行正常。', 'normal' FROM daily_reports WHERE report_date = '2026-03-29' AND business_system_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

INSERT INTO assessments (report_id, category, content, status)
SELECT id, '性能评估', '日志处理效率良好。', 'normal' FROM daily_reports WHERE report_date = '2026-03-29' AND business_system_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

INSERT INTO action_plans (report_id, priority, items, insight)
SELECT id, 'P2', '["持续监控日志采集核心指标。", "关注存储使用趋势。"]', '维持日常监控，确保日志系统稳定运行。' FROM daily_reports WHERE report_date = '2026-03-30' AND business_system_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

INSERT INTO action_plans (report_id, priority, items, insight)
SELECT id, 'P2', '["持续监控日志采集核心指标。", "关注存储使用趋势。"]', '维持日常监控，确保日志系统稳定运行。' FROM daily_reports WHERE report_date = '2026-03-29' AND business_system_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

-- 完成
SELECT 'All mock data inserted successfully!' as message;
