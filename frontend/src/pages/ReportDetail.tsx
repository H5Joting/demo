import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchBusinessSystem } from '@/api';
import { BusinessSystem } from '@/types';
import ErrorState from '@/components/ErrorState';
import PageHeader from '@/components/PageHeader';
import styles from './ReportDetail.module.scss';

const ReportDetail: React.FC = () => {
  const { systemId } = useParams<{ systemId: string }>();
  const navigate = useNavigate();
  const [system, setSystem] = useState<BusinessSystem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getReportDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const [reportDateTime] = useState(getReportDateTime);

  useEffect(() => {
    const loadSystem = async () => {
      if (!systemId) {
        setError('系统ID不存在');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await fetchBusinessSystem(systemId);
        setSystem(data);
      } catch (err: unknown) {
        console.error('Failed to load system:', err);
        setError('加载系统信息失败');
      } finally {
        setLoading(false);
      }
    };

    loadSystem();
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

  if (error || !system) {
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

  const reportTypeMap: Record<string, { type: string; color: string; bg: string }> = {
    'payment-center': { type: '订单服务', color: '#155dfc', bg: '#eff6ff' },
    'order-system': { type: '财务服务', color: '#16a34a', bg: '#ecfdf5' },
    'user-center': { type: 'API分析', color: '#7c3aed', bg: '#f5f3ff' },
    'log-service': { type: '日常分析', color: '#ca8a04', bg: '#fffbeb' },
  };
  const reportConfig = reportTypeMap[system.code] || { type: 'API分析', color: '#155dfc', bg: '#eff6ff' };

  const mockMetrics = {
    requestCount: Math.floor(Math.random() * 50000 + 100000).toLocaleString(),
    requestChange: `+${(Math.random() * 10 + 5).toFixed(1)}%`,
    responseTime: `${(Math.random() * 200 + 50).toFixed(1)}ms`,
    responseChange: `-${(Math.random() * 5 + 1).toFixed(1)}%`,
    cpuUsage: `${(Math.random() * 30 + 60).toFixed(1)}%`,
    cpuChange: `-${(Math.random() * 3 + 0.5).toFixed(1)}%`,
    memoryUsage: `${(Math.random() * 20 + 70).toFixed(1)}%`,
    memoryChange: `+${(Math.random() * 2 + 0.5).toFixed(1)}%`,
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
          reportDate: '2026-03-30',
          lastUpdate: '2026-03-30 07:45:00',
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
            <div className={styles.metricCard}>
              <div className={styles.metricLabel}>
                {system.code === 'payment-center' ? '交易量' : system.code === 'order-system' ? '订单量' : '请求量'}
              </div>
              <div className={styles.metricValue}>{mockMetrics.requestCount}</div>
              <div className={styles.metricChange}>
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M4 6.5L7 3.5L10 6.5" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7 3.5V10" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span style={{ color: '#dc2626' }}>{mockMetrics.requestChange}</span>
              </div>
            </div>
            <div className={styles.metricCard}>
              <div className={styles.metricLabel}>响应时间</div>
              <div className={styles.metricValue}>{mockMetrics.responseTime}</div>
              <div className={styles.metricChange}>
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M4 6.5L7 9.5L10 6.5" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7 3V9.5" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span style={{ color: '#16a34a' }}>{mockMetrics.responseChange}</span>
              </div>
            </div>
            <div className={styles.metricCard}>
              <div className={styles.metricLabel}>CPU使用率</div>
              <div className={styles.metricValue}>{mockMetrics.cpuUsage}</div>
              <div className={styles.metricChange}>
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M4 6.5L7 9.5L10 6.5" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7 3V9.5" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span style={{ color: '#16a34a' }}>{mockMetrics.cpuChange}</span>
              </div>
            </div>
            <div className={styles.metricCard}>
              <div className={styles.metricLabel}>内存使用率</div>
              <div className={styles.metricValue}>{mockMetrics.memoryUsage}</div>
              <div className={styles.metricChange}>
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M4 6.5L7 3.5L10 6.5" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7 3.5V10" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span style={{ color: '#dc2626' }}>{mockMetrics.memoryChange}</span>
              </div>
            </div>
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
            <span>{reportDateTime}</span>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ReportDetail;
