import React, { useState } from 'react';
import { Popconfirm, message } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
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
  systemId?: string;
  onViewDetail?: (systemId: string) => void;
  onDelete?: (systemId: string) => Promise<void>;
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
  date,
  systemId,
  onViewDetail,
  onDelete
}) => {
  const [deleting, setDeleting] = useState(false);

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
          <path d="M4 6.5L7 3.5L10 6.5" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M7 3.5V10" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    }
    if (trend === 'down') {
      return (
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
          <path d="M4 6.5L7 9.5L10 6.5" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M7 3V9.5" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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
    if (trend === 'up') return '#dc2626';
    if (trend === 'down') return '#16a34a';
    return '#62748e';
  };

  const handleDelete = async () => {
    if (!systemId || !onDelete) return;
    
    setDeleting(true);
    try {
      await onDelete(systemId);
      message.success('删除成功');
    } catch (error) {
      message.error('删除失败');
    } finally {
      setDeleting(false);
    }
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
        <div className={styles.headerRight}>
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
          {onDelete && (
            <Popconfirm
              title="确认删除"
              description="确定要删除此报表吗？删除后无法恢复。"
              onConfirm={handleDelete}
              okText="确认"
              cancelText="取消"
              okButtonProps={{ loading: deleting, danger: true }}
            >
              <button className={styles.deleteBtn} title="删除报表">
                <DeleteOutlined />
              </button>
            </Popconfirm>
          )}
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
        <div className={styles.footerLeft}>
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
        <button className={styles.detailBtn} onClick={() => {
          if (systemId && onViewDetail) {
            onViewDetail(systemId);
          }
        }}>
          查看详情
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M4 2L8 6L4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ReportCard;
