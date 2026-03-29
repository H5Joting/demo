import React from 'react';

import styles from './index.module.scss';

const Component = () => {
  return (
    <div className={styles.section}>
      <div className={styles.container}>
        <p className={styles.text}>三、集群核心指标明细</p>
        <div className={styles.text2}>
          <p className={styles.clusterCoreMetricsDe}>Cluster Core Metrics Detail</p>
        </div>
      </div>
      <div className={styles.container30}>
        <div className={styles.container2}>
          <div className={styles.button}>
            <p className={styles.text3}>威新中心</p>
          </div>
          <p className={styles.text4}>南方中心</p>
        </div>
        <div className={styles.table}>
          <div className={styles.tableRow}>
            <div className={styles.headerCell}>
              <p className={styles.text5}>链路层级</p>
            </div>
            <p className={styles.text6}>指标名称</p>
            <p className={styles.text7}>当日峰值 (MAX/AVG)</p>
            <p className={styles.text7}>上日峰值 (MAX/AVG)</p>
            <p className={styles.text8}>历史峰值</p>
            <p className={styles.text9}>同/环比</p>
            <p className={styles.text10}>结论 & 趋势</p>
          </div>
          <div className={styles.tableBody}>
            <div className={styles.tableRow2}>
              <div className={styles.tableCell}>
                <div className={styles.container3} />
                <div className={styles.container4}>
                  <div className={styles.text12}>
                    <p className={styles.text11}>接入层</p>
                  </div>
                  <div className={styles.text13}>
                    <p className={styles.aCcess}>ACCESS</p>
                  </div>
                </div>
              </div>
              <p className={styles.collectorEps}>Collector EPS</p>
              <div className={styles.tableCell2}>
                <div className={styles.container5}>
                  <p className={styles.a24011W}>240.11 w</p>
                </div>
                <div className={styles.container6}>
                  <p className={styles.avg24011W}>Avg: 240.11 w</p>
                </div>
              </div>
              <div className={styles.tableCell3}>
                <div className={styles.container7}>
                  <p className={styles.a25411W}>254.11 w</p>
                </div>
                <div className={styles.container8}>
                  <p className={styles.avg25411W}>Avg: 254.11 w</p>
                </div>
              </div>
              <p className={styles.a30005W}>300.05 w</p>
              <p className={styles.a55}>▼ -5.5%</p>
              <div className={styles.container10}>
                <p className={styles.text14}>水位健康</p>
                <div className={styles.button2}>
                  <p className={styles.text15}>趋势</p>
                  <div className={styles.container9}>
                    <img
                      src="../image/mnb924a5-hjcyb4h.svg"
                      className={styles.icon}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.tableRow3}>
              <p className={styles.collectorEps}>Proxy带宽-交易网</p>
              <div className={styles.tableCell4}>
                <div className={styles.container11}>
                  <p className={styles.a24011W}>3.94 Gb/s</p>
                </div>
                <div className={styles.container12}>
                  <p className={styles.avg24011W}>Avg: 1.20 Gb/s</p>
                </div>
              </div>
              <div className={styles.tableCell5}>
                <div className={styles.container13}>
                  <p className={styles.a25411W}>4.61 Gb/s</p>
                </div>
                <div className={styles.container14}>
                  <p className={styles.avg25411W}>Avg: 1.28 Gb/s</p>
                </div>
              </div>
              <p className={styles.a599GbS}>5.99 Gb/s</p>
              <p className={styles.a55}>▼ -14.5%</p>
              <div className={styles.container10}>
                <p className={styles.text14}>水位健康</p>
                <div className={styles.button2}>
                  <p className={styles.text15}>趋势</p>
                  <div className={styles.container9}>
                    <img
                      src="../image/mnb924a5-hjcyb4h.svg"
                      className={styles.icon}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.tableRow4}>
              <div className={styles.tableCell6}>
                <div className={styles.container15} />
                <div className={styles.container16}>
                  <div className={styles.text17}>
                    <p className={styles.text16}>缓冲层</p>
                  </div>
                  <div className={styles.text13}>
                    <p className={styles.aCcess}>BUFFER</p>
                  </div>
                </div>
              </div>
              <p className={styles.collectorEps}>日志入库耗时</p>
              <div className={styles.tableCell2}>
                <div className={styles.container5}>
                  <p className={styles.a24011W}>14.00 ms</p>
                </div>
                <div className={styles.container6}>
                  <p className={styles.avg24011W}>Avg: 14.00 ms</p>
                </div>
              </div>
              <div className={styles.tableCell3}>
                <div className={styles.container7}>
                  <p className={styles.a25411W}>14.00 ms</p>
                </div>
                <div className={styles.container8}>
                  <p className={styles.avg25411W}>Avg: 14.00 ms</p>
                </div>
              </div>
              <p className={styles.a30005W}>31.00 ms</p>
              <p className={styles.a00}>▼ 0.0%</p>
              <div className={styles.container10}>
                <p className={styles.text14}>水位健康</p>
                <div className={styles.button2}>
                  <p className={styles.text15}>趋势</p>
                  <div className={styles.container9}>
                    <img
                      src="../image/mnb924a5-hjcyb4h.svg"
                      className={styles.icon}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.tableRow3}>
              <p className={styles.collectorEps}>Kafka写入流量</p>
              <div className={styles.tableCell4}>
                <div className={styles.container11}>
                  <p className={styles.a24011W}>5.78 Gb/s</p>
                </div>
                <div className={styles.container12}>
                  <p className={styles.avg24011W}>Avg: 3.51 Gb/s</p>
                </div>
              </div>
              <div className={styles.tableCell5}>
                <div className={styles.container13}>
                  <p className={styles.a25411W}>6.41 Gb/s</p>
                </div>
                <div className={styles.container14}>
                  <p className={styles.avg25411W}>Avg: 3.87 Gb/s</p>
                </div>
              </div>
              <p className={styles.a599GbS}>6.96 Gb/s</p>
              <p className={styles.a55}>▼ -9.8%</p>
              <div className={styles.container10}>
                <p className={styles.text14}>水位健康</p>
                <div className={styles.button2}>
                  <p className={styles.text15}>趋势</p>
                  <div className={styles.container9}>
                    <img
                      src="../image/mnb924a5-hjcyb4h.svg"
                      className={styles.icon}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.tableRow5}>
              <div className={styles.tableCell7}>
                <div className={styles.container17} />
                <div className={styles.container18}>
                  <div className={styles.text19}>
                    <p className={styles.text18}>存储层</p>
                  </div>
                  <div className={styles.text20}>
                    <p className={styles.sTorage}>STORAGE</p>
                  </div>
                </div>
              </div>
              <p className={styles.collectorEps}>平均搜索耗时</p>
              <div className={styles.tableCell8}>
                <div className={styles.container19}>
                  <p className={styles.a24011W}>1.16 s</p>
                </div>
                <div className={styles.container20}>
                  <p className={styles.avg24011W}>Avg: 1.16 s</p>
                </div>
              </div>
              <div className={styles.tableCell9}>
                <div className={styles.container21}>
                  <p className={styles.a25411W}>2.71 s</p>
                </div>
                <div className={styles.container22}>
                  <p className={styles.avg25411W}>Avg: 2.71 s</p>
                </div>
              </div>
              <p className={styles.a599GbS}>3.84 s</p>
              <p className={styles.a55}>▼ -57.2%</p>
              <div className={styles.container10}>
                <p className={styles.text14}>水位健康</p>
                <div className={styles.button2}>
                  <p className={styles.text15}>趋势</p>
                  <div className={styles.container9}>
                    <img
                      src="../image/mnb924a5-hjcyb4h.svg"
                      className={styles.icon}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.tableRow6}>
              <p className={styles.collectorEps}>CPU使用率</p>
              <div className={styles.tableCell10}>
                <div className={styles.container23}>
                  <p className={styles.a24011W}>66.69 %</p>
                </div>
                <div className={styles.container24}>
                  <p className={styles.avg24011W}>Avg: 58.37 %</p>
                </div>
              </div>
              <div className={styles.tableCell11}>
                <div className={styles.container25}>
                  <p className={styles.a25411W}>65.42 %</p>
                </div>
                <div className={styles.container26}>
                  <p className={styles.avg25411W}>Avg: 60.39 %</p>
                </div>
              </div>
              <p className={styles.a30005W}>73.94 %</p>
              <p className={styles.a19}>▲ 1.9%</p>
              <div className={styles.container10}>
                <p className={styles.text14}>水位健康</p>
                <div className={styles.button2}>
                  <p className={styles.text15}>趋势</p>
                  <div className={styles.container9}>
                    <img
                      src="../image/mnb924a5-hjcyb4h.svg"
                      className={styles.icon}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.tableRow7}>
              <p className={styles.collectorEps}>磁盘使用率</p>
              <div className={styles.tableCell10}>
                <div className={styles.container23}>
                  <p className={styles.a24011W}>62.46 %</p>
                </div>
                <div className={styles.container24}>
                  <p className={styles.avg24011W}>Avg: 61.57 %</p>
                </div>
              </div>
              <div className={styles.tableCell11}>
                <div className={styles.container25}>
                  <p className={styles.a25411W}>63.42 %</p>
                </div>
                <div className={styles.container26}>
                  <p className={styles.avg25411W}>Avg: 62.44 %</p>
                </div>
              </div>
              <p className={styles.a30005W}>72.29 %</p>
              <p className={styles.a55}>▼ -1.5%</p>
              <div className={styles.container10}>
                <p className={styles.text14}>水位健康</p>
                <div className={styles.button2}>
                  <p className={styles.text15}>趋势</p>
                  <div className={styles.container9}>
                    <img
                      src="../image/mnb924a5-hjcyb4h.svg"
                      className={styles.icon}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.tableRow8}>
              <div className={styles.tableCell12}>
                <div className={styles.container27} />
                <div className={styles.container28}>
                  <div className={styles.text22}>
                    <p className={styles.text21}>应用层</p>
                  </div>
                  <div className={styles.text23}>
                    <p className={styles.aPplication}>APPLICATION</p>
                  </div>
                </div>
              </div>
              <p className={styles.text24}>监控延迟</p>
              <div className={styles.tableCell13}>
                <div className={styles.container19}>
                  <p className={styles.a24011W}>9.55 s</p>
                </div>
                <div className={styles.container20}>
                  <p className={styles.avg24011W}>Avg: 9.55 s</p>
                </div>
              </div>
              <div className={styles.tableCell14}>
                <div className={styles.container25}>
                  <p className={styles.a25411W}>12.61 s</p>
                </div>
                <div className={styles.container26}>
                  <p className={styles.avg25411W}>Avg: 12.61 s</p>
                </div>
              </div>
              <p className={styles.a1298S}>12.98 s</p>
              <p className={styles.a243}>▼ -24.3%</p>
              <div className={styles.container29}>
                <p className={styles.text14}>水位健康</p>
                <div className={styles.button2}>
                  <p className={styles.text15}>趋势</p>
                  <div className={styles.container9}>
                    <img
                      src="../image/mnb924a5-hjcyb4h.svg"
                      className={styles.icon}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Component;
