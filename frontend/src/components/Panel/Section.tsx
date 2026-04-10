import React from 'react';
import styles from './Section.module.scss';

interface SectionProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

const Section: React.FC<SectionProps> = ({
  title,
  subtitle,
  children,
  className,
}) => {
  return (
    <section className={`${styles.section} ${className || ''}`}>
      <div className={styles.header}>
        <h2>{title}</h2>
        {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
      </div>
      <div className={styles.content}>{children}</div>
    </section>
  );
};

export default Section;
