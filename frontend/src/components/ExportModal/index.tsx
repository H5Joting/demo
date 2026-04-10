import React, { useMemo, useState } from 'react';
import { Modal, Button, message } from 'antd';
import { DownloadOutlined, CloseOutlined, CopyOutlined, CheckOutlined } from '@ant-design/icons';
import { ExportJSON } from '@/types';
import styles from './ExportModal.module.scss';

interface ExportModalProps {
  visible: boolean;
  data: ExportJSON | null;
  onClose: () => void;
}

const ExportModal: React.FC<ExportModalProps> = ({ visible, data, onClose }) => {
  const [copied, setCopied] = useState(false);

  const formattedJson = useMemo(() => {
    if (!data) return '';
    return JSON.stringify(data, null, 2);
  }, [data]);

  const handleCopy = async () => {
    if (!formattedJson) return;

    try {
      await navigator.clipboard.writeText(formattedJson);
      setCopied(true);
      message.success('已复制到剪贴板');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      message.error('复制失败，请手动选择复制');
    }
  };

  const handleDownload = () => {
    if (!data) return;

    const blob = new Blob([formattedJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `export-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const dashboard = data?.dashboard;
  const panels = dashboard?.panels || [];
  const panelTypes: Record<string, number> = {};
  
  panels?.forEach(panel => {
    const type = panel.type;
    panelTypes[type] = (panelTypes[type] || 0) + 1;
  });

  const panelTypeList = Object.entries(panelTypes).map(([type, count]) => (
    <div key={type} style={{ marginBottom: '4px 0' }}>
      <span className={styles.panelTypeTag}>{type}</span>
      <span className={styles.panelCount}>{count}</span>
    </div>
  ));

  return (
    <Modal
      open={visible}
      title="导出预览"
      onCancel={onClose}
      width={720}
      footer={[
        <Button key="close" onClick={onClose} icon={<CloseOutlined />}>
          关闭
        </Button>,
        <Button
          key="copy"
          icon={copied ? <CheckOutlined /> : <CopyOutlined />}
          onClick={handleCopy}
          disabled={!data}
        >
          {copied ? '已复制' : '复制 JSON'}
        </Button>,
        <Button
          key="download"
          type="primary"
          icon={<DownloadOutlined />}
          onClick={handleDownload}
          disabled={!data}
        >
          下载 JSON
        </Button>,
      ]}
    >
      <div className={styles.jsonPreview}>
        <pre className={styles.preHeader}>
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
        
        <div className={styles.panelStats}>
          <h4>面板配置统计</h4>
          {panelTypeList}
        </div>
      </div>
    </Modal>
  );
};

export default ExportModal;
