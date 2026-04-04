import React from 'react';
import { RightOutlined, ReloadOutlined, DownloadOutlined, ShareAltOutlined, SettingOutlined, CalendarOutlined, ClockCircleOutlined, UserOutlined, SyncOutlined, TagOutlined, ExclamationCircleOutlined, LeftOutlined } from '@ant-design/icons';
import styles from './PageHeader.module.scss';

export interface PageHeaderProps {
  className?: string;
  breadcrumb?: { label: string; href?: string }[];
  title: string;
  subtitle?: string;
  typeBadge?: string;
  statusBadge?: 'normal' | 'warning' | 'error';
  tags?: string[];
  meta?: {
    reportDate?: string;
    lastUpdate?: string;
    owner?: string;
    updateFrequency?: string;
  };
  onRefresh?: () => void;
  onExport?: () => void;
  onShare?: () => void;
  onConfig?: () => void;
  onBack?: () => void;
  fullWidth?: boolean;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  className,
  breadcrumb = [{ label: '报表总览' }],
  title,
  subtitle,
  typeBadge,
  statusBadge,
  tags,
  meta,
  onRefresh,
  onExport,
  onShare,
  onConfig,
  onBack,
  fullWidth = false,
}) => {
  return (
    <div className={`${styles.container} ${fullWidth ? styles.fullWidth : ''} ${className || ''}`}>
      <nav className={styles.breadcrumb}>
        {breadcrumb.map((item, index) => (
          <React.Fragment key={index}>
            <span className={index === breadcrumb.length - 1 ? styles.breadcrumbActive : styles.breadcrumbItem}>
              {item.label}
            </span>
            {index < breadcrumb.length - 1 && <RightOutlined className={styles.breadcrumbSeparator} />}
          </React.Fragment>
        ))}
      </nav>

      <div className={styles.headerContent}>
        <div className={styles.titleSection}>
          <button className={styles.backIconButton} onClick={onBack}>
            <LeftOutlined className={styles.backIcon} />
          </button>
          <div className={styles.titleInfo}>
            <div className={styles.badges}>
              {typeBadge && <span className={styles.badgeCyan}>{typeBadge}</span>}
              {statusBadge && (
                <span className={statusBadge === 'warning' ? styles.badgeWarning : statusBadge === 'error' ? styles.badgeError : styles.badgeSuccess}>
                  {statusBadge === 'warning' && <ExclamationCircleOutlined className={styles.warningIcon} />}
                  {statusBadge === 'warning' ? '警告' : statusBadge === 'error' ? '异常' : '正常'}
                </span>
              )}
            </div>
            <h1 className={styles.title}>{title}</h1>
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.actionBtn} onClick={onRefresh}>
            <ReloadOutlined className={styles.actionIcon} />
            刷新
          </button>
          <button className={styles.actionBtn} onClick={onExport}>
            <DownloadOutlined className={styles.actionIcon} />
            导出
          </button>
          <button className={styles.actionBtn} onClick={onShare}>
            <ShareAltOutlined className={styles.actionIcon} />
            分享
          </button>
          <button className={styles.actionBtnPrimary} onClick={onConfig}>
            <SettingOutlined className={styles.actionIcon} />
            配置
          </button>
        </div>
      </div>

      <div className={styles.metaRow}>
        {meta?.reportDate && (
          <div className={styles.metaItem}>
            <CalendarOutlined className={styles.metaIcon} />
            <span className={styles.metaLabel}>报表日期：</span>
            <span className={styles.metaValue}>{meta.reportDate}</span>
          </div>
        )}
        {meta?.lastUpdate && (
          <div className={styles.metaItem}>
            <ClockCircleOutlined className={styles.metaIcon} />
            <span className={styles.metaLabel}>最后更新：</span>
            <span className={styles.metaValue}>{meta.lastUpdate}</span>
          </div>
        )}
        {meta?.owner && (
          <div className={styles.metaItem}>
            <UserOutlined className={styles.metaIcon} />
            <span className={styles.metaLabel}>负责人：</span>
            <span className={styles.metaValue}>{meta.owner}</span>
          </div>
        )}
        {meta?.updateFrequency && (
          <div className={styles.metaItem}>
            <SyncOutlined className={styles.metaIcon} />
            <span className={styles.metaLabel}>更新频率：</span>
            <span className={styles.metaValue}>{meta.updateFrequency}</span>
          </div>
        )}
        {tags && tags.length > 0 && (
          <div className={styles.metaItemTags}>
            <TagOutlined className={styles.metaIcon} />
            <div className={styles.tags}>
              {tags.map((tag, index) => (
                <span key={index} className={styles.tag}>{tag}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
