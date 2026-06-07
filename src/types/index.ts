/**
 * Rewrite Studio 类型定义
 */

import type { ReactNode } from 'react';

// ============ 基础类型 ============

/** 对照案例项 */
export interface CaseItem {
  id: string;
  source: string;
  output: string;
  name?: string; // 自定义案例名称
}

/** 项目 */
export interface Project {
  id: string;
  name: string;
  items: CaseItem[];
  targetSourceText?: string; // 待改写素材
  systemPrompt?: string; // AI 写作指令
}

/** 应用全局数据 */
export interface AppData {
  currentProjectId: string | null;
  projects: Project[];
}

// ============ UI 组件类型 ============

/** 路由配置 */
export interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

/** 下拉选项 */
export interface Option {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  withCount?: boolean;
}

// ============ 常量 ============

/** 默认系统提示词 */
export const DEFAULT_SYSTEM_PROMPT = `# Role
你是一位资深主编和文案风格模仿专家。

# Task
1. 分析上方【参考成品】（Reference Examples）的风格 DNA（语气、排版、Emoji 密度、结构）。
2. 将【新素材】（Target Material）重写为一篇全新的文章。

# Output Requirement
请严格按照【参考成品】的风格，撰写 **三个不同的草稿选项 (Option 1, 2, 3)**。

**关键约束 (Constraints)**：
* **风格一致性**：这三个版本必须 **全部** 严格符合参考案例的调性（色调、排版、Emoji 用法必须一致）。不要做"极简版"或"夸张版"的区分。
* **差异点**：它们之间的区别仅在于 **遣词造句的表达方式**、**开头引入的角度** 或 **段落的切入点** 不同。
* **目标**：给我提供三种"同一种味道"的表达方案，方便我从中挑选最顺口的一版。

请直接输出三个版本，中间用分割线隔开。`;

/** 存储 key */
export const STORAGE_KEY = 'rewrite_studio_data';
