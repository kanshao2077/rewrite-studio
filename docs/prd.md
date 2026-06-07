# Rewrite Studio (Final Ultimate Version) 需求文档

## 1. 应用概述

### 1.1 应用名称
Rewrite Studio (Final Ultimate Version)

### 1.2 应用描述
一个用于管理 AI 语料组装的单页 Web 应用，支持项目管理、素材编辑、参考案例管理、系统提示词配置、实时预览及语料导出功能。

## 2. 技术栈

### 2.1 前端框架
- 单文件 HTML (HTML5 + Vanilla JavaScript + Tailwind CSS CDN)
- FontAwesome (CDN) 或 SVG

### 2.2 数据存储
- 使用浏览器 LocalStorage，确保刷新页面数据不丢失

## 3. 设计系统 (Morandi Palette)

### 3.1 配色方案
- **Global Bg**: `#E9DFE2`（网页背景）
- **Sidebar Bg**: `#DBEFF6`（侧边栏背景，设置 opacity-60）
- **Accent Blue**: `#A8D8E3`（高亮、边框、预览按钮）
- **Accent Warm**: `#C5B8BF`（设置按钮、删除图标）
- **Text Main**: `#5D7389`（主文字）
- **Card Bg**: `#FFFFFF`（卡片背景）

### 3.2 字体
- Inter 或系统无衬线字体
- 主要文字颜色：Text Main

## 4. 布局结构

### 4.1 全局布局
- 页面背景色：Global Bg
- 布局分为：左侧侧边栏 (260px 固定宽度) + 中间主内容区 (占据剩余全部高度)

### 4.2 左侧侧边栏
**关键布局逻辑**：左侧分为“功能区”和“项目列表区”两部分。

1. **App Header**
- 标题：Rewrite Studio（Bold, p-6）

2. **Action Buttons (功能常驻区)**
- 位置：紧接标题下方
- **Item 1**: `⚙️ AI Settings`（点击触发 Prompt Modal）
  - 样式：圆角按钮，背景色 `#C5B8BF`/20
- **Item 2**: `👁️ Preview & Copy`（点击触发 Preview Modal）
  - 样式：圆角按钮，背景色 `#A8D8E3`/20
  - **特效**：必须应用 `btn-pulse` 呼吸动画

3. **The Divider (必须保留)**
- 在功能按钮和项目列表之间，画一条虚线：`border-b border-dashed border-[#5D7389]/30`，上下边距 `my-6`

4. **Projects List (项目列表区)**
- Header：PROJECTS（Small label）
- List：可滚动区域，选中项高亮
- Bottom：New Project 按钮

### 4.3 主内容区 (Center Canvas)
- **Header**：仅显示当前项目名称
- **Scrollable Area**：移除所有底部固定 Footer，让中间内容区占据剩余全部高度
- **Zone 1: [Target Source Panel]**（顶部）
  - 组件：`` 折叠面板
  - 样式：背景 `#DBEFF6`，边框 `#A8D8E3`
  - 内容：📄 待改写素材 + 实时保存的 Textarea
- **Zone 2: [Reference Cases]**（下方）
  - 内容：多组 [原文] vs [成品] 卡片流
  - 样式：纯白卡片，圆角，细腻阴影

### 4.4 Modals (交互弹窗)
- 使用 `fixed inset-0` 居中布局
- **Mask**：`bg-[#5D7389]/10 backdrop-blur-md`（毛玻璃遮罩）
- **Container**：纯白圆角卡片，应用 `modal-pop` 进场动画
- **Modal 1 (Prompt)**：编辑系统提示词，实时保存
- **Modal 2 (Preview)**：只读预览，底部有大大的 Copy All 按钮

## 5. 动画与微交互
请在 `` 中写入以下 CSS，并应用到对应元素：

1. **呼吸光晕 (For Preview Button)**
```css
@keyframes softGlow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(168, 216, 227, 0); }
  50% { box-shadow: 0 0 0 4px rgba(168, 216, 227, 0.4); }
}
.btn-pulse { animation: softGlow 3s infinite ease-in-out; }
```

2. **Q弹进场 (For Modals)**
```css
@keyframes modalPop {
  0% { opacity: 0; transform: scale(0.96) translateY(10px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}
.modal-active .modal-content { animation: modalPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
```

3. **按键触感 (Tactile)**
- 所有按钮和列表项添加: `active:scale-[0.98] transition-transform duration-100`

## 6. 数据逻辑

### 6.1 数据结构
建议使用以下数据结构：
```js
const appData = {
  currentProjectId: 1,
  projects: [
    {
      id: 1,
      name: 默认项目,
      targetSource: '',
      referenceCases: [
        { source: , output: }
      ],
      systemPrompt: 默认提示词内容
    }
  ]
}
```

### 6.2 数据同步
- 任何输入变动 (input 事件) 都必须实时写入 LocalStorage
- 页面加载时从 LocalStorage 读取并渲染

### 6.3 复制顺序
复制内容 = [Reference Cases] + [Target Source] + [System Prompt]

### 6.4 默认提示词
首次打开默认值：
```
# Role
你是一位资深主编和文案风格模仿专家。

# Task
1. 分析上方【参考成品】（Reference Examples）的风格 DNA（语气、排版、Emoji 密度、结构）。
2. 将【新素材】（Target Material）重写为一篇全新的文章。

# Output Requirement
请严格按照【参考成品】的风格，撰写 **三个不同的草稿选项 (Option 1, 2, 3)**。

**关键约束 (Constraints)**：
* **风格一致性**：这三个版本必须 **全部** 严格符合参考案例的调性（色调、排版、Emoji 用法必须一致）。不要做“极简版”或“夸张版”的区分。
* **差异点**：它们之间的区别仅在于 **遣词造句的表达方式**、**开头引入的角度** 或 **段落的切入点** 不同。
* **目标**：给我提供三种“同一种味道”的表达方案，方便我从中挑选最顺口的一版。

请直接输出三个版本，中间用分割线隔开。
```

## 7. 交互规范

### 7.1 按钮交互
- 所有按钮交互要有 Hover 效果 (颜色加深或透明度变化)

### 7.2 界面风格
- UI 必须精致，Padding 要大，要有呼吸感
- 不要做成紧凑的后台管理系统风格

## 8. 其他约束

### 8.1 代码要求
- 代码必须完整包含在一个 index.html 文件中
- 必须包含所有 CSS/JS 代码

### 8.2 功能修正
1. **项目删除功能**：在侧边栏的项目列表中，允许删除项目。删除时需弹窗确认 (confirm)，删除后数据需同步从 LocalStorage 移除。
2. **动态重排索引**：当用户删除中间的某个对照组卡片时，剩余卡片的 Case #N以及聚合预览区的 ### 案例 N 必须自动重新排序（例如：删除了 Case 2，原 Case 3 自动变为 Case 2）。
3. **独立滚动视口**：页面布局要求 侧边栏 和 聚合预览区 固定位置，仅 中间主内容区 可独立滚动 (overflow-y-auto)，确保用户在编辑长文时，随时能点击切换项目或复制结果。
4. **初始状态**：新建项目时，默认自动创建一个空的对照组卡片，避免页面空白。