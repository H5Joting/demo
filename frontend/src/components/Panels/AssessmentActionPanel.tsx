import React from 'react';
import { Card, Button, Spin, Empty } from 'antd';
import { BulbOutlined, EyeOutlined, CheckCircleOutlined, FlagOutlined } from '@ant-design/icons';
import { Assessment, ActionPlan, GrafanaPanelDatasource } from '@/types';
import { usePanelData, PANEL_DATASOURCES, PanelDatasource } from '@/hooks/usePanelData';
import styles from './AssessmentActionPanel.module.scss';

interface Props {
  reportId: string;
  datasource?: GrafanaPanelDatasource;
}

const AssessmentActionPanel: React.FC<Props> = ({ reportId, datasource }) => {
  const assessmentDatasource: PanelDatasource | null = datasource?.endpoints?.assessment
    ? {
        type: datasource.endpoints.assessment.type || 'api',
        endpoint: datasource.endpoints.assessment.endpoint || '/api/panel/assessment',
        method: datasource.endpoints.assessment.method || 'GET',
        params: datasource.endpoints.assessment.params,
      }
    : PANEL_DATASOURCES.assessment;

  const actionPlanDatasource: PanelDatasource | null = datasource?.endpoints?.actionPlan
    ? {
        type: datasource.endpoints.actionPlan.type || 'api',
        endpoint: datasource.endpoints.actionPlan.endpoint || '/api/panel/action-plan',
        method: datasource.endpoints.actionPlan.method || 'GET',
        params: datasource.endpoints.actionPlan.params,
      }
    : PANEL_DATASOURCES.actionPlan;

  const { data: assessments, loading: loadingAssessments, error: errorAssessments } = usePanelData<Assessment[]>(
    assessmentDatasource,
    { reportId }
  );

  const { data: actionPlans, loading: loadingActionPlans, error: errorActionPlans } = usePanelData<ActionPlan[]>(
    actionPlanDatasource,
    { reportId }
  );

  const loading = loadingAssessments || loadingActionPlans;
  const error = errorAssessments || errorActionPlans;

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

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'high':
        return styles.priorityHigh;
      case 'medium':
        return styles.priorityMedium;
      default:
        return styles.priorityLow;
    }
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
        <div className={styles.panelHeader}>
          <div className={styles.iconWrapper}>
            <CheckCircleOutlined />
          </div>
          <h3>核心评估</h3>
        </div>

        <div className={styles.assessmentList}>
          {(assessments || []).length > 0 ? (
            (assessments || []).map((assessment, index) => (
              <div key={assessment.id || index} className={styles.assessmentItem}>
                <div className={styles.assessmentTitle}>
                  {index + 1}. {assessment.category}:
                </div>
                <div className={styles.assessmentContent}>
                  <span className={styles.bullet}>•</span>
                  <p className={getStatusClass(assessment.status)}>{assessment.content}</p>
                </div>
              </div>
            ))
          ) : (
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

        <div className={styles.actionPlanList}>
          {(actionPlans || []).length > 0 ? (
            (actionPlans || []).map((plan, index) => (
              <div key={plan.id || index} className={styles.actionPlan}>
                <div className={`${styles.priorityBadge} ${getPriorityClass(plan.priority || 'low')}`}>
                  <span>
                    {plan.priority === 'high' ? '高' : plan.priority === 'medium' ? '中' : '低'}
                  </span>
                </div>
                {plan.items && plan.items.length > 0 && (
                  <div className={styles.planItems}>
                    {plan.items.map((item, itemIndex) => (
                      <div key={itemIndex} className={styles.planItem}>
                        <span className={styles.bullet}>•</span>
                        <p>{item}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className={styles.noData}>暂无行动计划</div>
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
            建议关注南方集群的数据同步效率，当前延迟略高于预期。
          </p>
          <Button type="link" className={styles.viewBtn} icon={<EyeOutlined />}>
            查看推理过程
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default AssessmentActionPanel;
