import React, { useState, useMemo } from 'react';
import { Card, Button } from 'antd';
import { LineChartOutlined } from '@ant-design/icons';
import { LogMetric } from '@/types';
import styles from './ClusterMetricsTable.module.scss';

interface Props {
  wxMetrics: LogMetric[];
  nfMetrics: LogMetric[];
}

const layerConfig: Record<string, { name: string; nameEn: string; color: string }> = {
  access: { name: '接入层', nameEn: 'ACCESS', color: '#4361ee' },
  buffer: { name: '缓冲层', nameEn: 'BUFFER', color: '#a061ff' },
  storage: { name: '存储层', nameEn: 'STORAGE', color: '#00b4d8' },
  application: { name: '应用层', nameEn: 'APPLICATION', color: '#ffb002' },
};

const metricOrder = [
  'Collector EPS',
  'Kafka写入流量',
  '磁盘使用率',
  '平均搜索耗时',
  'CPU使用率',
  '日志入库耗时',
  '监控延迟',
];

const ClusterMetricsTable: React.FC<Props> = ({ wxMetrics, nfMetrics }) => {
  const [activeCluster, setActiveCluster] = useState<'wx' | 'nf'>('wx');

  const metrics = activeCluster === 'wx' ? wxMetrics : nfMetrics;

  const sortedMetrics = useMemo(() => {
    return [...(metrics || [])].sort((a, b) => {
      const indexA = metricOrder.indexOf(a.metric_name);
      const indexB = metricOrder.indexOf(b.metric_name);
      return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
    });
  }, [metrics]);

  const layerGroups = useMemo(() => {
    const groups: { layer: string; metrics: LogMetric[] }[] = [];
    const layerOrder = ['access', 'buffer', 'storage', 'application'];
    
    layerOrder.forEach(layer => {
      const layerMetrics = sortedMetrics.filter(m => m.layer === layer);
      if (layerMetrics.length > 0) {
        groups.push({ layer, metrics: layerMetrics });
      }
    });
    
    return groups;
  }, [sortedMetrics]);

  const formatValue = (value: number | undefined, unit: string) => {
    if (value === undefined || value === null) return '-';
    return `${value} ${unit}`;
  };

  const formatChangeRate = (rate: number) => {
    if (rate === 0) return { text: '0.0%', className: styles.rateNeutral };
    const isPositive = rate > 0;
    return {
      text: `${isPositive ? '▲' : '▼'} ${Math.abs(rate).toFixed(1)}%`,
      className: isPositive ? styles.rateUp : styles.rateDown,
    };
  };

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2>三、集群核心指标明细</h2>
        <span className={styles.subtitle}>Cluster Core Metrics Detail</span>
      </div>

      <Card className={styles.tableCard}>
        <div className={styles.tabs}>
          <Button
            type={activeCluster === 'wx' ? 'primary' : 'text'}
            className={activeCluster === 'wx' ? styles.activeTab : styles.tab}
            onClick={() => setActiveCluster('wx')}
          >
            威新中心
          </Button>
          <Button
            type="text"
            className={activeCluster === 'nf' ? styles.activeTab : styles.tab}
            onClick={() => setActiveCluster('nf')}
          >
            南方中心
          </Button>
        </div>

        <table className={styles.table}>
          <thead>
            <tr className={styles.tableHeaderRow}>
              <th className={`${styles.colLayer} ${styles.tableHeaderCell}`}>链路层级</th>
              <th className={`${styles.colName} ${styles.tableHeaderCell}`}>指标名称</th>
              <th className={`${styles.colToday} ${styles.tableHeaderCell}`}>当日峰值 (MAX/AVG)</th>
              <th className={`${styles.colYesterday} ${styles.tableHeaderCell}`}>上日峰值 (MAX/AVG)</th>
              <th className={`${styles.colHistory} ${styles.tableHeaderCell}`}>历史峰值</th>
              <th className={`${styles.colRate} ${styles.tableHeaderCell}`}>同/环比</th>
              <th className={`${styles.colConclusion} ${styles.tableHeaderCell}`}>结论 & 趋势</th>
            </tr>
          </thead>
          <tbody>
            {layerGroups.map((group) => {
              const layer = layerConfig[group.layer] || layerConfig.application;
              const rowCount = group.metrics.length;
              
              return group.metrics.map((metric, index) => {
                const changeRate = formatChangeRate(metric.change_rate);
                
                return (
                  <tr key={metric.id || `${group.layer}-${index}`} className={styles.tableRow}>
                    {index === 0 && (
                      <td 
                        className={`${styles.colLayer} ${styles.colLayerData}`} 
                        rowSpan={rowCount}
                      >
                        <div 
                          className={styles.layerBar} 
                          style={{ backgroundColor: layer.color }} 
                        />
                        <div className={styles.layerCell}>
                          <div className={styles.layerContent}>
                            <span className={styles.layerName} style={{ color: layer.color }}>{layer.name}</span>
                            <span className={styles.layerEn}>{layer.nameEn}</span>
                          </div>
                        </div>
                      </td>
                    )}
                    <td className={styles.colName}>
                      <span className={styles.metricName}>{metric.metric_name}</span>
                    </td>
                    <td className={styles.colToday}>
                      <div className={styles.metricValue}>
                        <span className={styles.maxValue}>{formatValue(metric.today_max, metric.unit)}</span>
                        <span className={styles.avgValue}>Avg: {formatValue(metric.today_avg, metric.unit)}</span>
                      </div>
                    </td>
                    <td className={styles.colYesterday}>
                      <div className={styles.metricValue}>
                        <span className={styles.yesterdayMax}>{formatValue(metric.yesterday_max, metric.unit)}</span>
                        <span className={styles.avgValue}>Avg: {formatValue(metric.yesterday_avg, metric.unit)}</span>
                      </div>
                    </td>
                    <td className={styles.colHistory}>
                      <span className={styles.historicalMax}>{formatValue(metric.historical_max, metric.unit)}</span>
                    </td>
                    <td className={styles.colRate}>
                      <span className={changeRate.className}>{changeRate.text}</span>
                    </td>
                    <td className={styles.colConclusion}>
                      <div className={styles.conclusion}>
                        <span className={styles.healthStatus}>水位健康</span>
                        <Button className={styles.trendBtn} size="small">
                          趋势
                          <div className={styles.trendIcon}>
                            <LineChartOutlined />
                          </div>
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              });
            })}
          </tbody>
        </table>
      </Card>
    </section>
  );
};

export default ClusterMetricsTable;
