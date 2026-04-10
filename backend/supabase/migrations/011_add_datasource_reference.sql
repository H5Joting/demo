-- 为 business_systems 表添加 datasource_reference 列
-- 用于存储导入报表的数据源引用信息

ALTER TABLE business_systems ADD COLUMN IF NOT EXISTS datasource_reference JSONB DEFAULT NULL;

-- 添加注释说明
COMMENT ON COLUMN business_systems.datasource_reference IS '数据源引用配置，包含 original_uid、datasource_type、panels 等信息';

SELECT 'datasource_reference column added to business_systems table' as message;
