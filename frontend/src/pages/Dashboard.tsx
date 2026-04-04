import React, { useEffect, useState } from 'react';
import { Spin } from 'antd';
import { DashboardSummary } from '@/types';
import { fetchDashboardSummary } from '@/api';
import { useDate } from '@/context/DateContext';
import ErrorState from '@/components/ErrorState';
import ExecutiveSummary from '@/components/Dashboard/ExecutiveSummary';
import SlaMetricsTable from '@/components/Dashboard/SlaMetricsTable';
import ClusterMetricsTable from '@/components/Dashboard/ClusterMetricsTable';
import CloudRegionTraffic from '@/components/Dashboard/CloudRegionTraffic';
import AssessmentPlanning from '@/components/Dashboard/AssessmentPlanning';
import styles from './Dashboard.module.scss';

interface DashboardProps {
  businessSystemId?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ businessSystemId: propBusinessSystemId }) => {
  const { selectedDate, businessSystemId: contextBusinessSystemId } = useDate();
  const businessSystemId = propBusinessSystemId || contextBusinessSystemId;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDbError, setIsDbError] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    setIsDbError(false);
    try {
      const summary = await fetchDashboardSummary(selectedDate, businessSystemId || undefined);
      setData(summary);
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
  }, [selectedDate, businessSystemId]);

  if (loading) {
    return (
      <div className={styles.loading}>
        <Spin size="large" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={styles.errorContainer}>
        <ErrorState
          title={isDbError ? '数据库连接失败' : '数据加载失败'}
          message={isDbError ? '请检查数据库配置或联系管理员' : error || '加载数据失败'}
          onRetry={loadData}
        />
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <ExecutiveSummary
        report={data.report}
        wxCluster={data.wxCluster}
        nfCluster={data.nfCluster}
        wxMetrics={data.wxMetrics}
        nfMetrics={data.nfMetrics}
        businessSystemId={businessSystemId}
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
  );
};

export default Dashboard;
