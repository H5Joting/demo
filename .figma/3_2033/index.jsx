import React from 'react';

import styles from './index.module.scss';

const Component = () => {
  return (
    <div className={styles.section}>
      <div className={styles.container}>
        <p className={styles.text}>五、评估与计划</p>
        <p className={styles.assessmentPlanning}>Assessment & Planning</p>
      </div>
      <div className={styles.container25}>
        <div className={styles.container14}>
          <div className={styles.container3}>
            <div className={styles.container2}>
              <img src="../image/mnb6voun-eql98j8.svg" className={styles.icon} />
            </div>
            <div className={styles.heading3}>
              <p className={styles.text2}>核心评估</p>
            </div>
          </div>
          <div className={styles.container10}>
            <div className={styles.container5}>
              <p className={styles.text3}>1. 运行评估:</p>
              <div className={styles.container4}>
                <div className={styles.text4}>
                  <p className={styles.a}>•</p>
                </div>
                <div className={styles.paragraph}>
                  <p className={styles.text5}>
                    所有核心指标运行平稳，资源水位健康，
                  </p>
                  <div className={styles.text7}>
                    <p className={styles.text6}>暂无需扩容</p>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.container7}>
              <p className={styles.text3}>2. 容量预警:</p>
              <div className={styles.container6}>
                <div className={styles.text4}>
                  <p className={styles.a}>•</p>
                </div>
                <div className={styles.paragraph2}>
                  <p className={styles.text9}>
                    <span className={styles.text5}>
                      威新集群
                      CPU使用率峰值为66.7%，接近安全水位值（80.0）的83.4%，占历史峰值的90.2%，建议升级至&nbsp;
                    </span>
                    <span className={styles.text8}>更高配置或新增服务器资源</span>
                  </p>
                </div>
              </div>
            </div>
            <div className={styles.container9}>
              <p className={styles.text3}>3. 趋势分析:</p>
              <div className={styles.container8}>
                <div className={styles.text4}>
                  <p className={styles.a}>•</p>
                </div>
                <div className={styles.paragraph3}>
                  <p className={styles.text5}>
                    建议持续关注资源使用趋势，提前规划容量扩充。
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.container13}>
            <div className={styles.container12}>
              <div className={styles.container11}>
                <img src="../image/mnb6voun-xwq3mdz.svg" className={styles.icon2} />
              </div>
              <p className={styles.text10}>智能洞察</p>
            </div>
            <div className={styles.paragraph4}>
              <p className={styles.text11}>
                各架构层级健康度良好，同比指标多数改善，系统在业务高峰期承载能力稳定。
              </p>
            </div>
            <div className={styles.button}>
              <img src="../image/mnb6voun-sxh7wcz.svg" className={styles.icon3} />
              <p className={styles.text12}>查看推理过程</p>
            </div>
          </div>
        </div>
        <div className={styles.container24}>
          <div className={styles.container15}>
            <div className={styles.container2}>
              <img src="../image/mnb6voun-gaob0tv.svg" className={styles.icon} />
            </div>
            <div className={styles.heading3}>
              <p className={styles.text2}>下一步计划</p>
            </div>
          </div>
          <div className={styles.container21}>
            <div className={styles.container16}>
              <div className={styles.text13}>
                <p className={styles.p1}>P1</p>
              </div>
            </div>
            <div className={styles.container20}>
              <div className={styles.container17}>
                <div className={styles.text4}>
                  <p className={styles.a}>•</p>
                </div>
                <div className={styles.paragraph5}>
                  <p className={styles.text14}>
                    复盘南方集群Collector EPS的今日峰值（2277915.00 eps）占历史峰值
                    93.9% 的详情。
                  </p>
                </div>
              </div>
              <div className={styles.container18}>
                <div className={styles.text4}>
                  <p className={styles.a}>•</p>
                </div>
                <p className={styles.text15}>
                  复盘南方集群Kafka写入流量的今日峰值（6.04 Gb/s）占历史峰值 95.1%
                  的详情。
                </p>
              </div>
              <div className={styles.container19}>
                <div className={styles.text4}>
                  <p className={styles.a}>•</p>
                </div>
                <p className={styles.text16}>
                  复盘威新集群CPU使用率的今日峰值（66.69 %）占历史峰值 90.2%
                  的详情。
                </p>
              </div>
            </div>
          </div>
          <div className={styles.container23}>
            <div className={styles.container22}>
              <div className={styles.container11}>
                <img src="../image/mnb6voun-r7gxkrx.svg" className={styles.icon2} />
              </div>
              <p className={styles.text10}>智能洞察</p>
            </div>
            <div className={styles.paragraph6}>
              <p className={styles.text11}>
                建议优先监控磁盘使用率趋势，并优化存储层资源配置，维持预防性运维。
              </p>
            </div>
            <div className={styles.button}>
              <img src="../image/mnb6voun-sxh7wcz.svg" className={styles.icon3} />
              <p className={styles.text12}>查看推理过程</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Component;
