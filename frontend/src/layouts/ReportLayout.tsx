import React, { useState, useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import { fetchDataSourceStatus, toggleDataSource, DataSourceStatus } from '@/api';
import styles from './ReportLayout.module.scss';

const ReportLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [dataSourceStatus, setDataSourceStatus] = useState<DataSourceStatus>({ enabled: false, source: 'mock', connected: false });
  const isLoadingRef = useRef(false);

  useEffect(() => {
    loadDataSourceStatus();
  }, []);

  const loadDataSourceStatus = async () => {
    if (isLoadingRef.current) {
      return;
    }
    
    isLoadingRef.current = true;
    
    try {
      const status = await fetchDataSourceStatus();
      setDataSourceStatus(status);
    } catch (error) {
      console.error('Failed to load data source status:', error);
    } finally {
      isLoadingRef.current = false;
    }
  };

  const handleToggleDataSource = async () => {
    try {
      const newEnabled = !dataSourceStatus.enabled;
      const newStatus = await toggleDataSource(newEnabled);
      setDataSourceStatus(newStatus);
    } catch (error) {
      console.error('Failed to toggle data source:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  return (
    <div className={styles.layout}>
      <header className={`${styles.topNav} ${collapsed ? styles.topNavCollapsed : ''}`}>
        <div className={styles.topNavLeft}></div>
        <div className={styles.topNavRight}>
          <div className={styles.dataSourceToggle}>
            <span className={styles.dataSourceLabel}>数据源:</span>
            <button 
              className={`${styles.toggleBtn} ${dataSourceStatus.enabled ? styles.toggleOn : styles.toggleOff}`}
              onClick={handleToggleDataSource}
              title={`当前: ${dataSourceStatus.source === 'supabase' ? 'Supabase 数据库' : '本地 Mock 数据'}`}
            >
              <span className={styles.toggleSlider}></span>
            </button>
            <span className={`${styles.dataSourceValue} ${dataSourceStatus.source === 'mock' ? styles.mockSource : ''}`}>
              {dataSourceStatus.source === 'supabase' ? 'Supabase' : 'Mock'}
            </span>
          </div>
          <button 
            className={`${styles.refreshBtn} ${refreshing ? styles.refreshing : ''}`} 
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1.49854 5.99427C1.49854 4.80193 1.97219 3.65842 2.81531 2.81531C3.65842 1.97219 4.80193 1.49854 5.99427 1.49854C7.25111 1.50326 8.45745 1.99368 9.36108 2.86724L10.49 3.99617" stroke="#155DFC" strokeWidth="0.999053" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10.4901 1.49854V3.99617H7.99243" stroke="#155DFC" strokeWidth="0.999053" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10.49 5.99426C10.49 7.18661 10.0164 8.33012 9.17324 9.17323C8.33013 10.0163 7.18662 10.49 5.99427 10.49C4.73744 10.4853 3.53109 9.99486 2.62747 9.1213L1.49854 7.99237" stroke="#155DFC" strokeWidth="0.999053" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3.99617 7.99243H1.49854V10.4901" stroke="#155DFC" strokeWidth="0.999053" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>{refreshing ? '刷新中...' : '刷新数据'}</span>
          </button>
          <button className={styles.notifyBtn}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6.8429 13.995C6.95988 14.1976 7.12814 14.3658 7.33075 14.4828C7.53337 14.5998 7.7632 14.6614 7.99715 14.6614C8.23111 14.6614 8.46094 14.5998 8.66355 14.4828C8.86617 14.3658 9.03442 14.1976 9.15141 13.995" stroke="#62748E" strokeWidth="1.33286" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2.17387 10.2137C2.08681 10.3092 2.02936 10.4278 2.0085 10.5553C1.98764 10.6828 2.00428 10.8135 2.05639 10.9317C2.10849 11.0499 2.19382 11.1504 2.302 11.221C2.41017 11.2916 2.53653 11.3292 2.6657 11.3293H13.3286C13.4577 11.3294 13.5841 11.3299 13.6924 11.2214C13.8006 11.151 13.886 11.0506 13.9383 10.9325C13.9905 10.8144 14.0073 10.6836 13.9866 10.5561C13.9659 10.4287 13.9087 10.3099 13.8217 10.2144C12.9354 9.30072 11.9957 8.32973 11.9957 5.33147C11.9957 4.27098 11.5744 3.25392 10.8246 2.50404C10.0747 1.75416 9.05763 1.33289 7.99714 1.33289C6.93665 1.33289 5.91959 1.75416 5.16972 2.50404C4.41984 3.25392 3.99856 4.27098 3.99856 5.33147C3.99856 8.32973 3.05823 9.30072 2.17387 10.2137Z" stroke="#62748E" strokeWidth="1.33286" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className={styles.notifyDot}></span>
          </button>
          <button className={styles.exitBtn}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M5.24677 12.2425H2.91486C2.60563 12.2425 2.30906 12.1197 2.0904 11.901C1.87174 11.6823 1.7489 11.3858 1.7489 11.0766V2.91486C1.7489 2.60563 1.87174 2.30906 2.0904 2.0904C2.30906 1.87174 2.60563 1.7489 2.91486 1.7489H5.24677" stroke="#62748E" strokeWidth="1.16596" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9.32764 9.91059L12.2425 6.9957L9.32764 4.08081" stroke="#62748E" strokeWidth="1.16596" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12.2426 6.99573H5.24683" stroke="#62748E" strokeWidth="1.16596" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </header>

      <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
        <div className={styles.logoSection}>
          {!collapsed && (
            <>
              <div className={styles.logoBadge}>报</div>
              <div className={styles.logoText}>
                <span className={styles.logoTitle}>报表管理中心</span>
                <span className={styles.logoSubtitle}>Report Management</span>
              </div>
            </>
          )}
          {collapsed && (
            <div className={styles.logoBadgeCollapsed}>
              <svg width="18" height="18" viewBox="0 0 28 28" fill="none">
                <rect width="28" height="28" rx="6" fill="#155dfc"/>
                <path d="M8 10h12M8 14h8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
          )}
        </div>

        <nav className={styles.navigation}>
          <a href="/overview" className={`${styles.navLink} ${styles.active}`} title="报表总览">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M6.74893 2.24963H2.99953C2.58538 2.24963 2.24965 2.58537 2.24965 2.99952V8.24869C2.24965 8.66283 2.58538 8.99857 2.99953 8.99857H6.74893C7.16308 8.99857 7.49882 8.66283 7.49882 8.24869V2.99952C7.49882 2.58537 7.16308 2.24963 6.74893 2.24963Z" stroke="#155DFC" strokeWidth="1.49976" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14.9976 2.24963H11.2482C10.8341 2.24963 10.4983 2.58537 10.4983 2.99952V5.24916C10.4983 5.66331 10.8341 5.99904 11.2482 5.99904H14.9976C15.4118 5.99904 15.7475 5.66331 15.7475 5.24916V2.99952C15.7475 2.58537 15.4118 2.24963 14.9976 2.24963Z" stroke="#155DFC" strokeWidth="1.49976" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14.9976 8.99854H11.2482C10.8341 8.99854 10.4983 9.33427 10.4983 9.74842V14.9976C10.4983 15.4117 10.8341 15.7475 11.2482 15.7475H14.9976C15.4118 15.7475 15.7475 15.4117 15.7475 14.9976V9.74842C15.7475 9.33427 15.4118 8.99854 14.9976 8.99854Z" stroke="#155DFC" strokeWidth="1.49976" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6.74893 11.998H2.99953C2.58538 11.998 2.24965 12.3338 2.24965 12.7479V14.9976C2.24965 15.4117 2.58538 15.7475 2.99953 15.7475H6.74893C7.16308 15.7475 7.49882 15.4117 7.49882 14.9976V12.7479C7.49882 12.3338 7.16308 11.998 6.74893 11.998Z" stroke="#155DFC" strokeWidth="1.49976" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {!collapsed && '报表总览'}
          </a>
          <a href="/systems" className={styles.navLink} title="报表管理">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M11.2482 1.49976H4.49929C4.10153 1.49976 3.72006 1.65777 3.4388 1.93903C3.15754 2.22029 2.99953 2.60176 2.99953 2.99952V14.9976C2.99953 15.3954 3.15754 15.7769 3.4388 16.0581C3.72006 16.3394 4.10153 16.4974 4.49929 16.4974H13.4979C13.8956 16.4974 14.2771 16.3394 14.5584 16.0581C14.8396 15.7769 14.9976 15.3954 14.9976 14.9976V5.24916L11.2482 1.49976Z" stroke="#62748E" strokeWidth="1.49976" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10.4983 1.49976V4.49928C10.4983 4.89704 10.6564 5.27851 10.9376 5.55977C11.2189 5.84104 11.6003 5.99905 11.9981 5.99905H14.9976" stroke="#62748E" strokeWidth="1.49976" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5.99905 13.4979V12.748" stroke="#62748E" strokeWidth="1.49976" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8.99858 13.4978V8.99854" stroke="#62748E" strokeWidth="1.49976" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M11.9981 13.4978V11.2482" stroke="#62748E" strokeWidth="1.49976" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {!collapsed && '报表管理'}
          </a>
        </nav>

        <div className={`${styles.sidebarBottom} ${collapsed ? styles.collapsed : ''}`}>
          <button className={styles.helpBtn}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 16.5C13.1421 16.5 16.5 13.1421 16.5 9C16.5 4.85786 13.1421 1.5 9 1.5C4.85786 1.5 1.5 4.85786 1.5 9C1.5 13.1421 4.85786 16.5 9 16.5Z" stroke="#90A1B9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6.81802 6.75C6.99432 6.24883 7.3423 5.82623 7.80033 5.55704C8.25836 5.28785 8.79687 5.18945 9.3205 5.27927C9.84413 5.36908 10.3191 5.64132 10.6612 6.04776C11.0034 6.45419 11.1906 6.96861 11.1898 7.49988C11.1898 8.99964 8.94018 9.74953 8.94018 9.74953" stroke="#90A1B9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 12.75H9.0075" stroke="#90A1B9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {!collapsed && <span>帮助文档</span>}
          </button>
          <div className={styles.userCard}>
            <div className={styles.userAvatar}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 7C8.65685 7 10 5.65685 10 4C10 2.34315 8.65685 1 7 1C5.34315 1 4 2.34315 4 4C4 5.65685 5.34315 7 7 7Z" fill="white"/>
                <path d="M1 13C1 10.79 3.24 9 7 9C10.76 9 13 10.79 13 13" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            {!collapsed && (
              <div className={styles.userInfo}>
                <span className={styles.userName}>管理员</span>
                <span className={styles.userEmail}>admin@company.com</span>
              </div>
            )}
          </div>
        </div>

        <button className={styles.collapseBtn} onClick={() => setCollapsed(!collapsed)}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            {collapsed ? (
              <path d="M6 12L10 8L6 4" stroke="#62748E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            ) : (
              <path d="M10 12L6 8L10 4" stroke="#62748E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            )}
          </svg>
        </button>
      </aside>

      <main className={`${styles.main} ${collapsed ? styles.mainExpanded : ''}`}>
        <Outlet />
      </main>
    </div>
  );
};

export default ReportLayout;
