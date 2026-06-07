import React, { forwardRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CaseCard, CaseCardRef } from './CaseCard';
import type { CaseItem } from '@/types';

interface SortableCaseCardProps {
  item: CaseItem;
  index: number;
  isNew?: boolean;
  isExiting?: boolean;
  onUpdate: (field: 'source' | 'output' | 'name', value: string) => void;
  onDelete: () => void;
}

export const SortableCaseCard = forwardRef<CaseCardRef, SortableCaseCardProps>(({
  item,
  index,
  isNew = false,
  isExiting = false,
  onUpdate,
  onDelete,
}, ref) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : isExiting ? 0 : 1,
    zIndex: isDragging ? 50 : 'auto',
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`relative group/case ${isExiting ? 'animate-exit-up' : ''}`}
    >
      {/* 拖拽时的视觉反馈 */}
      {isDragging && (
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            border: '2px solid rgba(55, 71, 79, 0.12)',
            background: 'rgba(255, 255, 255, 0.7)',
          }}
        />
      )}

      {/* 整个卡片可拖拽 - 通过 listeners 绑定到 CaseCard 的头部 */}
      <CaseCard
        ref={ref}
        item={item}
        index={index}
        isNew={isNew}
        onUpdate={onUpdate}
        onDelete={onDelete}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
});

SortableCaseCard.displayName = 'SortableCaseCard';

export default SortableCaseCard;
