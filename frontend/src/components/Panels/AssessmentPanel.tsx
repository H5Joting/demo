import React from 'react';
import { Button } from 'antd';
import { CheckCircleOutlined, BulbOutlined, EyeOutlined } from '@ant-design/icons';
import { Panel } from '@/components/Panel';
import { Assessment } from '@/types';
import styles from './AssessmentPanel.module.scss';

interface Props {
  assessments: Assessment[];
  insight?: string;
}

const AssessmentPanel: React.FC<Props> = ({ assessments = [], insight }) => {
  const getCategoryTitle = (category: string, index: number) => {
    const titles: Record<string, string> = {
      '集群健康': '1. 运行评估:',
      '容量规划': '2. 容量预警:',
      '性能评估': '3. 趋势分析:',
    };
    return titles[category] || `${index + 1}. ${category}:`;
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'warning':
        return styles.statusWarning;
      case 'critical':
        return styles.statusCritical;
      default:
        return styles.statusNormal;
    }
  };

  return (
    <Panel title="核心评估" icon={<CheckCircleOutlined />}>
      <div className={styles.assessmentList}>
        {assessments.map((assessment, index) => (
          <div key={assessment.id} className={styles.assessmentItem}>
            <div className={styles.assessmentTitle}>
              {getCategoryTitle(assessment.category, index)}
            </div>
            <div className={styles.assessmentContent}>
              <span className={styles.bullet}>•</span>
              <p className={getStatusClass(assessment.status)}>
                {assessment.content}
              </p>
            </div>
          </div>
        ))}
        {assessments.length === 0 && (
          <div className={styles.noData}>暂无评估数据</div>
        )}
      </div>

      <div className={styles.insightBox}>
        <div className={styles.insightHeader}>
          <div className={styles.insightIcon}>
            <BulbOutlined />
          </div>
          <span>智能洞察</span>
        </div>
        <p className={styles.insightText}>
          {insight || '各架构层级健康度良好，同比指标多数改善，系统在业务高峰期承载能力稳定。'}
        </p>
        <Button type="link" className={styles.viewBtn} icon={<EyeOutlined />}>
          查看推理过程
        </Button>
      </div>
    </Panel>
  );
};

export default AssessmentPanel;
