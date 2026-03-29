import React from 'react';

import styles from './index.module.scss';

const Component = () => {
  return (
    <div className={styles.container2}>
      <p className={styles.text}>平均流量</p>
      <div className={styles.container}>
        <div className={styles.text2}>
          <p className={styles.a102}>1.02</p>
        </div>
        <div className={styles.text3}>
          <p className={styles.mbps}>Mbps</p>
        </div>
      </div>
    </div>
  );
}

export default Component;
