import React from 'react';
import { Card, Form, Input, Select, DatePicker, Button, Table, Tag, Space } from 'antd';
import { SearchOutlined, ReloadOutlined, DownloadOutlined } from '@ant-design/icons';
import styles from './LogQuery.module.scss';

const { RangePicker } = DatePicker;

const mockData = [
  {
    id: '1',
    timestamp: '2026-03-27 10:30:45',
    level: 'INFO',
    source: '威新中心-交易内网',
    cluster: 'WX',
    message: '日志入库成功，耗时 14ms',
    count: 1250,
  },
  {
    id: '2',
    timestamp: '2026-03-27 10:30:40',
    level: 'WARN',
    source: '南方中心-交易DMZ',
    cluster: 'NF',
    message: 'CPU使用率接近阈值警告，当前 78%',
    count: 1,
  },
  {
    id: '3',
    timestamp: '2026-03-27 10:30:35',
    level: 'ERROR',
    source: '威新中心-管理DMZ',
    cluster: 'WX',
    message: '连接超时，重试第 3 次',
    count: 5,
  },
  {
    id: '4',
    timestamp: '2026-03-27 10:30:30',
    level: 'INFO',
    source: '南方中心-交易内网',
    cluster: 'NF',
    message: 'EPS峰值达到 227w',
    count: 1,
  },
  {
    id: '5',
    timestamp: '2026-03-27 10:30:25',
    level: 'DEBUG',
    source: '威新中心-信创内网',
    cluster: 'WX',
    message: '健康检查通过',
    count: 100,
  },
];

const LogQuery: React.FC = () => {
  const columns = [
    {
      title: '时间戳',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 180,
      render: (text: string) => <span className={styles.timestamp}>{text}</span>,
    },
    {
      title: '级别',
      dataIndex: 'level',
      key: 'level',
      width: 100,
      render: (level: string) => {
        const colorMap: Record<string, string> = {
          INFO: 'blue',
          WARN: 'orange',
          ERROR: 'red',
          DEBUG: 'default',
        };
        return <Tag color={colorMap[level]}>{level}</Tag>;
      },
    },
    {
      title: '来源',
      dataIndex: 'source',
      key: 'source',
      width: 180,
    },
    {
      title: '集群',
      dataIndex: 'cluster',
      key: 'cluster',
      width: 80,
      render: (cluster: string) => (
        <Tag color={cluster === 'WX' ? 'purple' : 'cyan'}>
          {cluster}
        </Tag>
      ),
    },
    {
      title: '消息',
      dataIndex: 'message',
      key: 'message',
      ellipsis: true,
    },
    {
      title: '次数',
      dataIndex: 'count',
      key: 'count',
      width: 80,
      render: (count: number) => <span className={styles.count}>{count}</span>,
    },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h2>日志查询</h2>
        <span className={styles.subtitle}>Log Query</span>
      </div>

      <Card className={styles.filterCard}>
        <Form layout="inline" className={styles.filterForm}>
          <Form.Item label="时间范围">
            <RangePicker showTime style={{ width: 380 }} />
          </Form.Item>
          <Form.Item label="日志级别">
            <Select style={{ width: 120 }} placeholder="全部" allowClear>
              <Select.Option value="INFO">INFO</Select.Option>
              <Select.Option value="WARN">WARN</Select.Option>
              <Select.Option value="ERROR">ERROR</Select.Option>
              <Select.Option value="DEBUG">DEBUG</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="集群">
            <Select style={{ width: 120 }} placeholder="全部" allowClear>
              <Select.Option value="WX">威新集群</Select.Option>
              <Select.Option value="NF">南方集群</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="来源">
            <Input placeholder="输入来源关键词" style={{ width: 200 }} />
          </Form.Item>
          <Form.Item label="关键词">
            <Input placeholder="输入搜索关键词" style={{ width: 200 }} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" icon={<SearchOutlined />}>
                查询
              </Button>
              <Button icon={<ReloadOutlined />}>
                重置
              </Button>
              <Button icon={<DownloadOutlined />}>
                导出
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      <Card className={styles.tableCard}>
        <Table
          columns={columns}
          dataSource={mockData}
          rowKey="id"
          pagination={{
            total: 100,
            pageSize: 20,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>
    </div>
  );
};

export default LogQuery;
