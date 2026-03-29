import React from 'react';
import { Card, Typography } from 'antd';
import styles from './LogStatistics.module.scss';

const LogStatistics: React.FC = () => {
  return (
    <div className={styles.statistics}>
      <div className={styles.header}>
        <h2>日志统计分析</h2>
        <span className={styles.subtitle}>Log Statistics Analysis</span>
      </div>

      <div className={styles.content}>
        <Card className={styles.chartCard}>
          <Typography.Text type="secondary">
            此页面将展示日志统计分析图表，功能开发中...
          </Typography.Text>
        </Card>
      </div>
    </div>
  );
};

export default LogStatistics;
