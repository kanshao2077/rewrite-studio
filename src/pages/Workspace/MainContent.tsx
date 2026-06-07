import React, { useState, useRef, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Plus, FileText } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { TargetSourcePanel } from './TargetSourcePanel';
import { SortableCaseCard } from './SortableCaseCard';
import type { Project, CaseItem } from '@/types';

interface MainContentProps {
  currentProject: Project | null;
  onTargetSourceChange: (value: string) => void;
  onAddCase: () => void;
  onUpdateCase: (caseId: string, field: 'source' | 'output' | 'name', value: string) => void;
  onDeleteCase: (caseId: string) => void;
  onReorderCases: (newOrder: CaseItem[]) => void;
}

export const MainContent: React.FC<MainContentProps> = ({
  currentProject,
  onTargetSourceChange,
  onAddCase,
  onUpdateCase,
  onDeleteCase,
  onReorderCases,
}) => {
  const [newCaseId, setNewCaseId] = useState<string | null>(null);
  const [exitingIds, setExitingIds] = useState<Set<string>>(new Set());
  const caseRefs = useRef<{ [key: string]: React.RefObject<any> }>({});

  // 拖拽传感器配置
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 移动8px后才开始拖拽，避免误触
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // 拖拽结束处理
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!currentProject || !over) return;

    if (active.id !== over.id) {
      const oldIndex = currentProject.items.findIndex((item) => item.id === active.id);
      const newIndex = currentProject.items.findIndex((item) => item.id === over.id);
      const newOrder = [...currentProject.items];
      const [removed] = newOrder.splice(oldIndex, 1);
      newOrder.splice(newIndex, 0, removed);
      onReorderCases(newOrder);
    }
  };

  useEffect(() => {
    setNewCaseId(null);
    caseRefs.current = {};
  }, [currentProject?.id]);

  const handleAddCase = () => {
    const items = currentProject?.items || [];
    
    onAddCase();
    setTimeout(() => {
      const newItems = currentProject?.items || [];
      if (newItems.length > items.length) {
        const newItem = newItems[newItems.length - 1];
        setNewCaseId(newItem.id);
      }
    }, 50);
  };

  const handleDeleteCase = (caseId: string) => {
    setNewCaseId(null);
    // 添加到退出动画列表
    setExitingIds((prev) => new Set([...prev, caseId]));
    // 等待动画完成后再真正删除
    setTimeout(() => {
      onDeleteCase(caseId);
      setExitingIds((prev) => {
        const next = new Set(prev);
        next.delete(caseId);
        return next;
      });
    }, 200);
  };

  // 空状态
  if (!currentProject) {
    return (
      <div 
        className="flex-1 flex flex-col items-center justify-center gap-8 p-12"
        style={{ 
          background: 'linear-gradient(to bottom, hsl(var(--background)), white)'
        }}
      >
        {/* 主视觉 */}
        <div className="relative animate-float">
          <div 
            className="w-24 h-24 rounded-2xl flex items-center justify-center"
            style={{ 
              background: 'white',
              boxShadow: 'var(--shadow-level-4)'
            }}
          >
            <FileText 
              size={40} 
              style={{ color: 'hsl(var(--morandi-silver))' }} 
            />
          </div>
          {/* 装饰 */}
          <div 
            className="absolute -right-2 -top-2 w-5 h-5 rounded-full animate-pulse-soft"
            style={{ background: 'hsla(var(--morandi-silver), 0.25)' }}
          />
          <div 
            className="absolute -left-3 -bottom-1 w-4 h-4 rounded-full"
            style={{ background: 'hsla(var(--morandi-silver), 0.15)' }}
          />
        </div>
        
        {/* 文案 */}
        <div className="text-center space-y-2">
          <p className="font-serif text-lg" style={{ color: 'rgba(55, 71, 79, 0.35)' }}>
            选择一个项目开始
          </p>
          <p 
            className="text-sm max-w-xs leading-relaxed"
            style={{ color: 'rgba(55, 71, 79, 0.2)' }}
          >
            每个项目是一种写作风格的容器，你可以在这里收集案例、配置风格偏好
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden relative">
      {/* 头部 */}
      <header 
        className="px-8 py-6 flex-shrink-0 border-b"
        style={{ 
          borderColor: 'rgba(55, 71, 79, 0.05)',
          background: 'rgba(255, 255, 255, 0.5)'
        }}
      >
        <h2 className="font-serif text-lg text-morandi-text">
          {currentProject.name}
        </h2>
      </header>

      {/* 主内容区 */}
      <main className="flex-1 overflow-y-auto px-8 pb-12 scrollbar-autohide">
        <div className="max-w-4xl mx-auto py-8 space-y-8">
          {/* Zone 1: Target Source Panel */}
          <TargetSourcePanel
            value={currentProject.targetSourceText || ''}
            onChange={onTargetSourceChange}
          />

          {/* Zone 2: Reference Cases */}
          <div className="space-y-5">
            {/* 区块标题 */}
            <div className="flex items-center gap-4">
              <span className="label-xs" style={{ color: 'rgba(55, 71, 79, 0.3)' }}>
                对照案例流
              </span>
              <div 
                className="flex-1 h-px"
                style={{ background: 'linear-gradient(to right, rgba(55, 71, 79, 0.06), transparent)' }}
              />
              {currentProject.items.length > 0 && (
                <span className="text-[15px] tabular-nums" style={{ color: 'rgba(55, 71, 79, 0.2)' }}>
                  {currentProject.items.length} 个案例
                </span>
              )}
            </div>

            {/* 案例卡片 - 拖拽排序 */}
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={currentProject.items.map((item) => item.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-4">
                  {currentProject.items.map((item, index) => {
                    if (!caseRefs.current[item.id]) {
                      caseRefs.current[item.id] = React.createRef();
                    }
                    
                    return (
                      <SortableCaseCard
                        key={item.id}
                        ref={caseRefs.current[item.id]}
                        item={item}
                        index={index}
                        isNew={item.id === newCaseId}
                        isExiting={exitingIds.has(item.id)}
                        onUpdate={(field, value) => onUpdateCase(item.id, field, value)}
                        onDelete={() => handleDeleteCase(item.id)}
                      />
                    );
                  })}
                </div>
              </SortableContext>
            </DndContext>

            {/* 添加按钮 */}
            <button
              onClick={handleAddCase}
              className={cn(
                "group w-full py-12 rounded-2xl",
                "flex flex-col items-center justify-center gap-3",
                "transition-all duration-normal ease-out"
              )}
              style={{ 
                background: 'rgba(255, 255, 255, 0.35)',
                border: '1px dashed rgba(55, 71, 79, 0.08)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.borderColor = 'rgba(55, 71, 79, 0.12)';
                e.currentTarget.style.boxShadow = 'var(--shadow-card)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.35)';
                e.currentTarget.style.borderColor = 'rgba(55, 71, 79, 0.08)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-normal ease-out group-hover:scale-110"
                style={{ 
                  background: 'hsla(var(--morandi-silver), 0.2)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'hsla(var(--morandi-silver), 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'hsla(var(--morandi-silver), 0.2)';
                }}
              >
                <Plus 
                  size={20} 
                  style={{ color: 'hsl(var(--morandi-silver))' }} 
                />
              </div>
              <span 
                className="label-xs transition-colors duration-fast"
                style={{ color: 'rgba(55, 71, 79, 0.25)' }}
              >
                添加对照案例
              </span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

// Helper
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export default MainContent;
