import React from 'react';
import { Card } from 'antd';
import { RegionStats } from '@/types';
import styles from './TrafficOverviewPanel.module.scss';

interface Props {
  regionStats: RegionStats;
}

const TrafficOverviewPanel: React.FC<Props> = ({ regionStats }) => {
  return (
    <Card className={styles.summaryCard}>
      <div className={styles.overviewHeader}>
        <div className={styles.overviewIcon}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="8" stroke="#155dfc" strokeWidth="2"/>
            <path d="M10 6V10L13 13" stroke="#155dfc" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <h3>全网流量概览</h3>
      </div>

      <div className={styles.regionCount}>
        <span className={styles.label}>纳管区域总数</span>
        <div className={styles.countValue}>
          <span className={styles.count}>{regionStats.total_regions}</span>
          <span className={styles.unit}>/ 云区域</span>
        </div>
        <div className={styles.clusterBreakdown}>
          <div className={styles.clusterItem}>
            <span className={styles.clusterLabel}>南方集群</span>
            <span className={styles.clusterCount}>{regionStats.nf_regions} 云区域</span>
          </div>
          <div className={styles.clusterItem}>
            <span className={styles.clusterLabel}>威新集群</span>
            <span className={styles.clusterCount}>{regionStats.wx_regions} 云区域</span>
          </div>
        </div>
        <div className={styles.decorativeCircle} />
      </div>

      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>平均流量</span>
          <div className={styles.statValue}>
            <span className={styles.statNumber}>{regionStats.avg_traffic.toFixed(2)}</span>
            <span className={styles.statUnit}>Mbps</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>峰值时间</span>
          <div className={styles.statValue}>
            <span className={styles.statTime}>
              <span>09:31:00</span>
              <span>CST</span>
            </span>
          </div>
        </div>
      </div>

      <div className={styles.statusRow}>
        <span className={styles.statusLabel}>链路实时状态</span>
        <span className={styles.healthTag}>
          <span className={styles.healthDotWrapper}>
            <span className={styles.healthDotInner} />
            <span className={styles.healthDotOuter} />
          </span>
          监控中
        </span>
      </div>
    </Card>
  );
};

export default TrafficOverviewPanel;
