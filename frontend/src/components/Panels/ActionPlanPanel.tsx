import React from 'react';
import { Button } from 'antd';
import { FlagOutlined, BulbOutlined, EyeOutlined } from '@ant-design/icons';
import { Panel } from '@/components/Panel';
import { ActionPlan } from '@/types';
import styles from './ActionPlanPanel.module.scss';

interface Props {
  actionPlans: ActionPlan[];
}

const ActionPlanPanel: React.FC<Props> = ({ actionPlans = [] }) => {
  return (
    <Panel title="下一步计划" icon={<FlagOutlined />}>
      {actionPlans.map((plan) => (
        <div key={plan.id} className={styles.actionPlan}>
          <div className={styles.priorityBadge}>
            <span>{plan.priority}</span>
          </div>
          <div className={styles.planItems}>
            {(plan.items || []).map((item, index) => (
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
    </Panel>
  );
};

export default ActionPlanPanel;
