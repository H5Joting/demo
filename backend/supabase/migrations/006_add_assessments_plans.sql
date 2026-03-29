-- 为不同日期添加评估与计划数据
-- 请在 Supabase SQL Editor 中执行

-- 先删除现有数据
DELETE FROM action_plans;
DELETE FROM assessments;

-- 2026-03-28 评估数据
INSERT INTO assessments (report_id, category, content, status)
SELECT id, '运行评估', '所有核心指标运行平稳，资源水位健康，暂无需扩容。', 'normal' FROM daily_reports WHERE report_date = '2026-03-28';

INSERT INTO assessments (report_id, category, content, status)
SELECT id, '容量预警', '威新集群CPU使用率峰值为45%，占历史峰值的75%，系统负载正常。', 'normal' FROM daily_reports WHERE report_date = '2026-03-28';

INSERT INTO assessments (report_id, category, content, status)
SELECT id, '趋势分析', '建议持续关注资源使用趋势，提前规划容量扩充。', 'normal' FROM daily_reports WHERE report_date = '2026-03-28';

-- 2026-03-28 行动计划
INSERT INTO action_plans (report_id, priority, items, insight)
SELECT id, 'P2', '["持续监控各集群核心指标。", "关注流量变化趋势。", "定期检查磁盘使用率。"]', '维持日常监控，确保系统稳定运行。' FROM daily_reports WHERE report_date = '2026-03-28';

-- 2026-03-27 评估数据
INSERT INTO assessments (report_id, category, content, status)
SELECT id, '运行评估', '各集群运行正常，流量平稳，无明显异常。', 'normal' FROM daily_reports WHERE report_date = '2026-03-27';

INSERT INTO assessments (report_id, category, content, status)
SELECT id, '容量预警', '南方集群磁盘使用率62%，需关注存储容量规划。', 'warning' FROM daily_reports WHERE report_date = '2026-03-27';

INSERT INTO assessments (report_id, category, content, status)
SELECT id, '趋势分析', '流量趋势稳定，预计未来一周无扩容需求。', 'normal' FROM daily_reports WHERE report_date = '2026-03-27';

-- 2026-03-27 行动计划
INSERT INTO action_plans (report_id, priority, items, insight)
SELECT id, 'P2', '["监控南方集群磁盘使用率。", "准备存储扩容方案。"]', '建议提前规划存储扩容，避免容量不足影响业务。' FROM daily_reports WHERE report_date = '2026-03-27';

-- 2026-03-26 评估数据
INSERT INTO assessments (report_id, category, content, status)
SELECT id, '运行评估', '系统整体运行平稳，威新集群流量有所上升。', 'normal' FROM daily_reports WHERE report_date = '2026-03-26';

INSERT INTO assessments (report_id, category, content, status)
SELECT id, '容量预警', '所有集群资源水位在安全范围内，暂无扩容需求。', 'normal' FROM daily_reports WHERE report_date = '2026-03-26';

INSERT INTO assessments (report_id, category, content, status)
SELECT id, '趋势分析', '威新集群流量呈上升趋势，建议持续关注。', 'normal' FROM daily_reports WHERE report_date = '2026-03-26';

-- 2026-03-26 行动计划
INSERT INTO action_plans (report_id, priority, items, insight)
SELECT id, 'P2', '["重点关注威新集群流量变化。", "检查系统日志是否有异常。"]', '流量上升期间需加强监控，确保系统稳定。' FROM daily_reports WHERE report_date = '2026-03-26';

-- 2026-03-25 评估数据 (高流量日)
INSERT INTO assessments (report_id, category, content, status)
SELECT id, '运行评估', '今日为业务高峰期，各集群负载较高但运行稳定。', 'normal' FROM daily_reports WHERE report_date = '2026-03-25';

INSERT INTO assessments (report_id, category, content, status)
SELECT id, '容量预警', '威新集群CPU使用率峰值达58%，接近告警阈值，建议关注。南方集群磁盘使用率接近预警线。', 'warning' FROM daily_reports WHERE report_date = '2026-03-25';

INSERT INTO assessments (report_id, category, content, status)
SELECT id, '趋势分析', '业务高峰期资源消耗较大，建议评估扩容需求。', 'warning' FROM daily_reports WHERE report_date = '2026-03-25';

-- 2026-03-25 行动计划
INSERT INTO action_plans (report_id, priority, items, insight)
SELECT id, 'P1', '["复盘威新集群CPU使用率峰值详情。", "评估南方集群磁盘扩容需求。", "制定高峰期资源保障方案。"]', '建议优先处理容量预警问题，确保业务高峰期系统稳定。' FROM daily_reports WHERE report_date = '2026-03-25';

-- 2026-03-24 评估数据
INSERT INTO assessments (report_id, category, content, status)
SELECT id, '运行评估', '系统运行平稳，各项指标正常。', 'normal' FROM daily_reports WHERE report_date = '2026-03-24';

INSERT INTO assessments (report_id, category, content, status)
SELECT id, '容量预警', '资源水位健康，暂无扩容需求。', 'normal' FROM daily_reports WHERE report_date = '2026-03-24';

INSERT INTO assessments (report_id, category, content, status)
SELECT id, '趋势分析', '系统负载稳定，预计未来无重大变化。', 'normal' FROM daily_reports WHERE report_date = '2026-03-24';

-- 2026-03-24 行动计划
INSERT INTO action_plans (report_id, priority, items, insight)
SELECT id, 'P2', '["维持日常监控。", "关注即将到来的业务高峰。"]', '保持日常运维，为业务高峰做好准备。' FROM daily_reports WHERE report_date = '2026-03-24';

-- 2026-03-23 评估数据
INSERT INTO assessments (report_id, category, content, status)
SELECT id, '运行评估', '各集群运行正常，无异常告警。', 'normal' FROM daily_reports WHERE report_date = '2026-03-23';

INSERT INTO assessments (report_id, category, content, status)
SELECT id, '容量预警', '所有资源水位在安全范围内。', 'normal' FROM daily_reports WHERE report_date = '2026-03-23';

INSERT INTO assessments (report_id, category, content, status)
SELECT id, '趋势分析', '系统整体趋势平稳，建议持续监控。', 'normal' FROM daily_reports WHERE report_date = '2026-03-23';

-- 2026-03-23 行动计划
INSERT INTO action_plans (report_id, priority, items, insight)
SELECT id, 'P2', '["执行日常巡检。", "检查备份策略执行情况。"]', '维持日常运维，确保系统稳定。' FROM daily_reports WHERE report_date = '2026-03-23';

-- 2026-03-22 评估数据
INSERT INTO assessments (report_id, category, content, status)
SELECT id, '运行评估', '系统运行正常，所有核心指标在正常范围内。', 'normal' FROM daily_reports WHERE report_date = '2026-03-22';

INSERT INTO assessments (report_id, category, content, status)
SELECT id, '容量预警', '磁盘使用率趋势稳定，预计未来30天内不会触及阈值。', 'normal' FROM daily_reports WHERE report_date = '2026-03-22';

INSERT INTO assessments (report_id, category, content, status)
SELECT id, '趋势分析', 'CPU使用率较平稳，系统负载正常。', 'normal' FROM daily_reports WHERE report_date = '2026-03-22';

-- 2026-03-22 行动计划
INSERT INTO action_plans (report_id, priority, items, insight)
SELECT id, 'P2', '["持续监控各集群核心指标。", "关注流量变化趋势。"]', '维持日常监控，确保系统稳定运行。' FROM daily_reports WHERE report_date = '2026-03-22';

-- 验证数据
SELECT 'Assessments:' as type, COUNT(*) as count FROM assessments
UNION ALL
SELECT 'Action Plans:', COUNT(*) FROM action_plans;
