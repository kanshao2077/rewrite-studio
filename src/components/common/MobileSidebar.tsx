import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Menu, Plus, Upload, Download } from 'lucide-react';
import { ProjectList } from '@/pages/Workspace/ProjectList';
import { SettingsModal } from '@/pages/Workspace/modals/SettingsModal';
import { PreviewModal } from '@/pages/Workspace/modals/PreviewModal';
import { toast } from '@/hooks/use-toast';
import type { Project } from '@/types';

interface MobileSidebarProps {
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

export const MobileSidebar: React.FC<MobileSidebarProps> = ({
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
  const [open, setOpen] = React.useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSelectProject = (id: string) => {
    onSelectProject(id);
    setOpen(false);
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
        setOpen(false);
      } catch (err) {
        toast({ 
          variant: 'destructive', 
          title: '导入失败', 
          description: err instanceof Error ? err.message : '文件格式错误' 
        });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden fixed top-4 left-4 z-50 bg-white/80 backdrop-blur-sm rounded-full shadow-sm"
        >
          <Menu size={20} />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[85vh] bg-morandi-sidebar">
        <DrawerHeader className="border-b border-morandi-text/5">
          <DrawerTitle className="text-lg font-serif tracking-tight text-morandi-text">
            Rewrite Studio
          </DrawerTitle>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Action Buttons */}
          <div className="space-y-2">
            <SettingsModal
              systemPrompt={currentProject?.systemPrompt || ''}
              onSystemPromptChange={onSystemPromptChange}
            />
            <PreviewModal aggregationText={aggregationText} />
            
            {/* Import/Export */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleImportClick}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-fast text-xs"
                style={{ 
                  background: 'rgba(255, 255, 255, 0.5)',
                  color: 'rgba(55, 71, 79, 0.55)',
                  border: '1px solid transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.color = 'hsl(var(--foreground))';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.5)';
                  e.currentTarget.style.color = 'rgba(55, 71, 79, 0.55)';
                }}
              >
                <Upload size={14} />
                <span>导入</span>
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </div>

          {/* Projects */}
          <div className="border-t border-morandi-text/5 pt-4">
            <label className="px-2 text-[14px] font-bold uppercase tracking-[0.2em] text-morandi-text/30 mb-2 block">
              Projects
            </label>
            <ProjectList
              projects={projects}
              currentProjectId={currentProjectId}
              onSelectProject={handleSelectProject}
              onAddProject={onAddProject}
              onRenameProject={onRenameProject}
              onDeleteProject={onDeleteProject}
              onReorderProjects={onReorderProjects}
            />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileSidebar;
