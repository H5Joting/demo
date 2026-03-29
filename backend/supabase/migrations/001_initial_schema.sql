-- 统一日志分析系统数据库结构
-- 执行此脚本前请确保在 Supabase SQL Editor 中运行

-- 先删除已存在的表（按依赖顺序）
DROP TABLE IF EXISTS action_plans CASCADE;
DROP TABLE IF EXISTS assessments CASCADE;
DROP TABLE IF EXISTS cloud_regions CASCADE;
DROP TABLE IF EXISTS log_metrics CASCADE;
DROP TABLE IF EXISTS daily_reports CASCADE;
DROP TABLE IF EXISTS clusters CASCADE;

-- ============================================
-- 1. 集群表
-- ============================================
CREATE TABLE clusters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_en TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('wx', 'nf')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. 日志指标表（按日期存储）
-- ============================================
CREATE TABLE log_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cluster_id UUID NOT NULL REFERENCES clusters(id) ON DELETE CASCADE,
  report_date DATE NOT NULL,
  metric_name TEXT NOT NULL,
  metric_name_en TEXT NOT NULL,
  layer TEXT NOT NULL CHECK (layer IN ('access', 'buffer', 'storage', 'application')),
  today_max REAL NOT NULL,
  today_avg REAL NOT NULL,
  yesterday_max REAL NOT NULL,
  yesterday_avg REAL NOT NULL,
  historical_max REAL NOT NULL,
  historical_max_date TEXT NOT NULL,
  sla_threshold REAL NOT NULL,
  unit TEXT NOT NULL,
  change_rate REAL NOT NULL,
  health_status TEXT NOT NULL CHECK (health_status IN ('healthy', 'warning', 'critical')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(cluster_id, report_date, metric_name)
);

-- ============================================
-- 3. 云区域表（按日期存储）
-- ============================================
CREATE TABLE cloud_regions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cluster_id UUID NOT NULL REFERENCES clusters(id) ON DELETE CASCADE,
  report_date DATE NOT NULL,
  name TEXT NOT NULL,
  node_count INTEGER NOT NULL,
  current_traffic REAL NOT NULL,
  peak_traffic REAL NOT NULL,
  region_type TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(cluster_id, report_date, name)
);

-- ============================================
-- 4. 日报表
-- ============================================
CREATE TABLE daily_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_date DATE NOT NULL UNIQUE,
  system_status TEXT NOT NULL DEFAULT 'normal',
  wx_cluster_eps_rate REAL NOT NULL DEFAULT 0,
  wx_cluster_eps_peak_date TEXT NOT NULL DEFAULT '',
  wx_cluster_insight TEXT NOT NULL DEFAULT '',
  nf_cluster_eps_rate REAL NOT NULL DEFAULT 0,
  nf_cluster_eps_peak_date TEXT NOT NULL DEFAULT '',
  nf_cluster_insight TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 5. 评估表
-- ============================================
CREATE TABLE assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL REFERENCES daily_reports(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('normal', 'warning', 'critical')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 6. 行动计划表
-- ============================================
CREATE TABLE action_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL REFERENCES daily_reports(id) ON DELETE CASCADE,
  priority TEXT NOT NULL,
  items JSONB NOT NULL,
  insight TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 插入集群数据
-- ============================================
INSERT INTO clusters (id, name, name_en, type) VALUES
('11111111-1111-1111-1111-111111111111', '威新集群', 'WX CLUSTER', 'wx'),
('22222222-2222-2222-2222-222222222222', '南方集群', 'NF CLUSTER', 'nf');

-- ============================================
-- 插入日报数据（7天）
-- ============================================
INSERT INTO daily_reports (report_date, system_status, wx_cluster_eps_rate, wx_cluster_eps_peak_date, wx_cluster_insight, nf_cluster_eps_rate, nf_cluster_eps_peak_date, nf_cluster_insight) VALUES
('2026-03-28', 'normal', 85, '2025-03-22', '威新集群今日流量较上一交易日下跌5.51%，流量有所回落。集群指标平稳，弹性良好，无明显瓶颈。', 62, '2025-03-22', '南方集群指标平稳，弹性良好，无明显瓶颈。'),
('2026-03-27', 'normal', 82, '2025-03-22', '威新集群今日流量平稳，集群指标正常。', 60, '2025-03-22', '南方集群指标平稳，弹性良好。'),
('2026-03-26', 'normal', 78, '2025-03-22', '威新集群今日流量有所上升，需关注。', 58, '2025-03-22', '南方集群指标正常。'),
('2026-03-25', 'warning', 92, '2025-03-22', '威新集群今日流量达到近期峰值，CPU使用率接近告警阈值，建议关注。', 70, '2025-03-22', '南方集群流量较高，需关注磁盘使用率。'),
('2026-03-24', 'normal', 75, '2025-03-22', '威新集群指标正常。', 55, '2025-03-22', '南方集群指标正常。'),
('2026-03-23', 'normal', 72, '2025-03-22', '威新集群指标正常。', 52, '2025-03-22', '南方集群指标正常。'),
('2026-03-22', 'normal', 68, '2025-03-22', '威新集群指标正常。', 50, '2025-03-22', '南方集群指标正常。');

-- ============================================
-- 插入日志指标数据（7天 x 2集群 x 7指标）
-- ============================================

-- 2026-03-28 威新集群
INSERT INTO log_metrics (cluster_id, report_date, metric_name, metric_name_en, layer, today_max, today_avg, yesterday_max, yesterday_avg, historical_max, historical_max_date, sla_threshold, unit, change_rate, health_status) VALUES
('11111111-1111-1111-1111-111111111111', '2026-03-28', 'Collector EPS', 'Collector EPS', 'access', 68, 55, 72, 58, 80, '2025-03-22', 100, 'w', -5.51, 'healthy'),
('11111111-1111-1111-1111-111111111111', '2026-03-28', 'Kafka写入流量', 'Kafka Write Traffic', 'buffer', 120, 95, 125, 100, 150, '2025-03-22', 200, 'MB/s', -4.0, 'healthy'),
('11111111-1111-1111-1111-111111111111', '2026-03-28', '磁盘使用率', 'Disk Usage', 'storage', 72, 68, 70, 65, 85, '2025-03-22', 80, '%', 2.86, 'healthy'),
('11111111-1111-1111-1111-111111111111', '2026-03-28', 'CPU使用率', 'CPU Usage', 'application', 45, 38, 48, 40, 60, '2025-03-22', 70, '%', -6.25, 'healthy'),
('11111111-1111-1111-1111-111111111111', '2026-03-28', '平均搜索耗时', 'Avg Search Latency', 'application', 15, 12, 16, 13, 20, '2025-03-22', 30, 'ms', -6.67, 'healthy'),
('11111111-1111-1111-1111-111111111111', '2026-03-28', '日志入库耗时', 'Log Ingest Latency', 'storage', 8, 6, 9, 7, 12, '2025-03-22', 15, 'ms', -11.11, 'healthy'),
('11111111-1111-1111-1111-111111111111', '2026-03-28', '监控延迟', 'Monitor Latency', 'application', 5, 4, 6, 5, 8, '2025-03-22', 10, 'ms', -16.67, 'healthy');

-- 2026-03-28 南方集群
INSERT INTO log_metrics (cluster_id, report_date, metric_name, metric_name_en, layer, today_max, today_avg, yesterday_max, yesterday_avg, historical_max, historical_max_date, sla_threshold, unit, change_rate, health_status) VALUES
('22222222-2222-2222-2222-222222222222', '2026-03-28', 'Collector EPS', 'Collector EPS', 'access', 42, 35, 45, 38, 50, '2025-03-22', 60, 'w', -6.67, 'healthy'),
('22222222-2222-2222-2222-222222222222', '2026-03-28', 'Kafka写入流量', 'Kafka Write Traffic', 'buffer', 85, 70, 90, 75, 100, '2025-03-22', 120, 'MB/s', -5.56, 'healthy'),
('22222222-2222-2222-2222-222222222222', '2026-03-28', '磁盘使用率', 'Disk Usage', 'storage', 65, 60, 62, 58, 75, '2025-03-22', 80, '%', 4.84, 'healthy'),
('22222222-2222-2222-2222-222222222222', '2026-03-28', 'CPU使用率', 'CPU Usage', 'application', 38, 32, 40, 34, 50, '2025-03-22', 70, '%', -5.0, 'healthy'),
('22222222-2222-2222-2222-222222222222', '2026-03-28', '平均搜索耗时', 'Avg Search Latency', 'application', 12, 10, 13, 11, 18, '2025-03-22', 30, 'ms', -7.69, 'healthy'),
('22222222-2222-2222-2222-222222222222', '2026-03-28', '日志入库耗时', 'Log Ingest Latency', 'storage', 6, 5, 7, 6, 10, '2025-03-22', 15, 'ms', -14.29, 'healthy'),
('22222222-2222-2222-2222-222222222222', '2026-03-28', '监控延迟', 'Monitor Latency', 'application', 4, 3, 5, 4, 7, '2025-03-22', 10, 'ms', -20.0, 'healthy');

-- 2026-03-27 数据
INSERT INTO log_metrics (cluster_id, report_date, metric_name, metric_name_en, layer, today_max, today_avg, yesterday_max, yesterday_avg, historical_max, historical_max_date, sla_threshold, unit, change_rate, health_status) VALUES
('11111111-1111-1111-1111-111111111111', '2026-03-27', 'Collector EPS', 'Collector EPS', 'access', 72, 58, 70, 56, 80, '2025-03-22', 100, 'w', 2.86, 'healthy'),
('11111111-1111-1111-1111-111111111111', '2026-03-27', 'Kafka写入流量', 'Kafka Write Traffic', 'buffer', 125, 100, 120, 95, 150, '2025-03-22', 200, 'MB/s', 4.17, 'healthy'),
('11111111-1111-1111-1111-111111111111', '2026-03-27', '磁盘使用率', 'Disk Usage', 'storage', 70, 65, 68, 63, 85, '2025-03-22', 80, '%', 2.94, 'healthy'),
('11111111-1111-1111-1111-111111111111', '2026-03-27', 'CPU使用率', 'CPU Usage', 'application', 48, 40, 45, 38, 60, '2025-03-22', 70, '%', 6.67, 'healthy'),
('11111111-1111-1111-1111-111111111111', '2026-03-27', '平均搜索耗时', 'Avg Search Latency', 'application', 16, 13, 15, 12, 20, '2025-03-22', 30, 'ms', 6.67, 'healthy'),
('11111111-1111-1111-1111-111111111111', '2026-03-27', '日志入库耗时', 'Log Ingest Latency', 'storage', 9, 7, 8, 6, 12, '2025-03-22', 15, 'ms', 12.5, 'healthy'),
('11111111-1111-1111-1111-111111111111', '2026-03-27', '监控延迟', 'Monitor Latency', 'application', 6, 5, 5, 4, 8, '2025-03-22', 10, 'ms', 20.0, 'healthy'),
('22222222-2222-2222-2222-222222222222', '2026-03-27', 'Collector EPS', 'Collector EPS', 'access', 45, 38, 42, 35, 50, '2025-03-22', 60, 'w', 7.14, 'healthy'),
('22222222-2222-2222-2222-222222222222', '2026-03-27', 'Kafka写入流量', 'Kafka Write Traffic', 'buffer', 90, 75, 85, 70, 100, '2025-03-22', 120, 'MB/s', 5.88, 'healthy'),
('22222222-2222-2222-2222-222222222222', '2026-03-27', '磁盘使用率', 'Disk Usage', 'storage', 62, 58, 60, 55, 75, '2025-03-22', 80, '%', 3.33, 'healthy'),
('22222222-2222-2222-2222-222222222222', '2026-03-27', 'CPU使用率', 'CPU Usage', 'application', 40, 34, 38, 32, 50, '2025-03-22', 70, '%', 5.26, 'healthy'),
('22222222-2222-2222-2222-222222222222', '2026-03-27', '平均搜索耗时', 'Avg Search Latency', 'application', 13, 11, 12, 10, 18, '2025-03-22', 30, 'ms', 8.33, 'healthy'),
('22222222-2222-2222-2222-222222222222', '2026-03-27', '日志入库耗时', 'Log Ingest Latency', 'storage', 7, 6, 6, 5, 10, '2025-03-22', 15, 'ms', 16.67, 'healthy'),
('22222222-2222-2222-2222-222222222222', '2026-03-27', '监控延迟', 'Monitor Latency', 'application', 5, 4, 4, 3, 7, '2025-03-22', 10, 'ms', 25.0, 'healthy');

-- 2026-03-26 数据
INSERT INTO log_metrics (cluster_id, report_date, metric_name, metric_name_en, layer, today_max, today_avg, yesterday_max, yesterday_avg, historical_max, historical_max_date, sla_threshold, unit, change_rate, health_status) VALUES
('11111111-1111-1111-1111-111111111111', '2026-03-26', 'Collector EPS', 'Collector EPS', 'access', 70, 56, 65, 52, 80, '2025-03-22', 100, 'w', 7.69, 'healthy'),
('11111111-1111-1111-1111-111111111111', '2026-03-26', 'Kafka写入流量', 'Kafka Write Traffic', 'buffer', 120, 95, 110, 88, 150, '2025-03-22', 200, 'MB/s', 9.09, 'healthy'),
('11111111-1111-1111-1111-111111111111', '2026-03-26', '磁盘使用率', 'Disk Usage', 'storage', 68, 63, 65, 60, 85, '2025-03-22', 80, '%', 4.62, 'healthy'),
('11111111-1111-1111-1111-111111111111', '2026-03-26', 'CPU使用率', 'CPU Usage', 'application', 45, 38, 42, 35, 60, '2025-03-22', 70, '%', 7.14, 'healthy'),
('11111111-1111-1111-1111-111111111111', '2026-03-26', '平均搜索耗时', 'Avg Search Latency', 'application', 15, 12, 14, 11, 20, '2025-03-22', 30, 'ms', 7.14, 'healthy'),
('11111111-1111-1111-1111-111111111111', '2026-03-26', '日志入库耗时', 'Log Ingest Latency', 'storage', 8, 6, 7, 5, 12, '2025-03-22', 15, 'ms', 14.29, 'healthy'),
('11111111-1111-1111-1111-111111111111', '2026-03-26', '监控延迟', 'Monitor Latency', 'application', 5, 4, 5, 4, 8, '2025-03-22', 10, 'ms', 0.0, 'healthy'),
('22222222-2222-2222-2222-222222222222', '2026-03-26', 'Collector EPS', 'Collector EPS', 'access', 42, 35, 40, 33, 50, '2025-03-22', 60, 'w', 5.0, 'healthy'),
('22222222-2222-2222-2222-222222222222', '2026-03-26', 'Kafka写入流量', 'Kafka Write Traffic', 'buffer', 85, 70, 80, 65, 100, '2025-03-22', 120, 'MB/s', 6.25, 'healthy'),
('22222222-2222-2222-2222-222222222222', '2026-03-26', '磁盘使用率', 'Disk Usage', 'storage', 60, 55, 58, 53, 75, '2025-03-22', 80, '%', 3.45, 'healthy'),
('22222222-2222-2222-2222-222222222222', '2026-03-26', 'CPU使用率', 'CPU Usage', 'application', 38, 32, 36, 30, 50, '2025-03-22', 70, '%', 5.56, 'healthy'),
('22222222-2222-2222-2222-222222222222', '2026-03-26', '平均搜索耗时', 'Avg Search Latency', 'application', 12, 10, 11, 9, 18, '2025-03-22', 30, 'ms', 9.09, 'healthy'),
('22222222-2222-2222-2222-222222222222', '2026-03-26', '日志入库耗时', 'Log Ingest Latency', 'storage', 6, 5, 6, 5, 10, '2025-03-22', 15, 'ms', 0.0, 'healthy'),
('22222222-2222-2222-2222-222222222222', '2026-03-26', '监控延迟', 'Monitor Latency', 'application', 4, 3, 4, 3, 7, '2025-03-22', 10, 'ms', 0.0, 'healthy');

-- 2026-03-25 高流量日
INSERT INTO log_metrics (cluster_id, report_date, metric_name, metric_name_en, layer, today_max, today_avg, yesterday_max, yesterday_avg, historical_max, historical_max_date, sla_threshold, unit, change_rate, health_status) VALUES
('11111111-1111-1111-1111-111111111111', '2026-03-25', 'Collector EPS', 'Collector EPS', 'access', 78, 65, 70, 56, 80, '2025-03-22', 100, 'w', 11.43, 'warning'),
('11111111-1111-1111-1111-111111111111', '2026-03-25', 'Kafka写入流量', 'Kafka Write Traffic', 'buffer', 140, 115, 120, 95, 150, '2025-03-22', 200, 'MB/s', 16.67, 'healthy'),
('11111111-1111-1111-1111-111111111111', '2026-03-25', '磁盘使用率', 'Disk Usage', 'storage', 75, 70, 68, 63, 85, '2025-03-22', 80, '%', 10.29, 'warning'),
('11111111-1111-1111-1111-111111111111', '2026-03-25', 'CPU使用率', 'CPU Usage', 'application', 58, 48, 45, 38, 60, '2025-03-22', 70, '%', 28.89, 'warning'),
('11111111-1111-1111-1111-111111111111', '2026-03-25', '平均搜索耗时', 'Avg Search Latency', 'application', 18, 15, 15, 12, 20, '2025-03-22', 30, 'ms', 20.0, 'healthy'),
('11111111-1111-1111-1111-111111111111', '2026-03-25', '日志入库耗时', 'Log Ingest Latency', 'storage', 10, 8, 8, 6, 12, '2025-03-22', 15, 'ms', 25.0, 'healthy'),
('11111111-1111-1111-1111-111111111111', '2026-03-25', '监控延迟', 'Monitor Latency', 'application', 7, 5, 5, 4, 8, '2025-03-22', 10, 'ms', 40.0, 'healthy'),
('22222222-2222-2222-2222-222222222222', '2026-03-25', 'Collector EPS', 'Collector EPS', 'access', 48, 40, 42, 35, 50, '2025-03-22', 60, 'w', 14.29, 'warning'),
('22222222-2222-2222-2222-222222222222', '2026-03-25', 'Kafka写入流量', 'Kafka Write Traffic', 'buffer', 95, 80, 85, 70, 100, '2025-03-22', 120, 'MB/s', 11.76, 'healthy'),
('22222222-2222-2222-2222-222222222222', '2026-03-25', '磁盘使用率', 'Disk Usage', 'storage', 68, 62, 60, 55, 75, '2025-03-22', 80, '%', 13.33, 'healthy'),
('22222222-2222-2222-2222-222222222222', '2026-03-25', 'CPU使用率', 'CPU Usage', 'application', 45, 38, 38, 32, 50, '2025-03-22', 70, '%', 18.42, 'healthy'),
('22222222-2222-2222-2222-222222222222', '2026-03-25', '平均搜索耗时', 'Avg Search Latency', 'application', 14, 12, 12, 10, 18, '2025-03-22', 30, 'ms', 16.67, 'healthy'),
('22222222-2222-2222-2222-222222222222', '2026-03-25', '日志入库耗时', 'Log Ingest Latency', 'storage', 8, 6, 6, 5, 10, '2025-03-22', 15, 'ms', 33.33, 'healthy'),
('22222222-2222-2222-2222-222222222222', '2026-03-25', '监控延迟', 'Monitor Latency', 'application', 5, 4, 4, 3, 7, '2025-03-22', 10, 'ms', 25.0, 'healthy');

-- 2026-03-24 数据
INSERT INTO log_metrics (cluster_id, report_date, metric_name, metric_name_en, layer, today_max, today_avg, yesterday_max, yesterday_avg, historical_max, historical_max_date, sla_threshold, unit, change_rate, health_status) VALUES
('11111111-1111-1111-1111-111111111111', '2026-03-24', 'Collector EPS', 'Collector EPS', 'access', 65, 52, 62, 50, 80, '2025-03-22', 100, 'w', 4.84, 'healthy'),
('11111111-1111-1111-1111-111111111111', '2026-03-24', 'Kafka写入流量', 'Kafka Write Traffic', 'buffer', 110, 88, 105, 85, 150, '2025-03-22', 200, 'MB/s', 4.76, 'healthy'),
('11111111-1111-1111-1111-111111111111', '2026-03-24', '磁盘使用率', 'Disk Usage', 'storage', 65, 60, 62, 58, 85, '2025-03-22', 80, '%', 4.84, 'healthy'),
('11111111-1111-1111-1111-111111111111', '2026-03-24', 'CPU使用率', 'CPU Usage', 'application', 42, 35, 40, 33, 60, '2025-03-22', 70, '%', 5.0, 'healthy'),
('11111111-1111-1111-1111-111111111111', '2026-03-24', '平均搜索耗时', 'Avg Search Latency', 'application', 14, 11, 13, 10, 20, '2025-03-22', 30, 'ms', 7.69, 'healthy'),
('11111111-1111-1111-1111-111111111111', '2026-03-24', '日志入库耗时', 'Log Ingest Latency', 'storage', 7, 5, 7, 5, 12, '2025-03-22', 15, 'ms', 0.0, 'healthy'),
('11111111-1111-1111-1111-111111111111', '2026-03-24', '监控延迟', 'Monitor Latency', 'application', 5, 4, 5, 4, 8, '2025-03-22', 10, 'ms', 0.0, 'healthy'),
('22222222-2222-2222-2222-222222222222', '2026-03-24', 'Collector EPS', 'Collector EPS', 'access', 40, 33, 38, 31, 50, '2025-03-22', 60, 'w', 5.26, 'healthy'),
('22222222-2222-2222-2222-222222222222', '2026-03-24', 'Kafka写入流量', 'Kafka Write Traffic', 'buffer', 80, 65, 75, 62, 100, '2025-03-22', 120, 'MB/s', 6.67, 'healthy'),
('22222222-2222-2222-2222-222222222222', '2026-03-24', '磁盘使用率', 'Disk Usage', 'storage', 58, 53, 55, 50, 75, '2025-03-22', 80, '%', 5.45, 'healthy'),
('22222222-2222-2222-2222-222222222222', '2026-03-24', 'CPU使用率', 'CPU Usage', 'application', 36, 30, 34, 28, 50, '2025-03-22', 70, '%', 5.88, 'healthy'),
('22222222-2222-2222-2222-222222222222', '2026-03-24', '平均搜索耗时', 'Avg Search Latency', 'application', 11, 9, 10, 8, 18, '2025-03-22', 30, 'ms', 10.0, 'healthy'),
('22222222-2222-2222-2222-222222222222', '2026-03-24', '日志入库耗时', 'Log Ingest Latency', 'storage', 6, 5, 5, 4, 10, '2025-03-22', 15, 'ms', 20.0, 'healthy'),
('22222222-2222-2222-2222-222222222222', '2026-03-24', '监控延迟', 'Monitor Latency', 'application', 4, 3, 4, 3, 7, '2025-03-22', 10, 'ms', 0.0, 'healthy');

-- 2026-03-23 数据
INSERT INTO log_metrics (cluster_id, report_date, metric_name, metric_name_en, layer, today_max, today_avg, yesterday_max, yesterday_avg, historical_max, historical_max_date, sla_threshold, unit, change_rate, health_status) VALUES
('11111111-1111-1111-1111-111111111111', '2026-03-23', 'Collector EPS', 'Collector EPS', 'access', 62, 50, 60, 48, 80, '2025-03-22', 100, 'w', 3.33, 'healthy'),
('11111111-1111-1111-1111-111111111111', '2026-03-23', 'Kafka写入流量', 'Kafka Write Traffic', 'buffer', 105, 85, 100, 82, 150, '2025-03-22', 200, 'MB/s', 5.0, 'healthy'),
('11111111-1111-1111-1111-111111111111', '2026-03-23', '磁盘使用率', 'Disk Usage', 'storage', 62, 58, 60, 55, 85, '2025-03-22', 80, '%', 3.33, 'healthy'),
('11111111-1111-1111-1111-111111111111', '2026-03-23', 'CPU使用率', 'CPU Usage', 'application', 40, 33, 38, 31, 60, '2025-03-22', 70, '%', 5.26, 'healthy'),
('11111111-1111-1111-1111-111111111111', '2026-03-23', '平均搜索耗时', 'Avg Search Latency', 'application', 13, 10, 12, 10, 20, '2025-03-22', 30, 'ms', 8.33, 'healthy'),
('11111111-1111-1111-1111-111111111111', '2026-03-23', '日志入库耗时', 'Log Ingest Latency', 'storage', 7, 5, 6, 5, 12, '2025-03-22', 15, 'ms', 16.67, 'healthy'),
('11111111-1111-1111-1111-111111111111', '2026-03-23', '监控延迟', 'Monitor Latency', 'application', 5, 4, 5, 4, 8, '2025-03-22', 10, 'ms', 0.0, 'healthy'),
('22222222-2222-2222-2222-222222222222', '2026-03-23', 'Collector EPS', 'Collector EPS', 'access', 38, 31, 36, 29, 50, '2025-03-22', 60, 'w', 5.56, 'healthy'),
('22222222-2222-2222-2222-222222222222', '2026-03-23', 'Kafka写入流量', 'Kafka Write Traffic', 'buffer', 75, 62, 72, 60, 100, '2025-03-22', 120, 'MB/s', 4.17, 'healthy'),
('22222222-2222-2222-2222-222222222222', '2026-03-23', '磁盘使用率', 'Disk Usage', 'storage', 55, 50, 52, 48, 75, '2025-03-22', 80, '%', 5.77, 'healthy'),
('22222222-2222-2222-2222-222222222222', '2026-03-23', 'CPU使用率', 'CPU Usage', 'application', 34, 28, 32, 26, 50, '2025-03-22', 70, '%', 6.25, 'healthy'),
('22222222-2222-2222-2222-222222222222', '2026-03-23', '平均搜索耗时', 'Avg Search Latency', 'application', 10, 8, 10, 8, 18, '2025-03-22', 30, 'ms', 0.0, 'healthy'),
('22222222-2222-2222-2222-222222222222', '2026-03-23', '日志入库耗时', 'Log Ingest Latency', 'storage', 5, 4, 5, 4, 10, '2025-03-22', 15, 'ms', 0.0, 'healthy'),
('22222222-2222-2222-2222-222222222222', '2026-03-23', '监控延迟', 'Monitor Latency', 'application', 4, 3, 4, 3, 7, '2025-03-22', 10, 'ms', 0.0, 'healthy');

-- 2026-03-22 数据
INSERT INTO log_metrics (cluster_id, report_date, metric_name, metric_name_en, layer, today_max, today_avg, yesterday_max, yesterday_avg, historical_max, historical_max_date, sla_threshold, unit, change_rate, health_status) VALUES
('11111111-1111-1111-1111-111111111111', '2026-03-22', 'Collector EPS', 'Collector EPS', 'access', 60, 48, 58, 46, 80, '2025-03-22', 100, 'w', 3.45, 'healthy'),
('11111111-1111-1111-1111-111111111111', '2026-03-22', 'Kafka写入流量', 'Kafka Write Traffic', 'buffer', 100, 82, 95, 78, 150, '2025-03-22', 200, 'MB/s', 5.26, 'healthy'),
('11111111-1111-1111-1111-111111111111', '2026-03-22', '磁盘使用率', 'Disk Usage', 'storage', 60, 55, 58, 52, 85, '2025-03-22', 80, '%', 3.45, 'healthy'),
('11111111-1111-1111-1111-111111111111', '2026-03-22', 'CPU使用率', 'CPU Usage', 'application', 38, 31, 36, 29, 60, '2025-03-22', 70, '%', 5.56, 'healthy'),
('11111111-1111-1111-1111-111111111111', '2026-03-22', '平均搜索耗时', 'Avg Search Latency', 'application', 12, 10, 12, 10, 20, '2025-03-22', 30, 'ms', 0.0, 'healthy'),
('11111111-1111-1111-1111-111111111111', '2026-03-22', '日志入库耗时', 'Log Ingest Latency', 'storage', 6, 5, 6, 5, 12, '2025-03-22', 15, 'ms', 0.0, 'healthy'),
('11111111-1111-1111-1111-111111111111', '2026-03-22', '监控延迟', 'Monitor Latency', 'application', 5, 4, 5, 4, 8, '2025-03-22', 10, 'ms', 0.0, 'healthy'),
('22222222-2222-2222-2222-222222222222', '2026-03-22', 'Collector EPS', 'Collector EPS', 'access', 36, 29, 34, 27, 50, '2025-03-22', 60, 'w', 5.88, 'healthy'),
('22222222-2222-2222-2222-222222222222', '2026-03-22', 'Kafka写入流量', 'Kafka Write Traffic', 'buffer', 72, 60, 68, 56, 100, '2025-03-22', 120, 'MB/s', 5.88, 'healthy'),
('22222222-2222-2222-2222-222222222222', '2026-03-22', '磁盘使用率', 'Disk Usage', 'storage', 52, 48, 50, 45, 75, '2025-03-22', 80, '%', 4.0, 'healthy'),
('22222222-2222-2222-2222-222222222222', '2026-03-22', 'CPU使用率', 'CPU Usage', 'application', 32, 26, 30, 24, 50, '2025-03-22', 70, '%', 6.67, 'healthy'),
('22222222-2222-2222-2222-222222222222', '2026-03-22', '平均搜索耗时', 'Avg Search Latency', 'application', 10, 8, 10, 8, 18, '2025-03-22', 30, 'ms', 0.0, 'healthy'),
('22222222-2222-2222-2222-222222222222', '2026-03-22', '日志入库耗时', 'Log Ingest Latency', 'storage', 5, 4, 5, 4, 10, '2025-03-22', 15, 'ms', 0.0, 'healthy'),
('22222222-2222-2222-2222-222222222222', '2026-03-22', '监控延迟', 'Monitor Latency', 'application', 4, 3, 4, 3, 7, '2025-03-22', 10, 'ms', 0.0, 'healthy');

-- ============================================
-- 插入云区域数据（7天）
-- ============================================

-- 2026-03-28
INSERT INTO cloud_regions (cluster_id, report_date, name, node_count, current_traffic, peak_traffic, region_type) VALUES
('11111111-1111-1111-1111-111111111111', '2026-03-28', '华东区域', 120, 25, 35, 'domestic'),
('11111111-1111-1111-1111-111111111111', '2026-03-28', '华南区域', 85, 18, 25, 'domestic'),
('11111111-1111-1111-1111-111111111111', '2026-03-28', '华北区域', 70, 15, 22, 'domestic'),
('22222222-2222-2222-2222-222222222222', '2026-03-28', '西南区域', 55, 12, 18, 'domestic'),
('22222222-2222-2222-2222-222222222222', '2026-03-28', '海外区域', 30, 8, 12, 'overseas');

-- 2026-03-27
INSERT INTO cloud_regions (cluster_id, report_date, name, node_count, current_traffic, peak_traffic, region_type) VALUES
('11111111-1111-1111-1111-111111111111', '2026-03-27', '华东区域', 120, 26, 36, 'domestic'),
('11111111-1111-1111-1111-111111111111', '2026-03-27', '华南区域', 85, 19, 26, 'domestic'),
('11111111-1111-1111-1111-111111111111', '2026-03-27', '华北区域', 70, 16, 23, 'domestic'),
('22222222-2222-2222-2222-222222222222', '2026-03-27', '西南区域', 55, 13, 19, 'domestic'),
('22222222-2222-2222-2222-222222222222', '2026-03-27', '海外区域', 30, 9, 13, 'overseas');

-- 2026-03-26
INSERT INTO cloud_regions (cluster_id, report_date, name, node_count, current_traffic, peak_traffic, region_type) VALUES
('11111111-1111-1111-1111-111111111111', '2026-03-26', '华东区域', 120, 24, 34, 'domestic'),
('11111111-1111-1111-1111-111111111111', '2026-03-26', '华南区域', 85, 17, 24, 'domestic'),
('11111111-1111-1111-1111-111111111111', '2026-03-26', '华北区域', 70, 14, 21, 'domestic'),
('22222222-2222-2222-2222-222222222222', '2026-03-26', '西南区域', 55, 11, 17, 'domestic'),
('22222222-2222-2222-2222-222222222222', '2026-03-26', '海外区域', 30, 7, 11, 'overseas');

-- 2026-03-25 高流量日
INSERT INTO cloud_regions (cluster_id, report_date, name, node_count, current_traffic, peak_traffic, region_type) VALUES
('11111111-1111-1111-1111-111111111111', '2026-03-25', '华东区域', 120, 30, 42, 'domestic'),
('11111111-1111-1111-1111-111111111111', '2026-03-25', '华南区域', 85, 22, 30, 'domestic'),
('11111111-1111-1111-1111-111111111111', '2026-03-25', '华北区域', 70, 18, 26, 'domestic'),
('22222222-2222-2222-2222-222222222222', '2026-03-25', '西南区域', 55, 15, 22, 'domestic'),
('22222222-2222-2222-2222-222222222222', '2026-03-25', '海外区域', 30, 10, 15, 'overseas');

-- 2026-03-24
INSERT INTO cloud_regions (cluster_id, report_date, name, node_count, current_traffic, peak_traffic, region_type) VALUES
('11111111-1111-1111-1111-111111111111', '2026-03-24', '华东区域', 120, 23, 33, 'domestic'),
('11111111-1111-1111-1111-111111111111', '2026-03-24', '华南区域', 85, 16, 23, 'domestic'),
('11111111-1111-1111-1111-111111111111', '2026-03-24', '华北区域', 70, 13, 20, 'domestic'),
('22222222-2222-2222-2222-222222222222', '2026-03-24', '西南区域', 55, 10, 16, 'domestic'),
('22222222-2222-2222-2222-222222222222', '2026-03-24', '海外区域', 30, 6, 10, 'overseas');

-- 2026-03-23
INSERT INTO cloud_regions (cluster_id, report_date, name, node_count, current_traffic, peak_traffic, region_type) VALUES
('11111111-1111-1111-1111-111111111111', '2026-03-23', '华东区域', 120, 22, 32, 'domestic'),
('11111111-1111-1111-1111-111111111111', '2026-03-23', '华南区域', 85, 15, 22, 'domestic'),
('11111111-1111-1111-1111-111111111111', '2026-03-23', '华北区域', 70, 12, 19, 'domestic'),
('22222222-2222-2222-2222-222222222222', '2026-03-23', '西南区域', 55, 9, 15, 'domestic'),
('22222222-2222-2222-2222-222222222222', '2026-03-23', '海外区域', 30, 5, 9, 'overseas');

-- 2026-03-22
INSERT INTO cloud_regions (cluster_id, report_date, name, node_count, current_traffic, peak_traffic, region_type) VALUES
('11111111-1111-1111-1111-111111111111', '2026-03-22', '华东区域', 120, 21, 31, 'domestic'),
('11111111-1111-1111-1111-111111111111', '2026-03-22', '华南区域', 85, 14, 21, 'domestic'),
('11111111-1111-1111-1111-111111111111', '2026-03-22', '华北区域', 70, 11, 18, 'domestic'),
('22222222-2222-2222-2222-222222222222', '2026-03-22', '西南区域', 55, 8, 14, 'domestic'),
('22222222-2222-2222-2222-222222222222', '2026-03-22', '海外区域', 30, 4, 8, 'overseas');

-- ============================================
-- 插入评估数据（7天）
-- ============================================

INSERT INTO assessments (report_id, category, content, status)
SELECT id, '集群健康', '威新集群运行正常，所有指标在正常范围内。', 'normal' FROM daily_reports WHERE report_date = '2026-03-28';

INSERT INTO assessments (report_id, category, content, status)
SELECT id, '集群健康', '南方集群运行正常，所有指标在正常范围内。', 'normal' FROM daily_reports WHERE report_date = '2026-03-28';

INSERT INTO assessments (report_id, category, content, status)
SELECT id, '容量规划', '磁盘使用率趋势稳定，预计未来30天内不会触及阈值。', 'normal' FROM daily_reports WHERE report_date = '2026-03-28';

INSERT INTO assessments (report_id, category, content, status)
SELECT id, '性能评估', 'CPU使用率较昨日有所下降，系统负载正常。', 'normal' FROM daily_reports WHERE report_date = '2026-03-28';

INSERT INTO assessments (report_id, category, content, status)
SELECT id, '集群健康', '威新集群今日流量较高，需关注CPU使用率。', 'warning' FROM daily_reports WHERE report_date = '2026-03-25';

INSERT INTO assessments (report_id, category, content, status)
SELECT id, '集群健康', '南方集群今日流量较高，磁盘使用率需关注。', 'warning' FROM daily_reports WHERE report_date = '2026-03-25';

-- ============================================
-- 插入行动计划数据（7天）
-- ============================================

INSERT INTO action_plans (report_id, priority, items, insight)
SELECT id, 'P2', '["持续监控各集群核心指标。", "关注流量变化趋势。"]', '维持日常监控，确保系统稳定运行。' FROM daily_reports WHERE report_date = '2026-03-28';

INSERT INTO action_plans (report_id, priority, items, insight)
SELECT id, 'P2', '["持续监控各集群核心指标。", "关注流量变化趋势。"]', '维持日常监控，确保系统稳定运行。' FROM daily_reports WHERE report_date = '2026-03-27';

INSERT INTO action_plans (report_id, priority, items, insight)
SELECT id, 'P2', '["持续监控各集群核心指标。", "关注流量变化趋势。"]', '维持日常监控，确保系统稳定运行。' FROM daily_reports WHERE report_date = '2026-03-26';

INSERT INTO action_plans (report_id, priority, items, insight)
SELECT id, 'P1', '["紧急关注威新集群CPU使用率，已接近告警阈值。", "评估是否需要临时扩容。", "检查流量来源，确认是否为正常业务增长。"]', '今日为高流量日，建议加强监控并准备应急预案。' FROM daily_reports WHERE report_date = '2026-03-25';

INSERT INTO action_plans (report_id, priority, items, insight)
SELECT id, 'P2', '["持续监控各集群核心指标。", "关注流量变化趋势。"]', '维持日常监控，确保系统稳定运行。' FROM daily_reports WHERE report_date = '2026-03-24';

INSERT INTO action_plans (report_id, priority, items, insight)
SELECT id, 'P2', '["持续监控各集群核心指标。", "关注流量变化趋势。"]', '维持日常监控，确保系统稳定运行。' FROM daily_reports WHERE report_date = '2026-03-23';

INSERT INTO action_plans (report_id, priority, items, insight)
SELECT id, 'P2', '["持续监控各集群核心指标。", "关注流量变化趋势。"]', '维持日常监控，确保系统稳定运行。' FROM daily_reports WHERE report_date = '2026-03-22';

-- 完成
SELECT 'Database initialized successfully!' as message;
