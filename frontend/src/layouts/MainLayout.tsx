import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '@/components/Header';
import styles from './MainLayout.module.scss';

const MainLayout: React.FC = () => {
  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.main}>
        <Outlet />
      </main>
      <footer className={styles.footer}>
        <p>© 2026 Unified Log Center Team. Internal Use Only.</p>
      </footer>
    </div>
  );
};

export default MainLayout;
