import React from 'react';
import { Badge, Button, Tooltip, DatePicker, Alert } from 'antd';
import { BellOutlined, SyncOutlined, CheckCircleOutlined, CalendarOutlined, DatabaseOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useDate } from '@/context/DateContext';
import styles from './Header.module.scss';

const Header: React.FC = () => {
  const { selectedDate, setSelectedDate, loading, dbError } = useDate();

  const handleDateChange = (date: dayjs.Dayjs | null) => {
    if (date) {
      setSelectedDate(date.format('YYYY-MM-DD'));
    }
  };

  const disabledDate = (current: dayjs.Dayjs) => {
    if (!current) return true;
    const today = dayjs().startOf('day');
    return current.isAfter(today) || current.isSame(today);
  };

  return (
    <>
      {dbError && (
        <Alert
          message="数据库连接失败"
          description="无法连接到数据库，请检查数据库配置或联系管理员"
          type="error"
          icon={<DatabaseOutlined />}
          showIcon
          banner
          closable
        />
      )}
      <header className={styles.header}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect width="20" height="20" rx="4" fill="#155dfc"/>
              <path d="M6 10L9 13L14 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className={styles.logoText}>
            <h1>统一日志中心</h1>
            <span>Unified Log Analysis System</span>
          </div>
        </div>

        <div className={styles.headerRight}>
          <div className={styles.dateInfo}>
            <span className={styles.label}>报告日期</span>
            <DatePicker
              value={selectedDate ? dayjs(selectedDate) : null}
              onChange={handleDateChange}
              disabledDate={disabledDate}
              format="YYYY年MM月DD日"
              style={{ width: 180 }}
              suffixIcon={<CalendarOutlined />}
              allowClear={false}
              inputReadOnly
              disabled={dbError || loading}
            />
          </div>

          <div className={styles.timeInfo}>
            <span className={styles.label}>生成时间</span>
            <span className={styles.timeValue}>12:00:00 CST</span>
          </div>

          <div className={styles.divider} />

          <Button type="primary" className={styles.inspectionBtn} icon={<SyncOutlined />}>
            智能巡检已启用
          </Button>

          <Button className={styles.reportBtn} icon={<CheckCircleOutlined />}>
            生成报告
          </Button>

          <div className={styles.divider} />

          <div className={styles.statusBadge}>
            {dbError ? (
              <>
                <Badge status="error" />
                <span>数据库连接失败</span>
              </>
            ) : (
              <>
                <Badge status="success" />
                <span>系统运行正常</span>
              </>
            )}
          </div>

          <Tooltip title="通知">
            <Button type="text" icon={<BellOutlined />} className={styles.notifyBtn} />
          </Tooltip>
        </div>
      </header>
    </>
  );
};

export default Header;
