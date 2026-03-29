-- 启用所有表的公开读取权限
-- 请在 Supabase SQL Editor 中执行

-- 禁用 RLS 或添加公开访问策略
ALTER TABLE clusters ENABLE ROW LEVEL SECURITY;
ALTER TABLE log_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE cloud_regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE action_plans ENABLE ROW LEVEL SECURITY;

-- 为所有表添加 anon 公开读取策略
CREATE POLICY "Allow anon read access on clusters" ON clusters FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon read access on log_metrics" ON log_metrics FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon read access on daily_reports" ON daily_reports FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon read access on cloud_regions" ON cloud_regions FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon read access on assessments" ON assessments FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon read access on action_plans" ON action_plans FOR SELECT TO anon USING (true);

-- 验证策略
SELECT schemaname, tablename, policyname, permissive, roles, cmd 
FROM pg_policies 
WHERE schemaname = 'public';
