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
  wxMetrics,
  nfMetrics,
  businessSystemId,
}) => {
  const getEpsMetric = (metrics: LogMetric[], systemId: string | null) => {
    if (systemId === 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa') {
      return metrics.find(m => m.metric_name === 'Collector EPS');
    } else if (systemId === 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb') {
      return metrics.find(m => m.metric_name === '交易TPS');
    } else if (systemId === 'cccccccc-cccc-cccc-cccc-cccccccccccc') {
      return metrics.find(m => m.metric_name === '订单TPS');
    }
    return metrics.find(m => m.metric_name === 'Collector EPS');
  };
  const wxEpsMetric = getEpsMetric(wxMetrics, businessSystemId);
  const nfEpsMetric = getEpsMetric(nfMetrics, businessSystemId);

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
                <span className={styles.value}>{wxEpsMetric?.today_max || 0}w</span>
                <span className={styles.rate}>
                  EPS峰值 ({report.wx_cluster_eps_rate}%, {report.wx_cluster_eps_peak_date})
                </span>
              </div>
              <p className={styles.description}>较上一交易日下跌 5.51%，流量有所回落。</p>
            </div>

            <div className={styles.divider} />

            <div className={styles.cluster}>
              <div className={styles.clusterLabel}>
                {nfCluster?.name || '南方集群'} / {nfCluster?.name_en || 'NF CLUSTER'}
              </div>
              <div className={styles.epsValue}>
                <span className={styles.value}>{nfEpsMetric?.today_max || 0}w</span>
                <span className={styles.rate}>
                  EPS峰值 ({report.nf_cluster_eps_rate}%, {report.nf_cluster_eps_peak_date})
                </span>
              </div>
              <p className={styles.description}>集群指标平稳，弹性良好，无明显瓶颈。</p>
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
            <h3>系统运行正常</h3>
          </div>
          <p className={styles.statusText}>所有指标运行平稳，无风险提示。</p>

          <div className={styles.insightBox}>
            <div className={styles.insightHeader}>
              <div className={styles.insightIcon}>
                <BulbOutlined />
              </div>
              <span>智能洞察</span>
            </div>
            <p className={styles.insightText}>
              无高风险告警，所有指标正常，但需关注磁盘使用率趋势以防潜在容量风险。
            </p>
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
