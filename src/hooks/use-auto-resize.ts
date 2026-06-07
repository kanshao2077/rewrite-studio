import { useEffect, useRef, useCallback } from 'react';

interface UseAutoResizeOptions {
  minHeight?: number;
  maxHeight?: number;
}

export function useAutoResize<T extends HTMLTextAreaElement>(
  value: string,
  options: UseAutoResizeOptions = {}
) {
  const ref = useRef<T>(null);
  const { minHeight = 80, maxHeight = 600 } = options;

  const resize = useCallback(() => {
    const textarea = ref.current;
    if (!textarea) return;

    // 重置高度以获取正确的 scrollHeight
    textarea.style.height = 'auto';
    
    // 计算新高度
    const newHeight = Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight);
    textarea.style.height = `${newHeight}px`;
    
    // 如果达到最大高度，启用滚动
    textarea.style.overflowY = textarea.scrollHeight > maxHeight ? 'auto' : 'hidden';
  }, [minHeight, maxHeight]);

  useEffect(() => {
    resize();
  }, [value, resize]);

  return { ref, resize };
}
