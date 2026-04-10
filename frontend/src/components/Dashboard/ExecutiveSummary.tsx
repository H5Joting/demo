import React from 'react';
import { Card, Button } from 'antd';
import { CheckCircleOutlined, BulbOutlined, EyeOutlined } from '@ant-design/icons';
import { DailyReport, Cluster, LogMetric } from '@/types';
import styles from './ExecutiveSummary.module.scss';

interface Props {
  report: DailyReport | null;
  wxCluster: Cluster | null;
  nfCluster: Cluster | null;
  wxMetrics: LogMetric[];
  nfMetrics: LogMetric[];
  businessSystemId?: string | null;
}

const ExecutiveSummary: React.FC<Props> = ({
  report,
  wxCluster,
  nfCluster,
}) => {
  if (!report) {
    return (
      <section className={styles.section}>
        <div className={styles.header}>
          <h2>一、核心结论与风险</h2>
          <span className={styles.subtitle}>Executive Summary & Risks</span>
        </div>
        <Card className={styles.summaryCard}>
          <p style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
            暂无该日期的报告数据
          </p>
        </Card>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2>一、核心结论与风险</h2>
        <span className={styles.subtitle}>Executive Summary & Risks</span>
      </div>

      <div className={styles.content}>
        <Card className={styles.summaryCard}>
          <div className={styles.cardHeader}>
            <div className={styles.iconWrapper}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 2L2 7L10 12L18 7L10 2Z" stroke="#155dfc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 13L10 18L18 13" stroke="#155dfc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>运行综述</h3>
          </div>

          <div className={styles.clusterInfo}>
            <div className={styles.cluster}>
              <div className={styles.clusterLabel}>
                {wxCluster?.name || '威新集群'} / {wxCluster?.name_en || 'WX CLUSTER'}
              </div>
              <div className={styles.epsValue}>
                <span className={styles.value}>{report.wx_cluster_eps_peak}w</span>
                <span className={styles.rate}>
                  EPS峰值 ({report.wx_cluster_eps_rate}%, {report.wx_cluster_eps_peak_date})
                </span>
              </div>
              <p className={styles.description}>{report.wx_cluster_description || '集群运行正常。'}</p>
            </div>

            <div className={styles.divider} />

            <div className={styles.cluster}>
              <div className={styles.clusterLabel}>
                {nfCluster?.name || '南方集群'} / {nfCluster?.name_en || 'NF CLUSTER'}
              </div>
              <div className={styles.epsValue}>
                <span className={styles.value}>{report.nf_cluster_eps_peak}w</span>
                <span className={styles.rate}>
                  EPS峰值 ({report.nf_cluster_eps_rate}%, {report.nf_cluster_eps_peak_date})
                </span>
              </div>
              <p className={styles.description}>{report.nf_cluster_description || '集群运行正常。'}</p>
            </div>
          </div>

          <div className={styles.insightBox}>
            <div className={styles.insightHeader}>
              <div className={styles.insightIcon}>
                <BulbOutlined />
              </div>
              <span>智能洞察</span>
            </div>
            <p className={styles.insightText}>{report.wx_cluster_insight}</p>
            <Button type="link" className={styles.viewBtn} icon={<EyeOutlined />}>
              查看推理过程
            </Button>
          </div>
        </Card>

        <Card className={styles.statusCard}>
          <div className={styles.statusHeader}>
            <CheckCircleOutlined className={styles.statusIcon} />
            <h3>{report.system_status_text || '系统运行正常'}</h3>
          </div>
          <p className={styles.statusText}>{report.system_status === 'warning' ? '存在潜在风险，建议关注相关指标。' : '所有指标运行平稳，无风险提示。'}</p>

          <div className={styles.insightBox}>
            <div className={styles.insightHeader}>
              <div className={styles.insightIcon}>
                <BulbOutlined />
              </div>
              <span>智能洞察</span>
            </div>
            <p className={styles.insightText}>{report.system_insight || '系统运行平稳，无异常告警。'}</p>
            <Button type="link" className={styles.viewBtn} icon={<EyeOutlined />}>
              查看推理过程
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default ExecutiveSummary;
