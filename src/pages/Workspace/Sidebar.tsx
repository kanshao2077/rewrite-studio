import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Download, Upload } from 'lucide-react';
import { ProjectList } from './ProjectList';
import { SettingsModal } from './modals/SettingsModal';
import { PreviewModal } from './modals/PreviewModal';
import { toast } from '@/hooks/use-toast';
import type { Project } from '@/types';

interface SidebarProps {
  projects: Project[];
  currentProjectId: string | null;
  currentProject: Project | null;
  aggregationText: string;
  onSelectProject: (id: string) => void;
  onAddProject: () => void;
  onRenameProject: (id: string, name: string) => void;
  onDeleteProject: (id: string) => void;
  onReorderProjects: (newOrder: Project[]) => void;
  onSystemPromptChange: (value: string) => void;
  onImportData: (data: any) => number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  projects,
  currentProjectId,
  currentProject,
  aggregationText,
  onSelectProject,
  onAddProject,
  onRenameProject,
  onDeleteProject,
  onReorderProjects,
  onSystemPromptChange,
  onImportData,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const data = {
      version: 1,
      exportedAt: new Date().toISOString(),
      currentProjectId,
      projects,
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rewrite-studio-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({ title: '导出成功', description: '数据已保存到文件' });
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        const importedCount = onImportData(data);
        toast({ title: '导入成功', description: `已追加 ${importedCount} 个项目` });
      } catch (err) {
        toast({ 
          variant: 'destructive', 
          title: '导入失败', 
          description: err instanceof Error ? err.message : '文件格式错误' 
        });
      }
    };
    reader.readAsText(file);
    
    // 重置 input，允许重复导入同一文件
    e.target.value = '';
  };

  return (
    <aside 
      className="w-[260px] flex-shrink-0 flex flex-col h-full border-r"
      style={{ 
        background: 'hsl(var(--sidebar-background))',
        borderColor: 'rgba(55, 71, 79, 0.05)'
      }}
    >
      {/* Logo */}
      <div className="px-6 pt-7 pb-5">
        <h1 className="font-serif text-2xl font-bold tracking-tight text-morandi-text text-center">
          Rewrite Studio
        </h1>
      </div>

      {/* Action Buttons */}
      <div className="px-6 space-y-3">
        <SettingsModal
          systemPrompt={currentProject?.systemPrompt || ''}
          onSystemPromptChange={onSystemPromptChange}
        />
        <PreviewModal aggregationText={aggregationText} />
      </div>

      {/* Projects List */}
      <ProjectList
        projects={projects}
        currentProjectId={currentProjectId}
        onSelectProject={onSelectProject}
        onAddProject={onAddProject}
        onRenameProject={onRenameProject}
        onDeleteProject={onDeleteProject}
        onReorderProjects={onReorderProjects}
      />

      {/* Bottom */}
      <div className="p-5 mt-auto">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start rounded-lg py-4 border",
            "transition-all duration-fast"
          )}
          style={{ 
            color: 'rgba(55, 71, 79, 0.35)',
            borderColor: 'transparent'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.6)';
            e.currentTarget.style.color = 'hsl(var(--foreground))';
            e.currentTarget.style.borderColor = 'rgba(55, 71, 79, 0.06)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = 'rgba(55, 71, 79, 0.35)';
            e.currentTarget.style.borderColor = 'transparent';
          }}
          onClick={onAddProject}
        >
          <Plus size={15} className="mr-2" />
          <span className="label-xs">New Project</span>
        </Button>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t" style={{ borderColor: 'rgba(55, 71, 79, 0.05)' }}>
          <div className="group relative flex items-center justify-center gap-3">
            <span 
              className="font-mono text-[9px] tracking-widest uppercase cursor-default whitespace-nowrap"
              style={{ color: 'rgba(55, 71, 79, 0.15)' }}
            >
              A creation by Kan Shao 2077
            </span>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-fast">
              <button
                onClick={handleExport}
                className="p-1.5 rounded-lg"
                style={{ color: 'rgba(55, 71, 79, 0.2)' }}
                title="导出备份数据"
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'rgba(55, 71, 79, 0.4)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'rgba(55, 71, 79, 0.2)';
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <Upload size={10} />
              </button>
              <button
                onClick={handleImportClick}
                className="p-1.5 rounded-lg"
                style={{ color: 'rgba(55, 71, 79, 0.2)' }}
                title="导入备份数据"
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'rgba(55, 71, 79, 0.4)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'rgba(55, 71, 79, 0.2)';
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <Download size={10} />
              </button>
            </div>
          </div>
          
          {/* 隐藏的文件输入 */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
        </div>
      </div>
    </aside>
  );
};

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export default Sidebar;
