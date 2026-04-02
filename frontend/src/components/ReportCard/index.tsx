import React from 'react';
import { formatValue } from '@/utils/format';
import styles from './ReportCard.module.scss';

interface Metric {
  label: string;
  value: string | null | undefined;
  change: string | null | undefined;
  trend: 'up' | 'down' | 'neutral';
}

interface ReportCardProps {
  reportType: string;
  reportTypeColor?: string;
  reportTypeBg?: string;
  status: 'normal' | 'warning' | 'critical' | 'offline';
  title: string;
  subtitle?: string;
  description: string;
  metrics: Metric[];
  time?: string;
  date?: string;
}

const ReportCard: React.FC<ReportCardProps> = ({
  reportType,
  reportTypeColor = '#155dfc',
  reportTypeBg = '#eff6ff',
  status,
  title,
  subtitle,
  description,
  metrics,
  time,
  date
}) => {
  const statusConfig = {
    normal: { bg: '#ecfdf5', border: '#d0fae5', text: '#009966', dot: '#00bc7d', label: '正常' },
    warning: { bg: '#fffbeb', border: '#fde68a', text: '#b45309', dot: '#f59e0b', label: '警告' },
    critical: { bg: '#fef2f2', border: '#fecaca', text: '#dc2626', dot: '#ef4444', label: '异常' },
    offline: { bg: '#f1f5f9', border: '#e2e8f0', text: '#64748b', dot: '#94a3b8', label: '离线' }
  };

  const currentStatus = statusConfig[status];

  const renderTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
    if (trend === 'up') {
      return (
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
          <path d="M6.5 3L9.5 6L6.5 9" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    }
    if (trend === 'down') {
      return (
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
          <path d="M6.5 9L9.5 6L6.5 3" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    }
    return (
      <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
        <path d="M4 6.5h5" stroke="#62748e" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    );
  };

  const getTrendColor = (trend: 'up' | 'down' | 'neutral') => {
    if (trend === 'up') return '#16a34a';
    if (trend === 'down') return '#dc2626';
    return '#62748e';
  };

  return (
    <div className={styles.systemCard}>
      <div className={styles.cardHeader}>
        <div 
          className={styles.reportTypeBadge} 
          style={{ backgroundColor: reportTypeBg, color: reportTypeColor }}
        >
          {reportType}
        </div>
        <div 
          className={styles.statusBadge}
          style={{ 
            backgroundColor: currentStatus.bg, 
            borderColor: currentStatus.border 
          }}
        >
          <span className={styles.statusDot} style={{ backgroundColor: currentStatus.dot }} />
          <span style={{ color: currentStatus.text }}>{currentStatus.label}</span>
        </div>
      </div>
      
      <h3 className={styles.cardTitle}>{title}</h3>
      {subtitle && <p className={styles.cardSubtitle}>{subtitle}</p>}
      <p className={styles.cardDesc}>{description}</p>
      
      <div className={styles.metricsContainer}>
        {metrics.map((metric, index) => (
          <div key={index} className={styles.metricCard}>
            <div className={styles.metricLabel}>{metric.label}</div>
            <div className={styles.metricValue}>{formatValue(metric.value)}</div>
            <div className={styles.metricChange}>
              {renderTrendIcon(metric.trend)}
              <span style={{ color: getTrendColor(metric.trend) }}>
                {formatValue(metric.change)}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <div className={styles.cardFooter}>
        {time && (
          <div className={styles.footerItem}>
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <circle cx="5.5" cy="5.5" r="4.5" stroke="#90a1b9" strokeWidth="1.2" strokeLinecap="round"/>
              <path d="M5.5 3v1M5.5 8H4" stroke="#90a1b9" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            <span>{time}</span>
          </div>
        )}
        {date && (
          <div className={styles.footerItem}>
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <rect x="1.5" y="2.5" width="8" height="7" rx="1" stroke="#90a1b9" strokeWidth="1.2"/>
              <path d="M3 1v2M8 1v2" stroke="#90a1b9" strokeWidth="1.2" strokeLinecap="round"/>
              <path d="M1.5 5h8" stroke="#90a1b9" strokeWidth="1.2"/>
            </svg>
            <span>{date}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportCard;
