import React from 'react';
import { Card, Button, Spin, Empty } from 'antd';
import { BulbOutlined, EyeOutlined, CheckCircleOutlined, ExclamationCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { DailyReport, Cluster, GrafanaPanelDatasource } from '@/types';
import { usePanelData, PANEL_DATASOURCES, PanelDatasource } from '@/hooks/usePanelData';
import styles from './SummaryStatusPanel.module.scss';

interface Props {
  date: string;
  systemId: string;
  datasource?: GrafanaPanelDatasource;
}

interface SummaryData {
  report: DailyReport | null;
  wxCluster: Cluster | null;
  nfCluster: Cluster | null;
}

const SummaryStatusPanel: React.FC<Props> = ({ date, systemId, datasource }) => {
  const effectiveDatasource: PanelDatasource | null = datasource?.endpoint
    ? {
        type: datasource.type || 'api',
        endpoint: datasource.endpoint,
        method: datasource.method || 'GET',
        params: datasource.params,
      }
    : PANEL_DATASOURCES.summary;

  const { data, loading, error } = usePanelData<SummaryData>(
    effectiveDatasource,
    { date, systemId }
  );

  const report = data?.report;
  const wxCluster = data?.wxCluster;
  const nfCluster = data?.nfCluster;
  const systemStatus = report?.system_status || 'normal';

  const getStatusStyles = () => {
    switch (systemStatus) {
      case 'warning':
        return {
          cardClass: `${styles.statusCard} ${styles.statusWarning}`,
          iconClass: `${styles.statusIcon} ${styles.statusIconWarning}`,
          Icon: ExclamationCircleOutlined,
        };
      case 'critical':
        return {
          cardClass: `${styles.statusCard} ${styles.statusCritical}`,
          iconClass: `${styles.statusIcon} ${styles.statusIconCritical}`,
          Icon: CloseCircleOutlined,
        };
      default:
        return {
          cardClass: styles.statusCard,
          iconClass: styles.statusIcon,
          Icon: CheckCircleOutlined,
        };
    }
  };

  const statusStyles = getStatusStyles();
  const StatusIcon = statusStyles.Icon;

  if (loading) {
    return (
      <div className={styles.content}>
        <Card className={styles.summaryCard}>
          <div className={styles.loadingContainer}>
            <Spin />
          </div>
        </Card>
        <Card className={styles.statusCard}>
          <div className={styles.loadingContainer}>
            <Spin />
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.content}>
        <Card className={styles.summaryCard}>
          <Empty description={error} />
        </Card>
      </div>
    );
  }

  return (
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

        {report ? (
          <>
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
          </>
        ) : (
          <p className={styles.noData}>暂无该日期的报告数据</p>
        )}
      </Card>

      <Card className={statusStyles.cardClass}>
        {report ? (
          <>
            <div className={styles.statusHeader}>
              <StatusIcon className={statusStyles.iconClass} />
              <h3>{report.system_status_text || '系统运行正常'}</h3>
            </div>
            <p className={styles.statusText}>
              {systemStatus === 'warning' ? '存在潜在风险，建议关注相关指标。' : systemStatus === 'critical' ? '系统存在严重问题，请立即处理。' : '所有指标运行平稳，无风险提示。'}
            </p>

            <div className={styles.insightBox}>
              <div className={styles.insightHeader}>
                <div className={styles.insightIcon}>
                  <BulbOutlined />
                </div>
                <span>智能洞察</span>
              </div>
              <p className={styles.insightText}>
                {report.system_insight || '系统运行平稳，无异常告警。'}
              </p>
              <Button type="link" className={styles.viewBtn} icon={<EyeOutlined />}>
                查看推理过程
              </Button>
            </div>
          </>
        ) : (
          <p className={styles.noData}>暂无该日期的报告数据</p>
        )}
      </Card>
    </div>
  );
};

export default SummaryStatusPanel;
