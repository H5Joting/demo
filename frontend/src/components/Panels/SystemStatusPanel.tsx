import React from 'react';
import { Card, Button } from 'antd';
import { CheckCircleOutlined, BulbOutlined, EyeOutlined } from '@ant-design/icons';
import { DailyReport } from '@/types';
import styles from './SystemStatusPanel.module.scss';

interface Props {
  report: DailyReport | null;
}

const SystemStatusPanel: React.FC<Props> = ({ report }) => {
  const isWarning = report?.system_status === 'warning';

  return (
    <Card className={styles.statusCard}>
      <div className={styles.statusHeader}>
        <CheckCircleOutlined className={styles.statusIcon} />
        <h3>{report?.system_status_text || '系统运行正常'}</h3>
      </div>
      <p className={styles.statusText}>
        {isWarning ? '存在潜在风险，建议关注相关指标。' : '所有指标运行平稳，无风险提示。'}
      </p>

      <div className={styles.insightBox}>
        <div className={styles.insightHeader}>
          <div className={styles.insightIcon}>
            <BulbOutlined />
          </div>
          <span>智能洞察</span>
        </div>
        <p className={styles.insightText}>
          {report?.system_insight || '系统运行平稳，无异常告警。'}
        </p>
        <Button type="link" className={styles.viewBtn} icon={<EyeOutlined />}>
          查看推理过程
        </Button>
      </div>
    </Card>
  );
};

export default SystemStatusPanel;
