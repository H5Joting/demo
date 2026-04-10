import React from 'react';
import { Card } from 'antd';
import styles from './Panel.module.scss';

interface PanelProps {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
  headerRight?: React.ReactNode;
  noPadding?: boolean;
}

const Panel: React.FC<PanelProps> = ({
  title,
  subtitle,
  icon,
  className,
  children,
  headerRight,
  noPadding = false,
}) => {
  return (
    <Card className={`${styles.panel} ${className || ''}`} bodyStyle={noPadding ? { padding: 0 } : undefined}>
      {(title || headerRight) && (
        <div className={styles.header}>
          <div className={styles.titleGroup}>
            {icon && <div className={styles.iconWrapper}>{icon}</div>}
            <div className={styles.titleContent}>
              {title && <h3 className={styles.title}>{title}</h3>}
              {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
            </div>
          </div>
          {headerRight && <div className={styles.headerRight}>{headerRight}</div>}
        </div>
      )}
      <div className={styles.content}>{children}</div>
    </Card>
  );
};

export default Panel;
