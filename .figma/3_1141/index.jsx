import React from 'react';

import styles from './index.module.scss';

const Component = () => {
  return (
    <div className={styles.mainContent}>
      <div className={styles.section}>
        <div className={styles.container}>
          <p className={styles.text}>一、核心结论与风险</p>
          <p className={styles.executiveSummaryRisk}>Executive Summary & Risks</p>
        </div>
        <div className={styles.container18}>
          <div className={styles.container12}>
            <div className={styles.container3}>
              <div className={styles.container2}>
                <img src="../image/mnb4677v-75ckwcj.svg" className={styles.icon} />
              </div>
              <div className={styles.heading3}>
                <p className={styles.text2}>运行综述</p>
              </div>
            </div>
            <div className={styles.container8}>
              <div className={styles.container5}>
                <div className={styles.text4}>
                  <p className={styles.text3}>WX CLUSTER / 威新集群</p>
                </div>
                <div className={styles.container4}>
                  <div className={styles.text5}>
                    <p className={styles.a240W}>240w</p>
                  </div>
                  <div className={styles.text7}>
                    <p className={styles.text6}>EPS峰值 (80.02%，2026-03-02)</p>
                  </div>
                </div>
                <div className={styles.paragraph}>
                  <p className={styles.text8}>
                    较上一交易日下跌 5.51%，流量有所回落。
                  </p>
                </div>
              </div>
              <div className={styles.container6} />
              <div className={styles.container7}>
                <div className={styles.text9}>
                  <p className={styles.text3}>NF CLUSTER / 南方集群</p>
                </div>
                <div className={styles.container4}>
                  <div className={styles.text5}>
                    <p className={styles.a240W}>227w</p>
                  </div>
                  <div className={styles.text7}>
                    <p className={styles.text6}>EPS峰值 (93.89%，2026-03-09)</p>
                  </div>
                </div>
                <div className={styles.paragraph2}>
                  <p className={styles.text8}>
                    集群指标平稳，弹性良好，无明显瓶颈。
                  </p>
                </div>
              </div>
            </div>
            <div className={styles.container11}>
              <div className={styles.container10}>
                <div className={styles.container9}>
                  <img
                    src="../image/mnb4677v-6sz0kl0.svg"
                    className={styles.icon2}
                  />
                </div>
                <p className={styles.text10}>智能洞察</p>
              </div>
              <div className={styles.paragraph3}>
                <p className={styles.text11}>
                  今日统一日志中心运行平稳，核心指标均在安全范围内，整体流量较昨日略有回落。
                </p>
              </div>
              <div className={styles.button}>
                <img src="../image/mnb4677v-nzkcu9o.svg" className={styles.icon3} />
                <p className={styles.text12}>查看推理过程</p>
              </div>
            </div>
          </div>
          <div className={styles.container17}>
            <div className={styles.container14}>
              <div className={styles.container13}>
                <img src="../image/mnb4677v-xl8tol9.svg" className={styles.icon4} />
                <div className={styles.heading32}>
                  <p className={styles.text13}>系统运行正常</p>
                </div>
              </div>
              <div className={styles.paragraph4}>
                <p className={styles.text14}>所有指标运行平稳，无风险提示。</p>
              </div>
            </div>
            <div className={styles.container16}>
              <div className={styles.container15}>
                <div className={styles.container9}>
                  <img
                    src="../image/mnb4677v-5pph29c.svg"
                    className={styles.icon2}
                  />
                </div>
                <p className={styles.text10}>智能洞察</p>
              </div>
              <div className={styles.paragraph5}>
                <p className={styles.text15}>
                  无高风险告警，所有指标正常，但需关注磁盘使用率趋势以防潜在容量风险。
                </p>
              </div>
              <div className={styles.button}>
                <img src="../image/mnb4677v-nzkcu9o.svg" className={styles.icon3} />
                <p className={styles.text12}>查看推理过程</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.section2}>
        <div className={styles.container19}>
          <p className={styles.text16}>二、SLA 核心指标</p>
          <div className={styles.text17}>
            <p className={styles.sLaCoreMetrics}>SLA Core Metrics</p>
          </div>
        </div>
        <div className={styles.table}>
          <div className={styles.tableRow}>
            <p className={styles.text18}>指标名称</p>
            <p className={styles.text19}>今日数据</p>
            <p className={styles.text19}>前一交易日</p>
            <p className={styles.text20}>历史峰值 (日期)</p>
            <p className={styles.text21}>SLA 阈值</p>
            <p className={styles.text22}>健康评估</p>
          </div>
          <div className={styles.tableBody}>
            <div className={styles.tableRow2}>
              <p className={styles.text23}>平均搜索耗时</p>
              <div className={styles.container20}>
                <div className={styles.text24}>
                  <p className={styles.a116S}>1.16 s</p>
                </div>
                <div className={styles.text25}>
                  <p className={styles.avg116S}>Avg: 1.16 s</p>
                </div>
              </div>
              <div className={styles.container21}>
                <div className={styles.text26}>
                  <p className={styles.a271S}>2.71 s</p>
                </div>
                <div className={styles.text27}>
                  <p className={styles.avg271S}>Avg: 2.71 s</p>
                </div>
              </div>
              <div className={styles.container22}>
                <div className={styles.text28}>
                  <p className={styles.a271S}>3.84 s</p>
                </div>
                <div className={styles.text29}>
                  <p className={styles.avg271S}>(2026-03-02)</p>
                </div>
              </div>
              <p className={styles.a40000S}>&#60; 4.0000 s</p>
              <div className={styles.tableCell}>
                <div className={styles.text31}>
                  <p className={styles.text30}>健康</p>
                </div>
              </div>
            </div>
            <div className={styles.tableRow3}>
              <p className={styles.text23}>CPU使用率</p>
              <div className={styles.container23}>
                <div className={styles.text32}>
                  <p className={styles.a116S}>66.69 %</p>
                </div>
                <div className={styles.text33}>
                  <p className={styles.avg116S}>Avg: 58.37 %</p>
                </div>
              </div>
              <div className={styles.container24}>
                <div className={styles.text34}>
                  <p className={styles.a271S}>65.42 %</p>
                </div>
                <div className={styles.text35}>
                  <p className={styles.avg271S}>Avg: 60.39 %</p>
                </div>
              </div>
              <div className={styles.container25}>
                <div className={styles.text36}>
                  <p className={styles.a271S}>73.94 %</p>
                </div>
                <div className={styles.text29}>
                  <p className={styles.avg271S}>(2026-03-23)</p>
                </div>
              </div>
              <p className={styles.a40000S}>&#60; 80.0000 %</p>
              <div className={styles.tableCell}>
                <div className={styles.text31}>
                  <p className={styles.text30}>健康</p>
                </div>
              </div>
            </div>
            <div className={styles.tableRow4}>
              <p className={styles.text23}>日志入库耗时</p>
              <div className={styles.container26}>
                <div className={styles.text37}>
                  <p className={styles.a116S}>14.00 ms</p>
                </div>
                <div className={styles.text38}>
                  <p className={styles.avg116S}>Avg: 14.00 ms</p>
                </div>
              </div>
              <div className={styles.container27}>
                <div className={styles.text39}>
                  <p className={styles.a271S}>14.00 ms</p>
                </div>
                <div className={styles.text40}>
                  <p className={styles.avg271S}>Avg: 14.00 ms</p>
                </div>
              </div>
              <div className={styles.container28}>
                <div className={styles.text41}>
                  <p className={styles.a271S}>51.00 ms</p>
                </div>
                <div className={styles.text29}>
                  <p className={styles.avg271S}>(2026-02-23)</p>
                </div>
              </div>
              <p className={styles.a40000S}>&#60; 500.0000 ms</p>
              <div className={styles.tableCell}>
                <div className={styles.text31}>
                  <p className={styles.text30}>健康</p>
                </div>
              </div>
            </div>
            <div className={styles.tableRow5}>
              <p className={styles.text23}>监控延迟</p>
              <div className={styles.container20}>
                <div className={styles.text24}>
                  <p className={styles.a116S}>9.55 s</p>
                </div>
                <div className={styles.text25}>
                  <p className={styles.avg116S}>Avg: 9.55 s</p>
                </div>
              </div>
              <div className={styles.container24}>
                <div className={styles.text34}>
                  <p className={styles.a271S}>12.61 s</p>
                </div>
                <div className={styles.text35}>
                  <p className={styles.avg271S}>Avg: 12.61 s</p>
                </div>
              </div>
              <div className={styles.container25}>
                <div className={styles.text36}>
                  <p className={styles.a271S}>12.98 s</p>
                </div>
                <div className={styles.text29}>
                  <p className={styles.avg271S}>(2026-03-02)</p>
                </div>
              </div>
              <p className={styles.a40000S}>&#60; 35.0000 s</p>
              <div className={styles.tableCell}>
                <div className={styles.text31}>
                  <p className={styles.text30}>健康</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.section3}>
        <div className={styles.container29}>
          <p className={styles.text42}>三、集群核心指标明细</p>
          <div className={styles.text43}>
            <p className={styles.sLaCoreMetrics}>Cluster Core Metrics Detail</p>
          </div>
        </div>
        <div className={styles.container58}>
          <div className={styles.container30}>
            <div className={styles.button2}>
              <p className={styles.text44}>威新中心</p>
            </div>
            <p className={styles.text45}>南方中心</p>
          </div>
          <div className={styles.table2}>
            <div className={styles.tableRow6}>
              <div className={styles.headerCell}>
                <p className={styles.text46}>链路层级</p>
              </div>
              <p className={styles.text47}>指标名称</p>
              <p className={styles.text48}>当日峰值 (MAX/AVG)</p>
              <p className={styles.text48}>上日峰值 (MAX/AVG)</p>
              <p className={styles.text49}>历史峰值</p>
              <p className={styles.text50}>同/环比</p>
              <p className={styles.text51}>结论 & 趋势</p>
            </div>
            <div className={styles.tableBody2}>
              <div className={styles.tableRow7}>
                <div className={styles.tableCell2}>
                  <div className={styles.container31} />
                  <div className={styles.container32}>
                    <div className={styles.text53}>
                      <p className={styles.text52}>接入层</p>
                    </div>
                    <div className={styles.text54}>
                      <p className={styles.aCcess}>ACCESS</p>
                    </div>
                  </div>
                </div>
                <p className={styles.collectorEps}>Collector EPS</p>
                <div className={styles.tableCell3}>
                  <div className={styles.container33}>
                    <p className={styles.a24011W}>240.11 w</p>
                  </div>
                  <div className={styles.container34}>
                    <p className={styles.avg24011W}>Avg: 240.11 w</p>
                  </div>
                </div>
                <div className={styles.tableCell4}>
                  <div className={styles.container35}>
                    <p className={styles.a25411W}>254.11 w</p>
                  </div>
                  <div className={styles.container36}>
                    <p className={styles.avg271S}>Avg: 254.11 w</p>
                  </div>
                </div>
                <p className={styles.a30005W}>300.05 w</p>
                <p className={styles.a55}>▼ -5.5%</p>
                <div className={styles.container38}>
                  <p className={styles.text55}>水位健康</p>
                  <div className={styles.button3}>
                    <p className={styles.text56}>趋势</p>
                    <div className={styles.container37}>
                      <img
                        src="../image/mnb4677v-8k9xvh3.svg"
                        className={styles.icon5}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.tableRow8}>
                <p className={styles.collectorEps}>Proxy带宽-交易网</p>
                <div className={styles.tableCell5}>
                  <div className={styles.container39}>
                    <p className={styles.a24011W}>3.94 Gb/s</p>
                  </div>
                  <div className={styles.container40}>
                    <p className={styles.avg24011W}>Avg: 1.20 Gb/s</p>
                  </div>
                </div>
                <div className={styles.tableCell6}>
                  <div className={styles.container41}>
                    <p className={styles.a25411W}>4.61 Gb/s</p>
                  </div>
                  <div className={styles.container42}>
                    <p className={styles.avg271S}>Avg: 1.28 Gb/s</p>
                  </div>
                </div>
                <p className={styles.a599GbS}>5.99 Gb/s</p>
                <p className={styles.a55}>▼ -14.5%</p>
                <div className={styles.container38}>
                  <p className={styles.text55}>水位健康</p>
                  <div className={styles.button3}>
                    <p className={styles.text56}>趋势</p>
                    <div className={styles.container37}>
                      <img
                        src="../image/mnb4677v-8k9xvh3.svg"
                        className={styles.icon5}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.tableRow9}>
                <div className={styles.tableCell7}>
                  <div className={styles.container43} />
                  <div className={styles.container44}>
                    <div className={styles.text58}>
                      <p className={styles.text57}>缓冲层</p>
                    </div>
                    <div className={styles.text54}>
                      <p className={styles.aCcess}>BUFFER</p>
                    </div>
                  </div>
                </div>
                <p className={styles.collectorEps}>日志入库耗时</p>
                <div className={styles.tableCell3}>
                  <div className={styles.container33}>
                    <p className={styles.a24011W}>14.00 ms</p>
                  </div>
                  <div className={styles.container34}>
                    <p className={styles.avg24011W}>Avg: 14.00 ms</p>
                  </div>
                </div>
                <div className={styles.tableCell4}>
                  <div className={styles.container35}>
                    <p className={styles.a25411W}>14.00 ms</p>
                  </div>
                  <div className={styles.container36}>
                    <p className={styles.avg271S}>Avg: 14.00 ms</p>
                  </div>
                </div>
                <p className={styles.a30005W}>31.00 ms</p>
                <p className={styles.a00}>▼ 0.0%</p>
                <div className={styles.container38}>
                  <p className={styles.text55}>水位健康</p>
                  <div className={styles.button3}>
                    <p className={styles.text56}>趋势</p>
                    <div className={styles.container37}>
                      <img
                        src="../image/mnb4677v-8k9xvh3.svg"
                        className={styles.icon5}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.tableRow8}>
                <p className={styles.collectorEps}>Kafka写入流量</p>
                <div className={styles.tableCell5}>
                  <div className={styles.container39}>
                    <p className={styles.a24011W}>5.78 Gb/s</p>
                  </div>
                  <div className={styles.container40}>
                    <p className={styles.avg24011W}>Avg: 3.51 Gb/s</p>
                  </div>
                </div>
                <div className={styles.tableCell6}>
                  <div className={styles.container41}>
                    <p className={styles.a25411W}>6.41 Gb/s</p>
                  </div>
                  <div className={styles.container42}>
                    <p className={styles.avg271S}>Avg: 3.87 Gb/s</p>
                  </div>
                </div>
                <p className={styles.a599GbS}>6.96 Gb/s</p>
                <p className={styles.a55}>▼ -9.8%</p>
                <div className={styles.container38}>
                  <p className={styles.text55}>水位健康</p>
                  <div className={styles.button3}>
                    <p className={styles.text56}>趋势</p>
                    <div className={styles.container37}>
                      <img
                        src="../image/mnb4677v-8k9xvh3.svg"
                        className={styles.icon5}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.tableRow10}>
                <div className={styles.tableCell8}>
                  <div className={styles.container45} />
                  <div className={styles.container46}>
                    <div className={styles.text60}>
                      <p className={styles.text59}>存储层</p>
                    </div>
                    <div className={styles.text61}>
                      <p className={styles.sTorage}>STORAGE</p>
                    </div>
                  </div>
                </div>
                <p className={styles.collectorEps}>平均搜索耗时</p>
                <div className={styles.tableCell9}>
                  <div className={styles.container47}>
                    <p className={styles.a24011W}>1.16 s</p>
                  </div>
                  <div className={styles.container48}>
                    <p className={styles.avg24011W}>Avg: 1.16 s</p>
                  </div>
                </div>
                <div className={styles.tableCell10}>
                  <div className={styles.container49}>
                    <p className={styles.a25411W}>2.71 s</p>
                  </div>
                  <div className={styles.container50}>
                    <p className={styles.avg271S}>Avg: 2.71 s</p>
                  </div>
                </div>
                <p className={styles.a599GbS}>3.84 s</p>
                <p className={styles.a55}>▼ -57.2%</p>
                <div className={styles.container38}>
                  <p className={styles.text55}>水位健康</p>
                  <div className={styles.button3}>
                    <p className={styles.text56}>趋势</p>
                    <div className={styles.container37}>
                      <img
                        src="../image/mnb4677v-8k9xvh3.svg"
                        className={styles.icon5}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.tableRow11}>
                <p className={styles.collectorEps}>CPU使用率</p>
                <div className={styles.tableCell11}>
                  <div className={styles.container51}>
                    <p className={styles.a24011W}>66.69 %</p>
                  </div>
                  <div className={styles.container52}>
                    <p className={styles.avg24011W}>Avg: 58.37 %</p>
                  </div>
                </div>
                <div className={styles.tableCell12}>
                  <div className={styles.container53}>
                    <p className={styles.a25411W}>65.42 %</p>
                  </div>
                  <div className={styles.container54}>
                    <p className={styles.avg271S}>Avg: 60.39 %</p>
                  </div>
                </div>
                <p className={styles.a30005W}>73.94 %</p>
                <p className={styles.a19}>▲ 1.9%</p>
                <div className={styles.container38}>
                  <p className={styles.text55}>水位健康</p>
                  <div className={styles.button3}>
                    <p className={styles.text56}>趋势</p>
                    <div className={styles.container37}>
                      <img
                        src="../image/mnb4677v-8k9xvh3.svg"
                        className={styles.icon5}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.tableRow12}>
                <p className={styles.collectorEps}>磁盘使用率</p>
                <div className={styles.tableCell11}>
                  <div className={styles.container51}>
                    <p className={styles.a24011W}>62.46 %</p>
                  </div>
                  <div className={styles.container52}>
                    <p className={styles.avg24011W}>Avg: 61.57 %</p>
                  </div>
                </div>
                <div className={styles.tableCell12}>
                  <div className={styles.container53}>
                    <p className={styles.a25411W}>63.42 %</p>
                  </div>
                  <div className={styles.container54}>
                    <p className={styles.avg271S}>Avg: 62.44 %</p>
                  </div>
                </div>
                <p className={styles.a30005W}>72.29 %</p>
                <p className={styles.a55}>▼ -1.5%</p>
                <div className={styles.container38}>
                  <p className={styles.text55}>水位健康</p>
                  <div className={styles.button3}>
                    <p className={styles.text56}>趋势</p>
                    <div className={styles.container37}>
                      <img
                        src="../image/mnb4677v-8k9xvh3.svg"
                        className={styles.icon5}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.tableRow13}>
                <div className={styles.tableCell13}>
                  <div className={styles.container55} />
                  <div className={styles.container56}>
                    <div className={styles.text63}>
                      <p className={styles.text62}>应用层</p>
                    </div>
                    <div className={styles.text64}>
                      <p className={styles.aPplication}>APPLICATION</p>
                    </div>
                  </div>
                </div>
                <p className={styles.text65}>监控延迟</p>
                <div className={styles.tableCell14}>
                  <div className={styles.container47}>
                    <p className={styles.a24011W}>9.55 s</p>
                  </div>
                  <div className={styles.container48}>
                    <p className={styles.avg24011W}>Avg: 9.55 s</p>
                  </div>
                </div>
                <div className={styles.tableCell15}>
                  <div className={styles.container53}>
                    <p className={styles.a25411W}>12.61 s</p>
                  </div>
                  <div className={styles.container54}>
                    <p className={styles.avg271S}>Avg: 12.61 s</p>
                  </div>
                </div>
                <p className={styles.a1298S}>12.98 s</p>
                <p className={styles.a243}>▼ -24.3%</p>
                <div className={styles.container57}>
                  <p className={styles.text55}>水位健康</p>
                  <div className={styles.button3}>
                    <p className={styles.text56}>趋势</p>
                    <div className={styles.container37}>
                      <img
                        src="../image/mnb4677v-8k9xvh3.svg"
                        className={styles.icon5}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.section4}>
        <div className={styles.container59}>
          <p className={styles.text}>四、云区域流量态势</p>
          <p className={styles.cloudRegionTrafficSi}>
            Cloud Region Traffic Situational Awareness
          </p>
        </div>
        <div className={styles.container107}>
          <div className={styles.container74}>
            <div className={styles.container72}>
              <div className={styles.container61}>
                <div className={styles.container60}>
                  <img
                    src="../image/mnb4677w-yvt9t83.svg"
                    className={styles.icon}
                  />
                </div>
                <div className={styles.heading3}>
                  <p className={styles.text2}>全网流量概览</p>
                </div>
              </div>
              <div className={styles.container66}>
                <p className={styles.text66}>纳管区域总数</p>
                <div className={styles.container62}>
                  <p className={styles.a15}>15</p>
                  <div className={styles.text68}>
                    <p className={styles.text67}>/ 云区域</p>
                  </div>
                </div>
                <div className={styles.container64}>
                  <div className={styles.container63}>
                    <div className={styles.text70}>
                      <p className={styles.text69}>南方集群</p>
                    </div>
                    <div className={styles.text72}>
                      <p className={styles.text71}>8 云区域</p>
                    </div>
                  </div>
                  <div className={styles.container63}>
                    <div className={styles.text70}>
                      <p className={styles.text69}>威新集群</p>
                    </div>
                    <div className={styles.text72}>
                      <p className={styles.text71}>7 云区域</p>
                    </div>
                  </div>
                </div>
                <div className={styles.container65} />
              </div>
              <div className={styles.container71}>
                <div className={styles.container68}>
                  <p className={styles.text73}>平均流量</p>
                  <div className={styles.container67}>
                    <div className={styles.text74}>
                      <p className={styles.a102}>1.02</p>
                    </div>
                    <div className={styles.text75}>
                      <p className={styles.mbps}>Mbps</p>
                    </div>
                  </div>
                </div>
                <div className={styles.container70}>
                  <p className={styles.text73}>峰值时间</p>
                  <div className={styles.container69}>
                    <p className={styles.a093100Cst2}>
                      <span className={styles.a093100Cst}>09:31:00&nbsp;</span>
                      <span className={styles.avg24011W}>CST</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.container73}>
              <div className={styles.text77}>
                <p className={styles.text76}>链路实时状态</p>
              </div>
              <div className={styles.text81}>
                <div className={styles.autoWrapper}>
                  <div className={styles.text78} />
                  <div className={styles.text79} />
                </div>
                <p className={styles.text80}>监控中</p>
              </div>
            </div>
          </div>
          <div className={styles.container106}>
            <div className={styles.container78}>
              <div className={styles.container77}>
                <p className={styles.text82}>区域流量 TOP 5</p>
                <p className={styles.regionalTrafficDistr}>
                  Regional Traffic Distribution
                </p>
                <div className={styles.container76}>
                  <div className={styles.container75}>
                    <div className={styles.button4}>
                      <p className={styles.text83}>威新中心</p>
                    </div>
                    <p className={styles.text84}>南方中心</p>
                  </div>
                </div>
              </div>
              <div className={styles.button5}>
                <p className={styles.text85}>查看完整列表</p>
                <img src="../image/mnb4677w-jz41ac5.svg" className={styles.icon6} />
              </div>
            </div>
            <div className={styles.container105}>
              <div className={styles.container86}>
                <div className={styles.container79}>
                  <p className={styles.rank}>Rank</p>
                  <p className={styles.a1}>1</p>
                </div>
                <div className={styles.container84}>
                  <div className={styles.container81}>
                    <div className={styles.text89}>
                      <p className={styles.text88}>
                        <span className={styles.text86}>
                          威新中心-交易内网&nbsp;
                        </span>
                        <span className={styles.text87}>（8 节点）</span>
                      </p>
                    </div>
                    <div className={styles.container80}>
                      <div className={styles.text90}>
                        <p className={styles.a39}>3.9</p>
                      </div>
                      <div className={styles.text91}>
                        <p className={styles.mbps}>/</p>
                      </div>
                      <div className={styles.text92}>
                        <p className={styles.mbps}>10.0 Gbps</p>
                      </div>
                    </div>
                  </div>
                  <div className={styles.container83}>
                    <div className={styles.container82} />
                  </div>
                </div>
                <div className={styles.container85}>
                  <div className={styles.text95}>
                    <div className={styles.text93} />
                    <p className={styles.text94}>正常</p>
                  </div>
                </div>
              </div>
              <div className={styles.container92}>
                <div className={styles.container87}>
                  <p className={styles.rank}>Rank</p>
                  <div className={styles.text96}>
                    <p className={styles.a2}>2</p>
                  </div>
                </div>
                <div className={styles.container91}>
                  <div className={styles.container88}>
                    <div className={styles.text97}>
                      <p className={styles.text88}>
                        <span className={styles.text86}>
                          威新中心-交易DMZ&nbsp;
                        </span>
                        <span className={styles.text87}>（6 节点）</span>
                      </p>
                    </div>
                    <div className={styles.container80}>
                      <div className={styles.text90}>
                        <p className={styles.a39}>1.7</p>
                      </div>
                      <div className={styles.text91}>
                        <p className={styles.mbps}>/</p>
                      </div>
                      <div className={styles.text92}>
                        <p className={styles.mbps}>10.0 Gbps</p>
                      </div>
                    </div>
                  </div>
                  <div className={styles.container90}>
                    <div className={styles.container89} />
                  </div>
                </div>
                <div className={styles.container85}>
                  <div className={styles.text95}>
                    <div className={styles.text93} />
                    <p className={styles.text94}>正常</p>
                  </div>
                </div>
              </div>
              <div className={styles.container96}>
                <div className={styles.container87}>
                  <p className={styles.rank}>Rank</p>
                  <div className={styles.text96}>
                    <p className={styles.a2}>3</p>
                  </div>
                </div>
                <div className={styles.container95}>
                  <div className={styles.container88}>
                    <div className={styles.text97}>
                      <p className={styles.text88}>
                        <span className={styles.text86}>
                          威新中心-管理DMZ&nbsp;
                        </span>
                        <span className={styles.text87}>（2 节点）</span>
                      </p>
                    </div>
                    <div className={styles.container80}>
                      <div className={styles.text90}>
                        <p className={styles.a39}>1.5</p>
                      </div>
                      <div className={styles.text91}>
                        <p className={styles.mbps}>/</p>
                      </div>
                      <div className={styles.text92}>
                        <p className={styles.mbps}>10.0 Gbps</p>
                      </div>
                    </div>
                  </div>
                  <div className={styles.container94}>
                    <div className={styles.container93} />
                  </div>
                </div>
                <div className={styles.container85}>
                  <div className={styles.text95}>
                    <div className={styles.text93} />
                    <p className={styles.text94}>正常</p>
                  </div>
                </div>
              </div>
              <div className={styles.container100}>
                <div className={styles.container87}>
                  <p className={styles.rank}>Rank</p>
                  <div className={styles.text96}>
                    <p className={styles.a2}>4</p>
                  </div>
                </div>
                <div className={styles.container99}>
                  <div className={styles.container81}>
                    <div className={styles.text89}>
                      <p className={styles.text88}>
                        <span className={styles.text86}>
                          威新中心-信创内网&nbsp;
                        </span>
                        <span className={styles.text87}>（2 节点）</span>
                      </p>
                    </div>
                    <div className={styles.container80}>
                      <div className={styles.text90}>
                        <p className={styles.a39}>1.1</p>
                      </div>
                      <div className={styles.text91}>
                        <p className={styles.mbps}>/</p>
                      </div>
                      <div className={styles.text92}>
                        <p className={styles.mbps}>10.0 Gbps</p>
                      </div>
                    </div>
                  </div>
                  <div className={styles.container98}>
                    <div className={styles.container97} />
                  </div>
                </div>
                <div className={styles.container85}>
                  <div className={styles.text95}>
                    <div className={styles.text93} />
                    <p className={styles.text94}>正常</p>
                  </div>
                </div>
              </div>
              <div className={styles.container104}>
                <div className={styles.container87}>
                  <p className={styles.rank}>Rank</p>
                  <div className={styles.text96}>
                    <p className={styles.a2}>5</p>
                  </div>
                </div>
                <div className={styles.container103}>
                  <div className={styles.container101}>
                    <div className={styles.text98}>
                      <p className={styles.text88}>
                        <span className={styles.text86}>威新中心-托管云&nbsp;</span>
                        <span className={styles.text87}>（2 节点）</span>
                      </p>
                    </div>
                    <div className={styles.container80}>
                      <div className={styles.text90}>
                        <p className={styles.a39}>0.1</p>
                      </div>
                      <div className={styles.text91}>
                        <p className={styles.mbps}>/</p>
                      </div>
                      <div className={styles.text92}>
                        <p className={styles.mbps}>10.0 Gbps</p>
                      </div>
                    </div>
                  </div>
                  <div className={styles.container102}>
                    <div className={styles.container97} />
                  </div>
                </div>
                <div className={styles.container85}>
                  <div className={styles.text95}>
                    <div className={styles.text93} />
                    <p className={styles.text94}>正常</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.section5}>
        <div className={styles.container108}>
          <p className={styles.text99}>五、评估与计划</p>
          <p className={styles.assessmentPlanning}>Assessment & Planning</p>
        </div>
        <div className={styles.container130}>
          <div className={styles.container119}>
            <div className={styles.container109}>
              <div className={styles.container2}>
                <img src="../image/mnb4677w-ozp70ov.svg" className={styles.icon} />
              </div>
              <div className={styles.heading3}>
                <p className={styles.text2}>核心评估</p>
              </div>
            </div>
            <div className={styles.container116}>
              <div className={styles.container111}>
                <p className={styles.text100}>1. 运行评估:</p>
                <div className={styles.container110}>
                  <div className={styles.text101}>
                    <p className={styles.a}>•</p>
                  </div>
                  <div className={styles.paragraph6}>
                    <p className={styles.text8}>
                      所有核心指标运行平稳，资源水位健康，
                    </p>
                    <div className={styles.text103}>
                      <p className={styles.text102}>暂无需扩容</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.container113}>
                <p className={styles.text100}>2. 容量预警:</p>
                <div className={styles.container112}>
                  <div className={styles.text101}>
                    <p className={styles.a}>•</p>
                  </div>
                  <div className={styles.paragraph7}>
                    <p className={styles.text105}>
                      <span className={styles.text8}>
                        威新集群
                        CPU使用率峰值为66.7%，接近安全水位值（80.0）的83.4%，占历史峰值的90.2%，建议升级至&nbsp;
                      </span>
                      <span className={styles.text104}>
                        更高配置或新增服务器资源
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <div className={styles.container115}>
                <p className={styles.text100}>3. 趋势分析:</p>
                <div className={styles.container114}>
                  <div className={styles.text101}>
                    <p className={styles.a}>•</p>
                  </div>
                  <div className={styles.paragraph8}>
                    <p className={styles.text8}>
                      建议持续关注资源使用趋势，提前规划容量扩充。
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.container118}>
              <div className={styles.container117}>
                <div className={styles.container9}>
                  <img
                    src="../image/mnb4677w-ionutjo.svg"
                    className={styles.icon2}
                  />
                </div>
                <p className={styles.text10}>智能洞察</p>
              </div>
              <div className={styles.paragraph9}>
                <p className={styles.text11}>
                  各架构层级健康度良好，同比指标多数改善，系统在业务高峰期承载能力稳定。
                </p>
              </div>
              <div className={styles.button}>
                <img src="../image/mnb4677v-nzkcu9o.svg" className={styles.icon3} />
                <p className={styles.text12}>查看推理过程</p>
              </div>
            </div>
          </div>
          <div className={styles.container129}>
            <div className={styles.container120}>
              <div className={styles.container2}>
                <img src="../image/mnb4677w-2v7mlka.svg" className={styles.icon} />
              </div>
              <div className={styles.heading3}>
                <p className={styles.text2}>下一步计划</p>
              </div>
            </div>
            <div className={styles.container126}>
              <div className={styles.container121}>
                <div className={styles.text106}>
                  <p className={styles.p1}>P1</p>
                </div>
              </div>
              <div className={styles.container125}>
                <div className={styles.container122}>
                  <div className={styles.text101}>
                    <p className={styles.a}>•</p>
                  </div>
                  <div className={styles.paragraph10}>
                    <p className={styles.text107}>
                      复盘南方集群Collector EPS的今日峰值（2277915.00
                      eps）占历史峰值 93.9% 的详情。
                    </p>
                  </div>
                </div>
                <div className={styles.container123}>
                  <div className={styles.text101}>
                    <p className={styles.a}>•</p>
                  </div>
                  <p className={styles.text108}>
                    复盘南方集群Kafka写入流量的今日峰值（6.04 Gb/s）占历史峰值 95.1%
                    的详情。
                  </p>
                </div>
                <div className={styles.container124}>
                  <div className={styles.text101}>
                    <p className={styles.a}>•</p>
                  </div>
                  <p className={styles.text109}>
                    复盘威新集群CPU使用率的今日峰值（66.69 %）占历史峰值 90.2%
                    的详情。
                  </p>
                </div>
              </div>
            </div>
            <div className={styles.container128}>
              <div className={styles.container127}>
                <div className={styles.container9}>
                  <img
                    src="../image/mnb4677w-2rbqqoz.svg"
                    className={styles.icon2}
                  />
                </div>
                <p className={styles.text10}>智能洞察</p>
              </div>
              <div className={styles.paragraph11}>
                <p className={styles.text11}>
                  建议优先监控磁盘使用率趋势，并优化存储层资源配置，维持预防性运维。
                </p>
              </div>
              <div className={styles.button}>
                <img src="../image/mnb4677v-nzkcu9o.svg" className={styles.icon3} />
                <p className={styles.text12}>查看推理过程</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Component;
