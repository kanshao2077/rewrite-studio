import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { FileText, Layers, Settings, Sparkles, ChevronRight, Check } from 'lucide-react';

const ONBOARDING_KEY = 'rewrite_studio_onboarding_complete';

interface OnboardingStep {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const steps: OnboardingStep[] = [
  {
    icon: <FileText size={28} style={{ color: 'hsl(var(--morandi-silver))' }} />,
    title: '注入素材',
    description: '在顶部输入框粘贴您需要改写的原始草稿，这是 AI 改写的目标内容。',
  },
  {
    icon: <Layers size={28} style={{ color: 'hsl(var(--morandi-silver))' }} />,
    title: '沉淀案例',
    description: '添加对照案例卡片，填入原文与成品，确立 AI 应该模仿的风格标准。',
  },
  {
    icon: <Settings size={28} style={{ color: 'hsl(var(--morandi-silver))' }} />,
    title: '校准指令',
    description: '点击「调整提示词」自定义 AI 写作指令，为特定任务注入灵魂。',
  },
  {
    icon: <Sparkles size={28} style={{ color: 'hsl(var(--morandi-silver))' }} />,
    title: '一键复制',
    description: '点击「一键预览复制」，获取完整的 Prompt 指令包，粘贴到其他 AI 平台即可使用。',
  },
];

export const OnboardingModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const isCompleted = localStorage.getItem(ONBOARDING_KEY);
    if (!isCompleted) {
      setIsOpen(true);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    setIsOpen(false);
  };

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent 
        className="sm:max-w-[540px] bg-white border-none p-0 overflow-hidden animate-modal"
        style={{ 
          borderRadius: 'var(--radius-modal)',
          boxShadow: 'var(--shadow-modal)'
        }}
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        {/* 内容区 */}
        <div className="p-10">
          {/* 步骤指示器 */}
          <div className="flex items-center justify-center gap-2.5 mb-10">
            {steps.map((_, index) => (
              <div
                key={index}
                className="w-2 h-2 rounded-full transition-all duration-fast"
                style={{
                  background: index === currentStep 
                    ? 'hsl(var(--morandi-silver))' 
                    : index < currentStep 
                      ? 'hsla(var(--morandi-silver), 0.5)'
                      : 'rgba(55, 71, 79, 0.1)',
                  width: index === currentStep ? '24px' : '10px',
                }}
              />
            ))}
          </div>

          {/* 图标 */}
          <div 
            className="w-20 h-20 rounded-2xl mx-auto mb-8 flex items-center justify-center"
            style={{ 
              background: 'hsla(var(--morandi-silver), 0.12)',
              boxShadow: 'var(--shadow-inner)'
            }}
          >
            {step.icon}
          </div>

          {/* 标题 */}
          <h2 className="font-serif text-2xl text-center mb-4" style={{ color: 'hsl(var(--foreground))' }}>
            {step.title}
          </h2>

          {/* 描述 */}
          <p 
            className="text-base leading-relaxed mb-10 px-4"
            style={{ color: 'rgba(55, 71, 79, 0.5)' }}
          >
            {step.description}
          </p>

          {/* 按钮 */}
          <div className="flex gap-3">
            <Button
              variant="ghost"
              onClick={handleSkip}
              className="flex-1 py-6 rounded-lg text-base"
              style={{ color: 'rgba(55, 71, 79, 0.35)' }}
            >
              跳过引导
            </Button>
            <Button
              onClick={handleNext}
              className="flex-1 py-6 rounded-lg text-base font-medium"
              style={{ 
                background: 'hsl(var(--foreground))',
                color: 'white',
                boxShadow: 'var(--shadow-level-2)'
              }}
            >
              {isLastStep ? (
                <>
                  <Check size={16} className="mr-1" />
                  开始使用
                </>
              ) : (
                <>
                  下一步
                  <ChevronRight size={16} className="ml-1" />
                </>
              )}
            </Button>
          </div>
        </div>

        {/* 底部提示 */}
        <div 
          className="px-10 py-5 text-center border-t"
          style={{ borderColor: 'rgba(55, 71, 79, 0.05)' }}
        >
          <span 
            className="text-xs"
            style={{ color: 'rgba(55, 71, 79, 0.25)' }}
          >
            随时点击右上角 ℹ️ 图标查看帮助
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingModal;
