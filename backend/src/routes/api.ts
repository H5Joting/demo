import express from 'express';
import { Router } from 'express';
import { getSupabase, isDatabaseConnected, setConnectionFailed, testConnection, resetConnection, isUseSupabaseEnabled, setUseSupabaseEnabled, getDataSourceStatus } from '../database/supabase';
import {
  getMockBusinessSystems,
  getMockBusinessSystemById,
  getMockClustersByBusinessSystem,
  getMockDailyReportByDateAndSystem,
  getMockLogMetricsByReport,
  getMockCloudRegionsByReport,
  getMockAssessmentsByReport,
  getMockActionPlansByReport,
  getMockAvailableDates,
  mockData
} from '../database/mockData';

const router = Router();

const WX_CLUSTER_ID = '11111111-1111-1111-1111-111111111111';
const NF_CLUSTER_ID = '22222222-2222-2222-2222-222222222222';
const DEFAULT_BUSINESS_SYSTEM_ID = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

const DB_ERROR_RESPONSE = { success: false, error: '数据库连接失败，请检查数据库配置', code: 'DATABASE_ERROR' };

let useMockData = false;

function shouldUseMockData(): boolean {
  if (!isUseSupabaseEnabled()) {
    return true;
  }
  return useMockData || !isDatabaseConnected();
}

async function ensureConnection(): Promise<boolean> {
  if (!isUseSupabaseEnabled()) {
    return false;
  }
  
  if (useMockData) {
    return false;
  }
  
  if (isDatabaseConnected()) {
    return true;
  }
  
  console.log('Attempting to reconnect to database...');
  resetConnection();
  const connected = await testConnection();
  if (!connected) {
    console.log('Database unavailable, switching to mock data mode');
    useMockData = true;
  }
  return connected;
}

router.get('/data-source', async (req: express.Request, res: express.Response) => {
  try {
    const status = getDataSourceStatus();
    res.json({ success: true, data: status });
  } catch (error) {
    console.error('Failed to get data source status:', error);
    res.json({ success: true, data: { enabled: false, source: 'mock', connected: false } });
  }
});

router.post('/data-source/toggle', async (req: express.Request, res: express.Response) => {
  try {
    const { enabled } = req.body;
    if (typeof enabled !== 'boolean') {
      return res.status(400).json({ success: false, error: 'Invalid enabled value, must be boolean' });
    }
    
    setUseSupabaseEnabled(enabled);
    
    if (!enabled) {
      useMockData = true;
    } else {
      useMockData = false;
      resetConnection();
    }
    
    const status = getDataSourceStatus();
    res.json({ success: true, data: status });
  } catch (error) {
    console.error('Failed to toggle data source:', error);
    res.status(500).json({ success: false, error: 'Failed to toggle data source' });
  }
});

router.get('/business-systems', async (req: express.Request, res: express.Response) => {
  try {
    if (shouldUseMockData()) {
      const data = getMockBusinessSystems();
      return res.json({ success: true, data });
    }
    
    if (!await ensureConnection()) {
      const data = getMockBusinessSystems();
      return res.json({ success: true, data });
    }
    
    const supabase = getSupabase();
    const { data, error } = await supabase!.from('business_systems').select('*').order('created_at', { ascending: true });
    if (error) throw error;
    res.json({ success: true, data: data || [] });
  } catch (error) {
    console.error('Failed to fetch business systems:', error);
    setConnectionFailed();
    useMockData = true;
    const data = getMockBusinessSystems();
    res.json({ success: true, data });
  }
});

router.get('/business-systems/:id', async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    
    if (shouldUseMockData()) {
      const data = getMockBusinessSystemById(id);
      if (!data) {
        return res.status(404).json({ success: false, error: 'Business system not found' });
      }
      return res.json({ success: true, data });
    }
    
    if (!await ensureConnection()) {
      const data = getMockBusinessSystemById(id);
      if (!data) {
        return res.status(404).json({ success: false, error: 'Business system not found' });
      }
      return res.json({ success: true, data });
    }
    
    const supabase = getSupabase();
    const { data, error } = await supabase!.from('business_systems').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    if (!data) {
      return res.status(404).json({ success: false, error: 'Business system not found' });
    }
    res.json({ success: true, data });
  } catch (error) {
    console.error('Failed to fetch business system:', error);
    setConnectionFailed();
    useMockData = true;
    const data = getMockBusinessSystemById(req.params.id);
    if (!data) {
      return res.status(404).json({ success: false, error: 'Business system not found' });
    }
    res.json({ success: true, data });
  }
});

router.get('/clusters', async (req: express.Request, res: express.Response) => {
  try {
    const { businessSystemId } = req.query;
    
    if (shouldUseMockData()) {
      const data = businessSystemId 
        ? getMockClustersByBusinessSystem(businessSystemId as string)
        : mockData.clusters;
      return res.json({ success: true, data });
    }
    
    if (!await ensureConnection()) {
      const data = businessSystemId 
        ? getMockClustersByBusinessSystem(businessSystemId as string)
        : mockData.clusters;
      return res.json({ success: true, data });
    }
    
    const supabase = getSupabase();
    let query = supabase!.from('clusters').select('*');
    if (businessSystemId && typeof businessSystemId === 'string') {
      query = query.eq('business_system_id', businessSystemId);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    console.error('Failed to fetch clusters:', error);
    setConnectionFailed();
    useMockData = true;
    const data = req.query.businessSystemId 
      ? getMockClustersByBusinessSystem(req.query.businessSystemId as string)
      : mockData.clusters;
    res.json({ success: true, data });
  }
});

router.get('/metrics/:clusterId', async (req: express.Request, res: express.Response) => {
  try {
    const { clusterId } = req.params;
    const { date } = req.query;
    const reportDate = typeof date === 'string' ? date : new Date().toISOString().split('T')[0];
    
    if (shouldUseMockData() || !await ensureConnection()) {
      const cluster = mockData.clusters.find(c => c.id === clusterId);
      if (!cluster) {
        return res.json({ success: true, data: [] });
      }
      const report = getMockDailyReportByDateAndSystem(reportDate, cluster.business_system_id);
      if (!report) {
        return res.json({ success: true, data: [] });
      }
      const data = getMockLogMetricsByReport(report.id);
      return res.json({ success: true, data });
    }
    
    const supabase = getSupabase();
    const { data, error } = await supabase!.from('log_metrics').select('*').eq('cluster_id', clusterId).eq('report_date', reportDate);
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    console.error('Failed to fetch metrics:', error);
    setConnectionFailed();
    res.json({ success: true, data: [] });
  }
});

router.get('/regions', async (req: express.Request, res: express.Response) => {
  try {
    const { date, businessSystemId } = req.query;
    const reportDate = typeof date === 'string' ? date : new Date().toISOString().split('T')[0];
    
    if (shouldUseMockData() || !await ensureConnection()) {
      return res.json({ success: true, data: [] });
    }
    
    const supabase = getSupabase();
    let query = supabase!.from('cloud_regions').select('*, clusters!inner(*)').eq('report_date', reportDate);
    if (businessSystemId && typeof businessSystemId === 'string') {
      query = query.eq('clusters.business_system_id', businessSystemId);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    console.error('Failed to fetch regions:', error);
    setConnectionFailed();
    res.json({ success: true, data: [] });
  }
});

router.get('/dashboard/summary', async (req: express.Request, res: express.Response) => {
  try {
    const { date, businessSystemId } = req.query;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const reportDate = typeof date === 'string' ? date : yesterday.toISOString().split('T')[0];
    const bsId = businessSystemId && typeof businessSystemId === 'string' ? businessSystemId : DEFAULT_BUSINESS_SYSTEM_ID;
    
    if (shouldUseMockData() || !await ensureConnection()) {
      const report = getMockDailyReportByDateAndSystem(reportDate, bsId);
      const clusters = getMockClustersByBusinessSystem(bsId);
      const wxCluster = clusters.find((c: any) => c.type === 'wx') || clusters[0];
      const nfCluster = clusters.find((c: any) => c.type === 'nf') || clusters[1];
      
      const reportId = report?.id || `mock-${bsId}-${reportDate}`;
      const allMetrics = getMockLogMetricsByReport(reportId);
      const wxClusterId = wxCluster?.id;
      const nfClusterId = nfCluster?.id;
      const wxMetrics = allMetrics.filter((m: any) => m.cluster_id === wxClusterId);
      const nfMetrics = allMetrics.filter((m: any) => m.cluster_id === nfClusterId);
      
      const allRegions = getMockCloudRegionsByReport(reportId);
      const topRegions = allRegions.slice(0, 5).map((r: any) => ({
        ...r,
        cluster_name: r.cluster_id === wxClusterId ? wxCluster?.name : nfCluster?.name,
        cluster_type: r.cluster_id === wxClusterId ? 'wx' : 'nf'
      }));
      
      const assessments = getMockAssessmentsByReport(reportId);
      const actionPlans = getMockActionPlansByReport(reportId);
      
      const slaMetrics = allMetrics.filter((m: any) => 
        ['平均搜索耗时', 'CPU使用率', '日志入库耗时', '监控延迟'].includes(m.metric_name)
      ).map((m: any) => ({ ...m, cluster_name: m.cluster_id === wxClusterId ? wxCluster?.name : nfCluster?.name }));
      
      return res.json({
        success: true,
        data: {
          report,
          wxCluster,
          nfCluster,
          wxMetrics,
          nfMetrics,
          slaMetrics,
          topRegions,
          regionStats: { 
            total_regions: allRegions.length, 
            nf_regions: allRegions.filter((r: any) => r.cluster_id === nfClusterId).length, 
            wx_regions: allRegions.filter((r: any) => r.cluster_id === wxClusterId).length, 
            avg_traffic: allRegions.length > 0 ? allRegions.reduce((sum: number, r: any) => sum + (r.current_traffic || 0), 0) / allRegions.length : 0
          },
          assessments,
          actionPlans,
        },
      });
    }
    
    const supabase = getSupabase();

    const { data: report } = await supabase!.from('daily_reports').select('*').eq('report_date', reportDate).eq('business_system_id', bsId).maybeSingle();
    const { data: clusters } = await supabase!.from('clusters').select('*').eq('business_system_id', bsId);
    
    const wxCluster = clusters?.find((c: any) => c.type === 'wx') || { id: WX_CLUSTER_ID, name: '威新集群', name_en: 'WX CLUSTER', type: 'wx' };
    const nfCluster = clusters?.find((c: any) => c.type === 'nf') || { id: NF_CLUSTER_ID, name: '南方集群', name_en: 'NF CLUSTER', type: 'nf' };
    const wxClusterId = wxCluster?.id || WX_CLUSTER_ID;
    const nfClusterId = nfCluster?.id || NF_CLUSTER_ID;
    const reportId = report?.id;
    
    const { data: wxMetrics } = await supabase!.from('log_metrics').select('*').eq('cluster_id', wxClusterId).eq('report_date', reportDate);
    const { data: nfMetrics } = await supabase!.from('log_metrics').select('*').eq('cluster_id', nfClusterId).eq('report_date', reportDate);
    
    const clusterIds = clusters?.map((c: any) => c.id) || [];
    const { data: slaMetricsRaw } = await supabase!.from('log_metrics').select('*, clusters(name)').in('metric_name', ['平均搜索耗时', 'CPU使用率', '日志入库耗时', '监控延迟']).eq('report_date', reportDate).in('cluster_id', clusterIds.length > 0 ? clusterIds : [WX_CLUSTER_ID, NF_CLUSTER_ID]).order('metric_name', { ascending: true });
    
    const { data: topRegionsRaw } = await supabase!.from('cloud_regions').select('*, clusters(name, type)').eq('report_date', reportDate).in('cluster_id', clusterIds.length > 0 ? clusterIds : [WX_CLUSTER_ID, NF_CLUSTER_ID]).order('current_traffic', { ascending: false }).limit(5);
    const { data: avgData } = await supabase!.from('cloud_regions').select('current_traffic').eq('report_date', reportDate).in('cluster_id', clusterIds.length > 0 ? clusterIds : [WX_CLUSTER_ID, NF_CLUSTER_ID]);
    const { count: total_regions } = await supabase!.from('cloud_regions').select('*', { count: 'exact', head: true }).eq('report_date', reportDate).in('cluster_id', clusterIds.length > 0 ? clusterIds : [WX_CLUSTER_ID, NF_CLUSTER_ID]);
    const { count: nf_regions } = await supabase!.from('cloud_regions').select('*', { count: 'exact', head: true }).eq('cluster_id', nfClusterId).eq('report_date', reportDate);
    const { count: wx_regions } = await supabase!.from('cloud_regions').select('*', { count: 'exact', head: true }).eq('cluster_id', wxClusterId).eq('report_date', reportDate);
    
    let assessments: any[] = [];
    let actionPlans: any[] = [];
    if (reportId) {
      const { data: assessmentsData } = await supabase!.from('assessments').select('*').eq('report_id', reportId);
      const { data: actionPlansRaw } = await supabase!.from('action_plans').select('*').eq('report_id', reportId);
      assessments = assessmentsData || [];
      actionPlans = actionPlansRaw?.map((p: any) => ({ ...p, items: typeof p.items === 'string' ? JSON.parse(p.items) : p.items })) || [];
    }

    const slaMetrics = slaMetricsRaw?.map((m: any) => ({ ...m, cluster_name: m.clusters?.name })) || [];
    const topRegions = topRegionsRaw?.map((r: any) => ({ ...r, cluster_name: r.clusters?.name, cluster_type: r.clusters?.type })) || [];
    const avg_traffic = avgData && avgData.length > 0 ? avgData.reduce((sum: number, r: any) => sum + (r.current_traffic || 0), 0) / avgData.length : 0;

    res.json({
      success: true,
      data: {
        report,
        wxCluster,
        nfCluster,
        wxMetrics: wxMetrics || [],
        nfMetrics: nfMetrics || [],
        slaMetrics,
        topRegions,
        regionStats: { total_regions: total_regions || 0, nf_regions: nf_regions || 0, wx_regions: wx_regions || 0, avg_traffic },
        assessments,
        actionPlans,
      },
    });
  } catch (error) {
    console.error('Dashboard summary error:', error);
    setConnectionFailed();
    useMockData = true;
    
    const { date, businessSystemId } = req.query;
    const reportDate = typeof date === 'string' ? date : new Date().toISOString().split('T')[0];
    const bsId = businessSystemId && typeof businessSystemId === 'string' ? businessSystemId : DEFAULT_BUSINESS_SYSTEM_ID;
    
    const report = getMockDailyReportByDateAndSystem(reportDate, bsId);
    const clusters = getMockClustersByBusinessSystem(bsId);
    const wxCluster = clusters[0];
    const nfCluster = clusters[1];
    const reportId = report?.id || `${bsId}-${reportDate}`;
    
    res.json({
      success: true,
      data: {
        report,
        wxCluster,
        nfCluster,
        wxMetrics: getMockLogMetricsByReport(reportId),
        nfMetrics: getMockLogMetricsByReport(reportId),
        slaMetrics: [],
        topRegions: [],
        regionStats: { total_regions: 0, nf_regions: 0, wx_regions: 0, avg_traffic: 0 },
        assessments: getMockAssessmentsByReport(reportId),
        actionPlans: getMockActionPlansByReport(reportId),
      },
    });
  }
});

router.get('/available-dates', async (req: express.Request, res: express.Response) => {
  try {
    const { businessSystemId } = req.query;
    
    if (shouldUseMockData() || !await ensureConnection()) {
      const dates = getMockAvailableDates(businessSystemId as string || DEFAULT_BUSINESS_SYSTEM_ID);
      const data = dates.map(date => ({ report_date: date, system_status: 'normal' }));
      return res.json({ success: true, data });
    }
    
    const supabase = getSupabase();
    let query = supabase!.from('daily_reports').select('report_date, system_status').order('report_date', { ascending: false });
    if (businessSystemId && typeof businessSystemId === 'string') {
      query = query.eq('business_system_id', businessSystemId);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    res.json({ success: true, data: data || [] });
  } catch (error) {
    console.error('Failed to fetch available dates:', error);
    setConnectionFailed();
    useMockData = true;
    const dates = getMockAvailableDates(req.query.businessSystemId as string || DEFAULT_BUSINESS_SYSTEM_ID);
    const data = dates.map(date => ({ report_date: date, system_status: 'normal' }));
    res.json({ success: true, data });
  }
});

router.get('/report-detail/:systemId', async (req: express.Request, res: express.Response) => {
  try {
    const { systemId } = req.params;
    const { date } = req.query;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const reportDate = typeof date === 'string' ? date : yesterday.toISOString().split('T')[0];
    
    if (shouldUseMockData() || !await ensureConnection()) {
      const system = getMockBusinessSystemById(systemId);
      if (!system) {
        return res.status(404).json({ success: false, error: 'System not found' });
      }
      return res.json({ success: true, data: { system, metrics: [], clusters: [] } });
    }
    
    const supabase = getSupabase();
    
    const { data: system, error: systemError } = await supabase!.from('business_systems').select('*').eq('id', systemId).maybeSingle();
    if (systemError) throw systemError;
    if (!system) {
      return res.status(404).json({ success: false, error: 'System not found' });
    }
    
    const { data: clusters } = await supabase!.from('clusters').select('*').eq('business_system_id', systemId);
    const clusterIds = clusters?.map(c => c.id) || [];
    
    const { data: logMetrics } = await supabase!.from('log_metrics')
      .select('*')
      .in('cluster_id', clusterIds.length > 0 ? clusterIds : ['00000000-0000-0000-0000-000000000000'])
      .eq('report_date', reportDate);
    
    const { data: dailyReport } = await supabase!.from('daily_reports')
      .select('*')
      .eq('business_system_id', systemId)
      .eq('report_date', reportDate)
      .maybeSingle();
    
    const aggregatedMetrics: { [key: string]: { values: number[], changeRates: number[] } } = {};
    
    (logMetrics || []).forEach(m => {
      if (!aggregatedMetrics[m.metric_name]) {
        aggregatedMetrics[m.metric_name] = { values: [], changeRates: [] };
      }
      aggregatedMetrics[m.metric_name].values.push(m.today_avg || 0);
      aggregatedMetrics[m.metric_name].changeRates.push(m.change_rate || 0);
    });
    
    const metrics: any[] = [];
    
    const primaryMetricMap: { [key: string]: string } = {
      'unified-log': '请求量',
      'payment-center': '交易量',
      'order-system': '订单量',
    };
    const primaryMetricName = primaryMetricMap[system.code] || '请求量';
    
    if (aggregatedMetrics[primaryMetricName]) {
      const data = aggregatedMetrics[primaryMetricName];
      const avgValue = data.values.reduce((a, b) => a + b, 0);
      const avgChange = data.changeRates.reduce((a, b) => a + b, 0) / data.changeRates.length;
      metrics.push({
        label: primaryMetricName,
        value: Math.round(avgValue).toLocaleString(),
        change: `${avgChange >= 0 ? '+' : ''}${avgChange.toFixed(1)}%`,
        trend: avgChange >= 0 ? 'up' : 'down',
      });
    }
    
    ['响应时间', 'CPU使用率', '内存使用率'].forEach(metricName => {
      if (aggregatedMetrics[metricName]) {
        const data = aggregatedMetrics[metricName];
        const avgValue = data.values.reduce((a, b) => a + b, 0) / data.values.length;
        const avgChange = data.changeRates.reduce((a, b) => a + b, 0) / data.changeRates.length;
        metrics.push({
          label: metricName,
          value: metricName === '响应时间' ? `${avgValue.toFixed(1)}ms` : `${avgValue.toFixed(1)}%`,
          change: `${avgChange >= 0 ? '+' : ''}${avgChange.toFixed(1)}%`,
          trend: avgChange >= 0 ? 'up' : 'down',
        });
      }
    });
    
    const reportTimeMap: Record<string, string> = {
      'unified-log': '08:00:00',
      'payment-center': '08:10:00',
      'order-system': '08:30:00',
    };
    const reportTime = reportTimeMap[system.code] || '08:00:00';
    
    res.json({
      success: true,
      data: {
        system,
        metrics,
        clusters: clusters || [],
        dailyReport,
        reportDate: reportDate + ' ' + reportTime,
      },
    });
  } catch (error) {
    console.error('Failed to fetch report detail:', error);
    setConnectionFailed();
    useMockData = true;
    const system = getMockBusinessSystemById(req.params.systemId);
    if (!system) {
      return res.status(404).json({ success: false, error: 'System not found' });
    }
    res.json({ success: true, data: { system, metrics: [], clusters: [] } });
  }
});

router.get('/business-systems-overview', async (req: express.Request, res: express.Response) => {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const reportDate = yesterday.toISOString().split('T')[0];
    
    if (shouldUseMockData() || !await ensureConnection()) {
      const systems = getMockBusinessSystems();
      const overviewData = systems.map(system => {
        const report = getMockDailyReportByDateAndSystem(reportDate, system.id);
        const reportId = report?.id || `mock-${system.id}-${reportDate}`;
        const allMetrics = getMockLogMetricsByReport(reportId);
        
        const primaryMetricMap: Record<string, string> = {
          'unified-log': '请求量',
          'payment-center': '交易量',
          'order-system': '订单量',
        };
        const primaryMetricName = primaryMetricMap[system.code] || '请求量';
        
        const metrics: any[] = [];
        
        const primaryMetrics = allMetrics.filter(m => m.metric_name === primaryMetricName);
        if (primaryMetrics.length > 0) {
          const totalAvg = primaryMetrics.reduce((sum, m) => sum + (m.today_avg || 0), 0);
          const avgChangeRate = primaryMetrics.reduce((sum, m) => sum + (m.change_rate || 0), 0) / primaryMetrics.length;
          metrics.push({
            label: primaryMetricName,
            value: Math.round(totalAvg).toLocaleString(),
            change: `${avgChangeRate >= 0 ? '+' : ''}${avgChangeRate.toFixed(1)}%`,
            trend: avgChangeRate >= 0 ? 'up' : 'down',
          });
        }
        
        ['响应时间', 'CPU使用率', '内存使用率'].forEach(metricName => {
          const vals = allMetrics.filter(m => m.metric_name === metricName);
          if (vals.length > 0) {
            const avgValue = vals.reduce((sum, m) => sum + (m.today_avg || 0), 0) / vals.length;
            const avgChangeRate = vals.reduce((sum, m) => sum + (m.change_rate || 0), 0) / vals.length;
            metrics.push({
              label: metricName,
              value: metricName === '响应时间' ? `${avgValue.toFixed(1)}ms` : `${avgValue.toFixed(1)}%`,
              change: `${avgChangeRate >= 0 ? '+' : ''}${avgChangeRate.toFixed(1)}%`,
              trend: avgChangeRate >= 0 ? 'up' : 'down',
            });
          }
        });
        
        if (metrics.length === 0) {
          metrics.push(
            { label: '请求量', value: '0', change: '+0.0%', trend: 'neutral' },
            { label: '响应时间', value: '0ms', change: '+0.0%', trend: 'neutral' },
            { label: 'CPU使用率', value: '0%', change: '+0.0%', trend: 'neutral' },
            { label: '内存使用率', value: '0%', change: '+0.0%', trend: 'neutral' },
          );
        }
        
        const reportTimeMap: Record<string, string> = {
          'unified-log': '08:00:00',
          'payment-center': '08:10:00',
          'order-system': '08:30:00',
        };
        
        return {
          id: system.id,
          name: system.name,
          code: system.code,
          description: system.description,
          status: system.status,
          metrics,
          report_date: reportDate + ' ' + (reportTimeMap[system.code] || '08:00:00'),
        };
      });
      return res.json({ success: true, data: overviewData });
    }
    
    const supabase = getSupabase();
    
    const { data: systems } = await supabase!.from('business_systems').select('*').order('created_at', { ascending: true });
    
    const overviewData = await Promise.all((systems || []).map(async (system) => {
      const { data: clusters } = await supabase!.from('clusters').select('id').eq('business_system_id', system.id);
      const clusterIds = clusters?.map(c => c.id) || [];
      
      let metrics: any[] = [];
      if (clusterIds.length > 0) {
        const { data: logMetrics } = await supabase!.from('log_metrics')
          .select('*')
          .in('cluster_id', clusterIds)
          .eq('report_date', reportDate)
          .in('metric_name', ['请求量', '交易量', '订单量', '响应时间', 'CPU使用率', '内存使用率']);
        
        if (logMetrics && logMetrics.length > 0) {
          const metricMap = new Map<string, any[]>();
          logMetrics.forEach(m => {
            if (!metricMap.has(m.metric_name)) {
              metricMap.set(m.metric_name, []);
            }
            metricMap.get(m.metric_name)!.push(m);
          });
          
          const getMetricLabel = (code: string, metricName: string) => {
            if (metricName === '交易量') return '交易量';
            if (metricName === '订单量') return '订单量';
            if (metricName === '请求量') return '请求量';
            return metricName;
          };
          
          const primaryMetrics = ['请求量', '交易量', '订单量'];
          const primaryMetric = primaryMetrics.find(name => metricMap.has(name));
          
          if (primaryMetric && metricMap.has(primaryMetric)) {
            const vals = metricMap.get(primaryMetric)!;
            const totalAvg = vals.reduce((sum, m) => sum + (m.today_avg || 0), 0);
            const avgChangeRate = vals.reduce((sum, m) => sum + (m.change_rate || 0), 0) / vals.length;
            metrics.push({
              label: getMetricLabel(system.code, primaryMetric),
              value: Math.round(totalAvg).toLocaleString(),
              change: `${avgChangeRate >= 0 ? '+' : ''}${avgChangeRate.toFixed(1)}%`,
              trend: avgChangeRate >= 0 ? 'up' : 'down',
            });
          }
          
          ['响应时间', 'CPU使用率', '内存使用率'].forEach(metricName => {
            if (metricMap.has(metricName)) {
              const vals = metricMap.get(metricName)!;
              const avgValue = vals.reduce((sum, m) => sum + (m.today_avg || 0), 0) / vals.length;
              const avgChangeRate = vals.reduce((sum, m) => sum + (m.change_rate || 0), 0) / vals.length;
              metrics.push({
                label: metricName,
                value: metricName === '响应时间' ? `${avgValue.toFixed(1)}ms` : `${avgValue.toFixed(1)}%`,
                change: `${avgChangeRate >= 0 ? '+' : ''}${avgChangeRate.toFixed(1)}%`,
                trend: avgChangeRate >= 0 ? 'up' : 'down',
              });
            }
          });
        }
      }
      
      if (metrics.length === 0) {
        metrics = [
          { label: '请求量', value: '0', change: '+0.0%', trend: 'neutral' },
          { label: '响应时间', value: '0ms', change: '+0.0%', trend: 'neutral' },
          { label: 'CPU使用率', value: '0%', change: '+0.0%', trend: 'neutral' },
          { label: '内存使用率', value: '0%', change: '+0.0%', trend: 'neutral' },
        ];
      }
      
      const reportTimeMap: Record<string, string> = {
        'unified-log': '08:00:00',
        'payment-center': '08:10:00',
        'order-system': '08:30:00',
      };
      const reportTime = reportTimeMap[system.code] || '08:00:00';
      
      return {
        id: system.id,
        name: system.name,
        code: system.code,
        description: system.description,
        status: system.status,
        metrics,
        report_date: reportDate + ' ' + reportTime,
      };
    }));
    
    res.json({ success: true, data: overviewData });
  } catch (error) {
    console.error('Failed to fetch business systems overview:', error);
    setConnectionFailed();
    useMockData = true;
    const systems = getMockBusinessSystems();
    const reportTimeMap: Record<string, string> = {
      'unified-log': '08:00:00',
      'payment-center': '08:10:00',
      'order-system': '08:30:00',
    };
    const overviewData = systems.map(system => ({
      id: system.id,
      name: system.name,
      code: system.code,
      description: system.description,
      status: system.status,
      metrics: [
        { label: '请求量', value: '0', change: '+0.0%', trend: 'neutral' },
        { label: '响应时间', value: '0ms', change: '+0.0%', trend: 'neutral' },
        { label: 'CPU使用率', value: '0%', change: '+0.0%', trend: 'neutral' },
        { label: '内存使用率', value: '0%', change: '+0.0%', trend: 'neutral' },
      ],
      report_date: reportDate + ' ' + (reportTimeMap[system.code] || '08:00:00'),
    }));
    res.json({ success: true, data: overviewData });
  }
});

router.get('/assessments', async (req, res) => {
  try {
    const { reportId } = req.query;
    
    if (shouldUseMockData()) {
      const assessments = reportId 
        ? getMockAssessmentsByReport(reportId as string)
        : mockData.assessments;
      return res.json({ success: true, data: assessments });
    }
    
    if (!await ensureConnection()) {
      const assessments = reportId 
        ? getMockAssessmentsByReport(reportId as string)
        : mockData.assessments;
      return res.json({ success: true, data: assessments });
    }
    
    let query = supabase!.from('assessments').select('*');
    if (reportId) {
      query = query.eq('report_id', reportId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Supabase error:', error);
      setConnectionFailed();
      useMockData = true;
      const assessments = reportId 
        ? getMockAssessmentsByReport(reportId as string)
        : mockData.assessments;
      return res.json({ success: true, data: assessments });
    }
    
    res.json({ success: true, data: data || [] });
  } catch (error) {
    console.error('Failed to fetch assessments:', error);
    setConnectionFailed();
    useMockData = true;
    const assessments = req.query.reportId 
      ? getMockAssessmentsByReport(req.query.reportId as string)
      : mockData.assessments;
    res.json({ success: true, data: assessments });
  }
});

router.get('/action-plans', async (req, res) => {
  try {
    const { reportId } = req.query;
    
    if (shouldUseMockData()) {
      const actionPlans = reportId 
        ? getMockActionPlansByReport(reportId as string)
        : mockData.actionPlans;
      return res.json({ success: true, data: actionPlans });
    }
    
    if (!await ensureConnection()) {
      const actionPlans = reportId 
        ? getMockActionPlansByReport(reportId as string)
        : mockData.actionPlans;
      return res.json({ success: true, data: actionPlans });
    }
    
    let query = supabase!.from('action_plans').select('*');
    if (reportId) {
      query = query.eq('report_id', reportId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Supabase error:', error);
      setConnectionFailed();
      useMockData = true;
      const actionPlans = reportId 
        ? getMockActionPlansByReport(reportId as string)
        : mockData.actionPlans;
      return res.json({ success: true, data: actionPlans });
    }
    
    res.json({ success: true, data: data || [] });
  } catch (error) {
    console.error('Failed to fetch action plans:', error);
    setConnectionFailed();
    useMockData = true;
    const actionPlans = req.query.reportId 
      ? getMockActionPlansByReport(req.query.reportId as string)
      : mockData.actionPlans;
    res.json({ success: true, data: actionPlans });
  }
});

export default router;
