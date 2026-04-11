import React, { useState, useRef, useEffect } from 'react';
import { SendOutlined, CloseOutlined, AimOutlined, LoadingOutlined } from '@ant-design/icons';
import styles from './AIChatPanel.module.scss';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  selectedElement?: {
    id: string;
    title: string;
  };
  timestamp: Date;
  changes?: Array<{
    field: string;
    description: string;
  }>;
}

interface AIChatPanelProps {
  messages: ChatMessage[];
  selectedElement: { id: string; title: string } | null;
  isTyping: boolean;
  onSendMessage: (message: string) => void;
  onClearSelection: () => void;
}

const AIChatPanel: React.FC<AIChatPanelProps> = ({
  messages,
  selectedElement,
  isTyping,
  onSendMessage,
  onClearSelection,
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim() || isTyping) return;
    onSendMessage(input.trim());
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickActions = selectedElement
    ? ['修改标题', '修改样式', '修改数据源', '删除此模块']
    : ['添加图表模块', '添加指标卡', '添加数据表', '优化布局'];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.logo}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
                fill="url(#glm-grad)"
              />
              <path
                d="M8 12.5c0-2.5 2-4 4-4s4 1.5 4 4-2 4-4 4-4-1.5-4-4z"
                fill="#fff"
                fillOpacity=".9"
              />
              <defs>
                <linearGradient id="glm-grad" x1="2" y1="2" x2="22" y2="22">
                  <stop stopColor="#4D6BFE" />
                  <stop offset="1" stopColor="#7B61FF" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className={styles.headerInfo}>
            <div className={styles.titleRow}>
              <span className={styles.title}>GLM-5 智能助手</span>
              <span className={styles.statusBadge}>在线</span>
            </div>
            <span className={styles.subtitle}>报表模板配置助手 · 实时预览</span>
          </div>
        </div>
        <div className={styles.modelTag}>GLM-5</div>
      </div>

      {selectedElement && (
        <div className={styles.selectedElement}>
          <AimOutlined className={styles.selectedIcon} />
          <span className={styles.selectedText}>
            已选中：<strong>{selectedElement.title}</strong>
          </span>
          <button className={styles.clearButton} onClick={onClearSelection}>
            <CloseOutlined />
          </button>
        </div>
      )}

      <div className={styles.messages}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`${styles.message} ${msg.role === 'user' ? styles.userMessage : styles.assistantMessage}`}
          >
            <div className={styles.messageAvatar}>
              {msg.role === 'user' ? (
                <span className={styles.userAvatar}>我</span>
              ) : (
                <div className={styles.assistantAvatar}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
                      fill="url(#glm-grad-small)"
                    />
                    <defs>
                      <linearGradient id="glm-grad-small" x1="2" y1="2" x2="22" y2="22">
                        <stop stopColor="#4D6BFE" />
                        <stop offset="1" stopColor="#7B61FF" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              )}
            </div>
            <div className={styles.messageContent}>
              {msg.selectedElement && (
                <div className={styles.messageSelection}>
                  <AimOutlined />
                  <span>{msg.selectedElement.title}</span>
                </div>
              )}
              <p className={styles.messageText}>{msg.content}</p>
              {msg.changes && msg.changes.length > 0 && (
                <div className={styles.changes}>
                  {msg.changes.map((change, i) => (
                    <div key={i} className={styles.changeItem}>
                      <span className={styles.changeDot} />
                      <span>{change.description}</span>
                    </div>
                  ))}
                </div>
              )}
              <span className={styles.timestamp}>
                {msg.timestamp.toLocaleTimeString('zh-CN', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className={`${styles.message} ${styles.assistantMessage}`}>
            <div className={styles.messageAvatar}>
              <div className={styles.assistantAvatar}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
                    fill="url(#glm-grad-typing)"
                  />
                  <defs>
                    <linearGradient id="glm-grad-typing" x1="2" y1="2" x2="22" y2="22">
                      <stop stopColor="#4D6BFE" />
                      <stop offset="1" stopColor="#7B61FF" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
            <div className={styles.messageContent}>
              <div className={styles.typingIndicator}>
                <LoadingOutlined spin />
                <span>GLM-5 正在思考...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className={styles.quickActions}>
        {quickActions.map((action) => (
          <button
            key={action}
            className={styles.quickActionButton}
            onClick={() => setInput(action)}
          >
            {action}
          </button>
        ))}
      </div>

      <div className={styles.inputArea}>
        <div className={styles.inputWrapper}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              selectedElement
                ? `针对「${selectedElement.title}」描述修改需求...`
                : '描述报表调整需求，预览将实时更新...'
            }
            className={styles.input}
            rows={2}
            disabled={isTyping}
          />
          <button
            className={styles.sendButton}
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
          >
            <SendOutlined />
          </button>
        </div>
        <div className={styles.inputHint}>
          <span>Enter 发送 · Shift+Enter 换行</span>
          <span>Powered by GLM-5</span>
        </div>
      </div>
    </div>
  );
};

export default AIChatPanel;
