import React, { useEffect, useState } from 'react';
import { Spin, message } from 'antd';
import { DashboardSummary } from '@/types';
import { fetchDashboardSummary } from '@/api';
import { useDate } from '@/context/DateContext';
import ExecutiveSummary from '@/components/Dashboard/ExecutiveSummary';
import SlaMetricsTable from '@/components/Dashboard/SlaMetricsTable';
import ClusterMetricsTable from '@/components/Dashboard/ClusterMetricsTable';
import CloudRegionTraffic from '@/components/Dashboard/CloudRegionTraffic';
import AssessmentPlanning from '@/components/Dashboard/AssessmentPlanning';
import styles from './Dashboard.module.scss';

const Dashboard: React.FC = () => {
  const { selectedDate } = useDate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('Fetching data for date:', selectedDate);
        const summary = await fetchDashboardSummary(selectedDate);
        console.log('Fetched data:', summary);
        setData(summary);
      } catch (err) {
        console.error('Failed to load data:', err);
        setError(err instanceof Error ? err.message : '加载数据失败');
        message.error('加载数据失败');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [selectedDate]);

  if (loading) {
    return (
      <div className={styles.loading}>
        <Spin size="large" />
      </div>
    );
  }

  if (!data) {
    return <div className={styles.error}>加载失败，请刷新页面重试</div>;
  }

  return (
    <div className={styles.dashboard}>
      <ExecutiveSummary
        report={data.report}
        wxCluster={data.wxCluster}
        nfCluster={data.nfCluster}
        wxMetrics={data.wxMetrics}
        nfMetrics={data.nfMetrics}
      />

      <SlaMetricsTable metrics={data.slaMetrics || []} />
      {console.log('SLA Metrics data:', data.slaMetrics)}

      <ClusterMetricsTable
        wxMetrics={data.wxMetrics}
        nfMetrics={data.nfMetrics}
      />

      <CloudRegionTraffic
        topRegions={data.topRegions}
        regionStats={data.regionStats}
      />

      <AssessmentPlanning
        assessments={data.assessments}
        actionPlans={data.actionPlans}
      />
    </div>
  );
};

export default Dashboard;
