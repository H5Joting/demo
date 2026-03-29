import React from 'react';
import { Card, Button } from 'antd';
import { BulbOutlined, EyeOutlined, CheckCircleOutlined, FlagOutlined } from '@ant-design/icons';
import { Assessment, ActionPlan } from '@/types';
import styles from './AssessmentPlanning.module.scss';

interface Props {
  assessments: Assessment[];
  actionPlans: ActionPlan[];
}

const AssessmentPlanning: React.FC<Props> = ({ assessments, actionPlans }) => {
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
    <section className={styles.section}>
      <div className={styles.header}>
        <h2>五、评估与计划</h2>
        <span className={styles.subtitle}>Assessment & Planning</span>
      </div>

      <Card className={styles.contentCard}>
        <div className={styles.leftPanel}>
          <div className={styles.panelHeader}>
            <div className={styles.iconWrapper}>
              <CheckCircleOutlined />
            </div>
            <h3>核心评估</h3>
          </div>

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
              各架构层级健康度良好，同比指标多数改善，系统在业务高峰期承载能力稳定。
            </p>
            <Button type="link" className={styles.viewBtn} icon={<EyeOutlined />}>
              查看推理过程
            </Button>
          </div>
        </div>

        <div className={styles.rightPanel}>
          <div className={styles.panelHeader}>
            <div className={styles.iconWrapper}>
              <FlagOutlined />
            </div>
            <h3>下一步计划</h3>
          </div>

          {actionPlans.map((plan) => (
            <div key={plan.id} className={styles.actionPlan}>
              <div className={styles.priorityBadge}>
                <span>{plan.priority}</span>
              </div>
              <div className={styles.planItems}>
                {plan.items.map((item, index) => (
                  <div key={index} className={styles.planItem}>
                    <span className={styles.bullet}>•</span>
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {actionPlans.length === 0 && (
            <div className={styles.noData}>暂无行动计划</div>
          )}

          <div className={styles.insightBox}>
            <div className={styles.insightHeader}>
              <div className={styles.insightIcon}>
                <BulbOutlined />
              </div>
              <span>智能洞察</span>
            </div>
            <p className={styles.insightText}>
              {actionPlans.length > 0 
                ? actionPlans[0].insight 
                : '建议优先监控磁盘使用率趋势，并优化存储层资源配置，维持预防性运维。'}
            </p>
            <Button type="link" className={styles.viewBtn} icon={<EyeOutlined />}>
              查看推理过程
            </Button>
          </div>
        </div>
      </Card>
    </section>
  );
};

export default AssessmentPlanning;
