import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchReportDetail, ReportDetailData, SystemMetric } from '@/api';
import ErrorState from '@/components/ErrorState';
import PageHeader from '@/components/PageHeader';
import styles from './ReportDetail.module.scss';

const ReportDetail: React.FC = () => {
  const { systemId } = useParams<{ systemId: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<ReportDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!systemId) {
        setError('系统ID不存在');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const result = await fetchReportDetail(systemId);
        setData(result);
      } catch (err: unknown) {
        console.error('Failed to load report detail:', err);
        setError('加载报表详情失败');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [systemId]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingWrapper}>
          <div className={styles.loadingSpinner}></div>
          <span>加载中...</span>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={styles.container}>
        <div className={styles.errorWrapper}>
          <ErrorState
            title="数据加载失败"
            message={error || '未找到该系统'}
            onRetry={() => navigate('/overview')}
            retryText="返回列表"
          />
        </div>
      </div>
    );
  }

  const { system, metrics, clusters, reportDate } = data;

  const reportTypeMap: Record<string, { type: string; color: string; bg: string }> = {
    'unified-log': { type: '日志服务', color: '#ca8a04', bg: '#fffbeb' },
    'payment-center': { type: '支付服务', color: '#155dfc', bg: '#eff6ff' },
    'order-system': { type: '订单服务', color: '#16a34a', bg: '#ecfdf5' },
  };
  const reportConfig = reportTypeMap[system.code] || { type: 'API分析', color: '#155dfc', bg: '#eff6ff' };

  const renderTrendIcon = (trend: string, color: string) => {
    if (trend === 'up') {
      return (
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
          <path d="M4 6.5L7 3.5L10 6.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M7 3.5V10" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    } else if (trend === 'down') {
      return (
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
          <path d="M4 6.5L7 9.5L10 6.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M7 3V9.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    }
    return null;
  };

  const handleRefresh = () => {
    console.log('Refresh clicked');
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
    <div className={styles.container}>
      <PageHeader
        breadcrumb={[
          { label: '报表总览', href: '/overview' },
          { label: system.name },
        ]}
        title={system.name}
        subtitle={system.description}
        typeBadge={reportConfig.type}
        statusBadge={system.status === 'active' ? 'normal' : 'error'}
        tags={['用户', '行为', '分析']}
        meta={{
          reportDate: reportDate.split(' ')[0],
          lastUpdate: reportDate,
          owner: '王工 · 数据分析团队',
          updateFrequency: '每日',
        }}
        onRefresh={handleRefresh}
        onExport={handleExport}
        onShare={handleShare}
        onConfig={handleConfig}
      />

      <div className={styles.content}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>核心指标</h2>
          <div className={styles.metricsGrid}>
            {metrics.map((metric: SystemMetric, index: number) => {
              const isPositiveTrend = metric.trend === 'up';
              const color = metric.label === '响应时间' || metric.label === 'CPU使用率' || metric.label === '内存使用率'
                ? (isPositiveTrend ? '#16a34a' : '#dc2626')
                : (isPositiveTrend ? '#dc2626' : '#16a34a');
              
              return (
                <div key={index} className={styles.metricCard}>
                  <div className={styles.metricLabel}>{metric.label}</div>
                  <div className={styles.metricValue}>{metric.value}</div>
                  <div className={styles.metricChange}>
                    {renderTrendIcon(metric.trend, color)}
                    <span style={{ color }}>{metric.change}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>集群信息</h2>
          <div className={styles.infoCard}>
            {clusters.map((cluster, index) => (
              <div key={cluster.id} className={styles.infoRow}>
                <span className={styles.infoLabel}>{cluster.name}</span>
                <span className={styles.infoValue}>{cluster.type === 'wx' ? '主集群' : '备集群'}</span>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>系统信息</h2>
          <div className={styles.infoCard}>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>系统编码</span>
              <span className={styles.infoValue}>{system.code}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>系统状态</span>
              <span className={styles.infoValue}>{system.status === 'active' ? '正常运行' : '已停用'}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>创建时间</span>
              <span className={styles.infoValue}>{system.created_at || '2026-01-01 00:00:00'}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>更新时间</span>
              <span className={styles.infoValue}>{system.updated_at || '2026-03-31 12:00:00'}</span>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>数据统计周期</h2>
          <div className={styles.dateRange}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="3" width="12" height="11" rx="2" stroke="#90a1b9" strokeWidth="1.5"/>
              <path d="M5 1V3M11 1V3M2 6H14" stroke="#90a1b9" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span>{reportDate}</span>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ReportDetail;
