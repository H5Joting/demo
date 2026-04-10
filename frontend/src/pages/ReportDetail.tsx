import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { BusinessSystem, ExportJSON, GrafanaPanel, GrafanaPanelDatasource } from '@/types';
import { fetchBusinessSystem, exportReport } from '@/api';
import { useDate } from '@/context/DateContext';
import ErrorState from '@/components/ErrorState';
import PageHeader from '@/components/PageHeader';
import ExportModal from '@/components/ExportModal';
import { Section } from '@/components/Panel';
import {
  SummaryStatusPanel,
  SlaMetricsPanel,
  ClusterMetricsPanel,
  TrafficRegionPanel,
  AssessmentActionPanel,
} from '@/components/Panels';
import styles from './ReportDetail.module.scss';

/**
 * 替换参数中的模板变量
 * 
 * 支持的模板变量：
 * - ${date} - 当前选择的日期
 * - ${systemId} - 当前系统ID
 * - ${reportId} - 报表ID（格式：${systemId}-${date}）
 */
const resolveParams = (
  params: Record<string, any> | undefined,
  date: string,
  systemId: string
): Record<string, any> => {
  if (!params) return {};
  
  const resolved: Record<string, any> = {};
  const reportId = `${systemId}-${date}`;
  
  for (const [key, value] of Object.entries(params)) {
    if (typeof value === 'string') {
      resolved[key] = value
        .replace(/\$\{date\}/g, date)
        .replace(/\$\{systemId\}/g, systemId)
        .replace(/\$\{reportId\}/g, reportId);
    } else {
      resolved[key] = value;
    }
  }
  
  return resolved;
};

/**
 * 解析数据源配置
 * 
 * 将 Grafana 格式的数据源配置转换为 Panel 组件可用的格式
 */
const resolveDatasource = (
  datasource: GrafanaPanelDatasource | undefined,
  date: string,
  systemId: string
): GrafanaPanelDatasource | undefined => {
  if (!datasource) return undefined;
  
  const resolvedParams = resolveParams(datasource.params, date, systemId);
  
  if (datasource.endpoints) {
    return {
      ...datasource,
      endpoints: {
        assessment: datasource.endpoints.assessment ? {
          ...datasource.endpoints.assessment,
          params: resolveParams(datasource.endpoints.assessment.params, date, systemId),
        } : undefined,
        actionPlan: datasource.endpoints.actionPlan ? {
          ...datasource.endpoints.actionPlan,
          params: resolveParams(datasource.endpoints.actionPlan.params, date, systemId),
        } : undefined,
      },
    };
  }
  
  return {
    ...datasource,
    params: resolvedParams,
  };
};

/**
 * 根据 Panel 配置渲染对应的 Panel 组件
 */
const renderPanel = (
  panel: GrafanaPanel,
  date: string,
  systemId: string
): React.ReactNode => {
  const datasource = resolveDatasource(panel.datasource, date, systemId);
  const reportId = `${systemId}-${date}`;
  
  switch (panel.type) {
    case 'summary_status':
      return (
        <SummaryStatusPanel
          date={date}
          systemId={systemId}
          datasource={datasource}
        />
      );
    
    case 'sla_metrics':
      return (
        <SlaMetricsPanel
          date={date}
          systemId={systemId}
          datasource={datasource}
        />
      );
    
    case 'cluster_metrics':
      return (
        <ClusterMetricsPanel
          date={date}
          systemId={systemId}
          datasource={datasource}
        />
      );
    
    case 'region_traffic':
      return (
        <TrafficRegionPanel
          date={date}
          systemId={systemId}
          datasource={datasource}
        />
      );
    
    case 'assessment_action':
      return (
        <AssessmentActionPanel
          reportId={reportId}
          datasource={datasource}
        />
      );
    
    default:
      return null;
  }
};

/**
 * 获取 Panel 的标题和副标题
 */
const getPanelTitles = (panel: GrafanaPanel, index: number): { title: string; subtitle: string } => {
  const defaultTitles = [
    { title: '一、核心结论与风险', subtitle: 'Executive Summary & Risks' },
    { title: '二、SLA 核心指标', subtitle: 'SLA Core Metrics' },
    { title: '三、集群核心指标明细', subtitle: 'Cluster Core Metrics Detail' },
    { title: '四、云区域流量态势', subtitle: 'Cloud Region Traffic Situational Awareness' },
    { title: '五、评估与计划', subtitle: 'Assessment & Planning' },
  ];
  
  if (panel.title) {
    const chineseNumerals = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
    const numeral = chineseNumerals[index] || String(index + 1);
    return {
      title: `${numeral}、${panel.title}`,
      subtitle: panel.description || '',
    };
  }
  
  return defaultTitles[index] || { title: `Panel ${index + 1}`, subtitle: '' };
};

const ReportDetail: React.FC = () => {
  const { systemId } = useParams<{ systemId: string }>();
  const navigate = useNavigate();
  const { selectedDate } = useDate();
  const [system, setSystem] = useState<BusinessSystem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDbError, setIsDbError] = useState(false);
  const [exportVisible, setExportVisible] = useState(false);
  const [exportData, setExportData] = useState<ExportJSON | null>(null);
  const [reportStatus, setReportStatus] = useState<'normal' | 'warning' | 'critical' | null>(null);
  const isLoadingRef = React.useRef(false);

  const effectiveSystemId = system?.datasource_reference?.original_uid || systemId || '';

  const loadSystem = React.useCallback(async () => {
    if (!systemId || isLoadingRef.current) {
      return;
    }

    isLoadingRef.current = true;
    setError(null);
    setIsDbError(false);
    
    try {
      const systemInfo = await fetchBusinessSystem(systemId);
      setSystem(systemInfo);
    } catch (err: any) {
      console.error('Failed to load system:', err);
      if (err?.response?.data?.code === 'DATABASE_ERROR') {
        setIsDbError(true);
        setError(err.response.data.error || '数据库连接失败');
      } else {
        setError(err instanceof Error ? err.message : '加载系统信息失败');
      }
    } finally {
      isLoadingRef.current = false;
    }
  }, [systemId]);

  const loadReportStatus = React.useCallback(async () => {
    const currentSystemId = system?.datasource_reference?.original_uid || systemId;
    if (!currentSystemId || !selectedDate) {
      return;
    }

    try {
      const response = await fetch(`/api/panel/summary?date=${selectedDate}&systemId=${currentSystemId}`);
      const result = await response.json();
      
      if (result.success && result.data?.report) {
        setReportStatus(result.data.report.system_status);
      } else {
        setReportStatus(null);
      }
    } catch (err) {
      console.error('Failed to load report status:', err);
      setReportStatus(null);
    }
  }, [systemId, selectedDate, system]);

  React.useEffect(() => {
    loadSystem();
  }, [loadSystem]);

  React.useEffect(() => {
    loadReportStatus();
  }, [loadReportStatus]);

  const panels = useMemo(() => {
    return system?.datasource_reference?.panels || null;
  }, [system]);

  if (error && !system) {
    return (
      <div className={styles.errorWrapper}>
        <ErrorState
          title={isDbError ? '数据库连接失败' : '数据加载失败'}
          message={isDbError ? '请检查数据库配置或联系管理员' : error || '加载数据失败'}
          onRetry={loadSystem}
        />
      </div>
    );
  }

  if (!system) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.loadingContent}>
          <div className={styles.loadingSpinner}></div>
          <p>加载中...</p>
        </div>
      </div>
    );
  }

  const systemName = system?.name || '未知系统';
  const systemDesc = system?.description || '';

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleExport = async () => {
    if (!systemId) {
      message.error('系统ID不存在');
      return;
    }

    try {
      const data = await exportReport(systemId);
      setExportData(data);
      setExportVisible(true);
    } catch (err: any) {
      console.error('Failed to export report:', err);
      message.error(err instanceof Error ? err.message : '导出失败');
    }
  };

  const handleShare = () => {
    console.log('Share clicked');
  };

  const handleConfig = () => {
    console.log('Config clicked');
  };

  const handleExportClose = () => {
    setExportVisible(false);
  };

  const renderDynamicPanels = () => {
    if (!panels || panels.length === 0) {
      return (
        <>
          <Section title="一、核心结论与风险" subtitle="Executive Summary & Risks">
            <SummaryStatusPanel
              date={selectedDate}
              systemId={effectiveSystemId}
            />
          </Section>

          <Section title="二、SLA 核心指标" subtitle="SLA Core Metrics">
            <SlaMetricsPanel
              date={selectedDate}
              systemId={effectiveSystemId}
            />
          </Section>

          <Section title="三、集群核心指标明细" subtitle="Cluster Core Metrics Detail">
            <ClusterMetricsPanel
              date={selectedDate}
              systemId={effectiveSystemId}
            />
          </Section>

          <Section title="四、云区域流量态势" subtitle="Cloud Region Traffic Situational Awareness">
            <TrafficRegionPanel
              date={selectedDate}
              systemId={effectiveSystemId}
            />
          </Section>

          <Section title="五、评估与计划" subtitle="Assessment & Planning">
            <AssessmentActionPanel
              reportId={`${effectiveSystemId}-${selectedDate}`}
            />
          </Section>
        </>
      );
    }

    return panels.map((panel, index) => {
      const { title, subtitle } = getPanelTitles(panel, index);
      const panelContent = renderPanel(panel, selectedDate, effectiveSystemId);
      
      if (!panelContent) return null;
      
      return (
        <Section key={panel.id || index} title={title} subtitle={subtitle}>
          {panelContent}
        </Section>
      );
    });
  };

  return (
    <>
      <PageHeader
        breadcrumb={[
          { label: '报表总览', href: '/overview' },
          { label: systemName },
        ]}
        title={systemName}
        subtitle={systemDesc}
        typeBadge="报表详情"
        statusBadge={reportStatus === 'critical' ? 'error' : reportStatus || (system?.status === 'active' ? 'normal' : 'error')}
        tags={['用户', '行为', '分析']}
        meta={{
          reportDate: selectedDate,
          lastUpdate: new Date().toISOString().replace('T', ' ').slice(0, 19),
          owner: '王工 · 数据分析团队',
          updateFrequency: '每日',
        }}
        onRefresh={handleRefresh}
        onExport={handleExport}
        onShare={handleShare}
        onConfig={handleConfig}
        onBack={() => navigate('/overview')}
      />

      <div className={styles.content}>
        {renderDynamicPanels()}
      </div>

      <ExportModal
        visible={exportVisible}
        data={exportData}
        onClose={handleExportClose}
      />
    </>
  );
}

export default ReportDetail;
