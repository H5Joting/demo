import React from 'react';
import { Card, Table } from 'antd';
import { LogMetric } from '@/types';
import styles from './SlaMetricsTable.module.scss';

interface Props {
  metrics: LogMetric[];
}

const SlaMetricsTable: React.FC<Props> = ({ metrics }) => {
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

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2>二、SLA 核心指标</h2>
        <span className={styles.subtitle}>SLA Core Metrics</span>
      </div>

      <Card className={styles.tableCard}>
        <Table
          columns={columns}
          dataSource={metrics}
          rowKey="id"
          pagination={false}
          className={styles.table}
        />
      </Card>
    </section>
  );
};

export default SlaMetricsTable;
