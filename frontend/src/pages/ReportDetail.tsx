import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Spin } from 'antd';
import { DashboardSummary, BusinessSystem } from '@/types';
import { fetchDashboardSummary, fetchBusinessSystem } from '@/api';
import { useDate } from '@/context/DateContext';
import ErrorState from '@/components/ErrorState';
import PageHeader from '@/components/PageHeader';
import ExecutiveSummary from '@/components/Dashboard/ExecutiveSummary';
import SlaMetricsTable from '@/components/Dashboard/SlaMetricsTable';
import ClusterMetricsTable from '@/components/Dashboard/ClusterMetricsTable';
import CloudRegionTraffic from '@/components/Dashboard/CloudRegionTraffic';
import AssessmentPlanning from '@/components/Dashboard/AssessmentPlanning';
import styles from './ReportDetail.module.scss';

const ReportDetail: React.FC = () => {
  const { systemId } = useParams<{ systemId: string }>();
  const navigate = useNavigate();
  const { selectedDate } = useDate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [system, setSystem] = useState<BusinessSystem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDbError, setIsDbError] = useState(false);

  const loadData = async () => {
    if (!systemId) {
      setError('系统ID不存在');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setIsDbError(false);
    
    try {
      const [summary, systemInfo] = await Promise.all([
        fetchDashboardSummary(selectedDate, systemId),
        fetchBusinessSystem(systemId)
      ]);
      setData(summary);
      setSystem(systemInfo);
    } catch (err: any) {
      console.error('Failed to load data:', err);
      if (err?.response?.data?.code === 'DATABASE_ERROR') {
        setIsDbError(true);
        setError(err.response.data.error || '数据库连接失败');
      } else {
        setError(err instanceof Error ? err.message : '加载数据失败');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedDate, systemId]);

  if (loading) {
    return (
      <div className={styles.loading}>
        <Spin size="large" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={styles.errorWrapper}>
        <ErrorState
          title={isDbError ? '数据库连接失败' : '数据加载失败'}
          message={isDbError ? '请检查数据库配置或联系管理员' : error || '加载数据失败'}
          onRetry={loadData}
        />
      </div>
    );
  }

  const systemName = system?.name || '未知系统';
  const systemDesc = system?.description || '';

  const handleRefresh = () => {
    loadData();
  };

  const handleExport = () => {
    console.log('Export clicked');
  };

  const handleShare = () => {
    console.log('Share clicked');
  };

  const handleConfig = () => {
    console.log('Config clicked');
  };

  return (
    <>
      <PageHeader
        breadcrumb={[
          { label: '报表总览', href: '/overview' },
          { label: systemName },
        ]}
        title={systemName}
        subtitle={systemDesc}
        typeBadge="报表详情"
        statusBadge={system?.status === 'active' ? 'normal' : 'error'}
        tags={['用户', '行为', '分析']}
        meta={{
          reportDate: selectedDate,
          lastUpdate: new Date().toISOString().replace('T', ' ').slice(0, 19),
          owner: '王工 · 数据分析团队',
          updateFrequency: '每日',
        }}
        onRefresh={handleRefresh}
        onExport={handleExport}
        onShare={handleShare}
        onConfig={handleConfig}
        onBack={() => navigate('/overview')}
      />

      <div className={styles.content}>
        <ExecutiveSummary
          report={data.report}
          wxCluster={data.wxCluster}
          nfCluster={data.nfCluster}
          wxMetrics={data.wxMetrics}
          nfMetrics={data.nfMetrics}
          businessSystemId={systemId}
        />

        <SlaMetricsTable metrics={data.slaMetrics || []} />

        <ClusterMetricsTable
          wxMetrics={data.wxMetrics}
          nfMetrics={data.nfMetrics}
        />

        <CloudRegionTraffic
          topRegions={data.topRegions}
          regionStats={data.regionStats}
        />

        <AssessmentPlanning
          assessments={data.assessments || []}
          actionPlans={data.actionPlans || []}
        />
      </div>
    </>
  );
}

export default ReportDetail;
