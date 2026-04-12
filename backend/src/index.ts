import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { Resolver, setDefaultResultOrder } from 'node:dns';
import { setGlobalDispatcher, Agent } from 'undici';
import apiRouter from './routes/api';
import { initDatabase, getSupabase, isDatabaseConnected, setUseSupabaseEnabled } from './database/supabase';

setDefaultResultOrder('ipv4first');
const resolver = new Resolver();
resolver.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

setGlobalDispatcher(new Agent({
  keepAliveTimeout: 10000,
  keepAliveMaxTimeout: 60000,
  connections: 100
}));

const app = express();
const PORT = process.env.PORT || 3010;

app.use(cors());
app.use(express.json());

app.use('/api', apiRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

function getYesterday(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split('T')[0];
}

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

async function insertAllSystemsData() {
  const supabase = getSupabase();
  if (!supabase || !isDatabaseConnected()) {
    console.log('数据库未连接，跳过数据插入');
    return;
  }

  const yesterday = getYesterday();
  console.log(`\n检查昨日数据 (${yesterday})...`);

  try {
    const { data: businessSystems, error: bsError } = await supabase
      .from('business_systems')
      .select('id, name, code');

    if (bsError || !businessSystems) {
      console.log('获取业务系统失败:', bsError?.message);
      return;
    }

    console.log(`找到 ${businessSystems.length} 个业务系统\n`);

    for (const system of businessSystems) {
      console.log(`\n处理业务系统: ${system.name} (${system.code})`);
      console.log('----------------------------------------');

      const { data: clusters } = await supabase
        .from('clusters')
        .select('*')
        .eq('business_system_id', system.id);

      if (!clusters || clusters.length === 0) {
        console.log('  ⚠️  没有集群，跳过');
        continue;
      }

      console.log(`集群数量: ${clusters.length}`);

      const { data: existingReport } = await supabase
        .from('daily_reports')
        .select('id')
        .eq('business_system_id', system.id)
        .eq('report_date', yesterday)
        .maybeSingle();

      let reportId: string;

      if (existingReport) {
        reportId = existingReport.id;
        console.log('  ℹ️  日报已存在，跳过插入');
      } else {
        const report = {
          id: generateUUID(),
          report_date: yesterday,
          business_system_id: system.id,
          system_status: 'normal',
          system_status_text: '系统运行正常',
          system_insight: `${system.name}运行稳定，各项指标正常，无明显瓶颈。`,
          wx_cluster_eps_rate: 75 + Math.floor(Math.random() * 20),
          wx_cluster_eps_peak: 8 + Math.round(Math.random() * 5 * 10) / 10,
          wx_cluster_eps_peak_date: yesterday,
          wx_cluster_insight: '主集群运行正常，性能稳定。',
          wx_cluster_description: '集群运行正常，各项指标稳定。',
          nf_cluster_eps_rate: 55 + Math.floor(Math.random() * 15),
          nf_cluster_eps_peak: 4 + Math.round(Math.random() * 3 * 10) / 10,
          nf_cluster_eps_peak_date: yesterday,
          nf_cluster_insight: '备集群运行正常，备份功能正常。',
          nf_cluster_description: '备集群运行正常。',
          created_at: `${yesterday}T08:00:00Z`,
          updated_at: `${yesterday}T08:00:00Z`
        };

        const { error, data } = await supabase
          .from('daily_reports')
          .insert(report)
          .select('id')
          .single();

        if (error) {
          console.log(`  ✗ 日报插入失败: ${error.message}`);
          continue;
        }

        reportId = data.id;
        console.log('  ✓ 日报插入成功');
      }

      const { count: existingMetrics } = await supabase
        .from('log_metrics')
        .select('*', { count: 'exact', head: true })
        .eq('report_date', yesterday)
        .in('cluster_id', clusters.map(c => c.id));

      if (existingMetrics === 0) {
        const metrics: any[] = [];
        const metricTemplates = [
          { name: '请求量', nameEn: 'Request Count', layer: 'access', unit: '次', baseValue: 100000 },
          { name: '响应时间', nameEn: 'Response Time', layer: 'application', unit: 'ms', baseValue: 50 },
          { name: 'CPU使用率', nameEn: 'CPU Usage', layer: 'application', unit: '%', baseValue: 70 },
          { name: '内存使用率', nameEn: 'Memory Usage', layer: 'application', unit: '%', baseValue: 75 },
          { name: 'TPS', nameEn: 'TPS', layer: 'application', unit: 'tps', baseValue: 10 },
          { name: '平均搜索耗时', nameEn: 'Avg Search Time', layer: 'storage', unit: 'ms', baseValue: 100 },
          { name: '日志入库耗时', nameEn: 'Log Ingest Time', layer: 'buffer', unit: 'ms', baseValue: 80 },
          { name: '监控延迟', nameEn: 'Monitor Latency', layer: 'application', unit: 'ms', baseValue: 30 },
        ];

        for (const cluster of clusters) {
          const isMain = cluster.type === 'wx';
          const multiplier = isMain ? 1 : 0.6;

          for (const template of metricTemplates) {
            const baseValue = template.baseValue * multiplier;
            const variance = template.baseValue * 0.15;

            metrics.push({
              id: generateUUID(),
              cluster_id: cluster.id,
              report_date: yesterday,
              metric_name: template.name,
              metric_name_en: template.nameEn,
              layer: template.layer,
              today_max: Math.round(baseValue + variance * (Math.random() * 0.5 + 0.5)),
              today_avg: Math.round(baseValue),
              yesterday_max: Math.round(baseValue + variance * (Math.random() * 0.5 + 0.3)),
              yesterday_avg: Math.round(baseValue - variance * 0.2),
              historical_max: Math.round(baseValue + variance * 1.5),
              historical_max_date: '2026-03-15',
              sla_threshold: Math.round(baseValue * 0.85),
              unit: template.unit,
              change_rate: Math.round((Math.random() * 10 - 5) * 10) / 10,
              health_status: 'healthy',
              created_at: `${yesterday}T08:00:00Z`,
              updated_at: `${yesterday}T08:00:00Z`
            });
          }
        }

        const { error: metricsError } = await supabase.from('log_metrics').insert(metrics);
        if (metricsError) {
          console.log(`  ✗ 指标插入失败: ${metricsError.message}`);
        } else {
          console.log(`  ✓ 插入 ${metrics.length} 条日志指标`);
        }
      } else {
        console.log(`  ℹ️  日志指标已存在 (${existingMetrics} 条)，跳过插入`);
      }

      const { count: existingRegions } = await supabase
        .from('cloud_regions')
        .select('*', { count: 'exact', head: true })
        .eq('report_date', yesterday)
        .in('cluster_id', clusters.map(c => c.id));

      if (existingRegions === 0) {
        const regions: any[] = [];
        const regionTemplates = [
          { name: '华东-上海', baseTraffic: 12000 },
          { name: '华北-北京', baseTraffic: 9500 },
          { name: '华南-广州', baseTraffic: 8000 },
          { name: '西南-成都', baseTraffic: 6000 },
          { name: '华中-武汉', baseTraffic: 5000 },
        ];

        for (const cluster of clusters) {
          const isMain = cluster.type === 'wx';
          const multiplier = isMain ? 1.5 : 0.6;

          for (const template of regionTemplates) {
            regions.push({
              id: generateUUID(),
              cluster_id: cluster.id,
              report_date: yesterday,
              name: template.name,
              node_count: Math.floor((Math.random() * 15 + 10) * (isMain ? 1.2 : 0.7)),
              current_traffic: Math.round(template.baseTraffic * multiplier),
              peak_traffic: Math.round(template.baseTraffic * multiplier * 1.3),
              region_type: cluster.type,
              created_at: `${yesterday}T08:00:00Z`,
              updated_at: `${yesterday}T08:00:00Z`
            });
          }
        }

        const { error: regionsError } = await supabase.from('cloud_regions').insert(regions);
        if (regionsError) {
          console.log(`  ✗ 云区域插入失败: ${regionsError.message}`);
        } else {
          console.log(`  ✓ 插入 ${regions.length} 个云区域`);
        }
      } else {
        console.log(`  ℹ️  云区域已存在 (${existingRegions} 条)，跳过插入`);
      }

      const { count: existingAssessments } = await supabase
        .from('assessments')
        .select('*', { count: 'exact', head: true })
        .eq('report_id', reportId);

      if (existingAssessments === 0) {
        const assessments = [
          {
            id: generateUUID(),
            report_id: reportId,
            category: '系统稳定性',
            content: `${system.name}运行稳定，无异常告警。`,
            status: 'normal',
            created_at: `${yesterday}T08:00:00Z`
          },
          {
            id: generateUUID(),
            report_id: reportId,
            category: '性能评估',
            content: '系统性能正常，响应时间在合理范围内。',
            status: 'normal',
            created_at: `${yesterday}T08:00:00Z`
          },
          {
            id: generateUUID(),
            report_id: reportId,
            category: '资源使用',
            content: 'CPU和内存使用率在合理范围内，存储空间充足。',
            status: 'normal',
            created_at: `${yesterday}T08:00:00Z`
          },
          {
            id: generateUUID(),
            report_id: reportId,
            category: '数据处理',
            content: '数据处理效率正常，无积压现象。',
            status: 'normal',
            created_at: `${yesterday}T08:00:00Z`
          }
        ];

        const { error: assessmentsError } = await supabase.from('assessments').insert(assessments);
        if (assessmentsError) {
          console.log(`  ✗ 评估插入失败: ${assessmentsError.message}`);
        } else {
          console.log(`  ✓ 插入 ${assessments.length} 条评估`);
        }
      } else {
        console.log(`  ℹ️  评估已存在 (${existingAssessments} 条)，跳过插入`);
      }

      const { count: existingPlans } = await supabase
        .from('action_plans')
        .select('*', { count: 'exact', head: true })
        .eq('report_id', reportId);

      if (existingPlans === 0) {
        const plans = [
          {
            id: generateUUID(),
            report_id: reportId,
            priority: '高',
            items: ['持续监控系统运行状态', '关注资源使用趋势'],
            insight: '建议关注系统负载变化，做好容量规划。',
            created_at: `${yesterday}T08:00:00Z`
          },
          {
            id: generateUUID(),
            report_id: reportId,
            priority: '中',
            items: ['定期检查存储空间使用情况', '优化查询性能'],
            insight: '存储空间充足，建议定期进行性能优化。',
            created_at: `${yesterday}T08:00:00Z`
          },
          {
            id: generateUUID(),
            report_id: reportId,
            priority: '低',
            items: ['更新监控告警配置', '完善报表功能'],
            insight: '系统运行平稳，可按计划进行功能迭代。',
            created_at: `${yesterday}T08:00:00Z`
          }
        ];

        const { error: plansError } = await supabase.from('action_plans').insert(plans);
        if (plansError) {
          console.log(`  ✗ 行动计划插入失败: ${plansError.message}`);
        } else {
          console.log(`  ✓ 插入 ${plans.length} 条行动计划`);
        }
      } else {
        console.log(`  ℹ️  行动计划已存在 (${existingPlans} 条)，跳过插入`);
      }
    }

    console.log('\n✅ 所有业务系统数据插入完成！');
  } catch (error: any) {
    console.error('插入数据失败:', error.message);
  }
}

const startServer = async () => {
  try {
    await initDatabase();
    
    setUseSupabaseEnabled(true);
    
    await insertAllSystemsData();
    
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
