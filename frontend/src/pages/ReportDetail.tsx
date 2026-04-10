import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { message } from 'antd';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { BusinessSystem, ExportJSON, GrafanaPanel, GrafanaPanelDatasource } from '@/types';
import { fetchBusinessSystem, exportReport } from '@/api';
import { useDate } from '@/context/DateContext';
import ErrorState from '@/components/ErrorState';
import PageHeader from '@/components/PageHeader';
import ExportModal from '@/components/ExportModal';
import { DraggableSection } from '@/components/Panel';
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
 * 根据实际顺序动态生成序号
 */
const getPanelTitles = (panel: GrafanaPanel, index: number): { title: string; subtitle: string } => {
  const chineseNumerals = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
  const numeral = chineseNumerals[index] || String(index + 1);
  
  if (panel.title) {
    return {
      title: `${numeral}、${panel.title}`,
      subtitle: panel.description || '',
    };
  }
  
  const defaultSubtitles = [
    'Executive Summary & Risks',
    'SLA Core Metrics',
    'Cluster Core Metrics Detail',
    'Cloud Region Traffic Situational Awareness',
    'Assessment & Planning',
  ];
  
  const defaultTitleNames = [
    '核心结论与风险',
    'SLA 核心指标',
    '集群核心指标明细',
    '云区域流量态势',
    '评估与计划',
  ];
  
  const titleName = panel.type && defaultTitleNames[index] 
    ? defaultTitleNames[index] 
    : `Panel ${index + 1}`;
  
  return {
    title: `${numeral}、${titleName}`,
    subtitle: defaultSubtitles[index] || '',
  };
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
  const [isConfigMode, setIsConfigMode] = useState(false);
  const [panelOrder, setPanelOrder] = useState<string[]>([]);
  const [deletedPanels, setDeletedPanels] = useState<Set<string>>(new Set());
  const [operationHistory, setOperationHistory] = useState<Array<{ panelOrder: string[]; deletedPanels: string[] }>>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const isLoadingRef = React.useRef(false);

  const effectiveSystemId = system?.datasource_reference?.original_uid || systemId || '';

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const DEFAULT_PANEL_IDS = ['summary', 'sla', 'cluster', 'traffic', 'assessment'];

  const panels = useMemo(() => {
    const originalPanels = system?.datasource_reference?.panels || null;
    
    if (!originalPanels || originalPanels.length === 0) {
      return null;
    }

    if (panelOrder.length === 0) {
      return originalPanels;
    }

    return panelOrder.map(id => originalPanels.find(p => p.id === id)).filter(Boolean) as GrafanaPanel[];
  }, [system, panelOrder]);

  React.useEffect(() => {
    const savedTemplate = localStorage.getItem(`report-template-${systemId}`);
    
    if (savedTemplate) {
      try {
        const template = JSON.parse(savedTemplate);
        if (template.panelOrder) {
          setPanelOrder(template.panelOrder);
        }
        if (template.deletedPanels) {
          setDeletedPanels(new Set(template.deletedPanels));
        }
        return;
      } catch (e) {
        console.error('Failed to load saved template:', e);
      }
    }
    
    if (system?.datasource_reference?.panels && panelOrder.length === 0) {
      setPanelOrder(system.datasource_reference.panels.map(p => p.id));
    } else if (!system?.datasource_reference?.panels && panelOrder.length === 0) {
      setPanelOrder(DEFAULT_PANEL_IDS);
    }
  }, [system, systemId, panelOrder.length]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = panelOrder.indexOf(active.id as string);
      const newIndex = panelOrder.indexOf(over.id as string);
      
      if (oldIndex === -1 || newIndex === -1) {
        return;
      }
      
      if (oldIndex === 0 || oldIndex === panelOrder.length - 1) {
        return;
      }
      
      let newOrder: string[];
      
      if (newIndex === 0) {
        newOrder = [...panelOrder];
        newOrder.splice(oldIndex, 1);
        newOrder.splice(1, 0, active.id as string);
      } else if (newIndex === panelOrder.length - 1) {
        newOrder = [...panelOrder];
        newOrder.splice(oldIndex, 1);
        newOrder.splice(panelOrder.length - 2, 0, active.id as string);
      } else {
        newOrder = arrayMove(panelOrder, oldIndex, newIndex);
      }
      
      if (JSON.stringify(newOrder) !== JSON.stringify(panelOrder)) {
        setOperationHistory(prev => [...prev, { 
          panelOrder: panelOrder, 
          deletedPanels: Array.from(deletedPanels) 
        }]);
        setPanelOrder(newOrder);
      }
    }
  };

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
      
      const template = {
        panelOrder,
        deletedPanels: Array.from(deletedPanels),
        savedAt: new Date().toISOString(),
      };
      
      const exportDataWithTemplate = {
        ...data,
        panelTemplate: template,
      };
      
      setExportData(exportDataWithTemplate);
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
    setIsConfigMode(!isConfigMode);
    if (!isConfigMode) {
      message.info('已进入配置模式，可拖拽调整面板顺序或删除面板');
    } else {
      message.success('配置模式已关闭');
    }
  };

  const handleDeletePanel = (panelId: string) => {
    setOperationHistory(prev => [...prev, { 
      panelOrder: panelOrder, 
      deletedPanels: Array.from(deletedPanels) 
    }]);
    
    setDeletedPanels(prev => {
      const newSet = new Set(prev);
      newSet.add(panelId);
      return newSet;
    });
    setPanelOrder(prev => prev.filter(id => id !== panelId));
    message.success('面板已删除');
  };

  const handleSave = () => {
    const template = {
      panelOrder,
      deletedPanels: Array.from(deletedPanels),
      savedAt: new Date().toISOString(),
    };
    
    localStorage.setItem(`report-template-${systemId}`, JSON.stringify(template));
    message.success('模板保存成功');
    setIsConfigMode(false);
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleUndo = () => {
    if (operationHistory.length === 0) {
      message.info('没有可撤销的操作');
      return;
    }
    
    const lastOperation = operationHistory[operationHistory.length - 1];
    setPanelOrder(lastOperation.panelOrder);
    setDeletedPanels(new Set(lastOperation.deletedPanels));
    setOperationHistory(prev => prev.slice(0, -1));
    message.success('已撤销上一步操作');
  };

  const handleExportClose = () => {
    setExportVisible(false);
  };

  const renderDynamicPanels = () => {
    if (!panels || panels.length === 0) {
      const defaultPanelsMap = {
        'summary': { title: '核心结论与风险', subtitle: 'Executive Summary & Risks', component: <SummaryStatusPanel date={selectedDate} systemId={effectiveSystemId} /> },
        'sla': { title: 'SLA 核心指标', subtitle: 'SLA Core Metrics', component: <SlaMetricsPanel date={selectedDate} systemId={effectiveSystemId} /> },
        'cluster': { title: '集群核心指标明细', subtitle: 'Cluster Core Metrics Detail', component: <ClusterMetricsPanel date={selectedDate} systemId={effectiveSystemId} /> },
        'traffic': { title: '云区域流量态势', subtitle: 'Cloud Region Traffic Situational Awareness', component: <TrafficRegionPanel date={selectedDate} systemId={effectiveSystemId} /> },
        'assessment': { title: '评估与计划', subtitle: 'Assessment & Planning', component: <AssessmentActionPanel reportId={`${effectiveSystemId}-${selectedDate}`} /> },
      };

      const orderedPanels = panelOrder.length > 0 
        ? panelOrder.map(id => ({ id, ...defaultPanelsMap[id as keyof typeof defaultPanelsMap] })).filter(p => p.title && !deletedPanels.has(p.id))
        : DEFAULT_PANEL_IDS.map(id => ({ id, ...defaultPanelsMap[id as keyof typeof defaultPanelsMap] })).filter(p => !deletedPanels.has(p.id));

      const chineseNumerals = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];

      if (isConfigMode) {
        return (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={orderedPanels.map(p => p.id)}
              strategy={verticalListSortingStrategy}
            >
              {orderedPanels.map((panel, index) => {
                const isFixed = index === 0 || index === orderedPanels.length - 1;
                const numeral = chineseNumerals[index] || String(index + 1);
                const title = `${numeral}、${panel.title}`;
                return (
                  <DraggableSection
                    key={panel.id}
                    id={panel.id}
                    title={title}
                    subtitle={panel.subtitle}
                    isConfigMode={isConfigMode}
                    isFixed={isFixed}
                    onDelete={handleDeletePanel}
                  >
                    {panel.component}
                  </DraggableSection>
                );
              })}
            </SortableContext>
          </DndContext>
        );
      }

      return (
        <>
          {orderedPanels.map((panel, index) => {
            const isFixed = index === 0 || index === orderedPanels.length - 1;
            const numeral = chineseNumerals[index] || String(index + 1);
            const title = `${numeral}、${panel.title}`;
            return (
              <DraggableSection
                key={panel.id}
                id={panel.id}
                title={title}
                subtitle={panel.subtitle}
                isConfigMode={isConfigMode}
                isFixed={isFixed}
                onDelete={handleDeletePanel}
              >
                {panel.component}
              </DraggableSection>
            );
          })}
        </>
      );
    }

    const filteredPanels = panels.filter(panel => !deletedPanels.has(panel.id));

    if (isConfigMode) {
      return (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={filteredPanels.map(p => p.id)}
            strategy={verticalListSortingStrategy}
          >
            {filteredPanels.map((panel, index) => {
              const { title, subtitle } = getPanelTitles(panel, index);
              const panelContent = renderPanel(panel, selectedDate, effectiveSystemId);
              const isFixed = index === 0 || index === filteredPanels.length - 1;
              
              if (!panelContent) return null;
              
              return (
                <DraggableSection
                  key={panel.id || index}
                  id={panel.id || `panel-${index}`}
                  title={title}
                  subtitle={subtitle}
                  isConfigMode={isConfigMode}
                  isFixed={isFixed}
                  onDelete={handleDeletePanel}
                >
                  {panelContent}
                </DraggableSection>
              );
            })}
          </SortableContext>
        </DndContext>
      );
    }

    return filteredPanels.map((panel, index) => {
      const { title, subtitle } = getPanelTitles(panel, index);
      const panelContent = renderPanel(panel, selectedDate, effectiveSystemId);
      const isFixed = index === 0 || index === filteredPanels.length - 1;
      
      if (!panelContent) return null;
      
      return (
        <DraggableSection
          key={panel.id || index}
          id={panel.id || `panel-${index}`}
          title={title}
          subtitle={subtitle}
          isConfigMode={isConfigMode}
          isFixed={isFixed}
          onDelete={handleDeletePanel}
        >
          {panelContent}
        </DraggableSection>
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
        onSave={handleSave}
        onFullscreen={handleFullscreen}
        onUndo={handleUndo}
        onBack={() => navigate('/overview')}
        isConfigMode={isConfigMode}
        operationCount={operationHistory.length}
        isFullscreen={isFullscreen}
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
