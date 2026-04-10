-- 为 business_systems 表添加 RLS 策略
-- 允许 anon 角色进行读取和写入操作

-- 启用 RLS
ALTER TABLE business_systems ENABLE ROW LEVEL SECURITY;

-- 允许 anon 读取
CREATE POLICY "Allow anon read access on business_systems" ON business_systems FOR SELECT TO anon USING (true);

-- 允许 anon 插入
CREATE POLICY "Allow anon insert access on business_systems" ON business_systems FOR INSERT TO anon WITH CHECK (true);

-- 允许 anon 更新
CREATE POLICY "Allow anon update access on business_systems" ON business_systems FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- 为其他表添加写入策略（导入功能需要）
-- clusters 表
CREATE POLICY "Allow anon insert access on clusters" ON clusters FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anon update access on clusters" ON clusters FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- daily_reports 表
CREATE POLICY "Allow anon insert access on daily_reports" ON daily_reports FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anon update access on daily_reports" ON daily_reports FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- log_metrics 表
CREATE POLICY "Allow anon insert access on log_metrics" ON log_metrics FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anon update access on log_metrics" ON log_metrics FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- cloud_regions 表
CREATE POLICY "Allow anon insert access on cloud_regions" ON cloud_regions FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anon update access on cloud_regions" ON cloud_regions FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- assessments 表
CREATE POLICY "Allow anon insert access on assessments" ON assessments FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anon update access on assessments" ON assessments FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- action_plans 表
CREATE POLICY "Allow anon insert access on action_plans" ON action_plans FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anon update access on action_plans" ON action_plans FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- 验证策略
SELECT schemaname, tablename, policyname, permissive, roles, cmd 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
