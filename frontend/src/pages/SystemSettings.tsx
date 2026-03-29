import React from 'react';
import { Card, Form, Input, Select, Button, Switch, Divider, message } from 'antd';
import styles from './SystemSettings.module.scss';

const { Option } = Select;

const SystemSettings: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Settings saved:', values);
    message.success('设置保存成功');
  };

  return (
    <div className={styles.container}>
    <div className={styles.header}>
      <div>
        <h2 className={styles.title}>系统设置</h2>
        <span className={styles.subtitle}>System Settings</span>
      </div>
    </div>

    <div className={styles.content}>
      <Card className={styles.settingsCard}>
        <h3 className={styles.sectionTitle}>基础配置</h3>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            systemName: '统一日志中心',
            logRetention: '30',
            alertThreshold: '80',
          }}
        >
          <div className={styles.formRow}>
            <Form.Item label="系统名称" name="systemName" className={styles.formItem}>
              <Input placeholder="请输入系统名称" />
            </Form.Item>
            <Form.Item label="日志保留天数" name="logRetention" className={styles.formItem}>
              <Select>
                <Option value="7">7 天</Option>
                <Option value="14">14 天</Option>
                <Option value="30">30 天</Option>
                <Option value="60">60 天</Option>
                <Option value="90">90 天</Option>
              </Select>
            </Form.Item>
          </div>

          <Divider />

          <h3 className={styles.sectionTitle}>告警配置</h3>
          <div className={styles.formRow}>
            <Form.Item label="CPU使用率告警阈值 (%)" name="cpuThreshold" className={styles.formItem}>
              <Input type="number" placeholder="80" />
            </Form.Item>
            <Form.Item label="磁盘使用率告警阈值 (%)" name="diskThreshold" className={styles.formItem}>
              <Input type="number" placeholder="85" />
            </Form.Item>
          </div>

          <Divider />

          <h3 className={styles.sectionTitle}>功能开关</h3>
          <div className={styles.switchRow}>
            <div className={styles.switchItem}>
              <span>智能巡检</span>
              <Switch defaultChecked />
            </div>
            <div className={styles.switchItem}>
              <span>自动生成报告</span>
              <Switch defaultChecked />
            </div>
            <div className={styles.switchItem}>
              <span>实时监控</span>
              <Switch defaultChecked />
            </div>
            <div className={styles.switchItem}>
              <span>异常告警</span>
              <Switch defaultChecked />
            </div>
          </div>

          <Divider />

          <h3 className={styles.sectionTitle}>通知配置</h3>
          <div className={styles.formRow}>
            <Form.Item label="告警邮箱" name="alertEmail" className={styles.formItem}>
              <Input placeholder="admin@example.com" />
            </Form.Item>
            <Form.Item label="告警手机" name="alertPhone" className={styles.formItem}>
              <Input placeholder="13800138000" />
            </Form.Item>
          </div>

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large">
              保存设置
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
    </div>
  );
};

export default SystemSettings;
