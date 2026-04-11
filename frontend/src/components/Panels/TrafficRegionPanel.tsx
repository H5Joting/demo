import React, { useState } from 'react';
import { Card, Button, Progress, Spin, Empty } from 'antd';
import { RegionStats, CloudRegion, GrafanaPanelDatasource } from '@/types';
import { usePanelData, PANEL_DATASOURCES, PanelDatasource } from '@/hooks/usePanelData';
import styles from './TrafficRegionPanel.module.scss';

interface Props {
  date: string;
  systemId: string;
  datasource?: GrafanaPanelDatasource;
}

interface RegionTrafficData {
  regionStats: RegionStats;
  topRegions: CloudRegion[];
}

const TrafficRegionPanel: React.FC<Props> = ({ date, systemId, datasource }) => {
  const effectiveDatasource: PanelDatasource | null = datasource
    ? {
        type: datasource.type || 'api',
        endpoint: datasource.endpoint || '/api/panel/region-traffic',
        method: datasource.method || 'GET',
        params: datasource.params,
      }
    : PANEL_DATASOURCES.regionTraffic;

  const { data, loading, error } = usePanelData<RegionTrafficData>(
    effectiveDatasource,
    { date, systemId }
  );

  const [activeCluster, setActiveCluster] = useState<'wx' | 'nf'>('wx');

  const regionStats = data?.regionStats;
  const topRegions = data?.topRegions || [];
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

  if (loading) {
    return (
      <Card className={styles.contentCard}>
        <div className={styles.loadingContainer}>
          <Spin />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={styles.contentCard}>
        <Empty description={error} />
      </Card>
    );
  }

  return (
    <Card className={styles.contentCard}>
      <div className={styles.leftPanel}>
        <div className={styles.overview}>
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
              <span className={styles.count}>{regionStats?.total_regions || 0}</span>
              <span className={styles.unit}>/ 云区域</span>
            </div>
            <div className={styles.clusterBreakdown}>
              <div className={styles.clusterItem}>
                <span className={styles.clusterLabel}>南方集群</span>
                <span className={styles.clusterCount}>{regionStats?.nf_regions || 0} 云区域</span>
              </div>
              <div className={styles.clusterItem}>
                <span className={styles.clusterLabel}>威新集群</span>
                <span className={styles.clusterCount}>{regionStats?.wx_regions || 0} 云区域</span>
              </div>
            </div>
            <div className={styles.decorativeCircle} />
          </div>

          <div className={styles.statsRow}>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>平均流量</span>
              <div className={styles.statValue}>
                <span className={styles.statNumber}>{(regionStats?.avg_traffic || 0).toFixed(2)}</span>
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
        </div>

        <div className={styles.statusRow}>
          <span className={styles.statusLabel}>链路实时状态</span>
          <span className={`${styles.healthTag} ${styles.healthTagSuccess}`}>
            <span className={styles.healthDotWrapper}>
              <span className={styles.healthDotInner} />
              <span className={styles.healthDotOuter} />
            </span>
            监控中
          </span>
        </div>
      </div>

      <div className={styles.rightPanel}>
        <div className={styles.panelHeader}>
          <div className={styles.titleGroup}>
            <h4>区域流量 TOP 5</h4>
            <span>Regional Traffic Distribution</span>
            <div className={styles.clusterTabs}>
              <Button
                type={activeCluster === 'wx' ? 'primary' : 'text'}
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
          </div>
          <Button type="link" className={styles.viewAllBtn}>
            查看完整列表 →
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
      </div>
    </Card>
  );
};

export default TrafficRegionPanel;
