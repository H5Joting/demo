import React from 'react';

import styles from './index.module.scss';

const Component = () => {
  return (
    <div className={styles.container4}>
      <p className={styles.text}>报告日期</p>
      <div className={styles.container}>
        <p className={styles.text2}>生成时间</p>
        <div className={styles.text3}>
          <p className={styles.a120000Cst}>12:00:00 CST</p>
        </div>
      </div>
      <div className={styles.container2} />
      <div className={styles.button}>
        <img src="../image/mnafpnjl-16dvu0r.svg" className={styles.icon} />
        <p className={styles.text4}>智能巡检已启用</p>
      </div>
      <div className={styles.button2}>
        <img src="../image/mnafpnjl-rjo74ix.svg" className={styles.icon} />
        <p className={styles.text5}>生成报告</p>
      </div>
      <div className={styles.container2} />
      <div className={styles.container3}>
        <div className={styles.text6} />
        <div className={styles.autoWrapper}>
          <div className={styles.text7} />
          <div className={styles.text9}>
            <p className={styles.text8}>系统运行正常</p>
          </div>
        </div>
      </div>
      <div className={styles.button3}>
        <img src="../image/mnafpnjl-94ju6kq.svg" className={styles.icon2} />
      </div>
    </div>
  );
}

export default Component;
