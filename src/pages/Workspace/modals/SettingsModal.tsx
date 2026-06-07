import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from '@/components/ui/textarea';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';
import { DEFAULT_SYSTEM_PROMPT } from '@/types';
import { Button } from '@/components/ui/button';

interface SettingsModalProps {
  systemPrompt: string;
  onSystemPromptChange: (value: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  systemPrompt,
  onSystemPromptChange,
}) => {
  const handleReset = () => {
    onSystemPromptChange(DEFAULT_SYSTEM_PROMPT);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button 
          className="w-full flex items-center gap-2.5 px-4 py-3 rounded-lg transition-all duration-300 group"
          style={{ 
            background: 'hsla(var(--morandi-silver), 0.12)',
            color: 'hsl(var(--foreground))',
            border: '1px solid transparent'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'hsla(var(--morandi-silver), 0.22)';
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'hsla(var(--morandi-silver), 0.12)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <SlidersHorizontal 
            size={15} 
            className="transition-transform duration-300 group-hover:rotate-12"
          />
          <span className="text-[17px]">调整写作指令</span>
        </button>
      </DialogTrigger>
      <DialogContent 
        className="sm:max-w-[560px] bg-white border-none p-0 overflow-hidden animate-modal"
        style={{ 
          borderRadius: 'var(--radius-modal)',
          boxShadow: 'var(--shadow-modal)'
        }}
      >
        <DialogHeader 
          className="px-6 pt-6 pb-4 border-b"
          style={{ borderColor: 'rgba(55, 71, 79, 0.05)' }}
        >
          <div className="flex items-center justify-between">
            <DialogTitle className="font-serif text-xl text-morandi-text">
              AI 写作指令配置
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-xs h-7 px-3 rounded-lg"
              style={{ color: 'rgba(55, 71, 79, 0.3)' }}
            >
              <RotateCcw size={10} className="mr-1" />
              重置
            </Button>
          </div>
        </DialogHeader>
        <div className="p-6">
          <Textarea
            value={systemPrompt || DEFAULT_SYSTEM_PROMPT}
            onChange={(e) => onSystemPromptChange(e.target.value)}
            placeholder="在此输入您的系统指令..."
            className="min-h-[340px] border-none rounded-lg resize-none focus-visible:ring-0 p-5 text-base leading-relaxed placeholder:text-morandi-text/20 placeholder:font-serif placeholder:italic"
            style={{ 
              background: 'rgba(253, 252, 248, 0.15)',
              boxShadow: 'var(--shadow-inner)'
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
