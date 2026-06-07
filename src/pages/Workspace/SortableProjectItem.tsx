import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Input } from '@/components/ui/input';
import { Pencil, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ConfirmPopover } from '@/components/common/ConfirmPopover';
import type { Project } from '@/types';

interface SortableProjectItemProps {
  project: Project;
  isActive: boolean;
  isEditing: boolean;
  editingName: string;
  onSelect: () => void;
  onRename: (id: string, name: string) => void;
  onSubmitRename: (id: string) => void;
  onDelete: (id: string) => void;
  setEditingName: (name: string) => void;
}

export const SortableProjectItem: React.FC<SortableProjectItemProps> = React.memo(({
  project,
  isActive,
  isEditing,
  editingName,
  onSelect,
  onRename,
  onSubmitRename,
  onDelete,
  setEditingName,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={cn(
        "group flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-grab active:cursor-grabbing",
        "transition-all duration-300 ease-out"
      )}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      aria-selected={isActive}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.5)';
          e.currentTarget.style.transform = 'translateX(4px)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.transform = 'translateX(0)';
        }
      }}
      style={{
        background: isActive ? 'white' : 'transparent',
        color: isActive ? 'hsl(var(--foreground))' : 'rgba(55, 71, 79, 0.4)',
        fontWeight: isActive ? 500 : 400,
        boxShadow: isActive ? 'var(--shadow-level-2)' : 'none',
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.6 : 1,
        ...(isDragging && {
          boxShadow: 'var(--shadow-level-4)',
          border: '1px solid hsla(var(--morandi-silver), 0.2)',
          background: 'white'
        })
      }}
    >
      {isEditing ? (
        <div className="flex items-center gap-1 w-full" onClick={(e) => e.stopPropagation()}>
          <Input
            value={editingName}
            onChange={(e) => setEditingName(e.target.value)}
            onBlur={() => onSubmitRename(project.id)}
            onKeyDown={(e) => e.key === 'Enter' && onSubmitRename(project.id)}
            autoFocus
            className="h-7 py-0 px-2.5 bg-white border-none text-xs rounded-lg"
            style={{ boxShadow: 'var(--shadow-inner)' }}
          />
        </div>
      ) : (
        <>
          <span className="flex-1 truncate text-[17px]">{project.name}</span>
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-fast">
            <button
              className="p-1.5 rounded-lg transition-colors duration-fast"
              style={{ color: 'rgba(55, 71, 79, 0.25)' }}
              onClick={(e) => {
                e.stopPropagation();
                onRename(project.id, project.name);
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'rgba(55, 71, 79, 0.5)';
                e.currentTarget.style.background = 'hsl(var(--sidebar-background))';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'rgba(55, 71, 79, 0.25)';
                e.currentTarget.style.background = 'transparent';
              }}
              aria-label="重命名项目"
            >
              <Pencil size={11} />
            </button>
            <ConfirmPopover
              onConfirm={() => onDelete(project.id)}
              title="删除此项目？"
              trigger={
                <button
                  className="p-1.5 rounded-lg transition-colors duration-fast"
                  style={{ color: 'rgba(55, 71, 79, 0.2)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#ef4444';
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'rgba(55, 71, 79, 0.2)';
                    e.currentTarget.style.background = 'transparent';
                  }}
                  aria-label="删除项目"
                >
                  <Trash2 size={11} />
                </button>
              }
            />
          </div>
        </>
      )}
    </div>
  );
});

SortableProjectItem.displayName = 'SortableProjectItem';

export default SortableProjectItem;
