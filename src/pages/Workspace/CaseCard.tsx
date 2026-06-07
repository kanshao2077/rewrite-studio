import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Trash2, Copy, Check, CopyPlus, ChevronDown, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { ConfirmPopover } from '@/components/common/ConfirmPopover';
import { useAutoResize } from '@/hooks/use-auto-resize';
import type { CaseItem } from '@/types';

interface CaseCardProps {
  item: CaseItem;
  index: number;
  isNew?: boolean;
  onUpdate: (field: 'source' | 'output' | 'name', value: string) => void;
  onDelete: () => void;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
}

export interface CaseCardRef {
  focusSource: () => void;
}

export const CaseCard = forwardRef<CaseCardRef, CaseCardProps>(({
  item,
  index,
  isNew = false,
  onUpdate,
  onDelete,
  dragHandleProps,
}, ref) => {
  const [copiedField, setCopiedField] = useState<'source' | 'output' | 'full' | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState('');
  const nameInputRef = useRef<HTMLInputElement>(null);
  
  // 自动高度 Textarea
  const sourceTextarea = useAutoResize<HTMLTextAreaElement>(item.source, { minHeight: 140, maxHeight: 400 });
  const outputTextarea = useAutoResize<HTMLTextAreaElement>(item.output, { minHeight: 140, maxHeight: 400 });

  useImperativeHandle(ref, () => ({
    focusSource: () => sourceTextarea.ref.current?.focus(),
  }));

  useEffect(() => {
    if (isNew) {
      setIsExpanded(true);
      setTimeout(() => sourceTextarea.ref.current?.focus(), 100);
    }
  }, [isNew]);

  // 自动聚焦名称输入框
  useEffect(() => {
    if (isEditingName && nameInputRef.current) {
      nameInputRef.current.focus();
      nameInputRef.current.select();
    }
  }, [isEditingName]);

  const handleCopy = (field: 'source' | 'output') => {
    const text = field === 'source' ? item.source : item.output;
    if (!text) return;
    
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);
      toast({ title: '已复制', duration: 1500 });
      setTimeout(() => setCopiedField(null), 1500);
    });
  };
  
  const handleCopyFull = () => {
    if (!item.source && !item.output) return;
    
    const fullText = `【原文】\n${item.source || ''}\n\n【成品】\n${item.output || ''}`;
    navigator.clipboard.writeText(fullText).then(() => {
      setCopiedField('full');
      toast({ title: '已复制完整案例', duration: 1500 });
      setTimeout(() => setCopiedField(null), 1500);
    });
  };

  const handleStartEditName = () => {
    setTempName(item.name || '');
    setIsEditingName(true);
  };

  const handleSaveName = () => {
    onUpdate('name', tempName.trim());
    setIsEditingName(false);
  };

  // 显示名称：Case 1 · 自定义名称（如果有）
  const caseNumber = `Case ${index + 1}`;
  const displayName = item.name ? `${caseNumber} · ${item.name}` : caseNumber;

  return (
    <div 
      className={cn(
        "group relative bg-white rounded-2xl border overflow-hidden",
        "transition-all duration-300 ease-out",
        isNew && "animate-fade-in-up"
      )}
      style={{ 
        borderColor: 'rgba(55, 71, 79, 0.06)',
        boxShadow: 'var(--shadow-card)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)';
        e.currentTarget.style.borderColor = 'rgba(55, 71, 79, 0.1)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'var(--shadow-card)';
        e.currentTarget.style.borderColor = 'rgba(55, 71, 79, 0.06)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* 顶部栏 - 可折叠，可拖拽 */}
      <div 
        {...dragHandleProps}
        className="flex items-center justify-between px-5 py-3.5 border-b select-none"
        style={{ 
          borderColor: 'rgba(55, 71, 79, 0.05)',
          cursor: dragHandleProps ? 'grab' : 'pointer'
        }}
      >
        <div className="flex items-center gap-2">
          {/* 折叠箭头 */}
          <div 
            className="w-5 h-5 rounded flex items-center justify-center transition-transform duration-normal cursor-pointer"
            style={{ 
              transform: isExpanded ? 'rotate(0)' : 'rotate(-90deg)',
              color: 'rgba(55, 71, 79, 0.25)'
            }}
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            <ChevronDown size={14} />
          </div>
          
          {/* 名称显示/编辑 */}
          {isEditingName ? (
            <div 
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2"
            >
              <span 
                className="text-xs font-medium"
                style={{ color: 'rgba(55, 71, 79, 0.35)' }}
              >
                {caseNumber} ·
              </span>
              <Input
                ref={nameInputRef}
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onBlur={handleSaveName}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveName();
                  if (e.key === 'Escape') setIsEditingName(false);
                }}
                placeholder="自定义名称"
                className="h-6 py-0 px-2 text-xs border-none bg-transparent"
                style={{ width: `${Math.max(tempName.length * 8 + 40, 80)}px` }}
              />
            </div>
          ) : (
            <span 
              className="text-xs font-medium"
              style={{ color: 'rgba(55, 71, 79, 0.35)' }}
            >
              {displayName}
            </span>
          )}
        </div>
        
        <div 
          className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-fast"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 编辑名称 */}
          {!isEditingName && (
            <button
              onClick={handleStartEditName}
              className="p-1.5 rounded-lg transition-all duration-fast flex items-center justify-center"
              style={{ color: 'rgba(55, 71, 79, 0.2)', width: '28px', height: '28px' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'rgba(55, 71, 79, 0.5)';
                e.currentTarget.style.background = 'rgba(55, 71, 79, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'rgba(55, 71, 79, 0.2)';
                e.currentTarget.style.background = 'transparent';
              }}
              aria-label="编辑案例名称"
            >
              <Pencil size={14} />
            </button>
          )}
          
          {/* 复制完整案例 */}
          {(item.source || item.output) && (
            <button
              onClick={handleCopyFull}
              className={cn(
                "flex items-center gap-1 px-2.5 text-[15px] rounded-full",
                "transition-all duration-fast ease-out"
              )}
              style={{
                color: copiedField === 'full' ? 'rgba(55, 71, 79, 0.6)' : 'rgba(55, 71, 79, 0.25)',
                background: copiedField === 'full' ? 'hsla(var(--morandi-silver), 0.2)' : 'transparent',
                height: '28px'
              }}
              onMouseEnter={(e) => {
                if (copiedField !== 'full') {
                  e.currentTarget.style.color = 'rgba(55, 71, 79, 0.5)';
                  e.currentTarget.style.background = 'hsl(var(--sidebar-background))';
                }
              }}
              onMouseLeave={(e) => {
                if (copiedField !== 'full') {
                  e.currentTarget.style.color = 'rgba(55, 71, 79, 0.25)';
                  e.currentTarget.style.background = 'transparent';
                }
              }}
              aria-label="复制完整案例"
            >
              {copiedField === 'full' ? <Check size={14} /> : <CopyPlus size={14} />}
              <span>{copiedField === 'full' ? '已复制' : '复制'}</span>
            </button>
          )}
          
          {/* 删除按钮 */}
          <ConfirmPopover
            onConfirm={onDelete}
            title="删除此案例？"
            trigger={
              <button
                className="p-1.5 rounded-lg transition-all duration-fast flex items-center justify-center"
                style={{ color: 'rgba(55, 71, 79, 0.2)', width: '28px', height: '28px' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#ef4444';
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'rgba(55, 71, 79, 0.2)';
                  e.currentTarget.style.background = 'transparent';
                }}
                aria-label="删除案例"
              >
                <Trash2 size={14} />
              </button>
            }
          />
        </div>
      </div>

      {/* 内容区 - 可折叠 */}
      <div
        className={cn(
          "grid transition-all duration-normal ease-out",
          isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 1, background: 'rgba(55, 71, 79, 0.04)' }}>
            {/* 原文 */}
            <div className="bg-white p-5 space-y-3">
              <div className="flex items-center justify-between">
                <label className="label-xs" style={{ color: 'rgba(55, 71, 79, 0.25)' }}>原文</label>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-fast">
                  {item.source && (
                    <span className="text-[15px] tabular-nums font-medium" style={{ color: 'rgba(55, 71, 79, 0.2)' }}>
                      {item.source.length}字
                    </span>
                  )}
                  <button
                    onClick={() => handleCopy('source')}
                    className="p-1.5 rounded-full transition-all duration-fast"
                    style={{ color: copiedField === 'source' ? 'rgba(55, 71, 79, 0.5)' : 'rgba(55, 71, 79, 0.2)' }}
                    onMouseEnter={(e) => {
                      if (copiedField !== 'source') {
                        e.currentTarget.style.color = 'rgba(55, 71, 79, 0.4)';
                        e.currentTarget.style.background = 'hsl(var(--sidebar-background))';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (copiedField !== 'source') {
                        e.currentTarget.style.color = 'rgba(55, 71, 79, 0.2)';
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                    aria-label="复制原文"
                  >
                    {copiedField === 'source' ? <Check size={11} /> : <Copy size={11} />}
                  </button>
                </div>
              </div>
              <Textarea
                ref={sourceTextarea.ref}
                placeholder="输入原文内容..."
                value={item.source}
                onChange={(e) => onUpdate('source', e.target.value)}
                className="border-none rounded-lg resize-none focus-visible:ring-0 p-4 text-base leading-relaxed placeholder:text-morandi-text/20 placeholder:font-serif placeholder:italic placeholder:transition-opacity placeholder:duration-300 focus:placeholder:opacity-0"
                style={{ 
                  background: 'rgba(253, 252, 248, 0.12)',
                  boxShadow: 'var(--shadow-inner)',
                  minHeight: '140px'
                }}
              />
            </div>
            
            {/* 成品 */}
            <div className="bg-white p-5 space-y-3 group/textarea-container">
              <div className="flex items-center justify-between">
                <label className="label-xs" style={{ color: 'rgba(55, 71, 79, 0.25)' }}>成品</label>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-fast">
                  {item.output && (
                    <span className="text-[15px] tabular-nums font-medium" style={{ color: 'rgba(55, 71, 79, 0.2)' }}>
                      {item.output.length}字
                    </span>
                  )}
                  <button
                    onClick={() => handleCopy('output')}
                    className="p-1.5 rounded-full transition-all duration-fast"
                    style={{ color: copiedField === 'output' ? 'rgba(55, 71, 79, 0.5)' : 'rgba(55, 71, 79, 0.2)' }}
                    onMouseEnter={(e) => {
                      if (copiedField !== 'output') {
                        e.currentTarget.style.color = 'rgba(55, 71, 79, 0.4)';
                        e.currentTarget.style.background = 'hsl(var(--sidebar-background))';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (copiedField !== 'output') {
                        e.currentTarget.style.color = 'rgba(55, 71, 79, 0.2)';
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                    aria-label="复制成品"
                  >
                    {copiedField === 'output' ? <Check size={11} /> : <Copy size={11} />}
                  </button>
                </div>
              </div>
              <Textarea
                ref={outputTextarea.ref}
                placeholder="输入改写后的内容..."
                value={item.output}
                onChange={(e) => onUpdate('output', e.target.value)}
                className="border-none rounded-lg resize-none focus-visible:ring-0 p-4 text-base leading-relaxed placeholder:text-morandi-text/20 placeholder:font-serif placeholder:italic placeholder:transition-opacity placeholder:duration-300 focus:placeholder:opacity-0"
                style={{ 
                  background: 'rgba(247, 248, 250, 0.25)',
                  boxShadow: 'var(--shadow-inner)',
                  minHeight: '140px'
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

CaseCard.displayName = 'CaseCard';

export default CaseCard;
