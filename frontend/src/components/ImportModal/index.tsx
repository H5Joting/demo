import React, { useState } from 'react';
import { Modal, Upload, message, Progress, Input, Button, Radio, Space, Alert, Typography } from 'antd';
import { InboxOutlined, CheckCircleOutlined, CloseCircleOutlined, FileTextOutlined, EditOutlined, WarningOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import styles from './ImportModal.module.scss';

const { Dragger } = Upload;
const { TextArea } = Input;
const { Text } = Typography;

interface ImportModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: (data: Record<string, unknown>, mode: 'created' | 'updated') => void;
}

interface UploadState {
  status: 'idle' | 'uploading' | 'success' | 'error' | 'confirm';
  progress: number;
  errorMessage?: string;
  fileName?: string;
}

type ImportMode = 'file' | 'paste';

type ImportAction = 'create' | 'update' | 'auto';

interface ParsedImportData {
  __meta?: {
    exported_at: string;
    exporter_version: string;
    schema_version?: number;
  };
  uid?: string;
  overwrite?: boolean;
  dashboard?: {
    uid?: string;
    title?: string;
    description?: string;
    panels?: any[];
    clusters?: {
      wx_cluster: { name: string; name_en: string; type: 'wx' | 'nf'; description?: string } | null;
      nf_cluster: { name: string; name_en: string; type: 'wx' | 'nf'; description?: string } | null;
    };
    [key: string]: any;
  };
  report?: {
    title: string;
    description: string;
    code: string;
    status: 'active' | 'inactive';
    tags?: string[];
  };
  business_system?: {
    name: string;
    code: string;
    description: string;
    status: 'active' | 'inactive';
  };
  clusters?: {
    wx_cluster: { name: string; name_en: string; type: 'wx' | 'nf'; description?: string } | null;
    nf_cluster: { name: string; name_en: string; type: 'wx' | 'nf'; description?: string } | null;
  };
  metrics?: {
    metric_name: string;
    metric_name_en: string;
    layer: string;
    unit: string;
    sla_threshold: number;
  }[];
  panels?: {
    type: string;
    title: string;
    description?: string;
    visible: boolean;
    order: number;
  }[];
}

const ImportModal: React.FC<ImportModalProps> = ({ visible, onClose, onSuccess }) => {
  const [importMode, setImportMode] = useState<ImportMode>('file');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [jsonText, setJsonText] = useState('');
  const [uploadState, setUploadState] = useState<UploadState>({
    status: 'idle',
    progress: 0,
  });
  const [importAction, setImportAction] = useState<ImportAction>('auto');
  const [parsedData, setParsedData] = useState<ParsedImportData | null>(null);

  const validateJson = (content: string): ParsedImportData => {
    try {
      const json = JSON.parse(content);
      if (typeof json !== 'object' || json === null) {
        throw new Error('JSON 内容必须是一个对象');
      }
      
      const dashboard = json.dashboard || json;
      const reportData = dashboard.report || json.report || dashboard.business_system || json.business_system || {};
      const reportTitle = dashboard.title || reportData.title || reportData.name;
      
      if (!reportTitle) {
        throw new Error('缺少必需字段：dashboard.title 或 report.title');
      }
      
      const clusters = dashboard.clusters || json.clusters;
      if (!clusters) {
        throw new Error('缺少必需字段：clusters');
      }
      return json as ParsedImportData;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('无效的 JSON 格式');
    }
  };

  const validateJsonFile = (file: File): Promise<ParsedImportData> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const json = validateJson(content);
          resolve(json);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => {
        reject(new Error('文件读取失败'));
      };
      
      reader.readAsText(file);
    });
  };

  const hasUid = (data: ParsedImportData): boolean => {
    const dashboard = data.dashboard || data;
    return !!(data.uid || (dashboard as any).uid);
  };

  const handleUpload = async (file: File) => {
    setUploadState({
      status: 'uploading',
      progress: 0,
      fileName: file.name,
    });

    try {
      setUploadState(prev => ({ ...prev, progress: 30 }));

      await new Promise(resolve => setTimeout(resolve, 300));

      setUploadState(prev => ({ ...prev, progress: 60 }));

      const jsonData = await validateJsonFile(file);

      setUploadState(prev => ({ ...prev, progress: 90 }));

      await new Promise(resolve => setTimeout(resolve, 200));

      setParsedData(jsonData);

      if (hasUid(jsonData) && importAction === 'auto') {
        setUploadState({
          status: 'confirm',
          progress: 100,
          fileName: file.name,
        });
      } else {
        setUploadState({
          status: 'success',
          progress: 100,
          fileName: file.name,
        });
        message.success('文件解析成功！');
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '导入失败，请重试';
      setUploadState({
        status: 'error',
        progress: 0,
        errorMessage,
        fileName: file.name,
      });
      message.error(errorMessage);
    }
  };

  const handlePasteImport = async () => {
    if (!jsonText.trim()) {
      message.warning('请输入 JSON 内容');
      return;
    }

    setUploadState({
      status: 'uploading',
      progress: 0,
      fileName: '粘贴的 JSON',
    });

    try {
      setUploadState(prev => ({ ...prev, progress: 30 }));

      await new Promise(resolve => setTimeout(resolve, 200));

      setUploadState(prev => ({ ...prev, progress: 60 }));

      const jsonData = validateJson(jsonText);

      setUploadState(prev => ({ ...prev, progress: 90 }));

      await new Promise(resolve => setTimeout(resolve, 200));

      setParsedData(jsonData);

      if (hasUid(jsonData) && importAction === 'auto') {
        setUploadState({
          status: 'confirm',
          progress: 100,
          fileName: '粘贴的 JSON',
        });
      } else {
        setUploadState({
          status: 'success',
          progress: 100,
          fileName: '粘贴的 JSON',
        });
        message.success('解析成功！');
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '导入失败，请检查 JSON 格式';
      setUploadState({
        status: 'error',
        progress: 0,
        errorMessage,
        fileName: '粘贴的 JSON',
      });
      message.error(errorMessage);
    }
  };

  const handleConfirmImport = () => {
    if (!parsedData) return;
    
    const finalData = { ...parsedData };
    const dashboard = finalData.dashboard || finalData;
    const uid = (dashboard as any).uid || finalData.uid;
    
    if (importAction === 'create') {
      if (finalData.dashboard) {
        finalData.dashboard = { ...finalData.dashboard, uid: undefined };
      }
      delete finalData.uid;
      finalData.overwrite = false;
    } else if (importAction === 'update') {
      if (uid && finalData.dashboard) {
        finalData.dashboard = { ...finalData.dashboard, uid };
      }
      finalData.overwrite = true;
    } else {
      if (finalData.dashboard) {
        finalData.dashboard = { ...finalData.dashboard, uid: undefined };
      }
      delete finalData.uid;
      finalData.overwrite = false;
    }

    const mode = importAction === 'update' ? 'updated' : 'created';
    onSuccess(finalData, mode);
    handleClose();
  };

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: false,
    accept: '.json,application/json',
    fileList,
    beforeUpload: (file) => {
      const isJson = file.type === 'application/json' || file.name.endsWith('.json');
      if (!isJson) {
        message.error('只能上传 JSON 文件！');
        return false;
      }

      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error('文件大小不能超过 10MB！');
        return false;
      }

      setFileList([file as unknown as UploadFile]);
      handleUpload(file);
      return false;
    },
    onRemove: () => {
      setFileList([]);
      setParsedData(null);
      setUploadState({
        status: 'idle',
        progress: 0,
      });
    },
    showUploadList: false,
  };

  const handleClose = () => {
    setFileList([]);
    setJsonText('');
    setParsedData(null);
    setUploadState({
      status: 'idle',
      progress: 0,
    });
    setImportAction('auto');
    onClose();
  };

  const handleModeChange = (mode: ImportMode) => {
    setImportMode(mode);
    setParsedData(null);
    setUploadState({
      status: 'idle',
      progress: 0,
    });
  };

  const renderUidInfo = () => {
    if (!parsedData) return null;

    const dashboard = parsedData.dashboard || parsedData;
    const reportData = dashboard.report || parsedData.report || dashboard.business_system || parsedData.business_system || {};
    const reportTitle = (dashboard as any).title || (reportData as any).title || (reportData as any).name || '未知报表';
    const uid = (dashboard as any).uid || parsedData.uid;

    return (
      <div className={styles.uidInfo}>
        <Alert
          type="info"
          showIcon
          message={
            <Space direction="vertical" size="small">
              <Text strong>检测到报表: {reportTitle}</Text>
              {uid && <Text type="secondary">UID: {uid}</Text>}
              <Text type="secondary">
                该 JSON 包含报表配置，请选择导入方式：
              </Text>
            </Space>
          }
        />
        <Radio.Group 
          value={importAction} 
          onChange={(e) => setImportAction(e.target.value)}
          className={styles.actionGroup}
        >
          <Space direction="vertical" style={{ width: '100%' }}>
            <Radio value="create">
              <Space direction="vertical" size={0}>
                <Text strong>创建新副本</Text>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  删除 UID，创建一个全新的报表副本
                </Text>
              </Space>
            </Radio>
            <Radio value="update">
              <Space direction="vertical" size={0}>
                <Text strong>覆盖更新</Text>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  保留 UID，更新现有报表内容
                </Text>
              </Space>
            </Radio>
          </Space>
        </Radio.Group>
        <Button 
          type="primary" 
          block 
          onClick={handleConfirmImport}
          className={styles.confirmButton}
        >
          确认导入
        </Button>
      </div>
    );
  };

  const renderUploadArea = () => {
    if (uploadState.status === 'idle') {
      return (
        <Dragger {...uploadProps} className={styles.dragger}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined className={styles.uploadIcon} />
          </p>
          <p className={styles.uploadText}>点击或拖拽文件到此区域上传</p>
          <p className={styles.uploadHint}>支持 .json 格式文件，文件大小不超过 10MB</p>
        </Dragger>
      );
    }

    if (uploadState.status === 'uploading') {
      return (
        <div className={styles.progressContainer}>
          <div className={styles.fileName}>{uploadState.fileName}</div>
          <Progress 
            percent={uploadState.progress} 
            status="active"
            strokeColor={{
              '0%': '#155dfc',
              '100%': '#1249d6',
            }}
          />
          <p className={styles.progressText}>正在解析文件...</p>
        </div>
      );
    }

    if (uploadState.status === 'confirm') {
      return (
        <div className={styles.resultContainer}>
          <WarningOutlined className={styles.warningIcon} />
          <div className={styles.fileName}>{uploadState.fileName}</div>
          {renderUidInfo()}
        </div>
      );
    }

    if (uploadState.status === 'success') {
      return (
        <div className={styles.resultContainer}>
          <CheckCircleOutlined className={styles.successIcon} />
          <div className={styles.fileName}>{uploadState.fileName}</div>
          <p className={styles.successText}>文件解析成功！</p>
          <Button 
            type="primary" 
            onClick={handleConfirmImport}
            className={styles.confirmButton}
          >
            确认导入
          </Button>
        </div>
      );
    }

    if (uploadState.status === 'error') {
      return (
        <div className={styles.resultContainer}>
          <CloseCircleOutlined className={styles.errorIcon} />
          <div className={styles.fileName}>{uploadState.fileName}</div>
          <p className={styles.errorText}>{uploadState.errorMessage}</p>
          <button 
            className={styles.retryButton}
            onClick={() => {
              setFileList([]);
              setParsedData(null);
              setUploadState({
                status: 'idle',
                progress: 0,
              });
            }}
          >
            重新上传
          </button>
        </div>
      );
    }

    return null;
  };

  const renderPasteArea = () => {
    if (uploadState.status === 'idle') {
      return (
        <div className={styles.pasteContainer}>
          <TextArea
            className={styles.textArea}
            placeholder="请粘贴 JSON 内容..."
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            rows={10}
          />
          <Button
            type="primary"
            className={styles.importButton}
            onClick={handlePasteImport}
            disabled={!jsonText.trim()}
          >
            解析 JSON
          </Button>
        </div>
      );
    }

    if (uploadState.status === 'uploading') {
      return (
        <div className={styles.progressContainer}>
          <div className={styles.fileName}>{uploadState.fileName}</div>
          <Progress 
            percent={uploadState.progress} 
            status="active"
            strokeColor={{
              '0%': '#155dfc',
              '100%': '#1249d6',
            }}
          />
          <p className={styles.progressText}>正在解析...</p>
        </div>
      );
    }

    if (uploadState.status === 'confirm') {
      return (
        <div className={styles.resultContainer}>
          <WarningOutlined className={styles.warningIcon} />
          <div className={styles.fileName}>{uploadState.fileName}</div>
          {renderUidInfo()}
        </div>
      );
    }

    if (uploadState.status === 'success') {
      return (
        <div className={styles.resultContainer}>
          <CheckCircleOutlined className={styles.successIcon} />
          <div className={styles.fileName}>{uploadState.fileName}</div>
          <p className={styles.successText}>解析成功！</p>
          <Button 
            type="primary" 
            onClick={handleConfirmImport}
            className={styles.confirmButton}
          >
            确认导入
          </Button>
        </div>
      );
    }

    if (uploadState.status === 'error') {
      return (
        <div className={styles.resultContainer}>
          <CloseCircleOutlined className={styles.errorIcon} />
          <div className={styles.fileName}>{uploadState.fileName}</div>
          <p className={styles.errorText}>{uploadState.errorMessage}</p>
          <button 
            className={styles.retryButton}
            onClick={() => {
              setParsedData(null);
              setUploadState({
                status: 'idle',
                progress: 0,
              });
            }}
          >
            重新导入
          </button>
        </div>
      );
    }

    return null;
  };

  return (
    <Modal
      open={visible}
      title="导入报表"
      onCancel={handleClose}
      width={600}
      footer={null}
      className={styles.modal}
      centered
      destroyOnHidden
    >
      <div className={styles.container}>
        <div className={styles.modeTabs}>
          <button
            className={`${styles.modeTab} ${importMode === 'file' ? styles.modeTabActive : ''}`}
            onClick={() => handleModeChange('file')}
          >
            <FileTextOutlined className={styles.modeTabIcon} />
            上传文件
          </button>
          <button
            className={`${styles.modeTab} ${importMode === 'paste' ? styles.modeTabActive : ''}`}
            onClick={() => handleModeChange('paste')}
          >
            <EditOutlined className={styles.modeTabIcon} />
            粘贴 JSON
          </button>
        </div>
        
        <div className={styles.contentArea}>
          {importMode === 'file' ? renderUploadArea() : renderPasteArea()}
        </div>
      </div>
    </Modal>
  );
};

export default ImportModal;
