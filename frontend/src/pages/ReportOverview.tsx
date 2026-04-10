import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchBusinessSystemsOverview, BusinessSystemOverview, importReport, deleteBusinessSystem } from '@/api';
import ReportCard from '@/components/ReportCard';
import StatCard from '@/components/StatCard';
import ImportModal from '@/components/ImportModal';
import styles from './ReportOverview.module.scss';
import type { ExportJSON } from '@/types';

interface StatCardData {
  icon: React.ReactNode;
  value: number | null | undefined;
  label: string;
  subLabel: string;
  color: string;
  bgColor: string;
  iconBg: string;
}

const ReportOverview: React.FC = () => {
  const navigate = useNavigate();
  const [systems, setSystems] = useState<BusinessSystemOverview[]>([]);
  const [loading, setLoading] = useState(true);
  const [_refreshing, setRefreshing] = useState(false);
  const [_error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [importVisible, setImportVisible] = useState(false);
  const isLoadingRef = useRef(false);

  const getReportDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const [reportDateTime, setReportDateTime] = useState(getReportDateTime());

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadSystems = useCallback(async (isRefresh = false) => {
    if (isLoadingRef.current && !isRefresh) {
      return;
    }
    
    isLoadingRef.current = true;
    
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      const data = await fetchBusinessSystemsOverview();
      setSystems(data);
      if (isRefresh) {
        setReportDateTime(getReportDateTime());
        showToast('数据刷新成功', 'success');
      }
    } catch (err: any) {
      setError('加载报表数据失败');
      setSystems([]);
      if (isRefresh) {
        showToast('数据加载失败，请稍后重试', 'error');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
      isLoadingRef.current = false;
    }
  }, []);

  useEffect(() => {
    loadSystems();
  }, [loadSystems]);

  const handleImport = async (data: Record<string, unknown>, mode: 'created' | 'updated') => {
    try {
      const result = await importReport(data as unknown as ExportJSON);
      
      if (data.panelTemplate) {
        const systemId = result.details.business_system.id;
        localStorage.setItem(`report-template-${systemId}`, JSON.stringify(data.panelTemplate));
      }
      
      const message = mode === 'updated' 
        ? `报表更新成功：${result.details.business_system.name}`
        : `报表创建成功：${result.details.business_system.name}`;
      showToast(message, 'success');
      await loadSystems();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '导入失败，请重试';
      showToast(errorMessage, 'error');
    }
  };

  const handleDelete = async (systemId: string) => {
    await deleteBusinessSystem(systemId);
    await loadSystems();
  };

  const statCards: StatCardData[] = [
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M2.25 5.24953C2.25 4.55333 2.81533 3.98804 3.51149 3.98804H5.77342C6.46962 3.98804 7.03491 4.55337 7.03491 5.24953V7.51146C7.03491 8.20766 6.46958 8.77295 5.77342 8.77295H3.51149C2.81529 8.77295 2.25 8.20762 2.25 7.51146V5.24953Z" stroke="currentColor" strokeWidth="1.49976" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10.9651 5.24953C10.9651 4.55333 11.5304 3.98804 12.2266 3.98804H14.4885C15.1847 3.98804 15.75 4.55337 15.75 5.24953V7.51146C15.75 8.20766 15.1847 8.77295 14.4885 8.77295H12.2266C11.5304 8.77295 10.9651 8.20762 10.9651 7.51146V5.24953Z" stroke="currentColor" strokeWidth="1.49976" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2.25 12.2264C2.25 11.5302 2.81533 10.9649 3.51149 10.9649H5.77342C6.46962 10.9649 7.03491 11.5303 7.03491 12.2264V14.4884C7.03491 15.1846 6.46958 15.7499 5.77342 15.7499H3.51149C2.81529 15.7499 2.25 15.1845 2.25 14.4884V12.2264Z" stroke="currentColor" strokeWidth="1.49976" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10.9651 12.2264C10.9651 11.5302 11.5304 10.9649 12.2266 10.9649H14.4885C15.1847 10.9649 15.75 11.5303 15.75 12.2264V14.4884C15.75 15.1846 15.1847 15.7499 14.4885 15.7499H12.2266C11.5304 15.7499 10.9651 15.1845 10.9651 14.4884V12.2264Z" stroke="currentColor" strokeWidth="1.49976" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      value: systems.length > 0 ? systems.length : null,
      label: '系统总数',
      subLabel: '已接入业务系统',
      color: '#155dfc',
      bgColor: '#eff6ff',
      iconBg: '#dbeafe'
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M9 16.5C13.1421 16.5 16.5 13.1421 16.5 9C16.5 4.85786 13.1421 1.5 9 1.5C4.85786 1.5 1.5 4.85786 1.5 9C1.5 13.1421 4.85786 16.5 9 16.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M5.25 9L7.5 11.25L12.75 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      value: systems.length > 0 ? systems.filter(s => s.system_status === 'normal').length : null,
      label: '运行正常',
      subLabel: systems.length > 0 ? `占比 ${Math.round(systems.filter(s => s.system_status === 'normal').length / systems.length * 100)}%` : '占比 -',
      color: '#16a34a',
      bgColor: '#ecfdf5',
      iconBg: '#d0fae5'
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M9 6.75V9.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 12.75H9.0075" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M7.245 2.24998L1.2375 12.9C1.08244 13.1749 1.0003 13.4854 1.00001 13.8014C0.999717 14.1173 1.08128 14.4279 1.23584 14.7031C1.39041 14.9783 1.61248 15.2084 1.88029 15.3707C2.1481 15.533 2.45265 15.6218 2.7645 15.6285H15.2355C15.5474 15.6218 15.8519 15.533 16.1197 15.3707C16.3875 15.2084 16.6096 14.9783 16.7642 14.7031C16.9187 14.4279 17.0003 14.1173 17 13.8014C16.9997 13.4854 16.9176 13.1749 16.7625 12.9L10.755 2.24998C10.5944 1.98327 10.3685 1.76189 10.099 1.60756C9.82945 1.45323 9.52513 1.37134 9.21525 1.36987C8.90537 1.3684 8.6003 1.44741 8.32936 1.59925C8.05842 1.75108 7.83066 1.97039 7.66763 2.2356L7.245 2.24998Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      value: systems.length > 0 ? systems.filter(s => s.system_status === 'warning').length : null,
      label: '存在警告',
      subLabel: '需要关注',
      color: '#ca8a04',
      bgColor: '#fffbeb',
      iconBg: '#fde68a'
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M9 16.5C13.1421 16.5 16.5 13.1421 16.5 9C16.5 4.85786 13.1421 1.5 9 1.5C4.85786 1.5 1.5 4.85786 1.5 9C1.5 13.1421 4.85786 16.5 9 16.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M11.25 6.75L6.75 11.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M6.75 6.75L11.25 11.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      value: systems.length > 0 ? systems.filter(s => s.system_status === 'critical').length : null,
      label: '运行异常',
      subLabel: '需要立即处理',
      color: '#dc2626',
      bgColor: '#fef2f2',
      iconBg: '#fecaca'
    }
  ];

  const filteredSystems = systems.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingWrapper}>
          <div className={styles.loadingSpinner}></div>
          <span>加载中...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.pageTitle}>报表总览</h1>
          <p className={styles.pageSubtitle}>管理和监控所有业务系统的分析报表</p>
        </div>
      </header>

      <section className={styles.statsGrid}>
        {statCards.map((card, index) => (
          <StatCard
            key={index}
            icon={card.icon}
            value={card.value}
            label={card.label}
            subLabel={card.subLabel}
            color={card.color}
            bgColor={card.bgColor}
            iconBg={card.iconBg}
          />
        ))}
      </section>

      <section className={styles.filterBar}>
        <div className={styles.toolbar}>
          <div className={styles.searchBox}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className={styles.searchIcon}>
              <circle cx="8" cy="8" r="6.5" stroke="#999" strokeWidth="1.5"/>
              <path d="M13 13l3.5 3.5" stroke="#999" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              placeholder="搜索系统名称、标签..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <button 
            className={styles.importButton}
            onClick={() => setImportVisible(true)}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1.5v9M4.5 7.5L8 11l3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 11.5v2a1 1 0 001 1h10a1 1 0 001-1v-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            导入
          </button>
          <div className={styles.viewToggle}>
            <button className={`${styles.viewBtn} ${styles.active}`}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                <rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                <rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                <rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            </button>
            <button className={styles.viewBtn}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <line x1="2" y1="3" x2="14" y2="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="2" y1="8" x2="14" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="2" y1="13" x2="14" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>
        <div className={styles.resultInfo}>
          共找到 <span className={styles.resultCount}>{filteredSystems.length}</span> 个系统报表
        </div>
      </section>

      <section className={styles.reportGrid}>
        {filteredSystems.length > 0 ? (
          filteredSystems.map((system) => {
            const reportTypeMap: Record<string, { type: string; color: string; bg: string }> = {
              'payment-center': { type: '订单服务', color: '#155dfc', bg: '#eff6ff' },
              'order-system': { type: '财务服务', color: '#16a34a', bg: '#ecfdf5' },
              'unified-log': { type: 'API分析', color: '#155dfc', bg: '#eff6ff' },
              'user-center': { type: 'API分析', color: '#7c3aed', bg: '#f5f3ff' },
              'log-service': { type: '日常分析', color: '#ca8a04', bg: '#fffbeb' },
            };
            const reportConfig = reportTypeMap[system.code] || { type: 'API分析', color: '#155dfc', bg: '#eff6ff' };
            
            return (
              <ReportCard
                key={system.id}
                reportType={reportConfig.type}
                reportTypeColor={reportConfig.color}
                reportTypeBg={reportConfig.bg}
                status={system.system_status === 'normal' ? 'normal' : system.system_status === 'warning' ? 'warning' : system.system_status === 'critical' ? 'critical' : 'offline'}
                title={system.name}
                description={system.description}
                metrics={system.metrics.map(m => ({
                  label: m.label,
                  value: m.value,
                  change: m.change,
                  trend: m.trend as 'up' | 'down' | 'neutral',
                }))}
                date={system.report_date || reportDateTime}
                systemId={system.id}
                onViewDetail={(id) => navigate(`/overview/${id}`)}
                onDelete={handleDelete}
              />
            );
          })
        ) : (
          <div style={{ 
            gridColumn: '1 / -1',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '60px 0',
            color: '#90a1b9',
            fontSize: '14px'
          }}>
            暂无报表数据
          </div>
        )}
      </section>
      
      {toast && (
        <div className={`${styles.toast} ${styles[toast.type]}`}>
          <span>{toast.message}</span>
        </div>
      )}

      <ImportModal
        visible={importVisible}
        onClose={() => setImportVisible(false)}
        onSuccess={handleImport}
      />
    </>
  );
};

export default ReportOverview;
