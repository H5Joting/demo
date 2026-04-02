import React from 'react';
import { formatNumber } from '@/utils/format';
import styles from './StatCard.module.scss';

interface StatCardProps {
  icon: React.ReactNode;
  value: number | null | undefined;
  label: string;
  subLabel: string;
  color: string;
  bgColor: string;
  iconBg: string;
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  value,
  label,
  subLabel,
  color,
  bgColor,
  iconBg
}) => {
  return (
    <div 
      className={styles.statCard} 
      style={{ backgroundColor: bgColor }}
    >
      <div 
        className={styles.statIconWrapper} 
        style={{ backgroundColor: iconBg, color: color }}
      >
        {icon}
      </div>
      <div className={styles.statValue}>{formatNumber(value)}</div>
      <div className={styles.statLabel}>{label}</div>
      <div className={styles.statSubLabel}>{subLabel}</div>
    </div>
  );
};

export default StatCard;
