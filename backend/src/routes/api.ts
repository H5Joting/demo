import express from 'express';
import { Router } from 'express';
import { getSupabase, isDatabaseConnected, setConnectionFailed, testConnection, resetConnection } from '../database/supabase';
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
  return useMockData || !isDatabaseConnected();
}

async function ensureConnection(): Promise<boolean> {
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
    const reportDate = typeof date === 'string' ? date : new Date().toISOString().split('T')[0];
    const bsId = businessSystemId && typeof businessSystemId === 'string' ? businessSystemId : DEFAULT_BUSINESS_SYSTEM_ID;
    
    if (shouldUseMockData() || !await ensureConnection()) {
      const report = getMockDailyReportByDateAndSystem(reportDate, bsId);
      const clusters = getMockClustersByBusinessSystem(bsId);
      const wxCluster = clusters.find(c => c.id === WX_CLUSTER_ID) || clusters[0];
      const nfCluster = clusters.find(c => c.id === NF_CLUSTER_ID) || clusters[1];
      
      const reportId = report?.id || `${bsId}-${reportDate}`;
      const wxMetrics = getMockLogMetricsByReport(reportId);
      const nfMetrics = getMockLogMetricsByReport(reportId);
      const cloudRegions = getMockCloudRegionsByReport(reportId);
      const assessments = getMockAssessmentsByReport(reportId);
      const actionPlans = getMockActionPlansByReport(reportId);
      
      const slaMetrics = wxMetrics.filter(m => 
        ['平均搜索耗时', 'CPU使用率', '日志入库耗时', '监控延迟'].includes(m.metric_name)
      ).map(m => ({ ...m, cluster_name: wxCluster?.name }));
      
      const topRegions = cloudRegions.slice(0, 5).map(r => ({
        ...r,
        cluster_name: wxCluster?.name,
        cluster_type: 'wx'
      }));
      
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
            total_regions: cloudRegions.length, 
            nf_regions: Math.floor(cloudRegions.length / 2), 
            wx_regions: Math.ceil(cloudRegions.length / 2), 
            avg_traffic: 75 
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

export default router;
