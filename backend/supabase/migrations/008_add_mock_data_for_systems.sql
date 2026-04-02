-- 为支付中心和订单系统添加模拟数据
-- 最近一周（2026-03-24 到 2026-03-30）的数据

-- ============================================
-- 1. 为支付中心插入日报数据（7天）
-- ============================================
INSERT INTO daily_reports (report_date, system_status, wx_cluster_eps_rate, wx_cluster_eps_peak_date, wx_cluster_insight, nf_cluster_eps_rate, nf_cluster_eps_peak_date, nf_cluster_insight, business_system_id) VALUES
('2026-03-30', 'normal', 75, '2026-03-28', '支付主集群交易量稳定，支付成功率99.9%。', 55, '2026-03-28', '支付备份集群运行正常。', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
('2026-03-29', 'normal', 72, '2026-03-28', '支付主集群交易量平稳。', 52, '2026-03-28', '支付备份集群正常。', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
('2026-03-28', 'normal', 68, '2026-03-28', '支付主集群交易量略有下降。', 48, '2026-03-28', '支付备份集群正常。', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
('2026-03-27', 'warning', 85, '2026-03-28', '支付主集群交易量达到峰值，需关注响应时间。', 65, '2026-03-28', '支付备份集群负载较高。', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
('2026-03-26', 'normal', 65, '2026-03-28', '支付主集群运行正常。', 45, '2026-03-28', '支付备份集群正常。', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
('2026-03-25', 'normal', 62, '2026-03-28', '支付主集群运行正常。', 42, '2026-03-28', '支付备份集群正常。', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
('2026-03-24', 'normal', 58, '2026-03-28', '支付主集群运行正常。', 38, '2026-03-28', '支付备份集群正常。', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb')
ON CONFLICT (report_date, business_system_id) DO NOTHING;

-- ============================================
-- 2. 为订单系统插入日报数据（7天）
-- ============================================
INSERT INTO daily_reports (report_date, system_status, wx_cluster_eps_rate, wx_cluster_eps_peak_date, wx_cluster_insight, nf_cluster_eps_rate, nf_cluster_eps_peak_date, nf_cluster_insight, business_system_id) VALUES
('2026-03-30', 'normal', 90, '2026-03-28', '订单主集群订单处理量稳定，成功率99.8%。', 70, '2026-03-28', '订单备份集群运行正常。', 'cccccccc-cccc-cccc-cccc-cccccccccccc'),
('2026-03-29', 'normal', 88, '2026-03-28', '订单主集群订单量平稳。', 68, '2026-03-28', '订单备份集群正常。', 'cccccccc-cccc-cccc-cccc-cccccccccccc'),
('2026-03-28', 'normal', 82, '2026-03-28', '订单主集群订单量略有上升。', 62, '2026-03-28', '订单备份集群正常。', 'cccccccc-cccc-cccc-cccc-cccccccccccc'),
('2026-03-27', 'warning', 95, '2026-03-28', '订单主集群订单量达到峰值，库存同步延迟需关注。', 78, '2026-03-28', '订单备份集群负载较高。', 'cccccccc-cccc-cccc-cccc-cccccccccccc'),
('2026-03-26', 'normal', 78, '2026-03-28', '订单主集群运行正常。', 58, '2026-03-28', '订单备份集群正常。', 'cccccccc-cccc-cccc-cccc-cccccccccccc'),
('2026-03-25', 'normal', 75, '2026-03-28', '订单主集群运行正常。', 55, '2026-03-28', '订单备份集群正常。', 'cccccccc-cccc-cccc-cccc-cccccccccccc'),
('2026-03-24', 'normal', 70, '2026-03-28', '订单主集群运行正常。', 50, '2026-03-28', '订单备份集群正常。', 'cccccccc-cccc-cccc-cccc-cccccccccccc')
ON CONFLICT (report_date, business_system_id) DO NOTHING;

-- ============================================
-- 3. 为支付中心插入日志指标数据（7天）
-- ============================================
-- 2026-03-30
INSERT INTO log_metrics (cluster_id, report_date, metric_name, metric_name_en, layer, today_max, today_avg, yesterday_max, yesterday_avg, historical_max, historical_max_date, sla_threshold, unit, change_rate, health_status) VALUES
('33333333-3333-3333-3333-333333333333', '2026-03-30', 'Collector EPS', 'Collector EPS', 'access', 55, 45, 58, 48, 70, '2026-03-27', 80, 'w', -5.17, 'healthy'),
('33333333-3333-3333-3333-333333333333', '2026-03-30', 'Kafka写入流量', 'Kafka Write Traffic', 'buffer', 95, 78, 100, 82, 120, '2026-03-27', 150, 'MB/s', -5.0, 'healthy'),
('33333333-3333-3333-3333-333333333333', '2026-03-30', '磁盘使用率', 'Disk Usage', 'storage', 68, 62, 65, 60, 75, '2026-03-27', 80, '%', 4.62, 'healthy'),
('33333333-3333-3333-3333-333333333333', '2026-03-30', 'CPU使用率', 'CPU Usage', 'application', 42, 35, 45, 38, 55, '2026-03-27', 70, '%', -6.67, 'healthy'),
('33333333-3333-3333-3333-333333333333', '2026-03-30', '平均搜索耗时', 'Avg Search Latency', 'application', 12, 10, 13, 11, 18, '2026-03-27', 30, 'ms', -7.69, 'healthy'),
('33333333-3333-3333-3333-333333333333', '2026-03-30', '日志入库耗时', 'Log Ingest Latency', 'storage', 7, 5, 8, 6, 12, '2026-03-27', 15, 'ms', -12.5, 'healthy'),
('33333333-3333-3333-3333-333333333333', '2026-03-30', '监控延迟', 'Monitor Latency', 'application', 4, 3, 5, 4, 8, '2026-03-27', 10, 'ms', -20.0, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-30', 'Collector EPS', 'Collector EPS', 'access', 35, 28, 38, 30, 45, '2026-03-27', 50, 'w', -6.67, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-30', 'Kafka写入流量', 'Kafka Write Traffic', 'buffer', 70, 55, 75, 60, 90, '2026-03-27', 100, 'MB/s', -6.67, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-30', '磁盘使用率', 'Disk Usage', 'storage', 58, 52, 55, 50, 68, '2026-03-27', 80, '%', 5.45, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-30', 'CPU使用率', 'CPU Usage', 'application', 32, 26, 35, 28, 45, '2026-03-27', 70, '%', -5.71, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-30', '平均搜索耗时', 'Avg Search Latency', 'application', 10, 8, 11, 9, 15, '2026-03-27', 30, 'ms', -9.09, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-30', '日志入库耗时', 'Log Ingest Latency', 'storage', 5, 4, 6, 5, 10, '2026-03-27', 15, 'ms', -16.67, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-30', '监控延迟', 'Monitor Latency', 'application', 3, 2, 4, 3, 6, '2026-03-27', 10, 'ms', -25.0, 'healthy')
ON CONFLICT (cluster_id, report_date, metric_name) DO NOTHING;

-- 2026-03-29
INSERT INTO log_metrics (cluster_id, report_date, metric_name, metric_name_en, layer, today_max, today_avg, yesterday_max, yesterday_avg, historical_max, historical_max_date, sla_threshold, unit, change_rate, health_status) VALUES
('33333333-3333-3333-3333-333333333333', '2026-03-29', 'Collector EPS', 'Collector EPS', 'access', 58, 48, 55, 45, 70, '2026-03-27', 80, 'w', 5.56, 'healthy'),
('33333333-3333-3333-3333-333333333333', '2026-03-29', 'Kafka写入流量', 'Kafka Write Traffic', 'buffer', 100, 82, 95, 78, 120, '2026-03-27', 150, 'MB/s', 5.13, 'healthy'),
('33333333-3333-3333-3333-333333333333', '2026-03-29', '磁盘使用率', 'Disk Usage', 'storage', 65, 60, 62, 58, 75, '2026-03-27', 80, '%', 3.33, 'healthy'),
('33333333-3333-3333-3333-333333333333', '2026-03-29', 'CPU使用率', 'CPU Usage', 'application', 45, 38, 42, 35, 55, '2026-03-27', 70, '%', 8.57, 'healthy'),
('33333333-3333-3333-3333-333333333333', '2026-03-29', '平均搜索耗时', 'Avg Search Latency', 'application', 13, 11, 12, 10, 18, '2026-03-27', 30, 'ms', 10.0, 'healthy'),
('33333333-3333-3333-3333-333333333333', '2026-03-29', '日志入库耗时', 'Log Ingest Latency', 'storage', 8, 6, 7, 5, 12, '2026-03-27', 15, 'ms', 16.67, 'healthy'),
('33333333-3333-3333-3333-333333333333', '2026-03-29', '监控延迟', 'Monitor Latency', 'application', 5, 4, 4, 3, 8, '2026-03-27', 10, 'ms', 25.0, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-29', 'Collector EPS', 'Collector EPS', 'access', 38, 30, 35, 28, 45, '2026-03-27', 50, 'w', 7.14, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-29', 'Kafka写入流量', 'Kafka Write Traffic', 'buffer', 75, 60, 70, 55, 90, '2026-03-27', 100, 'MB/s', 7.14, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-29', '磁盘使用率', 'Disk Usage', 'storage', 55, 50, 52, 48, 68, '2026-03-27', 80, '%', 4.0, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-29', 'CPU使用率', 'CPU Usage', 'application', 35, 28, 32, 26, 45, '2026-03-27', 70, '%', 7.69, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-29', '平均搜索耗时', 'Avg Search Latency', 'application', 11, 9, 10, 8, 15, '2026-03-27', 30, 'ms', 11.11, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-29', '日志入库耗时', 'Log Ingest Latency', 'storage', 6, 5, 5, 4, 10, '2026-03-27', 15, 'ms', 20.0, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-29', '监控延迟', 'Monitor Latency', 'application', 4, 3, 3, 2, 6, '2026-03-27', 10, 'ms', 33.33, 'healthy')
ON CONFLICT (cluster_id, report_date, metric_name) DO NOTHING;

-- 2026-03-28
INSERT INTO log_metrics (cluster_id, report_date, metric_name, metric_name_en, layer, today_max, today_avg, yesterday_max, yesterday_avg, historical_max, historical_max_date, sla_threshold, unit, change_rate, health_status) VALUES
('33333333-3333-3333-3333-333333333333', '2026-03-28', 'Collector EPS', 'Collector EPS', 'access', 55, 45, 52, 42, 70, '2026-03-27', 80, 'w', 5.88, 'healthy'),
('33333333-3333-3333-3333-333333333333', '2026-03-28', 'Kafka写入流量', 'Kafka Write Traffic', 'buffer', 95, 78, 90, 75, 120, '2026-03-27', 150, 'MB/s', 4.0, 'healthy'),
('33333333-3333-3333-3333-333333333333', '2026-03-28', '磁盘使用率', 'Disk Usage', 'storage', 62, 58, 60, 55, 75, '2026-03-27', 80, '%', 3.45, 'healthy'),
('33333333-3333-3333-3333-333333333333', '2026-03-28', 'CPU使用率', 'CPU Usage', 'application', 42, 35, 40, 33, 55, '2026-03-27', 70, '%', 6.06, 'healthy'),
('33333333-3333-3333-3333-333333333333', '2026-03-28', '平均搜索耗时', 'Avg Search Latency', 'application', 12, 10, 11, 9, 18, '2026-03-27', 30, 'ms', 10.0, 'healthy'),
('33333333-3333-3333-3333-333333333333', '2026-03-28', '日志入库耗时', 'Log Ingest Latency', 'storage', 7, 5, 6, 5, 12, '2026-03-27', 15, 'ms', 0.0, 'healthy'),
('33333333-3333-3333-3333-333333333333', '2026-03-28', '监控延迟', 'Monitor Latency', 'application', 4, 3, 4, 3, 8, '2026-03-27', 10, 'ms', 0.0, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-28', 'Collector EPS', 'Collector EPS', 'access', 35, 28, 33, 26, 45, '2026-03-27', 50, 'w', 5.0, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-28', 'Kafka写入流量', 'Kafka Write Traffic', 'buffer', 70, 55, 65, 52, 90, '2026-03-27', 100, 'MB/s', 5.77, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-28', '磁盘使用率', 'Disk Usage', 'storage', 52, 48, 50, 45, 68, '2026-03-27', 80, '%', 4.0, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-28', 'CPU使用率', 'CPU Usage', 'application', 32, 26, 30, 24, 45, '2026-03-27', 70, '%', 6.67, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-28', '平均搜索耗时', 'Avg Search Latency', 'application', 10, 8, 9, 7, 15, '2026-03-27', 30, 'ms', 12.5, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-28', '日志入库耗时', 'Log Ingest Latency', 'storage', 5, 4, 5, 4, 10, '2026-03-27', 15, 'ms', 0.0, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-28', '监控延迟', 'Monitor Latency', 'application', 3, 2, 3, 2, 6, '2026-03-27', 10, 'ms', 0.0, 'healthy')
ON CONFLICT (cluster_id, report_date, metric_name) DO NOTHING;

-- 2026-03-27 高流量日
INSERT INTO log_metrics (cluster_id, report_date, metric_name, metric_name_en, layer, today_max, today_avg, yesterday_max, yesterday_avg, historical_max, historical_max_date, sla_threshold, unit, change_rate, health_status) VALUES
('33333333-3333-3333-3333-333333333333', '2026-03-27', 'Collector EPS', 'Collector EPS', 'access', 70, 58, 55, 45, 70, '2026-03-27', 80, 'w', 28.89, 'warning'),
('33333333-3333-3333-3333-333333333333', '2026-03-27', 'Kafka写入流量', 'Kafka Write Traffic', 'buffer', 120, 98, 95, 78, 120, '2026-03-27', 150, 'MB/s', 25.64, 'healthy'),
('33333333-3333-3333-3333-333333333333', '2026-03-27', '磁盘使用率', 'Disk Usage', 'storage', 72, 65, 62, 58, 75, '2026-03-27', 80, '%', 12.07, 'warning'),
('33333333-3333-3333-3333-333333333333', '2026-03-27', 'CPU使用率', 'CPU Usage', 'application', 55, 45, 42, 35, 55, '2026-03-27', 70, '%', 28.57, 'warning'),
('33333333-3333-3333-3333-333333333333', '2026-03-27', '平均搜索耗时', 'Avg Search Latency', 'application', 16, 13, 12, 10, 18, '2026-03-27', 30, 'ms', 30.0, 'healthy'),
('33333333-3333-3333-3333-333333333333', '2026-03-27', '日志入库耗时', 'Log Ingest Latency', 'storage', 10, 8, 7, 5, 12, '2026-03-27', 15, 'ms', 60.0, 'healthy'),
('33333333-3333-3333-3333-333333333333', '2026-03-27', '监控延迟', 'Monitor Latency', 'application', 6, 5, 4, 3, 8, '2026-03-27', 10, 'ms', 66.67, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-27', 'Collector EPS', 'Collector EPS', 'access', 45, 38, 35, 28, 45, '2026-03-27', 50, 'w', 35.71, 'warning'),
('44444444-4444-4444-4444-444444444444', '2026-03-27', 'Kafka写入流量', 'Kafka Write Traffic', 'buffer', 90, 72, 70, 55, 90, '2026-03-27', 100, 'MB/s', 30.91, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-27', '磁盘使用率', 'Disk Usage', 'storage', 62, 55, 52, 48, 68, '2026-03-27', 80, '%', 14.58, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-27', 'CPU使用率', 'CPU Usage', 'application', 42, 35, 32, 26, 45, '2026-03-27', 70, '%', 34.62, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-27', '平均搜索耗时', 'Avg Search Latency', 'application', 13, 11, 10, 8, 15, '2026-03-27', 30, 'ms', 37.5, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-27', '日志入库耗时', 'Log Ingest Latency', 'storage', 8, 6, 5, 4, 10, '2026-03-27', 15, 'ms', 50.0, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-27', '监控延迟', 'Monitor Latency', 'application', 5, 4, 3, 2, 6, '2026-03-27', 10, 'ms', 100.0, 'healthy')
ON CONFLICT (cluster_id, report_date, metric_name) DO NOTHING;

-- 2026-03-26
INSERT INTO log_metrics (cluster_id, report_date, metric_name, metric_name_en, layer, today_max, today_avg, yesterday_max, yesterday_avg, historical_max, historical_max_date, sla_threshold, unit, change_rate, health_status) VALUES
('33333333-3333-3333-3333-333333333333', '2026-03-26', 'Collector EPS', 'Collector EPS', 'access', 52, 42, 50, 40, 70, '2026-03-27', 80, 'w', 4.0, 'healthy'),
('33333333-3333-3333-3333-333333333333', '2026-03-26', 'Kafka写入流量', 'Kafka Write Traffic', 'buffer', 90, 75, 85, 70, 120, '2026-03-27', 150, 'MB/s', 5.0, 'healthy'),
('33333333-3333-3333-3333-333333333333', '2026-03-26', '磁盘使用率', 'Disk Usage', 'storage', 60, 55, 58, 52, 75, '2026-03-27', 80, '%', 3.57, 'healthy'),
('33333333-3333-3333-3333-333333333333', '2026-03-26', 'CPU使用率', 'CPU Usage', 'application', 40, 33, 38, 31, 55, '2026-03-27', 70, '%', 5.71, 'healthy'),
('33333333-3333-3333-3333-333333333333', '2026-03-26', '平均搜索耗时', 'Avg Search Latency', 'application', 11, 9, 10, 8, 18, '2026-03-27', 30, 'ms', 11.11, 'healthy'),
('33333333-3333-3333-3333-333333333333', '2026-03-26', '日志入库耗时', 'Log Ingest Latency', 'storage', 6, 5, 6, 5, 12, '2026-03-27', 15, 'ms', 0.0, 'healthy'),
('33333333-3333-3333-3333-333333333333', '2026-03-26', '监控延迟', 'Monitor Latency', 'application', 4, 3, 4, 3, 8, '2026-03-27', 10, 'ms', 0.0, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-26', 'Collector EPS', 'Collector EPS', 'access', 33, 26, 30, 24, 45, '2026-03-27', 50, 'w', 5.0, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-26', 'Kafka写入流量', 'Kafka Write Traffic', 'buffer', 65, 52, 60, 48, 90, '2026-03-27', 100, 'MB/s', 6.67, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-26', '磁盘使用率', 'Disk Usage', 'storage', 50, 45, 48, 42, 68, '2026-03-27', 80, '%', 5.88, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-26', 'CPU使用率', 'CPU Usage', 'application', 30, 24, 28, 22, 45, '2026-03-27', 70, '%', 7.14, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-26', '平均搜索耗时', 'Avg Search Latency', 'application', 9, 7, 8, 6, 15, '2026-03-27', 30, 'ms', 14.29, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-26', '日志入库耗时', 'Log Ingest Latency', 'storage', 5, 4, 4, 3, 10, '2026-03-27', 15, 'ms', 25.0, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-26', '监控延迟', 'Monitor Latency', 'application', 3, 2, 2, 2, 6, '2026-03-27', 10, 'ms', 0.0, 'healthy')
ON CONFLICT (cluster_id, report_date, metric_name) DO NOTHING;

-- 2026-03-25
INSERT INTO log_metrics (cluster_id, report_date, metric_name, metric_name_en, layer, today_max, today_avg, yesterday_max, yesterday_avg, historical_max, historical_max_date, sla_threshold, unit, change_rate, health_status) VALUES
('33333333-3333-3333-3333-333333333333', '2026-03-25', 'Collector EPS', 'Collector EPS', 'access', 50, 40, 48, 38, 70, '2026-03-27', 80, 'w', 4.17, 'healthy'),
('33333333-3333-3333-3333-333333333333', '2026-03-25', 'Kafka写入流量', 'Kafka Write Traffic', 'buffer', 85, 70, 82, 68, 120, '2026-03-27', 150, 'MB/s', 3.03, 'healthy'),
('33333333-3333-3333-3333-333333333333', '2026-03-25', '磁盘使用率', 'Disk Usage', 'storage', 58, 52, 55, 50, 75, '2026-03-27', 80, '%', 4.0, 'healthy'),
('33333333-3333-3333-3333-333333333333', '2026-03-25', 'CPU使用率', 'CPU Usage', 'application', 38, 31, 35, 28, 55, '2026-03-27', 70, '%', 6.45, 'healthy'),
('33333333-3333-3333-3333-333333333333', '2026-03-25', '平均搜索耗时', 'Avg Search Latency', 'application', 10, 8, 10, 8, 18, '2026-03-27', 30, 'ms', 0.0, 'healthy'),
('33333333-3333-3333-3333-333333333333', '2026-03-25', '日志入库耗时', 'Log Ingest Latency', 'storage', 6, 5, 5, 4, 12, '2026-03-27', 15, 'ms', 20.0, 'healthy'),
('33333333-3333-3333-3333-333333333333', '2026-03-25', '监控延迟', 'Monitor Latency', 'application', 4, 3, 4, 3, 8, '2026-03-27', 10, 'ms', 0.0, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-25', 'Collector EPS', 'Collector EPS', 'access', 30, 24, 28, 22, 45, '2026-03-27', 50, 'w', 5.0, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-25', 'Kafka写入流量', 'Kafka Write Traffic', 'buffer', 60, 48, 58, 45, 90, '2026-03-27', 100, 'MB/s', 4.35, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-25', '磁盘使用率', 'Disk Usage', 'storage', 48, 42, 45, 40, 68, '2026-03-27', 80, '%', 5.0, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-25', 'CPU使用率', 'CPU Usage', 'application', 28, 22, 26, 20, 45, '2026-03-27', 70, '%', 7.69, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-25', '平均搜索耗时', 'Avg Search Latency', 'application', 8, 6, 8, 6, 15, '2026-03-27', 30, 'ms', 0.0, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-25', '日志入库耗时', 'Log Ingest Latency', 'storage', 4, 3, 4, 3, 10, '2026-03-27', 15, 'ms', 0.0, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-25', '监控延迟', 'Monitor Latency', 'application', 2, 2, 2, 2, 6, '2026-03-27', 10, 'ms', 0.0, 'healthy')
ON CONFLICT (cluster_id, report_date, metric_name) DO NOTHING;

-- 2026-03-24
INSERT INTO log_metrics (cluster_id, report_date, metric_name, metric_name_en, layer, today_max, today_avg, yesterday_max, yesterday_avg, historical_max, historical_max_date, sla_threshold, unit, change_rate, health_status) VALUES
('33333333-3333-3333-3333-333333333333', '2026-03-24', 'Collector EPS', 'Collector EPS', 'access', 48, 38, 45, 35, 70, '2026-03-27', 80, 'w', 5.41, 'healthy'),
('33333333-3333-3333-3333-333333333333', '2026-03-24', 'Kafka写入流量', 'Kafka Write Traffic', 'buffer', 82, 68, 78, 65, 120, '2026-03-27', 150, 'MB/s', 4.62, 'healthy'),
('33333333-3333-3333-3333-333333333333', '2026-03-24', '磁盘使用率', 'Disk Usage', 'storage', 55, 50, 52, 48, 75, '2026-03-27', 80, '%', 4.17, 'healthy'),
('33333333-3333-3333-3333-333333333333', '2026-03-24', 'CPU使用率', 'CPU Usage', 'application', 35, 28, 33, 26, 55, '2026-03-27', 70, '%', 5.56, 'healthy'),
('33333333-3333-3333-3333-333333333333', '2026-03-24', '平均搜索耗时', 'Avg Search Latency', 'application', 10, 8, 9, 7, 18, '2026-03-27', 30, 'ms', 14.29, 'healthy'),
('33333333-3333-3333-3333-333333333333', '2026-03-24', '日志入库耗时', 'Log Ingest Latency', 'storage', 5, 4, 5, 4, 12, '2026-03-27', 15, 'ms', 0.0, 'healthy'),
('33333333-3333-3333-3333-333333333333', '2026-03-24', '监控延迟', 'Monitor Latency', 'application', 4, 3, 3, 2, 8, '2026-03-27', 10, 'ms', 33.33, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-24', 'Collector EPS', 'Collector EPS', 'access', 28, 22, 26, 20, 45, '2026-03-27', 50, 'w', 5.0, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-24', 'Kafka写入流量', 'Kafka Write Traffic', 'buffer', 58, 45, 55, 42, 90, '2026-03-27', 100, 'MB/s', 5.88, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-24', '磁盘使用率', 'Disk Usage', 'storage', 45, 40, 42, 38, 68, '2026-03-27', 80, '%', 5.26, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-24', 'CPU使用率', 'CPU Usage', 'application', 26, 20, 24, 18, 45, '2026-03-27', 70, '%', 8.0, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-24', '平均搜索耗时', 'Avg Search Latency', 'application', 8, 6, 7, 5, 15, '2026-03-27', 30, 'ms', 20.0, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-24', '日志入库耗时', 'Log Ingest Latency', 'storage', 4, 3, 3, 2, 10, '2026-03-27', 15, 'ms', 33.33, 'healthy'),
('44444444-4444-4444-4444-444444444444', '2026-03-24', '监控延迟', 'Monitor Latency', 'application', 2, 2, 2, 1, 6, '2026-03-27', 10, 'ms', 0.0, 'healthy')
ON CONFLICT (cluster_id, report_date, metric_name) DO NOTHING;

-- ============================================
-- 4. 为订单系统插入日志指标数据（7天）
-- ============================================
-- 2026-03-30
INSERT INTO log_metrics (cluster_id, report_date, metric_name, metric_name_en, layer, today_max, today_avg, yesterday_max, yesterday_avg, historical_max, historical_max_date, sla_threshold, unit, change_rate, health_status) VALUES
('55555555-5555-5555-5555-555555555555', '2026-03-30', 'Collector EPS', 'Collector EPS', 'access', 72, 60, 75, 62, 90, '2026-03-27', 100, 'w', -3.23, 'healthy'),
('55555555-5555-5555-5555-555555555555', '2026-03-30', 'Kafka写入流量', 'Kafka Write Traffic', 'buffer', 130, 105, 135, 110, 160, '2026-03-27', 200, 'MB/s', -4.55, 'healthy'),
('55555555-5555-5555-5555-555555555555', '2026-03-30', '磁盘使用率', 'Disk Usage', 'storage', 70, 65, 68, 62, 78, '2026-03-27', 80, '%', 3.23, 'healthy'),
('55555555-5555-5555-5555-555555555555', '2026-03-30', 'CPU使用率', 'CPU Usage', 'application', 48, 40, 50, 42, 62, '2026-03-27', 70, '%', -4.76, 'healthy'),
('55555555-5555-5555-5555-555555555555', '2026-03-30', '平均搜索耗时', 'Avg Search Latency', 'application', 14, 12, 15, 13, 22, '2026-03-27', 30, 'ms', -7.69, 'healthy'),
('55555555-5555-5555-5555-555555555555', '2026-03-30', '日志入库耗时', 'Log Ingest Latency', 'storage', 9, 7, 10, 8, 14, '2026-03-27', 15, 'ms', -12.5, 'healthy'),
('55555555-5555-5555-5555-555555555555', '2026-03-30', '监控延迟', 'Monitor Latency', 'application', 5, 4, 6, 5, 9, '2026-03-27', 10, 'ms', -20.0, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-30', 'Collector EPS', 'Collector EPS', 'access', 52, 42, 55, 45, 68, '2026-03-27', 80, 'w', -6.67, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-30', 'Kafka写入流量', 'Kafka Write Traffic', 'buffer', 95, 78, 100, 82, 120, '2026-03-27', 150, 'MB/s', -4.88, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-30', '磁盘使用率', 'Disk Usage', 'storage', 62, 56, 58, 52, 72, '2026-03-27', 80, '%', 5.77, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-30', 'CPU使用率', 'CPU Usage', 'application', 38, 32, 40, 34, 52, '2026-03-27', 70, '%', -5.88, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-30', '平均搜索耗时', 'Avg Search Latency', 'application', 12, 10, 13, 11, 18, '2026-03-27', 30, 'ms', -9.09, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-30', '日志入库耗时', 'Log Ingest Latency', 'storage', 7, 5, 8, 6, 11, '2026-03-27', 15, 'ms', -16.67, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-30', '监控延迟', 'Monitor Latency', 'application', 4, 3, 5, 4, 7, '2026-03-27', 10, 'ms', -25.0, 'healthy')
ON CONFLICT (cluster_id, report_date, metric_name) DO NOTHING;

-- 2026-03-29
INSERT INTO log_metrics (cluster_id, report_date, metric_name, metric_name_en, layer, today_max, today_avg, yesterday_max, yesterday_avg, historical_max, historical_max_date, sla_threshold, unit, change_rate, health_status) VALUES
('55555555-5555-5555-5555-555555555555', '2026-03-29', 'Collector EPS', 'Collector EPS', 'access', 75, 62, 72, 58, 90, '2026-03-27', 100, 'w', 6.90, 'healthy'),
('55555555-5555-5555-5555-555555555555', '2026-03-29', 'Kafka写入流量', 'Kafka Write Traffic', 'buffer', 135, 110, 130, 105, 160, '2026-03-27', 200, 'MB/s', 4.76, 'healthy'),
('55555555-5555-5555-5555-555555555555', '2026-03-29', '磁盘使用率', 'Disk Usage', 'storage', 68, 62, 65, 58, 78, '2026-03-27', 80, '%', 3.45, 'healthy'),
('55555555-5555-5555-5555-555555555555', '2026-03-29', 'CPU使用率', 'CPU Usage', 'application', 50, 42, 48, 40, 62, '2026-03-27', 70, '%', 5.0, 'healthy'),
('55555555-5555-5555-5555-555555555555', '2026-03-29', '平均搜索耗时', 'Avg Search Latency', 'application', 15, 13, 14, 12, 22, '2026-03-27', 30, 'ms', 8.33, 'healthy'),
('55555555-5555-5555-5555-555555555555', '2026-03-29', '日志入库耗时', 'Log Ingest Latency', 'storage', 10, 8, 9, 7, 14, '2026-03-27', 15, 'ms', 14.29, 'healthy'),
('55555555-5555-5555-5555-555555555555', '2026-03-29', '监控延迟', 'Monitor Latency', 'application', 6, 5, 5, 4, 9, '2026-03-27', 10, 'ms', 25.0, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-29', 'Collector EPS', 'Collector EPS', 'access', 55, 45, 52, 42, 68, '2026-03-27', 80, 'w', 7.14, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-29', 'Kafka写入流量', 'Kafka Write Traffic', 'buffer', 100, 82, 95, 78, 120, '2026-03-27', 150, 'MB/s', 5.13, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-29', '磁盘使用率', 'Disk Usage', 'storage', 58, 52, 55, 50, 72, '2026-03-27', 80, '%', 4.0, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-29', 'CPU使用率', 'CPU Usage', 'application', 40, 34, 38, 32, 52, '2026-03-27', 70, '%', 5.88, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-29', '平均搜索耗时', 'Avg Search Latency', 'application', 13, 11, 12, 10, 18, '2026-03-27', 30, 'ms', 10.0, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-29', '日志入库耗时', 'Log Ingest Latency', 'storage', 8, 6, 7, 5, 11, '2026-03-27', 15, 'ms', 20.0, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-29', '监控延迟', 'Monitor Latency', 'application', 5, 4, 4, 3, 7, '2026-03-27', 10, 'ms', 33.33, 'healthy')
ON CONFLICT (cluster_id, report_date, metric_name) DO NOTHING;

-- 2026-03-28
INSERT INTO log_metrics (cluster_id, report_date, metric_name, metric_name_en, layer, today_max, today_avg, yesterday_max, yesterday_avg, historical_max, historical_max_date, sla_threshold, unit, change_rate, health_status) VALUES
('55555555-5555-5555-5555-555555555555', '2026-03-28', 'Collector EPS', 'Collector EPS', 'access', 72, 58, 68, 55, 90, '2026-03-27', 100, 'w', 5.45, 'healthy'),
('55555555-5555-5555-5555-555555555555', '2026-03-28', 'Kafka写入流量', 'Kafka Write Traffic', 'buffer', 130, 105, 125, 100, 160, '2026-03-27', 200, 'MB/s', 5.0, 'healthy'),
('55555555-5555-5555-5555-555555555555', '2026-03-28', '磁盘使用率', 'Disk Usage', 'storage', 65, 58, 62, 55, 78, '2026-03-27', 80, '%', 3.64, 'healthy'),
('55555555-5555-5555-5555-555555555555', '2026-03-28', 'CPU使用率', 'CPU Usage', 'application', 48, 40, 45, 38, 62, '2026-03-27', 70, '%', 5.26, 'healthy'),
('55555555-5555-5555-5555-555555555555', '2026-03-28', '平均搜索耗时', 'Avg Search Latency', 'application', 14, 12, 13, 11, 22, '2026-03-27', 30, 'ms', 9.09, 'healthy'),
('55555555-5555-5555-5555-555555555555', '2026-03-28', '日志入库耗时', 'Log Ingest Latency', 'storage', 9, 7, 8, 6, 14, '2026-03-27', 15, 'ms', 16.67, 'healthy'),
('55555555-5555-5555-5555-555555555555', '2026-03-28', '监控延迟', 'Monitor Latency', 'application', 5, 4, 5, 4, 9, '2026-03-27', 10, 'ms', 0.0, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-28', 'Collector EPS', 'Collector EPS', 'access', 52, 42, 50, 40, 68, '2026-03-27', 80, 'w', 5.0, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-28', 'Kafka写入流量', 'Kafka Write Traffic', 'buffer', 95, 78, 90, 75, 120, '2026-03-27', 150, 'MB/s', 4.0, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-28', '磁盘使用率', 'Disk Usage', 'storage', 55, 50, 52, 48, 72, '2026-03-27', 80, '%', 4.17, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-28', 'CPU使用率', 'CPU Usage', 'application', 38, 32, 35, 28, 52, '2026-03-27', 70, '%', 7.14, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-28', '平均搜索耗时', 'Avg Search Latency', 'application', 12, 10, 11, 9, 18, '2026-03-27', 30, 'ms', 11.11, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-28', '日志入库耗时', 'Log Ingest Latency', 'storage', 7, 5, 6, 5, 11, '2026-03-27', 15, 'ms', 0.0, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-28', '监控延迟', 'Monitor Latency', 'application', 4, 3, 4, 3, 7, '2026-03-27', 10, 'ms', 0.0, 'healthy')
ON CONFLICT (cluster_id, report_date, metric_name) DO NOTHING;

-- 2026-03-27 高流量日
INSERT INTO log_metrics (cluster_id, report_date, metric_name, metric_name_en, layer, today_max, today_avg, yesterday_max, yesterday_avg, historical_max, historical_max_date, sla_threshold, unit, change_rate, health_status) VALUES
('55555555-5555-5555-5555-555555555555', '2026-03-27', 'Collector EPS', 'Collector EPS', 'access', 90, 75, 72, 58, 90, '2026-03-27', 100, 'w', 29.31, 'warning'),
('55555555-5555-5555-5555-555555555555', '2026-03-27', 'Kafka写入流量', 'Kafka Write Traffic', 'buffer', 160, 130, 130, 105, 160, '2026-03-27', 200, 'MB/s', 23.81, 'healthy'),
('55555555-5555-5555-5555-555555555555', '2026-03-27', '磁盘使用率', 'Disk Usage', 'storage', 75, 68, 65, 58, 78, '2026-03-27', 80, '%', 12.07, 'warning'),
('55555555-5555-5555-5555-555555555555', '2026-03-27', 'CPU使用率', 'CPU Usage', 'application', 62, 52, 48, 40, 62, '2026-03-27', 70, '%', 30.0, 'warning'),
('55555555-5555-5555-5555-555555555555', '2026-03-27', '平均搜索耗时', 'Avg Search Latency', 'application', 20, 17, 14, 12, 22, '2026-03-27', 30, 'ms', 41.67, 'healthy'),
('55555555-5555-5555-5555-555555555555', '2026-03-27', '日志入库耗时', 'Log Ingest Latency', 'storage', 12, 10, 9, 7, 14, '2026-03-27', 15, 'ms', 42.86, 'healthy'),
('55555555-5555-5555-5555-555555555555', '2026-03-27', '监控延迟', 'Monitor Latency', 'application', 8, 6, 5, 4, 9, '2026-03-27', 10, 'ms', 50.0, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-27', 'Collector EPS', 'Collector EPS', 'access', 68, 55, 52, 42, 68, '2026-03-27', 80, 'w', 30.95, 'warning'),
('66666666-6666-6666-6666-666666666666', '2026-03-27', 'Kafka写入流量', 'Kafka Write Traffic', 'buffer', 120, 98, 95, 78, 120, '2026-03-27', 150, 'MB/s', 25.64, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-27', '磁盘使用率', 'Disk Usage', 'storage', 70, 62, 55, 50, 72, '2026-03-27', 80, '%', 15.38, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-27', 'CPU使用率', 'CPU Usage', 'application', 52, 42, 38, 32, 52, '2026-03-27', 70, '%', 31.25, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-27', '平均搜索耗时', 'Avg Search Latency', 'application', 16, 13, 12, 10, 18, '2026-03-27', 30, 'ms', 30.0, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-27', '日志入库耗时', 'Log Ingest Latency', 'storage', 10, 8, 7, 5, 11, '2026-03-27', 15, 'ms', 60.0, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-27', '监控延迟', 'Monitor Latency', 'application', 6, 5, 4, 3, 7, '2026-03-27', 10, 'ms', 66.67, 'healthy')
ON CONFLICT (cluster_id, report_date, metric_name) DO NOTHING;

-- 2026-03-26
INSERT INTO log_metrics (cluster_id, report_date, metric_name, metric_name_en, layer, today_max, today_avg, yesterday_max, yesterday_avg, historical_max, historical_max_date, sla_threshold, unit, change_rate, health_status) VALUES
('55555555-5555-5555-5555-555555555555', '2026-03-26', 'Collector EPS', 'Collector EPS', 'access', 68, 55, 65, 52, 90, '2026-03-27', 100, 'w', 5.77, 'healthy'),
('55555555-5555-5555-5555-555555555555', '2026-03-26', 'Kafka写入流量', 'Kafka Write Traffic', 'buffer', 125, 100, 120, 95, 160, '2026-03-27', 200, 'MB/s', 5.26, 'healthy'),
('55555555-5555-5555-5555-555555555555', '2026-03-26', '磁盘使用率', 'Disk Usage', 'storage', 62, 55, 60, 52, 78, '2026-03-27', 80, '%', 3.85, 'healthy'),
('55555555-5555-5555-5555-555555555555', '2026-03-26', 'CPU使用率', 'CPU Usage', 'application', 45, 38, 42, 35, 62, '2026-03-27', 70, '%', 6.67, 'healthy'),
('55555555-5555-5555-5555-555555555555', '2026-03-26', '平均搜索耗时', 'Avg Search Latency', 'application', 13, 11, 12, 10, 22, '2026-03-27', 30, 'ms', 10.0, 'healthy'),
('55555555-5555-5555-5555-555555555555', '2026-03-26', '日志入库耗时', 'Log Ingest Latency', 'storage', 8, 6, 7, 5, 14, '2026-03-27', 15, 'ms', 20.0, 'healthy'),
('55555555-5555-5555-5555-555555555555', '2026-03-26', '监控延迟', 'Monitor Latency', 'application', 5, 4, 5, 4, 9, '2026-03-27', 10, 'ms', 0.0, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-26', 'Collector EPS', 'Collector EPS', 'access', 50, 40, 48, 38, 68, '2026-03-27', 80, 'w', 5.26, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-26', 'Kafka写入流量', 'Kafka Write Traffic', 'buffer', 90, 75, 85, 70, 120, '2026-03-27', 150, 'MB/s', 5.0, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-26', '磁盘使用率', 'Disk Usage', 'storage', 52, 48, 50, 45, 72, '2026-03-27', 80, '%', 4.44, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-26', 'CPU使用率', 'CPU Usage', 'application', 35, 28, 33, 26, 52, '2026-03-27', 70, '%', 7.69, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-26', '平均搜索耗时', 'Avg Search Latency', 'application', 11, 9, 10, 8, 18, '2026-03-27', 30, 'ms', 12.5, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-26', '日志入库耗时', 'Log Ingest Latency', 'storage', 6, 5, 6, 5, 11, '2026-03-27', 15, 'ms', 0.0, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-26', '监控延迟', 'Monitor Latency', 'application', 4, 3, 4, 3, 7, '2026-03-27', 10, 'ms', 0.0, 'healthy')
ON CONFLICT (cluster_id, report_date, metric_name) DO NOTHING;

-- 2026-03-25
INSERT INTO log_metrics (cluster_id, report_date, metric_name, metric_name_en, layer, today_max, today_avg, yesterday_max, yesterday_avg, historical_max, historical_max_date, sla_threshold, unit, change_rate, health_status) VALUES
('55555555-5555-5555-5555-555555555555', '2026-03-25', 'Collector EPS', 'Collector EPS', 'access', 65, 52, 62, 50, 90, '2026-03-27', 100, 'w', 4.0, 'healthy'),
('55555555-5555-5555-5555-555555555555', '2026-03-25', 'Kafka写入流量', 'Kafka Write Traffic', 'buffer', 120, 95, 115, 92, 160, '2026-03-27', 200, 'MB/s', 3.26, 'healthy'),
('55555555-5555-5555-5555-555555555555', '2026-03-25', '磁盘使用率', 'Disk Usage', 'storage', 60, 52, 58, 50, 78, '2026-03-27', 80, '%', 4.0, 'healthy'),
('55555555-5555-5555-5555-555555555555', '2026-03-25', 'CPU使用率', 'CPU Usage', 'application', 42, 35, 40, 33, 62, '2026-03-27', 70, '%', 6.06, 'healthy'),
('55555555-5555-5555-5555-555555555555', '2026-03-25', '平均搜索耗时', 'Avg Search Latency', 'application', 12, 10, 11, 9, 22, '2026-03-27', 30, 'ms', 11.11, 'healthy'),
('55555555-5555-5555-5555-555555555555', '2026-03-25', '日志入库耗时', 'Log Ingest Latency', 'storage', 7, 5, 7, 5, 14, '2026-03-27', 15, 'ms', 0.0, 'healthy'),
('55555555-5555-5555-5555-555555555555', '2026-03-25', '监控延迟', 'Monitor Latency', 'application', 5, 4, 5, 4, 9, '2026-03-27', 10, 'ms', 0.0, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-25', 'Collector EPS', 'Collector EPS', 'access', 48, 38, 45, 35, 68, '2026-03-27', 80, 'w', 5.0, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-25', 'Kafka写入流量', 'Kafka Write Traffic', 'buffer', 85, 70, 82, 68, 120, '2026-03-27', 150, 'MB/s', 3.03, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-25', '磁盘使用率', 'Disk Usage', 'storage', 50, 45, 48, 42, 72, '2026-03-27', 80, '%', 4.76, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-25', 'CPU使用率', 'CPU Usage', 'application', 33, 26, 30, 24, 52, '2026-03-27', 70, '%', 8.33, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-25', '平均搜索耗时', 'Avg Search Latency', 'application', 10, 8, 9, 7, 18, '2026-03-27', 30, 'ms', 14.29, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-25', '日志入库耗时', 'Log Ingest Latency', 'storage', 6, 5, 5, 4, 11, '2026-03-27', 15, 'ms', 25.0, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-25', '监控延迟', 'Monitor Latency', 'application', 4, 3, 3, 2, 7, '2026-03-27', 10, 'ms', 33.33, 'healthy')
ON CONFLICT (cluster_id, report_date, metric_name) DO NOTHING;

-- 2026-03-24
INSERT INTO log_metrics (cluster_id, report_date, metric_name, metric_name_en, layer, today_max, today_avg, yesterday_max, yesterday_avg, historical_max, historical_max_date, sla_threshold, unit, change_rate, health_status) VALUES
('55555555-5555-5555-5555-555555555555', '2026-03-24', 'Collector EPS', 'Collector EPS', 'access', 62, 50, 60, 48, 90, '2026-03-27', 100, 'w', 4.17, 'healthy'),
('55555555-5555-5555-5555-555555555555', '2026-03-24', 'Kafka写入流量', 'Kafka Write Traffic', 'buffer', 115, 92, 110, 88, 160, '2026-03-27', 200, 'MB/s', 4.55, 'healthy'),
('55555555-5555-5555-5555-555555555555', '2026-03-24', '磁盘使用率', 'Disk Usage', 'storage', 58, 50, 55, 48, 78, '2026-03-27', 80, '%', 4.17, 'healthy'),
('55555555-5555-5555-5555-555555555555', '2026-03-24', 'CPU使用率', 'CPU Usage', 'application', 40, 33, 38, 31, 62, '2026-03-27', 70, '%', 5.71, 'healthy'),
('55555555-5555-5555-5555-555555555555', '2026-03-24', '平均搜索耗时', 'Avg Search Latency', 'application', 11, 9, 10, 8, 22, '2026-03-27', 30, 'ms', 12.5, 'healthy'),
('55555555-5555-5555-5555-555555555555', '2026-03-24', '日志入库耗时', 'Log Ingest Latency', 'storage', 7, 5, 6, 5, 14, '2026-03-27', 15, 'ms', 0.0, 'healthy'),
('55555555-5555-5555-5555-555555555555', '2026-03-24', '监控延迟', 'Monitor Latency', 'application', 5, 4, 4, 3, 9, '2026-03-27', 10, 'ms', 33.33, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-24', 'Collector EPS', 'Collector EPS', 'access', 45, 35, 42, 33, 68, '2026-03-27', 80, 'w', 5.0, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-24', 'Kafka写入流量', 'Kafka Write Traffic', 'buffer', 82, 68, 78, 65, 120, '2026-03-27', 150, 'MB/s', 4.62, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-24', '磁盘使用率', 'Disk Usage', 'storage', 48, 42, 45, 40, 72, '2026-03-27', 80, '%', 4.76, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-24', 'CPU使用率', 'CPU Usage', 'application', 30, 24, 28, 22, 52, '2026-03-27', 70, '%', 9.09, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-24', '平均搜索耗时', 'Avg Search Latency', 'application', 9, 7, 8, 6, 18, '2026-03-27', 30, 'ms', 16.67, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-24', '日志入库耗时', 'Log Ingest Latency', 'storage', 5, 4, 4, 3, 11, '2026-03-27', 15, 'ms', 33.33, 'healthy'),
('66666666-6666-6666-6666-666666666666', '2026-03-24', '监控延迟', 'Monitor Latency', 'application', 3, 2, 2, 2, 7, '2026-03-27', 10, 'ms', 0.0, 'healthy')
ON CONFLICT (cluster_id, report_date, metric_name) DO NOTHING;

-- ============================================
-- 5. 为支付中心和订单系统插入云区域数据（7天）
-- ============================================
-- 支付中心 2026-03-30
INSERT INTO cloud_regions (cluster_id, report_date, name, node_count, current_traffic, peak_traffic, region_type) VALUES
('33333333-3333-3333-3333-333333333333', '2026-03-30', '支付华东区', 80, 20, 30, 'domestic'),
('33333333-3333-3333-3333-333333333333', '2026-03-30', '支付华南区', 60, 15, 22, 'domestic'),
('44444444-4444-4444-4444-444444444444', '2026-03-30', '支付华北区', 40, 10, 15, 'domestic')
ON CONFLICT (cluster_id, report_date, name) DO NOTHING;

-- 支付中心 2026-03-29
INSERT INTO cloud_regions (cluster_id, report_date, name, node_count, current_traffic, peak_traffic, region_type) VALUES
('33333333-3333-3333-3333-333333333333', '2026-03-29', '支付华东区', 80, 21, 31, 'domestic'),
('33333333-3333-3333-3333-333333333333', '2026-03-29', '支付华南区', 60, 16, 23, 'domestic'),
('44444444-4444-4444-4444-444444444444', '2026-03-29', '支付华北区', 40, 11, 16, 'domestic')
ON CONFLICT (cluster_id, report_date, name) DO NOTHING;

-- 支付中心 2026-03-28
INSERT INTO cloud_regions (cluster_id, report_date, name, node_count, current_traffic, peak_traffic, region_type) VALUES
('33333333-3333-3333-3333-333333333333', '2026-03-28', '支付华东区', 80, 19, 28, 'domestic'),
('33333333-3333-3333-3333-333333333333', '2026-03-28', '支付华南区', 60, 14, 20, 'domestic'),
('44444444-4444-4444-4444-444444444444', '2026-03-28', '支付华北区', 40, 9, 14, 'domestic')
ON CONFLICT (cluster_id, report_date, name) DO NOTHING;

-- 支付中心 2026-03-27 高流量日
INSERT INTO cloud_regions (cluster_id, report_date, name, node_count, current_traffic, peak_traffic, region_type) VALUES
('33333333-3333-3333-3333-333333333333', '2026-03-27', '支付华东区', 80, 28, 40, 'domestic'),
('33333333-3333-3333-3333-333333333333', '2026-03-27', '支付华南区', 60, 20, 28, 'domestic'),
('44444444-4444-4444-4444-444444444444', '2026-03-27', '支付华北区', 40, 14, 20, 'domestic')
ON CONFLICT (cluster_id, report_date, name) DO NOTHING;

-- 支付中心 2026-03-26
INSERT INTO cloud_regions (cluster_id, report_date, name, node_count, current_traffic, peak_traffic, region_type) VALUES
('33333333-3333-3333-3333-333333333333', '2026-03-26', '支付华东区', 80, 18, 26, 'domestic'),
('33333333-3333-3333-3333-333333333333', '2026-03-26', '支付华南区', 60, 13, 18, 'domestic'),
('44444444-4444-4444-4444-444444444444', '2026-03-26', '支付华北区', 40, 8, 12, 'domestic')
ON CONFLICT (cluster_id, report_date, name) DO NOTHING;

-- 支付中心 2026-03-25
INSERT INTO cloud_regions (cluster_id, report_date, name, node_count, current_traffic, peak_traffic, region_type) VALUES
('33333333-3333-3333-3333-333333333333', '2026-03-25', '支付华东区', 80, 17, 25, 'domestic'),
('33333333-3333-3333-3333-333333333333', '2026-03-25', '支付华南区', 60, 12, 17, 'domestic'),
('44444444-4444-4444-4444-444444444444', '2026-03-25', '支付华北区', 40, 7, 11, 'domestic')
ON CONFLICT (cluster_id, report_date, name) DO NOTHING;

-- 支付中心 2026-03-24
INSERT INTO cloud_regions (cluster_id, report_date, name, node_count, current_traffic, peak_traffic, region_type) VALUES
('33333333-3333-3333-3333-333333333333', '2026-03-24', '支付华东区', 80, 16, 24, 'domestic'),
('33333333-3333-3333-3333-333333333333', '2026-03-24', '支付华南区', 60, 11, 16, 'domestic'),
('44444444-4444-4444-4444-444444444444', '2026-03-24', '支付华北区', 40, 6, 10, 'domestic')
ON CONFLICT (cluster_id, report_date, name) DO NOTHING;

-- 订单系统 2026-03-30
INSERT INTO cloud_regions (cluster_id, report_date, name, node_count, current_traffic, peak_traffic, region_type) VALUES
('55555555-5555-5555-5555-555555555555', '2026-03-30', '订单华东区', 100, 28, 40, 'domestic'),
('55555555-5555-5555-5555-555555555555', '2026-03-30', '订单华南区', 75, 22, 32, 'domestic'),
('66666666-6666-6666-6666-666666666666', '2026-03-30', '订单华北区', 50, 15, 22, 'domestic')
ON CONFLICT (cluster_id, report_date, name) DO NOTHING;

-- 订单系统 2026-03-29
INSERT INTO cloud_regions (cluster_id, report_date, name, node_count, current_traffic, peak_traffic, region_type) VALUES
('55555555-5555-5555-5555-555555555555', '2026-03-29', '订单华东区', 100, 30, 42, 'domestic'),
('55555555-5555-5555-5555-555555555555', '2026-03-29', '订单华南区', 75, 24, 34, 'domestic'),
('66666666-6666-6666-6666-666666666666', '2026-03-29', '订单华北区', 50, 16, 24, 'domestic')
ON CONFLICT (cluster_id, report_date, name) DO NOTHING;

-- 订单系统 2026-03-28
INSERT INTO cloud_regions (cluster_id, report_date, name, node_count, current_traffic, peak_traffic, region_type) VALUES
('55555555-5555-5555-5555-555555555555', '2026-03-28', '订单华东区', 100, 26, 38, 'domestic'),
('55555555-5555-5555-5555-555555555555', '2026-03-28', '订单华南区', 75, 20, 30, 'domestic'),
('66666666-6666-6666-6666-666666666666', '2026-03-28', '订单华北区', 50, 14, 20, 'domestic')
ON CONFLICT (cluster_id, report_date, name) DO NOTHING;

-- 订单系统 2026-03-27 高流量日
INSERT INTO cloud_regions (cluster_id, report_date, name, node_count, current_traffic, peak_traffic, region_type) VALUES
('55555555-5555-5555-5555-555555555555', '2026-03-27', '订单华东区', 100, 38, 55, 'domestic'),
('55555555-5555-5555-5555-555555555555', '2026-03-27', '订单华南区', 75, 28, 42, 'domestic'),
('66666666-6666-6666-6666-666666666666', '2026-03-27', '订单华北区', 50, 20, 30, 'domestic')
ON CONFLICT (cluster_id, report_date, name) DO NOTHING;

-- 订单系统 2026-03-26
INSERT INTO cloud_regions (cluster_id, report_date, name, node_count, current_traffic, peak_traffic, region_type) VALUES
('55555555-5555-5555-5555-555555555555', '2026-03-26', '订单华东区', 100, 24, 35, 'domestic'),
('55555555-5555-5555-5555-555555555555', '2026-03-26', '订单华南区', 75, 18, 26, 'domestic'),
('66666666-6666-6666-6666-666666666666', '2026-03-26', '订单华北区', 50, 12, 18, 'domestic')
ON CONFLICT (cluster_id, report_date, name) DO NOTHING;

-- 订单系统 2026-03-25
INSERT INTO cloud_regions (cluster_id, report_date, name, node_count, current_traffic, peak_traffic, region_type) VALUES
('55555555-5555-5555-5555-555555555555', '2026-03-25', '订单华东区', 100, 22, 32, 'domestic'),
('55555555-5555-5555-5555-555555555555', '2026-03-25', '订单华南区', 75, 16, 24, 'domestic'),
('66666666-6666-6666-6666-666666666666', '2026-03-25', '订单华北区', 50, 10, 16, 'domestic')
ON CONFLICT (cluster_id, report_date, name) DO NOTHING;

-- 订单系统 2026-03-24
INSERT INTO cloud_regions (cluster_id, report_date, name, node_count, current_traffic, peak_traffic, region_type) VALUES
('55555555-5555-5555-5555-555555555555', '2026-03-24', '订单华东区', 100, 20, 30, 'domestic'),
('55555555-5555-5555-5555-555555555555', '2026-03-24', '订单华南区', 75, 14, 22, 'domestic'),
('66666666-6666-6666-6666-666666666666', '2026-03-24', '订单华北区', 50, 8, 14, 'domestic')
ON CONFLICT (cluster_id, report_date, name) DO NOTHING;

-- ============================================
-- 6. 为支付中心和订单系统插入评估和行动计划数据
-- ============================================
-- 支付中心评估数据
INSERT INTO assessments (report_id, category, content, status)
SELECT id, '集群健康', '支付主集群运行正常，支付成功率保持在99.9%以上。', 'normal' FROM daily_reports WHERE report_date = '2026-03-30' AND business_system_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'
ON CONFLICT DO NOTHING;

INSERT INTO assessments (report_id, category, content, status)
SELECT id, '性能评估', '支付响应时间稳定，平均延迟低于10ms。', 'normal' FROM daily_reports WHERE report_date = '2026-03-30' AND business_system_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'
ON CONFLICT DO NOTHING;

INSERT INTO assessments (report_id, category, content, status)
SELECT id, '集群健康', '支付主集群交易量较高，需关注响应时间。', 'warning' FROM daily_reports WHERE report_date = '2026-03-27' AND business_system_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'
ON CONFLICT DO NOTHING;

-- 订单系统评估数据
INSERT INTO assessments (report_id, category, content, status)
SELECT id, '集群健康', '订单主集群运行正常，订单处理成功率99.8%。', 'normal' FROM daily_reports WHERE report_date = '2026-03-30' AND business_system_id = 'cccccccc-cccc-cccc-cccc-cccccccccccc'
ON CONFLICT DO NOTHING;

INSERT INTO assessments (report_id, category, content, status)
SELECT id, '性能评估', '订单处理延迟稳定，库存同步正常。', 'normal' FROM daily_reports WHERE report_date = '2026-03-30' AND business_system_id = 'cccccccc-cccc-cccc-cccc-cccccccccccc'
ON CONFLICT DO NOTHING;

INSERT INTO assessments (report_id, category, content, status)
SELECT id, '集群健康', '订单主集群订单量达到峰值，库存同步延迟需关注。', 'warning' FROM daily_reports WHERE report_date = '2026-03-27' AND business_system_id = 'cccccccc-cccc-cccc-cccc-cccccccccccc'
ON CONFLICT DO NOTHING;

-- 支付中心行动计划
INSERT INTO action_plans (report_id, priority, items, insight)
SELECT id, 'P2', '["持续监控支付成功率。", "关注交易量变化趋势。"]', '维持日常监控，确保支付系统稳定运行。' FROM daily_reports WHERE report_date = '2026-03-30' AND business_system_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'
ON CONFLICT DO NOTHING;

INSERT INTO action_plans (report_id, priority, items, insight)
SELECT id, 'P1', '["紧急关注支付主集群响应时间。", "评估是否需要临时扩容。", "检查支付渠道状态。"]', '今日为高流量日，建议加强监控并准备应急预案。' FROM daily_reports WHERE report_date = '2026-03-27' AND business_system_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'
ON CONFLICT DO NOTHING;

-- 订单系统行动计划
INSERT INTO action_plans (report_id, priority, items, insight)
SELECT id, 'P2', '["持续监控订单处理成功率。", "关注库存同步状态。"]', '维持日常监控，确保订单系统稳定运行。' FROM daily_reports WHERE report_date = '2026-03-30' AND business_system_id = 'cccccccc-cccc-cccc-cccc-cccccccccccc'
ON CONFLICT DO NOTHING;

INSERT INTO action_plans (report_id, priority, items, insight)
SELECT id, 'P1', '["紧急关注订单主集群处理能力。", "评估库存同步延迟影响。", "检查第三方接口状态。"]', '今日为高流量日，建议加强监控并准备应急预案。' FROM daily_reports WHERE report_date = '2026-03-27' AND business_system_id = 'cccccccc-cccc-cccc-cccc-cccccccccccc'
ON CONFLICT DO NOTHING;

-- 完成
SELECT 'Mock data for payment-center and order-system added successfully!' as message;
