import React from 'react';
import { Card, Table, Spin, Empty } from 'antd';
import { LogMetric, GrafanaPanelDatasource } from '@/types';
import { usePanelData, PANEL_DATASOURCES, PanelDatasource } from '@/hooks/usePanelData';
import styles from './SlaMetricsPanel.module.scss';

interface Props {
  date: string;
  systemId: string;
  datasource?: GrafanaPanelDatasource;
}

const SlaMetricsPanel: React.FC<Props> = ({ date, systemId, datasource }) => {
  const effectiveDatasource: PanelDatasource | null = datasource?.endpoint
    ? {
        type: datasource.type || 'api',
        endpoint: datasource.endpoint,
        method: datasource.method || 'GET',
        params: datasource.params,
      }
    : PANEL_DATASOURCES.slaMetrics;

  const { data: metrics, loading, error } = usePanelData<LogMetric[]>(
    effectiveDatasource,
    { date, systemId }
  );

  const getHealthStatusClass = (status: string) => {
    switch (status) {
      case 'warning':
        return styles.healthTagWarning;
      case 'critical':
        return styles.healthTagError;
      default:
        return styles.healthTagSuccess;
    }
  };

  const getHealthStatusText = (status: string) => {
    switch (status) {
      case 'warning':
        return '告警';
      case 'critical':
        return '异常';
      default:
        return '健康';
    }
  };

  const columns = [
    {
      title: '指标名称',
      dataIndex: 'metric_name',
      key: 'metric_name',
      width: 200,
      render: (text: string) => <span className={styles.metricName}>{text}</span>,
    },
    {
      title: '今日数据',
      key: 'today',
      width: 180,
      render: (_: unknown, record: LogMetric) => (
        <div className={styles.metricValue}>
          <span className={styles.maxValue}>{record.today_max} {record.unit}</span>
          <span className={styles.avgValue}>Avg: {record.today_avg} {record.unit}</span>
        </div>
      ),
    },
    {
      title: '前一交易日',
      key: 'yesterday',
      width: 180,
      render: (_: unknown, record: LogMetric) => (
        <div className={styles.metricValue}>
          <span className={styles.yesterdayMax}>{record.yesterday_max} {record.unit}</span>
          <span className={styles.avgValue}>Avg: {record.yesterday_avg} {record.unit}</span>
        </div>
      ),
    },
    {
      title: '历史峰值 (日期)',
      key: 'historical',
      width: 180,
      render: (_: unknown, record: LogMetric) => (
        <div className={styles.metricValue}>
          <span className={styles.historicalMax}>{record.historical_max} {record.unit}</span>
          <span className={styles.avgValue}>({record.historical_max_date})</span>
        </div>
      ),
    },
    {
      title: 'SLA 阈值',
      dataIndex: 'sla_threshold',
      key: 'sla_threshold',
      width: 150,
      render: (value: number, record: LogMetric) => (
        <span className={styles.slaThreshold}>&lt; {value.toFixed(4)} {record.unit}</span>
      ),
    },
    {
      title: '健康评估',
      key: 'health',
      width: 120,
      render: (_: unknown, record: LogMetric) => (
        <span className={`${styles.healthTag} ${getHealthStatusClass(record.health_status)}`}>
          <span className={styles.healthDotWrapper}>
            <span className={styles.healthDotInner} />
            <span className={styles.healthDotOuter} />
          </span>
          {getHealthStatusText(record.health_status)}
        </span>
      ),
    },
  ];

  if (loading) {
    return (
      <Card className={styles.tableCard}>
        <div className={styles.loadingContainer}>
          <Spin />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={styles.tableCard}>
        <Empty description={error} />
      </Card>
    );
  }

  return (
    <Card className={styles.tableCard}>
      <Table
        columns={columns}
        dataSource={metrics || []}
        rowKey="id"
        pagination={false}
        className={styles.table}
      />
    </Card>
  );
};

export default SlaMetricsPanel;
