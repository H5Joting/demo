import React, { useEffect, useState } from 'react';
import { fetchBusinessSystems } from '@/api';
import { BusinessSystem } from '@/types';
import ReportCard from '@/components/ReportCard';
import StatCard from '@/components/StatCard';
import Dashboard from '@/pages/Dashboard';
import PageHeader from '@/components/PageHeader';
import styles from './ReportOverview.module.scss';

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
  const [systems, setSystems] = useState<BusinessSystem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [collapsed, setCollapsed] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [selectedSystemId, setSelectedSystemId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(() => {
    const now = new Date();
    return {
      date: now.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-'),
      time: now.toLocaleTimeString('zh-CN', { hour12: false })
    };
  });

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

  const updateTime = () => {
    const now = new Date();
    setCurrentTime({
      date: now.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-'),
      time: now.toLocaleTimeString('zh-CN', { hour12: false })
    });
    setReportDateTime(getReportDateTime());
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadSystems = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      const data = await fetchBusinessSystems();
      setSystems(data);
      if (isRefresh) {
        updateTime();
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
    }
  };

  useEffect(() => {
    loadSystems();
  }, []);

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
      value: systems.length > 0 ? systems.filter(s => s.status === 'active').length : null,
      label: '运行正常',
      subLabel: systems.length > 0 ? `占比 ${Math.round(systems.filter(s => s.status === 'active').length / systems.length * 100)}%` : '占比 -',
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
      value: systems.length > 0 ? Math.floor(systems.length * 0.25) : null,
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
      value: systems.length > 0 ? 0 : null,
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
    <div className={styles.layout}>
      <header className={`${styles.topNav} ${collapsed ? styles.topNavCollapsed : ''}`}>
        <div className={styles.topNavLeft}></div>
        <div className={styles.topNavRight}>
          <button 
            className={`${styles.refreshBtn} ${refreshing ? styles.refreshing : ''}`} 
            onClick={() => loadSystems(true)}
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
              <path d="M2.17387 10.2137C2.08681 10.3092 2.02936 10.4278 2.0085 10.5553C1.98764 10.6828 2.00428 10.8135 2.05639 10.9317C2.10849 11.0499 2.19382 11.1504 2.302 11.221C2.41017 11.2916 2.53653 11.3292 2.6657 11.3293H13.3286C13.4577 11.3294 13.5841 11.2919 13.6924 11.2214C13.8006 11.151 13.886 11.0506 13.9383 10.9325C13.9905 10.8144 14.0073 10.6836 13.9866 10.5561C13.9659 10.4287 13.9087 10.3099 13.8217 10.2144C12.9354 9.30072 11.9957 8.32973 11.9957 5.33147C11.9957 4.27098 11.5744 3.25392 10.8246 2.50404C10.0747 1.75416 9.05763 1.33289 7.99714 1.33289C6.93665 1.33289 5.91959 1.75416 5.16972 2.50404C4.41984 3.25392 3.99856 4.27098 3.99856 5.33147C3.99856 8.32973 3.05823 9.30072 2.17387 10.2137Z" stroke="#62748E" strokeWidth="1.33286" strokeLinecap="round" strokeLinejoin="round"/>
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

        {!collapsed && (
          <div className={styles.sidebarBottom}>
            <button className={styles.helpBtn}>
              <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
                <path d="M8.99858 16.4974C13.1401 16.4974 16.4974 13.1401 16.4974 8.99857C16.4974 4.85709 13.1401 1.49976 8.99858 1.49976C4.8571 1.49976 1.49976 4.85709 1.49976 8.99857C1.49976 13.1401 4.8571 16.4974 8.99858 16.4974Z" stroke="#90A1B9" strokeWidth="1.49976" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6.81643 6.74897C6.99273 6.2478 7.34071 5.8252 7.79874 5.55601C8.25677 5.28682 8.79528 5.18842 9.31891 5.27824C9.84254 5.36805 10.3175 5.64029 10.6596 6.04673C11.0018 6.45316 11.189 6.96758 11.1882 7.49885C11.1882 8.99861 8.93859 9.7485 8.93859 9.7485" stroke="#90A1B9" strokeWidth="1.49976" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8.99858 12.748H9.00608" stroke="#90A1B9" strokeWidth="1.49976" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              帮助文档
            </button>
            <div className={styles.userCard}>
              <div className={styles.userAvatar}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M11.0766 12.2425V11.0765C11.0766 10.4581 10.8309 9.86495 10.3936 9.42763C9.95626 8.99031 9.36313 8.74463 8.74467 8.74463H5.2468C4.62834 8.74463 4.03521 8.99031 3.59789 9.42763C3.16057 9.86495 2.91489 10.4581 2.91489 11.0765V12.2425" stroke="white" strokeWidth="1.16596" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6.99574 6.41273C8.28362 6.41273 9.32765 5.36869 9.32765 4.08081C9.32765 2.79293 8.28362 1.7489 6.99574 1.7489C5.70786 1.7489 4.66383 2.79293 4.66383 4.08081C4.66383 5.36869 5.70786 6.41273 6.99574 6.41273Z" stroke="white" strokeWidth="1.16596" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className={styles.userInfo}>
                <span className={styles.userName}>管理员</span>
                <span className={styles.userEmail}>admin@company.com</span>
              </div>
            </div>
          </div>
        )}

        {collapsed && (
          <div className={styles.sidebarBottomCollapsed}>
            <button className={styles.iconBtn} title="帮助文档">
              <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
                <path d="M8.99858 16.4974C13.1401 16.4974 16.4974 13.1401 16.4974 8.99857C16.4974 4.85709 13.1401 1.49976 8.99858 1.49976C4.8571 1.49976 1.49976 4.85709 1.49976 8.99857C1.49976 13.1401 4.8571 16.4974 8.99858 16.4974Z" stroke="#90A1B9" strokeWidth="1.49976" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6.81643 6.74897C6.99273 6.2478 7.34071 5.8252 7.79874 5.55601C8.25677 5.28682 8.79528 5.18842 9.31891 5.27824C9.84254 5.36805 10.3175 5.64029 10.6596 6.04673C11.0018 6.45316 11.189 6.96758 11.1882 7.49885C11.1882 8.99861 8.93859 9.7485 8.93859 9.7485" stroke="#90A1B9" strokeWidth="1.49976" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8.99858 12.748H9.00608" stroke="#90A1B9" strokeWidth="1.49976" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div className={styles.userAvatarCollapsed} title="管理员">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M11.0766 12.2425V11.0765C11.0766 10.4581 10.8309 9.86495 10.3936 9.42763C9.95626 8.99031 9.36313 8.74463 8.74467 8.74463H5.2468C4.62834 8.74463 4.03521 8.99031 3.59789 9.42763C3.16057 9.86495 2.91489 10.4581 2.91489 11.0765V12.2425" stroke="white" strokeWidth="1.16596" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6.99574 6.41273C8.28362 6.41273 9.32765 5.36869 9.32765 4.08081C9.32765 2.79293 8.28362 1.7489 6.99574 1.7489C5.70786 1.7489 4.66383 2.79293 4.66383 4.08081C4.66383 5.36869 5.70786 6.41273 6.99574 6.41273Z" stroke="white" strokeWidth="1.16596" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        )}

        <button 
          className={styles.collapseBtn} 
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? '展开菜单' : '折叠菜单'}
        >
          <svg 
            width="12" 
            height="12" 
            viewBox="0 0 12 12" 
            fill="none"
            style={{ transform: collapsed ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.3s' }}
          >
            <path d="M4.49574 8.99151L7.49289 5.99435L4.49574 2.99719" stroke="#62748E" strokeWidth="0.999053" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </aside>

      <main className={`${styles.main} ${collapsed ? styles.mainExpanded : ''} ${selectedSystemId ? styles.mainDetail : ''}`}>
        {selectedSystemId ? (
          <div className={styles.detailWrapper}>
            <PageHeader
              breadcrumb={[
                { label: '报表总览' },
                { label: systems.find(s => s.id === selectedSystemId)?.name || '系统详情' },
              ]}
              title={systems.find(s => s.id === selectedSystemId)?.name || '系统详情'}
              subtitle={systems.find(s => s.id === selectedSystemId)?.description}
              typeBadge="行为分析"
              statusBadge={systems.find(s => s.id === selectedSystemId)?.status === 'active' ? 'normal' : 'error'}
              tags={['用户', '行为', '分析']}
              meta={{
                reportDate: currentTime.date,
                lastUpdate: `${currentTime.date} ${currentTime.time}`,
                owner: '王工 · 数据分析团队',
                updateFrequency: '每日',
              }}
              onRefresh={() => {}}
              onExport={() => {}}
              onShare={() => {}}
              onConfig={() => {}}
              onBack={() => setSelectedSystemId(null)}
              fullWidth
            />
            <div className={styles.detailContent}>
              <Dashboard businessSystemId={selectedSystemId} />
            </div>
          </div>
        ) : (
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
                    status={system.status === 'active' ? 'normal' : 'offline'}
                    title={system.name}
                    description={system.description}
                    metrics={[
                      {
                        label: system.code === 'payment-center' ? '交易量' : system.code === 'order-system' ? '订单量' : '请求量',
                        value: Math.floor(Math.random() * 50000 + 100000).toLocaleString(),
                        change: `+${(Math.random() * 10 + 5).toFixed(1)}%`,
                        trend: 'up' as const,
                      },
                      {
                        label: '响应时间',
                        value: `${(Math.random() * 200 + 50).toFixed(1)}ms`,
                        change: `-${(Math.random() * 5 + 1).toFixed(1)}%`,
                        trend: 'down' as const,
                      },
                      {
                        label: 'CPU使用率',
                        value: `${(Math.random() * 30 + 60).toFixed(1)}%`,
                        change: `-${(Math.random() * 3 + 0.5).toFixed(1)}%`,
                        trend: 'down' as const,
                      },
                      {
                        label: '内存使用率',
                        value: `${(Math.random() * 20 + 70).toFixed(1)}%`,
                        change: `+${(Math.random() * 2 + 0.5).toFixed(1)}%`,
                        trend: 'up' as const,
                      },
                    ]}
                    date={reportDateTime}
                    systemId={system.id}
                    onViewDetail={(id) => setSelectedSystemId(id)}
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
          </>
        )}
      </main>
      
      {toast && (
        <div className={`${styles.toast} ${styles[toast.type]}`}>
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
};

export default ReportOverview;
