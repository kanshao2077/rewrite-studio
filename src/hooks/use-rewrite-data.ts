import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Project, CaseItem } from '@/types';
import { STORAGE_KEY, DEFAULT_SYSTEM_PROMPT } from '@/types';

// ============ 初始数据 ============

const createDefaultProject = (): Project => ({
  id: Date.now().toString(),
  name: '默认项目',
  items: [{ id: `${Date.now()}-1`, source: '', output: '' }],
  targetSourceText: '',
  systemPrompt: DEFAULT_SYSTEM_PROMPT,
});

// ============ Hook 实现 ============

export function useRewriteData() {
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // 数据迁移：确保所有项目都有必要字段
        return parsed.map((p: Project) => ({
          ...p,
          targetSourceText: p.targetSourceText ?? '',
          systemPrompt: p.systemPrompt ?? DEFAULT_SYSTEM_PROMPT,
          items: p.items?.length > 0 ? p.items : [{ id: `${Date.now()}-1`, source: '', output: '' }],
        }));
      }
    } catch (e) {
      console.error('Failed to load data from localStorage:', e);
    }
    return [createDefaultProject()];
  });

  const [currentProjectId, setCurrentProjectId] = useState<string | null>(() => {
    const stored = localStorage.getItem(`${STORAGE_KEY}_current_id`);
    return stored || (projects.length > 0 ? projects[0].id : null);
  });

  // 自动保存（带防抖）
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    }, 300);
    return () => clearTimeout(timer);
  }, [projects]);

  useEffect(() => {
    if (currentProjectId) {
      localStorage.setItem(`${STORAGE_KEY}_current_id`, currentProjectId);
    }
  }, [currentProjectId]);

  // 当前项目
  const currentProject = useMemo(() => {
    return projects.find((p) => p.id === currentProjectId) || null;
  }, [projects, currentProjectId]);

  // ============ 项目操作 ============

  const addProject = useCallback(() => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: '新建项目',
      items: [{ id: `${Date.now()}-1`, source: '', output: '' }],
      targetSourceText: '',
      systemPrompt: DEFAULT_SYSTEM_PROMPT,
    };
    setProjects((prev) => [newProject, ...prev]);
    setCurrentProjectId(newProject.id);
  }, []);

  const renameProject = useCallback((id: string, newName: string) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, name: newName } : p))
    );
  }, []);

  const deleteProject = useCallback((id: string) => {
    setProjects((prev) => {
      const filtered = prev.filter((p) => p.id !== id);
      if (filtered.length === 0) {
        const defaultProj = createDefaultProject();
        setCurrentProjectId(defaultProj.id);
        return [defaultProj];
      }
      if (currentProjectId === id) {
        setCurrentProjectId(filtered[0].id);
      }
      return filtered;
    });
  }, [currentProjectId]);

  const reorderProjects = useCallback((newOrder: Project[]) => {
    setProjects(newOrder);
  }, []);

  const updateProjectSettings = useCallback(
    (projectId: string, field: 'targetSourceText' | 'systemPrompt', value: string) => {
      setProjects((prev) =>
        prev.map((p) => (p.id === projectId ? { ...p, [field]: value } : p))
      );
    },
    []
  );

  // ============ 案例操作 ============

  const addCase = useCallback((projectId: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          return {
            ...p,
            items: [
              ...p.items,
              { id: Date.now().toString(), source: '', output: '' },
            ],
          };
        }
        return p;
      })
    );
  }, []);

  const updateCase = useCallback(
    (projectId: string, caseId: string, field: 'source' | 'output' | 'name', value: string) => {
      setProjects((prev) =>
        prev.map((p) => {
          if (p.id === projectId) {
            return {
              ...p,
              items: p.items.map((item) =>
                item.id === caseId ? { ...item, [field]: value } : item
              ),
            };
          }
          return p;
        })
      );
    },
    []
  );

  const deleteCase = useCallback((projectId: string, caseId: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          const filtered = p.items.filter((item) => item.id !== caseId);
          return {
            ...p,
            items: filtered.length > 0 ? filtered : [{ id: Date.now().toString(), source: '', output: '' }],
          };
        }
        return p;
      })
    );
  }, []);

  const reorderCases = useCallback((projectId: string, newOrder: CaseItem[]) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, items: newOrder } : p))
    );
  }, []);

  // ============ 聚合文本 ============

  const aggregationText = useMemo(() => {
    if (!currentProject) return '';

    const cases = currentProject.items
      .map((item, index) => {
        return `### 案例 ${index + 1}\n\n[原文]: ${item.source}\n\n[成品]: ${item.output}\n\n---`;
      })
      .join('\n\n');

    const target = `\n---\n# Target Material\n[New Input]:\n${currentProject.targetSourceText || ''}`;
    const instruction = `\n\n---\n# System Instruction\n${currentProject.systemPrompt || DEFAULT_SYSTEM_PROMPT}`;

    return `${cases}${target}${instruction}`;
  }, [currentProject]);

  // 导入数据（追加模式，支持多种格式）
  const importData = useCallback((data: any) => {
    let projectsToImport: any[] = [];
    
    // 情况1：标准格式 { projects: [...] }
    if (data.projects && Array.isArray(data.projects)) {
      projectsToImport = data.projects;
    }
    // 情况2：直接是项目数组 [...]
    else if (Array.isArray(data)) {
      projectsToImport = data;
    }
    // 情况3：单个项目对象 { id, name, items, ... }
    else if (data && typeof data === 'object' && (data.id || data.name || data.items)) {
      projectsToImport = [data];
    }
    else {
      throw new Error('无法识别的数据格式');
    }
    
    // 数据迁移：确保所有项目都有必要字段，并生成新ID避免冲突
    const timestamp = Date.now();
    const migratedProjects = projectsToImport.map((p: any, index: number) => {
      const newId = `${timestamp}-${index}`;
      return {
        id: newId,
        name: p.name || '未命名项目',
        targetSourceText: p.targetSourceText ?? '',
        systemPrompt: p.systemPrompt ?? DEFAULT_SYSTEM_PROMPT,
        items: (p.items?.length > 0 ? p.items : [{ id: `${timestamp}-${index}-1`, source: '', output: '' }]).map((item: any, itemIndex: number) => ({
          id: `${timestamp}-${index}-${itemIndex}`,
          source: item.source ?? '',
          output: item.output ?? '',
          name: item.name ?? '',
        })),
      };
    });
    
    // 追加到现有项目列表
    setProjects((prev) => [...prev, ...migratedProjects]);
    
    // 切换到第一个导入的项目
    if (migratedProjects.length > 0) {
      setCurrentProjectId(migratedProjects[0].id);
    }
    
    return migratedProjects.length;
  }, []);

  return {
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
  };
}

// 导出类型和常量
export type { Project, CaseItem };
export { DEFAULT_SYSTEM_PROMPT, STORAGE_KEY };
