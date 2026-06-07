import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Info } from 'lucide-react';

export const HelpModal: React.FC = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="absolute top-8 right-8 z-10">
          <Info
            size={18}
            className="text-gray-400/60 hover:text-morandi-accent transition-colors duration-500 cursor-pointer"
          />
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-[340px] bg-morandi-main border-none shadow-[0_25px_50px_-12px_rgba(0,0,0,0.1)] rounded-xl p-0 overflow-hidden">
        <div className="p-6 space-y-5">
          <div className="space-y-4">
            <section className="space-y-2.5">
              <div className="font-serif text-sm leading-relaxed text-morandi-text space-y-3">
                <p className="font-serif text-[22px] font-bold text-morandi-text tracking-tight">Rewrite Studio</p>
                <p className="font-['MF-7d416f2b095e2799086c9ddc63e4b8ff'] text-sm leading-relaxed">
                  这是一个专为风格迁移打造的改写工作台。它将繁琐的提示词工程（Prompt）封装为可视化的卡片流，帮您省去每次重复拼凑"提示词 + 参考范文"的机械劳动，解决 AI 的上下文素材难以搜集整理的痛点，并且提供自定义提示词，确保 AI 每次输出都精准命中预设的风格。
                </p>
              </div>
            </section>

            <section className="space-y-3">
              <label className="font-mono text-[11px] tracking-[0.2em] uppercase text-gray-400 font-bold">操作流程</label>
              <div className="font-serif text-sm leading-relaxed text-morandi-text space-y-2">
                <p>1. <span className="font-bold">注入素材</span>: 在顶部输入框，粘贴您当前需要改写的原始草稿。</p>
                <p>2. <span className="font-bold">沉淀基准</span>: 在下方卡片区，填入您想模仿的优质成品案例（原文 vs 改写后），确立风格标准。</p>
                <p>3. <span className="font-bold">校准内核</span>: 点击左侧「调整提示词」，可根据自己需求自定义，为特定任务注入灵魂。</p>
                <p>4. <span className="font-bold">一键组装</span>: 点击左侧「一键预览复制」，即可获得包含完整风格定义的 Prompt 指令包，再跳转到其他 AI 平台发送即可。</p>
              </div>
            </section>
          </div>

          <div className="pt-4 border-t border-dashed border-morandi-divider">
            <div className="font-mono text-[9px] tracking-[0.3em] uppercase text-morandi-text/20 text-center whitespace-nowrap">
              A creation birthed by Kan Shao 2077
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HelpModal;
