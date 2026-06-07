import React, { useEffect, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { useRewriteData } from '@/hooks/use-rewrite-data';
import { Sidebar } from './Sidebar';
import { MainContent } from './MainContent';
import { HelpModal } from './modals/HelpModal';
import { MobileSidebar } from '@/components/common/MobileSidebar';
import { OnboardingModal } from '@/components/common/OnboardingModal';

const Workspace: React.FC = () => {
  const {
    projects,
    currentProject,
    currentProjectId,
    setCurrentProjectId,
    addProject,
    renameProject,
    deleteProject,
    reorderProjects,
    updateProjectSettings,
    addCase,
    updateCase,
    deleteCase,
    reorderCases,
    importData,
    aggregationText,
  } = useRewriteData();

  // 更新当前项目的素材
  const handleTargetSourceChange = useCallback((value: string) => {
    if (currentProjectId) {
      updateProjectSettings(currentProjectId, 'targetSourceText', value);
    }
  }, [currentProjectId, updateProjectSettings]);

  // 更新当前项目的系统提示词
  const handleSystemPromptChange = useCallback((value: string) => {
    if (currentProjectId) {
      updateProjectSettings(currentProjectId, 'systemPrompt', value);
    }
  }, [currentProjectId, updateProjectSettings]);

  // 更新案例
  const handleUpdateCase = useCallback((caseId: string, field: 'source' | 'output', value: string) => {
    if (currentProjectId) {
      updateCase(currentProjectId, caseId, field, value);
    }
  }, [currentProjectId, updateCase]);

  // 删除案例
  const handleDeleteCase = useCallback((caseId: string) => {
    if (currentProjectId) {
      deleteCase(currentProjectId, caseId);
    }
  }, [currentProjectId, deleteCase]);

  // 重排案例
  const handleReorderCases = useCallback((newOrder: any[]) => {
    if (currentProjectId) {
      reorderCases(currentProjectId, newOrder);
    }
  }, [currentProjectId, reorderCases]);

  // 添加案例
  const handleAddCase = useCallback(() => {
    if (currentProjectId) {
      addCase(currentProjectId);
    }
  }, [currentProjectId, addCase]);

  // 键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + S: 显示保存提示
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        toast({ title: '已自动保存' });
      }

      // Ctrl/Cmd + Shift + C: 复制聚合内容
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        navigator.clipboard.writeText(aggregationText).then(() => {
          toast({ title: '语料已复制到剪贴板' });
        }).catch(() => {
          toast({ variant: 'destructive', title: '复制失败' });
        });
      }

      // Ctrl/Cmd + N: 新建项目
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        addProject();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [aggregationText, addProject]);

  const sidebarProps = {
    projects,
    currentProjectId,
    currentProject,
    aggregationText,
    onSelectProject: setCurrentProjectId,
    onAddProject: addProject,
    onRenameProject: renameProject,
    onDeleteProject: deleteProject,
    onReorderProjects: reorderProjects,
    onSystemPromptChange: handleSystemPromptChange,
    onImportData: importData,
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-morandi-main text-morandi-text selection:bg-morandi-accent selection:text-white">
      {/* Mobile Sidebar */}
      <MobileSidebar {...sidebarProps} />

      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar {...sidebarProps} />
      </div>

      {/* Main Content */}
      <MainContent
        currentProject={currentProject}
        onTargetSourceChange={handleTargetSourceChange}
        onAddCase={handleAddCase}
        onUpdateCase={handleUpdateCase}
        onDeleteCase={handleDeleteCase}
        onReorderCases={handleReorderCases}
      />

      {/* Help Modal */}
      <HelpModal />

      {/* Onboarding Modal */}
      <OnboardingModal />
    </div>
  );
};

export default Workspace;
