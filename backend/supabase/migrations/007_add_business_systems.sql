-- 业务系统表迁移脚本
-- 创建 business_systems 表并插入模拟数据

-- ============================================
-- 1. 创建业务系统表
-- ============================================
CREATE TABLE IF NOT EXISTS business_systems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. 为 clusters 表添加 business_system_id 字段
-- ============================================
ALTER TABLE clusters ADD COLUMN IF NOT EXISTS business_system_id UUID REFERENCES business_systems(id) ON DELETE SET NULL;

-- ============================================
-- 3. 为 daily_reports 表添加 business_system_id 字段
-- ============================================
ALTER TABLE daily_reports ADD COLUMN IF NOT EXISTS business_system_id UUID REFERENCES business_systems(id) ON DELETE SET NULL;

-- ============================================
-- 4. 插入业务系统模拟数据
-- ============================================
INSERT INTO business_systems (id, name, code, description, status) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '统一日志平台', 'unified-log', '统一日志分析平台运维报表系统', 'active'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '支付中心', 'payment-center', '支付中心业务系统运维报表', 'active'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', '订单系统', 'order-system', '订单管理系统运维报表', 'active');

-- ============================================
-- 5. 迁移现有数据关联到默认业务系统
-- ============================================
UPDATE clusters SET business_system_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' WHERE business_system_id IS NULL;
UPDATE daily_reports SET business_system_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' WHERE business_system_id IS NULL;

-- ============================================
-- 6. 创建索引
-- ============================================
CREATE INDEX IF NOT EXISTS idx_clusters_business_system_id ON clusters(business_system_id);
CREATE INDEX IF NOT EXISTS idx_daily_reports_business_system_id ON daily_reports(business_system_id);

-- 完成
SELECT 'Business systems migration completed successfully!' as message;
