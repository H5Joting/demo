import React from 'react';
import styles from './ErrorState.module.scss';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  title = '数据加载失败',
  message = '请检查网络连接或稍后重试',
  onRetry
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.illustration}>
        <svg viewBox="0 0 200 150" className={styles.svg}>
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e0e7ff" />
              <stop offset="100%" stopColor="#c7d2fe" />
            </linearGradient>
          </defs>
          <ellipse cx="100" cy="130" rx="80" ry="12" fill="#e0e7ff" opacity="0.5" />
          <rect x="30" y="30" width="140" height="90" rx="8" fill="url(#grad1)" />
          <rect x="40" y="45" width="60" height="8" rx="4" fill="#a5b4fc" opacity="0.6" />
          <rect x="40" y="60" width="80" height="6" rx="3" fill="#c7d2fe" />
          <rect x="40" y="72" width="50" height="6" rx="3" fill="#c7d2fe" />
          <rect x="40" y="84" width="70" height="6" rx="3" fill="#c7d2fe" />
          <circle cx="150" cy="55" r="20" fill="#fee2e2" />
          <path d="M143 48 L157 62 M157 48 L143 62" stroke="#f87171" strokeWidth="3" strokeLinecap="round" />
          <circle cx="150" cy="55" r="25" fill="none" stroke="#fca5a5" strokeWidth="2" strokeDasharray="4 4" />
        </svg>
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.message}>{message}</p>
      {onRetry && (
        <button className={styles.retryBtn} onClick={onRetry}>
          重新加载
        </button>
      )}
    </div>
  );
};

export default ErrorState;
