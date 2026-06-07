import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

interface ConfirmPopoverProps {
  onConfirm: () => void;
  trigger: React.ReactNode;
  title?: string;
  confirmText?: string;
  cancelText?: string;
}

export const ConfirmPopover: React.FC<ConfirmPopoverProps> = ({
  onConfirm,
  trigger,
  title = '确定删除？',
  confirmText = '删除',
  cancelText = '取消',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.top - 10,
        left: rect.right + 10,
      });
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (triggerRef.current && !triggerRef.current.contains(target)) {
        // Check if click is inside popover
        const popover = document.getElementById('confirm-popover-content');
        if (popover && !popover.contains(target)) {
          handleClose();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 150);
  };

  const handleConfirm = () => {
    onConfirm();
    setIsOpen(false);
    setIsClosing(false);
  };

  const popoverContent = (
    <div
      id="confirm-popover-content"
      className={cn(
        "fixed z-[9999]",
        isClosing ? "opacity-0 scale-95" : "opacity-100 scale-100"
      )}
      style={{
        top: position.top,
        left: position.left,
        transition: 'opacity 150ms ease-out, transform 150ms ease-out',
      }}
    >
      <div
        className="bg-white rounded-xl p-2.5 min-w-[120px]"
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid rgba(55, 71, 79, 0.06)',
        }}
      >
        <p
          className="text-[15px] mb-2.5 text-center font-medium whitespace-nowrap"
          style={{ color: 'rgba(55, 71, 79, 0.5)' }}
        >
          {title}
        </p>
        <div className="flex gap-1.5">
          <button
            onClick={(e) => { e.stopPropagation(); handleClose(); }}
            className="flex-1 py-1.5 text-[15px] font-medium rounded-lg transition-colors duration-fast"
            style={{ color: 'rgba(55, 71, 79, 0.4)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'hsl(var(--foreground))';
              e.currentTarget.style.background = 'hsl(var(--sidebar-background))';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'rgba(55, 71, 79, 0.4)';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            {cancelText}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleConfirm(); }}
            className="flex-1 py-1.5 text-[15px] font-medium rounded-lg transition-colors duration-fast"
            style={{ color: '#ef4444' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'white';
              e.currentTarget.style.background = '#ef4444';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#ef4444';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div ref={triggerRef} className="relative inline-block">
      <div
        onClick={(e) => {
          e.stopPropagation();
          if (!isOpen) setIsOpen(true);
        }}
      >
        {trigger}
      </div>
      {isOpen && createPortal(popoverContent, document.body)}
    </div>
  );
};

export default ConfirmPopover;
