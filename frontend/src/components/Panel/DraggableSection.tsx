import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DragOutlined, LockOutlined, DeleteOutlined, CheckOutlined } from '@ant-design/icons';
import styles from './DraggableSection.module.scss';

interface DraggableSectionProps {
  id: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  isConfigMode?: boolean;
  isFixed?: boolean;
  isSelected?: boolean;
  onSelect?: (id: string, isFixed: boolean) => void;
  onDelete?: (id: string) => void;
}

const DraggableSection: React.FC<DraggableSectionProps> = ({
  id,
  title,
  subtitle,
  children,
  className,
  isConfigMode = false,
  isFixed = false,
  isSelected = false,
  onSelect,
  onDelete,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id,
    disabled: isFixed,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete && !isFixed) {
      onDelete(id);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (isConfigMode && onSelect && !isFixed) {
      e.stopPropagation();
      onSelect(id, isFixed);
    }
  };

  return (
    <section
      ref={setNodeRef}
      style={style}
      onClick={handleClick}
      className={`${styles.section} ${className || ''} ${isDragging ? styles.dragging : ''} ${isConfigMode ? styles.configMode : ''} ${isFixed ? styles.fixed : ''} ${isSelected ? styles.selected : ''}`}
    >
      {isSelected && !isFixed && (
        <div className={styles.selectedIndicator}>
          <CheckOutlined />
        </div>
      )}
      <div className={styles.header}>
        {isConfigMode && (
          <div className={styles.dragHandleWrapper}>
            {isFixed ? (
              <div className={styles.fixedIcon}>
                <LockOutlined />
              </div>
            ) : (
              <div
                {...attributes}
                {...listeners}
                className={styles.dragHandle}
              >
                <DragOutlined />
              </div>
            )}
          </div>
        )}
        <h2>{title}</h2>
        {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
        {isConfigMode && isFixed && (
          <span className={styles.fixedBadge}>固定</span>
        )}
        {isConfigMode && !isFixed && onDelete && (
          <button
            className={styles.deleteButton}
            onClick={handleDelete}
            title="删除此面板"
          >
            <DeleteOutlined />
          </button>
        )}
      </div>
      <div className={styles.content}>{children}</div>
    </section>
  );
};

export default DraggableSection;
