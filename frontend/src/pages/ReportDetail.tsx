import React, { useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { AimOutlined } from '@ant-design/icons';
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
import AIChatPanel, { ChatMessage } from '@/components/AIChatPanel';
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
  systemId: string,
  onStatusChange?: (status: 'normal' | 'warning' | 'critical' | null) => void
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
          onStatusChange={onStatusChange}
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
    'Overview',
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
  const [exportData, setExportData] = useState<(ExportJSON & { panelTemplate?: any }) | null>(null);
  const [reportStatus, setReportStatus] = useState<'normal' | 'warning' | 'critical' | null>(null);
  const [isConfigMode, setIsConfigMode] = useState(false);
  const [panelOrder, setPanelOrder] = useState<string[]>([]);
  const [deletedPanels, setDeletedPanels] = useState<Set<string>>(new Set());
  const [panelModifications, setPanelModifications] = useState<Record<string, Record<string, any>>>({});
  const [pendingModifications, setPendingModifications] = useState<Record<string, Record<string, any>>>({});
  const [operationHistory, setOperationHistory] = useState<Array<{ panelOrder: string[]; deletedPanels: string[] }>>([]);
  const [modificationHistory, setModificationHistory] = useState<Array<{ pendingModifications: Record<string, Record<string, any>> }>>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const isLoadingRef = React.useRef(false);
  const [selectedPanelId, setSelectedPanelId] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `您好！我是 GLM-5 报表助手。

您可以在左侧预览中 **点击选中** 任意可编辑面板，然后告诉我您想要的修改，预览会**实时更新**。

支持的操作：
• 修改面板标题
• 调整面板顺序
• 删除不需要的面板

⚠️「核心结论与风险」和「评估与计划」为固定模块，不可修改。`,
      timestamp: new Date(),
    },
  ]);
  const [isAiTyping, setIsAiTyping] = useState(false);

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

  React.useEffect(() => {
    loadSystem();
  }, [loadSystem]);

  const handleStatusChange = useCallback((status: 'normal' | 'warning' | 'critical' | null) => {
    setReportStatus(status);
  }, []);

  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const DEFAULT_PANEL_IDS = [
    'panel-summary-status',
    'panel-sla-metrics',
    'panel-cluster-metrics',
    'panel-region-traffic',
    'panel-assessment-action'
  ];

  const panels = useMemo(() => {
    const originalPanels = system?.datasource_reference?.panels || null;
    
    if (!originalPanels || originalPanels.length === 0) {
      return null;
    }

    let orderedPanels: GrafanaPanel[];
    if (panelOrder.length === 0) {
      orderedPanels = originalPanels;
    } else {
      orderedPanels = panelOrder.map(id => originalPanels.find(p => p.id === id)).filter(Boolean) as GrafanaPanel[];
    }

    const modifiedPanels = orderedPanels.map(panel => {
      const savedMods = panelModifications[panel.id];
      const pendingMods = pendingModifications[panel.id];
      
      const mergedMods = {
        title: pendingMods?.title ?? savedMods?.title,
        description: pendingMods?.description ?? savedMods?.description,
        endpoint: pendingMods?.endpoint ?? savedMods?.endpoint,
      };
      
      if (mergedMods.title || mergedMods.description || mergedMods.endpoint) {
        return {
          ...panel,
          title: mergedMods.title ?? panel.title,
          description: mergedMods.description ?? panel.description,
          datasource: mergedMods.endpoint 
            ? { ...panel.datasource, endpoint: mergedMods.endpoint }
            : panel.datasource,
        };
      }
      return panel;
    });

    return modifiedPanels;
  }, [system, panelOrder, panelModifications, pendingModifications]);

  const getPanelTitle = useCallback((panelId: string): string => {
    if (!panels) {
      const defaultTitles: Record<string, string> = {
        'panel-summary-status': '核心结论与风险',
        'panel-sla-metrics': 'SLA 核心指标',
        'panel-cluster-metrics': '集群核心指标明细',
        'panel-region-traffic': '云区域流量态势',
        'panel-assessment-action': '评估与计划',
      };
      return defaultTitles[panelId] || panelId;
    }
    const panel = panels.find(p => p.id === panelId);
    return panel?.title || panelId;
  }, [panels]);

  const getPanelType = useCallback((panelId: string): string => {
    if (!panels) return 'default';
    const panel = panels.find(p => p.id === panelId);
    return panel?.type || 'default';
  }, [panels]);

  const handleDeletePanel = useCallback((panelId: string) => {
    console.log('[handleDeletePanel] 删除面板:', panelId);
    console.log('[handleDeletePanel] 当前 panelOrder:', panelOrder);
    console.log('[handleDeletePanel] 当前 deletedPanels:', Array.from(deletedPanels));
    
    setOperationHistory(prev => [...prev, { 
      panelOrder: panelOrder, 
      deletedPanels: Array.from(deletedPanels) 
    }]);
    
    const newDeletedPanels = new Set(deletedPanels);
    newDeletedPanels.add(panelId);
    const newPanelOrder = panelOrder.filter(id => id !== panelId);
    
    setDeletedPanels(newDeletedPanels);
    setPanelOrder(newPanelOrder);
    
    const template = {
      panelOrder: newPanelOrder,
      deletedPanels: Array.from(newDeletedPanels),
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(`report-template-${systemId}`, JSON.stringify(template));
    
    message.success('面板已删除');
  }, [panelOrder, deletedPanels, systemId]);

  const handleUpdatePanelTitle = useCallback((panelId: string, newTitle: string) => {
    console.log('[handleUpdatePanelTitle] 修改面板标题:', panelId, '->', newTitle);
    
    setModificationHistory(prev => [...prev, { 
      pendingModifications: { ...pendingModifications } 
    }]);
    
    setPendingModifications(prev => ({
      ...prev,
      [panelId]: {
        ...prev[panelId],
        title: newTitle,
      },
    }));
    
    message.success(`标题已修改为「${newTitle}」(临时预览，需保存生效)`);
  }, [pendingModifications]);

  const handleUpdatePanelDescription = useCallback((panelId: string, newDescription: string) => {
    console.log('[handleUpdatePanelDescription] 修改面板描述:', panelId, '->', newDescription);
    
    setModificationHistory(prev => [...prev, { 
      pendingModifications: { ...pendingModifications } 
    }]);
    
    setPendingModifications(prev => ({
      ...prev,
      [panelId]: {
        ...prev[panelId],
        description: newDescription,
      },
    }));
    
    message.success(`描述已修改 (临时预览，需保存生效)`);
  }, [pendingModifications]);

  const handleUpdatePanelEndpoint = useCallback((panelId: string, newEndpoint: string) => {
    console.log('[handleUpdatePanelEndpoint] 修改面板数据源:', panelId, '->', newEndpoint);
    
    setModificationHistory(prev => [...prev, { 
      pendingModifications: { ...pendingModifications } 
    }]);
    
    setPendingModifications(prev => ({
      ...prev,
      [panelId]: {
        ...prev[panelId],
        endpoint: newEndpoint,
      },
    }));
    
    message.success(`数据源已修改为「${newEndpoint}」(临时预览，需保存生效)`);
  }, [pendingModifications]);

  const handleSendMessage = useCallback(async (content: string) => {
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content,
      selectedElement: selectedPanelId ? {
        id: selectedPanelId,
        title: getPanelTitle(selectedPanelId),
      } : undefined,
      timestamp: new Date(),
    };

    setChatMessages(prev => [...prev, userMessage]);
    setIsAiTyping(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          selectedPanel: selectedPanelId ? {
            id: selectedPanelId,
            title: getPanelTitle(selectedPanelId),
            type: getPanelType(selectedPanelId),
          } : undefined,
          conversationHistory: chatMessages
            .filter(m => m.id !== 'welcome')
            .map(m => ({
              role: m.role,
              content: m.content,
            })),
        }),
      });

      const result = await response.json();

      if (result.success) {
        const aiMessage: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          role: 'assistant',
          content: result.data.message,
          timestamp: new Date(),
          changes: result.data.modifications?.map((m: any) => ({
            field: m.field,
            description: m.description,
          })),
        };

        setChatMessages(prev => [...prev, aiMessage]);

        if (result.data.modifications) {
          result.data.modifications.forEach((mod: any) => {
            console.log('[AI Modification]', mod);
            
            if (mod.field === 'remove') {
              handleDeletePanel(mod.panelId);
              setSelectedPanelId(null);
            } else if (mod.field === 'add') {
              message.success(`已添加新面板：${mod.newValue.type}`);
            } else if (mod.field === 'title') {
              handleUpdatePanelTitle(mod.panelId, mod.newValue);
            } else if (mod.field === 'description') {
              handleUpdatePanelDescription(mod.panelId, mod.newValue);
            } else if (mod.field === 'endpoint') {
              handleUpdatePanelEndpoint(mod.panelId, mod.newValue);
            }
          });
        }
      } else {
        const errorMessage: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          role: 'assistant',
          content: result.error || '抱歉，处理您的请求时出现错误，请稍后重试。',
          timestamp: new Date(),
        };
        setChatMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('AI chat error:', error);
      const errorMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: '抱歉，AI 服务暂时不可用，请稍后重试。',
        timestamp: new Date(),
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsAiTyping(false);
    }
  }, [selectedPanelId, chatMessages, getPanelTitle, getPanelType, handleDeletePanel, handleUpdatePanelTitle, handleUpdatePanelDescription, handleUpdatePanelEndpoint]);

  const handlePanelSelect = useCallback((panelId: string, isFixed: boolean) => {
    if (isFixed) {
      message.info('固定模块不可选择修改');
      return;
    }
    setSelectedPanelId(panelId === selectedPanelId ? null : panelId);
  }, [selectedPanelId]);

  React.useEffect(() => {
    const oldToNewIdMap: Record<string, string> = {
      'summary': 'panel-summary-status',
      'sla': 'panel-sla-metrics',
      'cluster': 'panel-cluster-metrics',
      'traffic': 'panel-region-traffic',
      'assessment': 'panel-assessment-action',
    };
    
    const savedTemplate = localStorage.getItem(`report-template-${systemId}`);
    
    if (savedTemplate) {
      try {
        const template = JSON.parse(savedTemplate);
        if (template.panelOrder) {
          const convertedPanelOrder = template.panelOrder.map((id: string) => oldToNewIdMap[id] || id);
          console.log('[loadTemplate] Converted panelOrder:', template.panelOrder, '->', convertedPanelOrder);
          setPanelOrder(convertedPanelOrder);
        }
        if (template.deletedPanels) {
          const convertedDeletedPanels = template.deletedPanels.map((id: string) => oldToNewIdMap[id] || id);
          console.log('[loadTemplate] Converted deletedPanels:', template.deletedPanels, '->', convertedDeletedPanels);
          setDeletedPanels(new Set(convertedDeletedPanels));
        }
        if (template.panelModifications) {
          console.log('[loadTemplate] Loaded panelModifications:', template.panelModifications);
          setPanelModifications(template.panelModifications);
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
        
        const template = {
          panelOrder: newOrder,
          deletedPanels: Array.from(deletedPanels),
          savedAt: new Date().toISOString(),
        };
        localStorage.setItem(`report-template-${systemId}`, JSON.stringify(template));
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
      const dashboardData = await exportReport(systemId);
      
      console.log('=== 导出调试信息 ===');
      console.log('当前 panelOrder 状态:', panelOrder);
      console.log('当前 deletedPanels 状态:', Array.from(deletedPanels));
      console.log('API 返回的 panels:', dashboardData.panels?.map((p: any) => ({ id: p.id, title: p.title })));
      
      let reorderedPanels = dashboardData.panels || [];
      
      if (panelOrder.length > 0 && dashboardData.panels) {
        const panelMap = new Map(dashboardData.panels.map((p: any) => [p.id, p]));
        
        console.log('panelMap keys:', Array.from(panelMap.keys()));
        
        reorderedPanels = panelOrder
          .filter(id => {
            const isDeleted = deletedPanels.has(id);
            console.log(`过滤 panel ${id}: isDeleted=${isDeleted}`);
            return !isDeleted;
          })
          .map(id => {
            const panel = panelMap.get(id);
            console.log(`映射 panel ${id}: found=${!!panel}`);
            return panel;
          })
          .filter(Boolean);
          
        console.log('最终 reorderedPanels:', reorderedPanels.map((p: any) => ({ id: p.id, title: p.title })));
      } else if (deletedPanels.size > 0 && dashboardData.panels) {
        reorderedPanels = dashboardData.panels.filter((p: any) => !deletedPanels.has(p.id));
        console.log('使用 deletedPanels 过滤后:', reorderedPanels.map((p: any) => ({ id: p.id, title: p.title })));
      } else {
        console.log('使用 API 返回的原始 panels');
      }
      
      const template = {
        panelOrder,
        deletedPanels: Array.from(deletedPanels),
        savedAt: new Date().toISOString(),
        systemId,
      };
      
      const exportDataWithTemplate = {
        __meta: {
          exported_at: new Date().toISOString(),
          exporter_version: '1.0.0',
          schema_version: 1,
          type: 'dashboard' as const,
        },
        dashboard: {
          ...dashboardData,
          panels: reorderedPanels,
        },
        panelTemplate: template
      };
      
      console.log('Final export data panels:', exportDataWithTemplate.dashboard.panels);
      
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

  const handleSave = () => {
    const mergedModifications = { ...panelModifications };
    
    for (const [panelId, mods] of Object.entries(pendingModifications)) {
      mergedModifications[panelId] = {
        ...mergedModifications[panelId],
        ...mods,
      };
    }
    
    setPanelModifications(mergedModifications);
    setPendingModifications({});
    setModificationHistory([]);
    
    const template = {
      panelOrder,
      deletedPanels: Array.from(deletedPanels),
      panelModifications: mergedModifications,
      savedAt: new Date().toISOString(),
    };
    
    localStorage.setItem(`report-template-${systemId}`, JSON.stringify(template));
    message.success('模板保存成功，所有修改已生效');
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
    if (modificationHistory.length > 0) {
      const lastModification = modificationHistory[modificationHistory.length - 1];
      setPendingModifications(lastModification.pendingModifications);
      setModificationHistory(prev => prev.slice(0, -1));
      message.success('已撤销对话修改');
      return;
    }
    
    if (operationHistory.length === 0) {
      message.info('没有可撤销的操作');
      return;
    }
    
    const lastOperation = operationHistory[operationHistory.length - 1];
    setPanelOrder(lastOperation.panelOrder);
    setDeletedPanels(new Set(lastOperation.deletedPanels));
    setOperationHistory(prev => prev.slice(0, -1));
    
    const template = {
      panelOrder: lastOperation.panelOrder,
      deletedPanels: lastOperation.deletedPanels,
      panelModifications,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(`report-template-${systemId}`, JSON.stringify(template));
    
    message.success('已撤销上一步操作');
  };

  const handleExportClose = () => {
    setExportVisible(false);
  };

  const renderDynamicPanels = () => {
    console.log('[renderDynamicPanels] panels:', panels);
    console.log('[renderDynamicPanels] panelOrder:', panelOrder);
    console.log('[renderDynamicPanels] deletedPanels:', Array.from(deletedPanels));
    
    if (!panels || panels.length === 0) {
      const defaultPanelsMap = {
        'panel-summary-status': { title: '核心结论与风险', subtitle: 'Overview', component: <SummaryStatusPanel date={selectedDate} systemId={effectiveSystemId} onStatusChange={handleStatusChange} /> },
        'panel-sla-metrics': { title: 'SLA 核心指标', subtitle: 'SLA Core Metrics', component: <SlaMetricsPanel date={selectedDate} systemId={effectiveSystemId} /> },
        'panel-cluster-metrics': { title: '集群核心指标明细', subtitle: 'Cluster Core Metrics Detail', component: <ClusterMetricsPanel date={selectedDate} systemId={effectiveSystemId} /> },
        'panel-region-traffic': { title: '云区域流量态势', subtitle: 'Cloud Region Traffic Situational Awareness', component: <TrafficRegionPanel date={selectedDate} systemId={effectiveSystemId} /> },
        'panel-assessment-action': { title: '评估与计划', subtitle: 'Assessment & Planning', component: <AssessmentActionPanel reportId={`${effectiveSystemId}-${selectedDate}`} /> },
      };

      const oldToNewIdMap: Record<string, string> = {
        'summary': 'panel-summary-status',
        'sla': 'panel-sla-metrics',
        'cluster': 'panel-cluster-metrics',
        'traffic': 'panel-region-traffic',
        'assessment': 'panel-assessment-action',
      };

      const orderedPanels = panelOrder.length > 0 
        ? panelOrder.map(id => {
            const newId = oldToNewIdMap[id] || id;
            return { id: newId, ...defaultPanelsMap[newId as keyof typeof defaultPanelsMap] };
          }).filter(p => p.title && !deletedPanels.has(p.id))
        : DEFAULT_PANEL_IDS.map(id => ({ id, ...defaultPanelsMap[id as keyof typeof defaultPanelsMap] })).filter(p => !deletedPanels.has(p.id));

      console.log('[renderDynamicPanels] Final orderedPanels:', orderedPanels);

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
                    isSelected={selectedPanelId === panel.id}
                    onSelect={handlePanelSelect}
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
                isSelected={selectedPanelId === panel.id}
                onSelect={handlePanelSelect}
                onDelete={handleDeletePanel}
              >
                {panel.component}
              </DraggableSection>
            );
          })}
        </>
      );
    }

    const filteredPanels: GrafanaPanel[] = panelOrder.length > 0 
      ? panelOrder
          .filter(id => !deletedPanels.has(id))
          .map(id => panels.find(p => p.id === id))
          .filter((p): p is GrafanaPanel => p !== undefined)
      : panels.filter(panel => !deletedPanels.has(panel.id));

    console.log('[renderDynamicPanels] filteredPanels (panels存在):', filteredPanels.map((p: any) => ({ id: p.id, title: p.title })));

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
              const panelContent = renderPanel(panel, selectedDate, effectiveSystemId, handleStatusChange);
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
                  isSelected={selectedPanelId === panel.id}
                  onSelect={handlePanelSelect}
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
      const panelContent = renderPanel(panel, selectedDate, effectiveSystemId, handleStatusChange);
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
          isSelected={selectedPanelId === panel.id}
          onSelect={handlePanelSelect}
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
        operationCount={operationHistory.length + modificationHistory.length}
        isFullscreen={isFullscreen}
        hasUnsavedChanges={Object.keys(pendingModifications).length > 0}
      />

      <div className={`${styles.content} ${isConfigMode ? styles.configModeContent : ''}`}>
        <div className={styles.previewArea}>
          {isConfigMode && (
            <div className={styles.configHint}>
              <AimOutlined /> 点击选中可编辑面板 · 拖拽调整顺序 · 右侧对话实时修改
            </div>
          )}
          {renderDynamicPanels()}
        </div>
        
        {isConfigMode && (
          <div className={styles.chatPanel}>
            <AIChatPanel
              messages={chatMessages}
              selectedElement={selectedPanelId ? {
                id: selectedPanelId,
                title: getPanelTitle(selectedPanelId),
              } : null}
              isTyping={isAiTyping}
              onSendMessage={handleSendMessage}
              onClearSelection={() => setSelectedPanelId(null)}
            />
          </div>
        )}
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
