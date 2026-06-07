import React, { useState, useRef, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { FileText, ChevronDown, Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { useAutoResize } from '@/hooks/use-auto-resize';

interface TargetSourcePanelProps {
  value: string;
  onChange: (value: string) => void;
}

export const TargetSourcePanel: React.FC<TargetSourcePanelProps> = ({
  value,
  onChange,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [copied, setCopied] = useState(false);
  const textarea = useAutoResize<HTMLTextAreaElement>(value, { minHeight: 200, maxHeight: 500 });

  const handleCopy = () => {
    if (!value) return;
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      toast({ title: '已复制', duration: 1500 });
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div 
      className="group rounded-2xl overflow-hidden animate-fade-in-up border transition-all duration-300"
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
      {/* 头部 - 黄色背景 */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "w-full px-6 py-4 flex items-center justify-between",
          "transition-colors duration-normal"
        )}
        style={{ 
          background: 'linear-gradient(135deg, rgba(253, 245, 200, 0.5) 0%, rgba(252, 241, 168, 0.35) 100%)'
        }}
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-4">
          <FileText size={17} style={{ color: 'rgba(180, 160, 60, 0.7)' }} />
          <div className="flex items-baseline gap-3">
            <span className="font-serif text-base tracking-tight">待改写素材</span>
            <span className="label-xs" style={{ color: 'rgba(55, 71, 79, 0.2)' }}>
              Target Source
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {value && !isExpanded && (
            <span 
              className="text-xs font-medium px-2.5 py-1 rounded-full"
              style={{ 
                background: 'hsla(var(--morandi-silver), 0.12)',
                color: 'rgba(55, 71, 79, 0.35)'
              }}
            >
              {value.length} 字
            </span>
          )}
          <div 
            className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center",
              "transition-transform duration-normal"
            )}
            style={{ 
              background: 'hsla(var(--morandi-silver), 0.1)',
              transform: isExpanded ? 'rotate(0)' : 'rotate(-90deg)'
            }}
          >
            <ChevronDown size={14} style={{ color: 'rgba(55, 71, 79, 0.3)' }} />
          </div>
        </div>
      </button>
      
      {/* 展开内容 */}
      <div
        className={cn(
          "grid transition-all duration-normal ease-out",
          isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <div className="px-6 pb-5 pt-4 bg-white">
            <Textarea
              ref={textarea.ref}
              placeholder="在此倾注您的文字..."
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="border-none rounded-lg resize-none focus-visible:ring-0 p-5 text-base leading-relaxed placeholder:text-morandi-text/20 placeholder:font-serif placeholder:italic placeholder:transition-opacity placeholder:duration-300 focus:placeholder:opacity-0"
              style={{ 
                background: 'rgba(253, 252, 248, 0.12)',
                boxShadow: 'var(--shadow-inner)',
                minHeight: '200px'
              }}
            />
            {value && (
              <div className="flex items-center justify-end gap-3 pt-3">
                <span className="text-[15px] tabular-nums font-medium" style={{ color: 'rgba(55, 71, 79, 0.2)' }}>
                  {value.length} 字
                </span>
                <button
                  onClick={handleCopy}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full font-medium",
                    "transition-all duration-fast ease-out"
                  )}
                  style={{
                    color: copied ? 'rgba(55, 71, 79, 0.5)' : 'rgba(55, 71, 79, 0.25)',
                    background: copied ? 'hsla(var(--morandi-silver), 0.15)' : 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    if (!copied) {
                      e.currentTarget.style.color = 'rgba(55, 71, 79, 0.45)';
                      e.currentTarget.style.background = 'hsl(var(--sidebar-background))';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!copied) {
                      e.currentTarget.style.color = 'rgba(55, 71, 79, 0.25)';
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                  aria-label="复制素材内容"
                >
                  {copied ? <Check size={11} /> : <Copy size={11} />}
                  <span>{copied ? '已复制' : '复制'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TargetSourcePanel;
