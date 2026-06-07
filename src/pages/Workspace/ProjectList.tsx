import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { SortableProjectItem } from './SortableProjectItem';
import type { Project } from '@/types';

interface ProjectListProps {
  projects: Project[];
  currentProjectId: string | null;
  onSelectProject: (id: string) => void;
  onAddProject: () => void;
  onRenameProject: (id: string, name: string) => void;
  onDeleteProject: (id: string) => void;
  onReorderProjects: (newOrder: Project[]) => void;
}

export const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  currentProjectId,
  onSelectProject,
  onAddProject,
  onRenameProject,
  onDeleteProject,
  onReorderProjects,
}) => {
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  // 拖拽传感器配置
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 移动8px后才开始拖拽，避免误触
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = projects.findIndex((p) => p.id === active.id);
      const newIndex = projects.findIndex((p) => p.id === over.id);
      const newOrder = [...projects];
      const [removed] = newOrder.splice(oldIndex, 1);
      newOrder.splice(newIndex, 0, removed);
      onReorderProjects(newOrder);
    }
  };

  const handleRename = (id: string, name: string) => {
    setEditingProjectId(id);
    setEditingName(name);
  };

  const submitRename = (id: string) => {
    if (editingName.trim()) {
      onRenameProject(id, editingName.trim());
    }
    setEditingProjectId(null);
  };

  return (
    <div className="px-6 flex flex-col flex-1 overflow-hidden min-h-0 pt-6">
      <label className="px-5 text-[14px] font-bold uppercase tracking-[0.2em] text-morandi-text/30 mb-4">
        Projects
      </label>
      <ScrollArea className="flex-1 h-full">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={projects.map((p) => p.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2 pb-6 pr-2">
              {projects.map((project) => (
                <SortableProjectItem
                  key={project.id}
                  project={project}
                  isActive={currentProjectId === project.id}
                  isEditing={editingProjectId === project.id}
                  editingName={editingName}
                  onSelect={() => onSelectProject(project.id)}
                  onRename={handleRename}
                  onSubmitRename={submitRename}
                  onDelete={onDeleteProject}
                  setEditingName={setEditingName}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </ScrollArea>
    </div>
  );
};

export default ProjectList;
