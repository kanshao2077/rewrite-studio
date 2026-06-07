import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Check, Sparkles } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface PreviewModalProps {
  aggregationText: string;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({
  aggregationText,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(aggregationText);
      setCopied(true);
      toast({
        title: "复制成功",
        description: "全量语料已复制到剪贴板",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "复制失败",
        description: "无法访问剪贴板",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button 
          className="w-full flex items-center gap-2.5 px-4 py-3 rounded-lg transition-all duration-300 group"
          style={{ 
            background: 'hsla(var(--morandi-silver), 0.2)',
            color: 'hsl(var(--foreground))',
            border: '1px solid transparent'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'hsla(var(--morandi-silver), 0.32)';
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.06)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'hsla(var(--morandi-silver), 0.2)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <Sparkles 
            size={15}
            className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12"
          />
          <span className="text-[17px]">一键预览复制</span>
        </button>
      </DialogTrigger>
      <DialogContent 
        className="sm:max-w-[700px] bg-white border-none p-0 overflow-hidden animate-modal"
        style={{ 
          borderRadius: 'var(--radius-modal)',
          boxShadow: 'var(--shadow-modal)'
        }}
      >
        <DialogHeader 
          className="px-6 pt-6 pb-4 border-b"
          style={{ borderColor: 'rgba(55, 71, 79, 0.05)' }}
        >
          <DialogTitle className="font-serif text-xl text-morandi-text">
            语料聚合预览
          </DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <Textarea
            readOnly
            value={aggregationText}
            className="min-h-[380px] border-none rounded-lg resize-none focus-visible:ring-0 p-5 text-base leading-relaxed"
            style={{ 
              background: 'rgba(253, 252, 248, 0.15)',
              boxShadow: 'var(--shadow-inner)'
            }}
          />
        </div>
        <div className="px-6 pb-6">
          <Button
            onClick={handleCopy}
            className={cn(
              "w-full py-6 rounded-lg font-medium text-base",
              "transition-all duration-fast"
            )}
            style={{ 
              background: copied ? 'hsla(var(--morandi-silver), 0.2)' : 'hsl(var(--foreground))',
              color: copied ? 'rgba(55, 71, 79, 0.6)' : 'white',
              boxShadow: copied ? 'none' : 'var(--shadow-level-2)'
            }}
          >
            {copied ? (
              <>
                <Check size={16} className="mr-2" />
                已复制到剪贴板
              </>
            ) : (
              <>
                <Copy size={16} className="mr-2" />
                Copy All · 复制全部语料
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export default PreviewModal;
