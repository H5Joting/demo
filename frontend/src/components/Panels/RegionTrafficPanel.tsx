import React, { useState } from 'react';
import { Card, Button, Progress } from 'antd';
import { CloudRegion } from '@/types';
import styles from './RegionTrafficPanel.module.scss';

interface Props {
  topRegions: CloudRegion[];
  defaultCluster?: 'wx' | 'nf';
}

const RegionTrafficPanel: React.FC<Props> = ({ topRegions, defaultCluster = 'wx' }) => {
  const [activeCluster, setActiveCluster] = useState<'wx' | 'nf'>(defaultCluster);

  const filteredRegions = topRegions.filter(r => r.cluster_type === activeCluster);

  const getRegionStatusClass = (region: CloudRegion) => {
    const ratio = region.current_traffic / region.peak_traffic;
    if (ratio > 0.9) {
      return styles.healthTagError;
    } else if (ratio > 0.8) {
      return styles.healthTagWarning;
    }
    return styles.healthTagSuccess;
  };

  const getRegionStatusText = (region: CloudRegion) => {
    const ratio = region.current_traffic / region.peak_traffic;
    if (ratio > 0.9) {
      return '异常';
    } else if (ratio > 0.8) {
      return '告警';
    }
    return '健康';
  };

  return (
    <Card className={styles.regionCard}>
      <div className={styles.panelHeader}>
        <div className={styles.titleGroup}>
          <h4>区域流量 TOP 5</h4>
          <span className={styles.subtitle}>Regional Traffic Distribution</span>
        </div>
        <Button className={styles.viewAllBtn}>查看全部</Button>
      </div>

      <div className={styles.clusterTabs}>
        <Button
          type="text"
          className={activeCluster === 'wx' ? styles.activeClusterTab : styles.clusterTab}
          onClick={() => setActiveCluster('wx')}
        >
          威新中心
        </Button>
        <Button
          type="text"
          className={activeCluster === 'nf' ? styles.activeClusterTab : styles.clusterTab}
          onClick={() => setActiveCluster('nf')}
        >
          南方中心
        </Button>
      </div>

      <div className={styles.regionList}>
        {filteredRegions.slice(0, 5).map((region, index) => (
          <div key={region.id} className={styles.regionItem}>
            <div className={styles.rankBadge}>
              <span className={styles.rankLabel}>Rank</span>
              <span className={styles.rankNumber}>{index + 1}</span>
            </div>
            <div className={styles.regionInfo}>
              <div className={styles.regionHeader}>
                <span className={styles.regionName}>
                  {region.name} <span className={styles.nodeCount}>({region.node_count} 节点)</span>
                </span>
                <div className={styles.trafficValue}>
                  <span className={styles.currentTraffic}>{region.current_traffic}</span>
                  <span className={styles.trafficSeparator}>/</span>
                  <span className={styles.maxTraffic}>{region.peak_traffic} Gbps</span>
                </div>
              </div>
              <Progress
                percent={(region.current_traffic / region.peak_traffic) * 100}
                showInfo={false}
                strokeColor="#4361ee"
                trailColor="#f1f5f9"
                className={styles.progress}
              />
            </div>
            <div className={styles.regionStatus}>
              <span className={`${styles.healthTag} ${getRegionStatusClass(region)}`}>
                <span className={styles.healthDotWrapper}>
                  <span className={styles.healthDotInner} />
                  <span className={styles.healthDotOuter} />
                </span>
                {getRegionStatusText(region)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default RegionTrafficPanel;
