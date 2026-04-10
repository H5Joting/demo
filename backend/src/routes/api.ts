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

router.get('/business-systems/overview', async (req: express.Request, res: express.Response) => {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const reportDateStr = yesterday.toISOString().split('T')[0];
    const reportDateTime = `${reportDateStr} 08:00:00`;
    
    if (shouldUseMockData()) {
      const systems = getMockBusinessSystems();
      const overviewData = systems.map(system => {
        const report = getMockDailyReportByDateAndSystem(reportDateStr, system.id);
        const clusters = getMockClustersByBusinessSystem(system.id);
        const wxCluster = clusters.find((c: any) => c.type === 'wx');
        const nfCluster = clusters.find((c: any) => c.type === 'nf');
        
        const systemStatus = report?.system_status || 'normal';
        
        return {
          id: system.id,
          name: system.name,
          code: system.code,
          description: system.description || '',
          status: system.status,
          system_status: systemStatus,
          metrics: [
            {
              label: '主集群 EPS',
              value: report ? `${report.wx_cluster_eps_rate}w` : '-',
              change: '-5.51%',
              trend: 'down'
            },
            {
              label: '备集群 EPS',
              value: report ? `${report.nf_cluster_eps_rate}w` : '-',
              change: '+2.3%',
              trend: 'up'
            }
          ],
          report_date: reportDateTime
        };
      });
      return res.json({ success: true, data: overviewData });
    }
    
    if (!await ensureConnection()) {
      const systems = getMockBusinessSystems();
      const overviewData = systems.map(system => {
        const report = getMockDailyReportByDateAndSystem(reportDateStr, system.id);
        
        const systemStatus = report?.system_status || 'normal';
        
        return {
          id: system.id,
          name: system.name,
          code: system.code,
          description: system.description || '',
          status: system.status,
          system_status: systemStatus,
          metrics: [
            {
              label: '主集群 EPS',
              value: report ? `${report.wx_cluster_eps_rate}w` : '-',
              change: '-5.51%',
              trend: 'down'
            },
            {
              label: '备集群 EPS',
              value: report ? `${report.nf_cluster_eps_rate}w` : '-',
              change: '+2.3%',
              trend: 'up'
            }
          ],
          report_date: reportDateTime
        };
      });
      return res.json({ success: true, data: overviewData });
    }
    
    const supabase = getSupabase();
    
    const { data: systems, error: systemsError } = await supabase!
      .from('business_systems')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (systemsError) throw systemsError;
    
    const { data: reports } = await supabase!
      .from('daily_reports')
      .select('*')
      .eq('report_date', reportDateStr);
    
    const overviewData = (systems || []).map(system => {
      const report = (reports || []).find(r => r.business_system_id === system.id);
      const systemStatus = report?.system_status || 'normal';
      
      return {
        id: system.id,
        name: system.name,
        code: system.code,
        description: system.description || '',
        status: system.status,
        system_status: systemStatus,
        metrics: [
          {
            label: '主集群 EPS',
            value: report?.wx_cluster_eps_rate ? `${report.wx_cluster_eps_rate}w` : '-',
            change: '-5.51%',
            trend: 'down'
          },
          {
            label: '备集群 EPS',
            value: report?.nf_cluster_eps_rate ? `${report.nf_cluster_eps_rate}w` : '-',
            change: '+2.3%',
            trend: 'up'
          }
        ],
        report_date: reportDateTime
      };
    });
    
    res.json({ success: true, data: overviewData });
  } catch (error) {
    console.error('Failed to fetch business systems overview:', error);
    setConnectionFailed();
    useMockData = true;
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const reportDate = yesterday.toISOString().split('T')[0];
    const reportDateTime = `${reportDate} 08:00:00`;
    
    const systems = getMockBusinessSystems();
    const overviewData = systems.map(system => {
      const report = getMockDailyReportByDateAndSystem(reportDate, system.id);
      const systemStatus = report?.system_status || 'normal';
      
      return {
        id: system.id,
        name: system.name,
        code: system.code,
        description: system.description || '',
        status: system.status,
        system_status: systemStatus,
        metrics: [
          {
            label: '主集群 EPS',
            value: report ? `${report.wx_cluster_eps_rate}w` : '-',
            change: '-5.51%',
            trend: 'down'
          },
          {
            label: '备集群 EPS',
            value: report ? `${report.nf_cluster_eps_rate}w` : '-',
            change: '+2.3%',
            trend: 'up'
          }
        ],
        report_date: reportDateTime
      };
    });
    res.json({ success: true, data: overviewData });
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

router.delete('/business-systems/:id', async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    
    if (shouldUseMockData()) {
      const index = mockData.businessSystems.findIndex((s: any) => s.id === id);
      if (index === -1) {
        return res.status(404).json({ success: false, error: '报表不存在' });
      }
      mockData.businessSystems.splice(index, 1);
      return res.json({ success: true, message: '删除成功' });
    }
    
    if (!await ensureConnection()) {
      const index = mockData.businessSystems.findIndex((s: any) => s.id === id);
      if (index === -1) {
        return res.status(404).json({ success: false, error: '报表不存在' });
      }
      mockData.businessSystems.splice(index, 1);
      return res.json({ success: true, message: '删除成功' });
    }
    
    const supabase = getSupabase();
    
    const { error: deleteClustersError } = await supabase!
      .from('clusters')
      .delete()
      .eq('business_system_id', id);
    if (deleteClustersError) {
      console.error('Failed to delete clusters:', deleteClustersError);
    }
    
    const { error: deleteReportsError } = await supabase!
      .from('daily_reports')
      .delete()
      .eq('business_system_id', id);
    if (deleteReportsError) {
      console.error('Failed to delete reports:', deleteReportsError);
    }
    
    const { error, count } = await supabase!
      .from('business_systems')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    res.json({ success: true, message: '删除成功' });
  } catch (error) {
    console.error('Failed to delete business system:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : '删除失败' 
    });
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
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const reportDate = yesterday.toISOString().split('T')[0];
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
    
    const supabaseClient = getSupabase();
    let query = supabaseClient!.from('assessments').select('*');
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
    
    const supabaseClient = getSupabase();
    let query = supabaseClient!.from('action_plans').select('*');
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

router.get('/export/:systemId', async (req: express.Request, res: express.Response) => {
  try {
    const { systemId } = req.params;
    
    const buildExportData = (system: any, clusters: any[]) => {
      const wxCluster = clusters.find((c: any) => c.type === 'wx') || null;
      const nfCluster = clusters.find((c: any) => c.type === 'nf') || null;
      
      const panels = [
        {
          id: 'panel-summary-status',
          type: 'summary_status',
          title: '核心结论与风险',
          description: 'Executive Summary & Risks',
          datasource: {
            type: 'api',
            endpoint: '/api/panel/summary',
            method: 'GET',
            params: { date: '${date}', systemId: systemId }
          },
          gridPos: { x: 0, y: 0, w: 24, h: 6 },
          options: {
            showInsight: true,
            showClusterInfo: true
          }
        },
        {
          id: 'panel-sla-metrics',
          type: 'sla_metrics',
          title: 'SLA 核心指标',
          description: 'SLA Core Metrics',
          datasource: {
            type: 'api',
            endpoint: '/api/panel/sla-metrics',
            method: 'GET',
            params: { date: '${date}', systemId: systemId }
          },
          gridPos: { x: 0, y: 6, w: 24, h: 8 },
          options: {
            showHealthStatus: true,
            showThreshold: true
          }
        },
        {
          id: 'panel-cluster-metrics',
          type: 'cluster_metrics',
          title: '集群核心指标明细',
          description: 'Cluster Core Metrics Detail',
          datasource: {
            type: 'api',
            endpoint: '/api/panel/cluster-metrics',
            method: 'GET',
            params: { date: '${date}', systemId: systemId }
          },
          gridPos: { x: 0, y: 14, w: 24, h: 10 },
          options: {
            showTrend: true,
            clusterTabs: ['wx', 'nf']
          }
        },
        {
          id: 'panel-region-traffic',
          type: 'region_traffic',
          title: '云区域流量态势',
          description: 'Cloud Region Traffic Situational Awareness',
          datasource: {
            type: 'api',
            endpoint: '/api/panel/region-traffic',
            method: 'GET',
            params: { date: '${date}', systemId: systemId }
          },
          gridPos: { x: 0, y: 24, w: 24, h: 8 },
          options: {
            showTopRegions: 5,
            clusterTabs: ['wx', 'nf']
          }
        },
        {
          id: 'panel-assessment-action',
          type: 'assessment_action',
          title: '评估与计划',
          description: 'Assessment & Planning',
          datasource: {
            type: 'api',
            endpoints: {
              assessment: {
                type: 'api',
                endpoint: '/api/panel/assessment',
                method: 'GET',
                params: { reportId: '${reportId}' }
              },
              actionPlan: {
                type: 'api',
                endpoint: '/api/panel/action-plan',
                method: 'GET',
                params: { reportId: '${reportId}' }
              }
            }
          },
          gridPos: { x: 0, y: 32, w: 24, h: 10 },
          options: {
            showInsight: true,
            showPriority: true
          }
        }
      ];
      
      return {
        __meta: {
          exported_at: new Date().toISOString(),
          exporter_version: '2.0.0',
          schema_version: 2,
          type: 'dashboard'
        },
        dashboard: {
          uid: system.id,
          title: system.name,
          description: system.description || '',
          tags: ['运维报表', '日志分析', system.code],
          style: 'dark',
          timezone: 'browser',
          refresh: '1d',
          time: {
            from: 'now-24h',
            to: 'now'
          },
          timepicker: {
            refresh_intervals: ['5m', '15m', '30m', '1h', '2h', '1d']
          },
          templating: {
            list: [
              {
                name: 'date',
                type: 'custom',
                label: '报表日期',
                current: {
                  value: new Date().toISOString().split('T')[0],
                  text: new Date().toISOString().split('T')[0]
                },
                options: []
              },
              {
                name: 'systemId',
                type: 'custom',
                label: '系统ID',
                current: {
                  value: systemId,
                  text: system.name
                },
                options: []
              },
              {
                name: 'reportId',
                type: 'custom',
                label: '报表ID',
                current: {
                  value: '${systemId}-${date}',
                  text: '动态生成'
                },
                options: []
              }
            ]
          },
          annotations: {
            list: []
          },
          panels: panels,
          clusters: {
            wx_cluster: wxCluster ? { 
              name: wxCluster.name, 
              name_en: wxCluster.name_en, 
              type: wxCluster.type
            } : null,
            nf_cluster: nfCluster ? { 
              name: nfCluster.name, 
              name_en: nfCluster.name_en, 
              type: nfCluster.type
            } : null
          },
          version: 1
        },
        overwrite: false
      };
    };
    
    if (shouldUseMockData() || !await ensureConnection()) {
      const system = getMockBusinessSystemById(systemId);
      if (!system) {
        return res.status(404).json({ success: false, error: 'Business system not found' });
      }
      
      const clusters = getMockClustersByBusinessSystem(systemId);
      const exportData = buildExportData(system, clusters);
      
      return res.json({ success: true, data: exportData });
    }
    
    const supabase = getSupabase();
    
    const { data: system, error: systemError } = await supabase!.from('business_systems').select('*').eq('id', systemId).maybeSingle();
    if (systemError) throw systemError;
    if (!system) {
      return res.status(404).json({ success: false, error: 'Business system not found' });
    }
    
    const { data: clusters } = await supabase!.from('clusters').select('*').eq('business_system_id', systemId);
    
    const exportData = buildExportData(system, clusters || []);
    
    res.json({ success: true, data: exportData });
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ success: false, error: '导出失败' });
  }
});

router.post('/import', async (req: express.Request, res: express.Response) => {
  try {
    if (!isUseSupabaseEnabled()) {
      return res.status(503).json({ 
        success: false, 
        error: '未启用数据库服务，无法导入数据',
        code: 'DATABASE_DISABLED' 
      });
    }

    const supabaseClient = getSupabase();
    if (!supabaseClient) {
      return res.status(503).json({ 
        success: false, 
        error: '数据库客户端未初始化',
        code: 'DATABASE_NOT_INITIALIZED' 
      });
    }

    const connected = await testConnection();
    if (!connected) {
      return res.status(503).json({ 
        success: false, 
        error: '数据库连接失败，请稍后重试',
        code: 'DATABASE_CONNECTION_FAILED' 
      });
    }

    const importData = req.body;

    if (!importData || typeof importData !== 'object') {
      return res.status(400).json({ 
        success: false, 
        error: '无效的请求数据',
        code: 'INVALID_REQUEST_BODY' 
      });
    }

    const dashboard = importData.dashboard || importData;
    const reportData = dashboard.report || importData.report || importData.business_system || {};
    const reportTitle = dashboard.title || reportData.title || reportData.name;
    const reportDescription = dashboard.description || reportData.description || '';
    
    if (!reportTitle) {
      return res.status(400).json({ 
        success: false, 
        error: '缺少必需字段：dashboard.title 或 report.title',
        code: 'MISSING_REPORT_TITLE' 
      });
    }

    const clusters = dashboard.clusters || importData.clusters || {};

    const uid = dashboard.uid || importData.uid;
    const overwrite = importData.overwrite === true || dashboard.overwrite === true;

    if (uid) {
      const { data: existingByUid } = await supabaseClient!
        .from('business_systems')
        .select('*')
        .eq('id', uid)
        .maybeSingle();

      if (existingByUid) {
        if (!overwrite) {
          return res.status(409).json({ 
            success: false, 
            error: `已存在相同 UID 的业务系统：${existingByUid.name}。如需覆盖，请在导入时选择"覆盖"模式或删除 UID 字段以创建新副本。`,
            code: 'UID_EXISTS',
            existing_system: {
              id: existingByUid.id,
              name: existingByUid.name,
              code: existingByUid.code
            }
          });
        }

        const { data: updatedSystem, error: updateError } = await supabaseClient!
          .from('business_systems')
          .update({
            name: reportTitle,
            description: reportDescription || existingByUid.description,
            status: reportData.status || existingByUid.status,
            updated_at: new Date().toISOString()
          })
          .eq('id', uid)
          .select()
          .single();

        if (updateError) {
          console.error('Failed to update business system:', updateError);
          return res.status(500).json({ 
            success: false, 
            error: `业务系统更新失败: ${updateError.message}`,
            code: 'BUSINESS_SYSTEM_UPDATE_ERROR' 
          });
        }

        const { data: existingClusters } = await supabaseClient!
          .from('clusters')
          .select('*')
          .eq('business_system_id', uid);

        const clustersToUpdate: any[] = [];
        const clustersToInsert: any[] = [];

        if (clusters.wx_cluster) {
          const existingWx = existingClusters?.find((c: any) => c.type === 'wx');
          if (existingWx) {
            clustersToUpdate.push({
              id: existingWx.id,
              name: clusters.wx_cluster.name,
              name_en: clusters.wx_cluster.name_en || clusters.wx_cluster.name,
              updated_at: new Date().toISOString()
            });
          } else {
            clustersToInsert.push({
              name: clusters.wx_cluster.name,
              name_en: clusters.wx_cluster.name_en || clusters.wx_cluster.name,
              type: 'wx',
              business_system_id: uid,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
          }
        }

        if (clusters.nf_cluster) {
          const existingNf = existingClusters?.find((c: any) => c.type === 'nf');
          if (existingNf) {
            clustersToUpdate.push({
              id: existingNf.id,
              name: clusters.nf_cluster.name,
              name_en: clusters.nf_cluster.name_en || clusters.nf_cluster.name,
              updated_at: new Date().toISOString()
            });
          } else {
            clustersToInsert.push({
              name: clusters.nf_cluster.name,
              name_en: clusters.nf_cluster.name_en || clusters.nf_cluster.name,
              type: 'nf',
              business_system_id: uid,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
          }
        }

        for (const cluster of clustersToUpdate) {
          await supabaseClient!
            .from('clusters')
            .update({
              name: cluster.name,
              name_en: cluster.name_en,
              updated_at: cluster.updated_at
            })
            .eq('id', cluster.id);
        }

        let insertedClusters: any[] = [];
        if (clustersToInsert.length > 0) {
          const { data } = await supabaseClient!
            .from('clusters')
            .insert(clustersToInsert)
            .select();
          insertedClusters = data || [];
        }

        const { data: allClusters } = await supabaseClient!
          .from('clusters')
          .select('*')
          .eq('business_system_id', uid);

        return res.json({
          success: true,
          data: {
            message: '业务系统更新成功',
            mode: 'updated',
            imported: {
              business_system: 1,
              clusters: clustersToUpdate.length + insertedClusters.length
            },
            details: {
              business_system: updatedSystem,
              clusters: allClusters || []
            }
          }
        });
      }
    }

    const code = reportData.code || reportTitle.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');

    const { data: existingByCode } = await supabaseClient!
      .from('business_systems')
      .select('id, code')
      .eq('code', code)
      .maybeSingle();

    let finalCode = code;
    if (existingByCode) {
      const timestamp = Date.now().toString(36);
      finalCode = `${code}-${timestamp}`;
    }

    const businessSystemData = {
      name: reportTitle,
      code: finalCode,
      description: reportDescription,
      status: reportData.status || 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: businessSystem, error: bsError } = await supabaseClient!
      .from('business_systems')
      .insert(businessSystemData)
      .select()
      .single();

    if (bsError) {
      console.error('Failed to create business system:', bsError);
      return res.status(500).json({ 
        success: false, 
        error: `业务系统创建失败: ${bsError.message}`,
        code: 'BUSINESS_SYSTEM_ERROR' 
      });
    }

    const clustersToInsert: any[] = [];
    
    if (clusters.wx_cluster) {
      clustersToInsert.push({
        name: clusters.wx_cluster.name,
        name_en: clusters.wx_cluster.name_en || clusters.wx_cluster.name,
        type: 'wx',
        business_system_id: businessSystem.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }
    
    if (clusters.nf_cluster) {
      clustersToInsert.push({
        name: clusters.nf_cluster.name,
        name_en: clusters.nf_cluster.name_en || clusters.nf_cluster.name,
        type: 'nf',
        business_system_id: businessSystem.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }

    let insertedClusters: any[] = [];
    if (clustersToInsert.length > 0) {
      const { data, error: clusterError } = await supabaseClient!
        .from('clusters')
        .insert(clustersToInsert)
        .select();

      if (clusterError) {
        console.error('Failed to create clusters:', clusterError);
      } else {
        insertedClusters = data || [];
      }
    }

    let originalDatasourceUid = dashboard.datasource?.uid || importData.datasource?.uid || null;
    const panels = dashboard.panels || importData.panels || [];

    // 从 panel 的 datasource.params.systemId 中提取 original_uid
    if (!originalDatasourceUid && panels.length > 0) {
      for (const panel of panels) {
        const panelSystemId = panel.datasource?.params?.systemId;
        if (panelSystemId && typeof panelSystemId === 'string' && !panelSystemId.startsWith('${')) {
          originalDatasourceUid = panelSystemId;
          console.log(`[Import] Extracted original_uid from panel ${panel.id}: ${originalDatasourceUid}`);
          break;
        }
      }
    }

    if (originalDatasourceUid) {
      const { error: updateError } = await supabaseClient!
        .from('business_systems')
        .update({
          datasource_reference: {
            original_uid: originalDatasourceUid,
            datasource_type: dashboard.datasource?.type || importData.datasource?.type || 'api',
            panels: panels,
            imported_at: new Date().toISOString()
          }
        })
        .eq('id', businessSystem.id);

      if (updateError) {
        console.error('Failed to update datasource reference:', updateError);
      }
    }

    res.json({
      success: true,
      data: {
        message: '业务系统创建成功',
        mode: 'created',
        imported: {
          business_system: 1,
          clusters: insertedClusters.length,
          panels: panels.length
        },
        details: {
          business_system: businessSystem,
          clusters: insertedClusters,
          datasource_reference: {
            original_uid: originalDatasourceUid,
            new_uid: businessSystem.id,
            panels_count: panels.length,
            note: originalDatasourceUid 
              ? `新报表将通过数据源引用从原始数据源 (UID: ${originalDatasourceUid}) 获取数据`
              : '无数据源引用'
          }
        }
      }
    });

  } catch (error) {
    console.error('Import error:', error);
    res.status(500).json({ 
      success: false, 
      error: '数据导入失败',
      code: 'IMPORT_ERROR',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Panel 数据 API 端点 - 遵循 Grafana 配置与数据分离原则
// 每个 Panel 从独立的 API 端点获取数据，而非存储数据快照

/**
 * 解析数据源 UID
 * 
 * 当导入 JSON 创建新报表时，新报表有自己的 ID，但数据源引用的是原始 UID。
 * 此函数检查传入的 systemId 是否有 datasource_reference.original_uid，
 * 如果有则返回原始 UID，否则返回传入的 systemId。
 */
async function resolveDatasourceUid(supabase: any, systemId: string): Promise<string> {
  try {
    const { data: businessSystem } = await supabase
      .from('business_systems')
      .select('id, datasource_reference')
      .eq('id', systemId)
      .maybeSingle();
    
    if (businessSystem?.datasource_reference?.original_uid) {
      console.log(`[resolveDatasourceUid] Using original_uid: ${businessSystem.datasource_reference.original_uid} for systemId: ${systemId}`);
      return businessSystem.datasource_reference.original_uid;
    }
    
    return systemId;
  } catch (error) {
    console.error('[resolveDatasourceUid] Error:', error);
    return systemId;
  }
}

router.get('/panel/sla-metrics', async (req: express.Request, res: express.Response) => {
  try {
    const { date, systemId } = req.query;
    const reportDate = typeof date === 'string' ? date : new Date().toISOString().split('T')[0];
    let bsId = systemId && typeof systemId === 'string' ? systemId : DEFAULT_BUSINESS_SYSTEM_ID;

    if (shouldUseMockData() || !await ensureConnection()) {
      const report = getMockDailyReportByDateAndSystem(reportDate, bsId);
      const reportId = report?.id || `mock-${bsId}-${reportDate}`;
      const allMetrics = getMockLogMetricsByReport(reportId);
      const slaMetrics = allMetrics.filter((m: any) =>
        ['平均搜索耗时', 'CPU使用率', '日志入库耗时', '监控延迟'].includes(m.metric_name)
      );
      return res.json({ success: true, data: slaMetrics });
    }

    const supabase = getSupabase();
    
    // 解析数据源 UID
    bsId = await resolveDatasourceUid(supabase!, bsId);
    
    const { data: clusters } = await supabase!.from('clusters').select('id').eq('business_system_id', bsId);
    const clusterIds = clusters?.map(c => c.id) || [];

    const { data: slaMetrics } = await supabase!.from('log_metrics')
      .select('*, clusters(name)')
      .in('metric_name', ['平均搜索耗时', 'CPU使用率', '日志入库耗时', '监控延迟'])
      .eq('report_date', reportDate)
      .in('cluster_id', clusterIds.length > 0 ? clusterIds : [WX_CLUSTER_ID, NF_CLUSTER_ID])
      .order('metric_name', { ascending: true });

    const result = slaMetrics?.map((m: any) => ({ ...m, cluster_name: m.clusters?.name })) || [];
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Failed to fetch SLA metrics:', error);
    res.json({ success: true, data: [] });
  }
});

router.get('/panel/cluster-metrics', async (req: express.Request, res: express.Response) => {
  try {
    const { date, systemId } = req.query;
    const reportDate = typeof date === 'string' ? date : new Date().toISOString().split('T')[0];
    let bsId = systemId && typeof systemId === 'string' ? systemId : DEFAULT_BUSINESS_SYSTEM_ID;

    if (shouldUseMockData() || !await ensureConnection()) {
      const clusters = getMockClustersByBusinessSystem(bsId);
      const wxCluster = clusters.find((c: any) => c.type === 'wx') || clusters[0];
      const nfCluster = clusters.find((c: any) => c.type === 'nf') || clusters[1];
      const report = getMockDailyReportByDateAndSystem(reportDate, bsId);
      const reportId = report?.id || `mock-${bsId}-${reportDate}`;
      const allMetrics = getMockLogMetricsByReport(reportId);

      const wxMetrics = allMetrics.filter((m: any) => m.cluster_id === wxCluster?.id);
      const nfMetrics = allMetrics.filter((m: any) => m.cluster_id === nfCluster?.id);

      return res.json({
        success: true,
        data: {
          wxCluster,
          nfCluster,
          wxMetrics,
          nfMetrics
        }
      });
    }

    const supabase = getSupabase();
    
    // 解析数据源 UID
    bsId = await resolveDatasourceUid(supabase!, bsId);
    
    const { data: clusters } = await supabase!.from('clusters').select('*').eq('business_system_id', bsId);
    const wxCluster = clusters?.find((c: any) => c.type === 'wx') || { id: WX_CLUSTER_ID, name: '威新集群', name_en: 'WX CLUSTER', type: 'wx' };
    const nfCluster = clusters?.find((c: any) => c.type === 'nf') || { id: NF_CLUSTER_ID, name: '南方集群', name_en: 'NF CLUSTER', type: 'nf' };

    const { data: wxMetrics } = await supabase!.from('log_metrics').select('*').eq('cluster_id', wxCluster.id).eq('report_date', reportDate);
    const { data: nfMetrics } = await supabase!.from('log_metrics').select('*').eq('cluster_id', nfCluster.id).eq('report_date', reportDate);

    res.json({
      success: true,
      data: {
        wxCluster,
        nfCluster,
        wxMetrics: wxMetrics || [],
        nfMetrics: nfMetrics || []
      }
    });
  } catch (error) {
    console.error('Failed to fetch cluster metrics:', error);
    res.json({ success: true, data: { wxCluster: null, nfCluster: null, wxMetrics: [], nfMetrics: [] } });
  }
});

router.get('/panel/region-traffic', async (req: express.Request, res: express.Response) => {
  try {
    const { date, systemId } = req.query;
    const reportDate = typeof date === 'string' ? date : new Date().toISOString().split('T')[0];
    let bsId = systemId && typeof systemId === 'string' ? systemId : DEFAULT_BUSINESS_SYSTEM_ID;

    if (shouldUseMockData() || !await ensureConnection()) {
      const clusters = getMockClustersByBusinessSystem(bsId);
      const wxCluster = clusters.find((c: any) => c.type === 'wx') || clusters[0];
      const nfCluster = clusters.find((c: any) => c.type === 'nf') || clusters[1];
      const report = getMockDailyReportByDateAndSystem(reportDate, bsId);
      const reportId = report?.id || `mock-${bsId}-${reportDate}`;
      const allRegions = getMockCloudRegionsByReport(reportId);

      const topRegions = allRegions.slice(0, 5).map((r: any) => ({
        ...r,
        cluster_name: r.cluster_id === wxCluster?.id ? wxCluster?.name : nfCluster?.name,
        cluster_type: r.cluster_id === wxCluster?.id ? 'wx' : 'nf'
      }));

      return res.json({
        success: true,
        data: {
          regionStats: {
            total_regions: allRegions.length,
            nf_regions: allRegions.filter((r: any) => r.cluster_id === nfCluster?.id).length,
            wx_regions: allRegions.filter((r: any) => r.cluster_id === wxCluster?.id).length,
            avg_traffic: allRegions.length > 0 ? allRegions.reduce((sum: number, r: any) => sum + (r.current_traffic || 0), 0) / allRegions.length : 0
          },
          topRegions
        }
      });
    }

    const supabase = getSupabase();
    
    // 解析数据源 UID
    bsId = await resolveDatasourceUid(supabase!, bsId);
    
    const { data: clusters } = await supabase!.from('clusters').select('id').eq('business_system_id', bsId);
    const clusterIds = clusters?.map(c => c.id) || [];

    const { data: topRegionsRaw } = await supabase!.from('cloud_regions')
      .select('*, clusters(name, type)')
      .eq('report_date', reportDate)
      .in('cluster_id', clusterIds.length > 0 ? clusterIds : [WX_CLUSTER_ID, NF_CLUSTER_ID])
      .order('current_traffic', { ascending: false })
      .limit(5);

    const { data: avgData } = await supabase!.from('cloud_regions')
      .select('current_traffic')
      .eq('report_date', reportDate)
      .in('cluster_id', clusterIds.length > 0 ? clusterIds : [WX_CLUSTER_ID, NF_CLUSTER_ID]);

    const { count: total_regions } = await supabase!.from('cloud_regions')
      .select('*', { count: 'exact', head: true })
      .eq('report_date', reportDate)
      .in('cluster_id', clusterIds.length > 0 ? clusterIds : [WX_CLUSTER_ID, NF_CLUSTER_ID]);

    const topRegions = topRegionsRaw?.map((r: any) => ({
      ...r,
      cluster_name: r.clusters?.name,
      cluster_type: r.clusters?.type
    })) || [];

    const avg_traffic = avgData && avgData.length > 0
      ? avgData.reduce((sum: number, r: any) => sum + (r.current_traffic || 0), 0) / avgData.length
      : 0;

    res.json({
      success: true,
      data: {
        regionStats: {
          total_regions: total_regions || 0,
          nf_regions: 0,
          wx_regions: 0,
          avg_traffic
        },
        topRegions
      }
    });
  } catch (error) {
    console.error('Failed to fetch region traffic:', error);
    res.json({ success: true, data: { regionStats: { total_regions: 0, nf_regions: 0, wx_regions: 0, avg_traffic: 0 }, topRegions: [] } });
  }
});

router.get('/panel/summary', async (req: express.Request, res: express.Response) => {
  try {
    const { date, systemId } = req.query;
    const reportDate = typeof date === 'string' ? date : new Date().toISOString().split('T')[0];
    let bsId = systemId && typeof systemId === 'string' ? systemId : DEFAULT_BUSINESS_SYSTEM_ID;

    if (shouldUseMockData() || !await ensureConnection()) {
      const report = getMockDailyReportByDateAndSystem(reportDate, bsId);
      const clusters = getMockClustersByBusinessSystem(bsId);
      const wxCluster = clusters.find((c: any) => c.type === 'wx') || clusters[0];
      const nfCluster = clusters.find((c: any) => c.type === 'nf') || clusters[1];

      return res.json({
        success: true,
        data: {
          report,
          wxCluster,
          nfCluster
        }
      });
    }

    const supabase = getSupabase();
    
    // 解析数据源 UID
    bsId = await resolveDatasourceUid(supabase!, bsId);
    
    const { data: report } = await supabase!.from('daily_reports')
      .select('*')
      .eq('report_date', reportDate)
      .eq('business_system_id', bsId)
      .maybeSingle();

    const { data: clusters } = await supabase!.from('clusters').select('*').eq('business_system_id', bsId);
    const wxCluster = clusters?.find((c: any) => c.type === 'wx') || { id: WX_CLUSTER_ID, name: '威新集群', name_en: 'WX CLUSTER', type: 'wx' };
    const nfCluster = clusters?.find((c: any) => c.type === 'nf') || { id: NF_CLUSTER_ID, name: '南方集群', name_en: 'NF CLUSTER', type: 'nf' };

    res.json({
      success: true,
      data: {
        report,
        wxCluster,
        nfCluster
      }
    });
  } catch (error) {
    console.error('Failed to fetch summary:', error);
    res.json({ success: true, data: { report: null, wxCluster: null, nfCluster: null } });
  }
});

router.get('/panel/assessment', async (req: express.Request, res: express.Response) => {
  try {
    const { reportId } = req.query;

    if (shouldUseMockData() || !await ensureConnection()) {
      const assessments = reportId ? getMockAssessmentsByReport(reportId as string) : mockData.assessments;
      return res.json({ success: true, data: assessments });
    }

    const supabase = getSupabase();
    
    // reportId 格式为 ${systemId}-${date}，需要解析并查询对应的 daily_report
    if (reportId && typeof reportId === 'string') {
      const parts = reportId.split('-');
      if (parts.length >= 4) {
        // systemId 是 UUID 格式 (8-4-4-4-12)，date 是最后部分
        const systemId = parts.slice(0, 5).join('-');
        const dateStr = parts.slice(5).join('-');
        
        // 解析数据源 UID
        const resolvedSystemId = await resolveDatasourceUid(supabase!, systemId);
        
        // 查询对应的 daily_report
        const { data: dailyReport } = await supabase!
          .from('daily_reports')
          .select('id')
          .eq('business_system_id', resolvedSystemId)
          .eq('report_date', dateStr)
          .maybeSingle();
        
        if (dailyReport) {
          const { data } = await supabase!.from('assessments').select('*').eq('report_id', dailyReport.id);
          return res.json({ success: true, data: data || [] });
        }
      }
    }
    
    const { data } = await supabase!.from('assessments').select('*');
    res.json({ success: true, data: data || [] });
  } catch (error) {
    console.error('Failed to fetch assessments:', error);
    res.json({ success: true, data: [] });
  }
});

router.get('/panel/action-plan', async (req: express.Request, res: express.Response) => {
  try {
    const { reportId } = req.query;

    if (shouldUseMockData() || !await ensureConnection()) {
      const actionPlans = reportId ? getMockActionPlansByReport(reportId as string) : mockData.actionPlans;
      return res.json({ success: true, data: actionPlans });
    }

    const supabase = getSupabase();
    
    // reportId 格式为 ${systemId}-${date}，需要解析并查询对应的 daily_report
    if (reportId && typeof reportId === 'string') {
      const parts = reportId.split('-');
      if (parts.length >= 4) {
        // systemId 是 UUID 格式 (8-4-4-4-12)，date 是最后部分
        const systemId = parts.slice(0, 5).join('-');
        const dateStr = parts.slice(5).join('-');
        
        // 解析数据源 UID
        const resolvedSystemId = await resolveDatasourceUid(supabase!, systemId);
        
        // 查询对应的 daily_report
        const { data: dailyReport } = await supabase!
          .from('daily_reports')
          .select('id')
          .eq('business_system_id', resolvedSystemId)
          .eq('report_date', dateStr)
          .maybeSingle();
        
        if (dailyReport) {
          const { data } = await supabase!.from('action_plans').select('*').eq('report_id', dailyReport.id);
          const result = data?.map((p: any) => ({
            ...p,
            items: typeof p.items === 'string' ? JSON.parse(p.items) : p.items
          })) || [];
          return res.json({ success: true, data: result });
        }
      }
    }
    
    const { data } = await supabase!.from('action_plans').select('*');
    const result = data?.map((p: any) => ({
      ...p,
      items: typeof p.items === 'string' ? JSON.parse(p.items) : p.items
    })) || [];
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Failed to fetch action plans:', error);
    res.json({ success: true, data: [] });
  }
});

export default router;
