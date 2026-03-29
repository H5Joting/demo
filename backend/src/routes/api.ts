import express from 'express';
import { Router } from 'express';
import { getSupabase } from '../database/supabase';
import { ApiResponse, Cluster, LogMetric, CloudRegion, DailyReport, Assessment, ActionPlan } from '../types';

const router = Router();

const WX_CLUSTER_ID = '11111111-1111-1111-1111-111111111111';
const NF_CLUSTER_ID = '22222222-2222-2222-2222-222222222222';

router.get('/clusters', async (req: express.Request, res: express.Response) => {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      return res.status(500).json({ success: false, error: 'Database not configured' });
    }
    const { data, error } = await supabase.from('clusters').select('*');
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch clusters' });
  }
});

router.get('/metrics/:clusterId', async (req: express.Request, res: express.Response) => {
  try {
    const { clusterId } = req.params;
    const { date } = req.query;
    const reportDate = typeof date === 'string' ? date : new Date().toISOString().split('T')[0];
    
    const supabase = getSupabase();
    if (!supabase) {
      return res.status(500).json({ success: false, error: 'Database not configured' });
    }
    
    const { data, error } = await supabase.from('log_metrics').select('*').eq('cluster_id', clusterId).eq('report_date', reportDate);
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch metrics' });
  }
});

router.get('/regions', async (req: express.Request, res: express.Response) => {
  try {
    const { date } = req.query;
    const reportDate = typeof date === 'string' ? date : new Date().toISOString().split('T')[0];
    
    const supabase = getSupabase();
    if (!supabase) {
      return res.status(500).json({ success: false, error: 'Database not configured' });
    }
    
    const { data, error } = await supabase.from('cloud_regions').select('*').eq('report_date', reportDate);
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch regions' });
  }
});

router.get('/dashboard/summary', async (req: express.Request, res: express.Response) => {
  try {
    const { date } = req.query;
    const reportDate = typeof date === 'string' ? date : new Date().toISOString().split('T')[0];
    const supabase = getSupabase();
    
    if (!supabase) {
      return res.status(500).json({ success: false, error: 'Database not configured' });
    }

    const { data: report, error: err1 } = await supabase.from('daily_reports').select('*').eq('report_date', reportDate).maybeSingle();
    const { data: wxCluster, error: err2 } = await supabase.from('clusters').select('*').eq('id', WX_CLUSTER_ID).maybeSingle();
    const { data: nfCluster, error: err3 } = await supabase.from('clusters').select('*').eq('id', NF_CLUSTER_ID).maybeSingle();
    const wxClusterId = wxCluster?.id || WX_CLUSTER_ID;
    const nfClusterId = nfCluster?.id || NF_CLUSTER_ID;
    const reportId = report?.id;
    
    const { data: wxMetrics, error: err4 } = await supabase.from('log_metrics').select('*').eq('cluster_id', wxClusterId).eq('report_date', reportDate);
    const { data: nfMetrics, error: err5 } = await supabase.from('log_metrics').select('*').eq('cluster_id', nfClusterId).eq('report_date', reportDate);
    const { data: slaMetricsRaw, error: err6 } = await supabase.from('log_metrics').select('*, clusters(name)').in('metric_name', ['平均搜索耗时', 'CPU使用率', '日志入库耗时', '监控延迟']).eq('report_date', reportDate).order('metric_name', { ascending: true });
    const { data: topRegionsRaw, error: err7 } = await supabase.from('cloud_regions').select('*, clusters(name, type)').eq('report_date', reportDate).order('current_traffic', { ascending: false }).limit(5);
    const { data: avgData, error: err8 } = await supabase.from('cloud_regions').select('current_traffic').eq('report_date', reportDate);
    const { count: total_regions, error: err9 } = await supabase.from('cloud_regions').select('*', { count: 'exact', head: true }).eq('report_date', reportDate);
    const { count: nf_regions, error: err10 } = await supabase.from('cloud_regions').select('*', { count: 'exact', head: true }).eq('cluster_id', nfClusterId).eq('report_date', reportDate);
    const { count: wx_regions, error: err11 } = await supabase.from('cloud_regions').select('*', { count: 'exact', head: true }).eq('cluster_id', wxClusterId).eq('report_date', reportDate);
    
    let assessments: Assessment[] = [];
    let actionPlans: ActionPlan[] = [];
    if (reportId) {
      const { data: assessmentsData, error: err12 } = await supabase.from('assessments').select('*').eq('report_id', reportId);
      const { data: actionPlansRaw, error: err13 } = await supabase.from('action_plans').select('*').eq('report_id', reportId);
      assessments = assessmentsData || [];
      actionPlans = actionPlansRaw?.map((p: any) => ({ ...p, items: typeof p.items === 'string' ? JSON.parse(p.items) : p.items })) || [];
    }

    const errors = [err1, err2, err3, err4, err5, err6, err7, err8, err9, err10, err11].filter(Boolean);
    if (errors.length > 0) {
      console.error('Supabase errors:', errors);
    }

    const slaMetrics = slaMetricsRaw?.map((m: any) => ({ ...m, cluster_name: m.clusters?.name })) || [];
    const topRegions = topRegionsRaw?.map((r: any) => ({ ...r, cluster_name: r.clusters?.name, cluster_type: r.clusters?.type })) || [];
    const avg_traffic = avgData && avgData.length > 0 ? avgData.reduce((sum: number, r: any) => sum + (r.current_traffic || 0), 0) / avgData.length : 0;

    res.json({
      success: true,
      data: {
        report,
        wxCluster: wxCluster || { id: WX_CLUSTER_ID, name: '威新集群', name_en: 'WX CLUSTER', type: 'wx' },
        nfCluster: nfCluster || { id: NF_CLUSTER_ID, name: '南方集群', name_en: 'NF CLUSTER', type: 'nf' },
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
    res.status(500).json({ success: false, error: 'Failed to fetch dashboard summary' });
  }
});

router.get('/available-dates', async (req: express.Request, res: express.Response) => {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      return res.status(500).json({ success: false, error: 'Database not configured' });
    }
    const { data, error } = await supabase.from('daily_reports').select('report_date, system_status').order('report_date', { ascending: false });
    if (error) throw error;
    res.json({ success: true, data: data || [] });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch available dates' });
  }
});

export default router;
