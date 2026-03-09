# UI 重构修正与对齐执行报告 (Fix Report)

本报告针对当前重构后“页面空白”及“布局失效”问题，提供精确的修正指引。

---

## 1. 核心修复 (Core Fixes) - 解决页面空白

### 1.1 路由挂载 (App.jsx)
- **问题**: `App.jsx` 仅包含 `<Outlet />`，未引入 `<Router />`。
- **操作**: 
  - 从 `@/router` 导入 `Router` 组件。
  - 将 `<Outlet />` 替换为 `<Router />`。
  - 确保 `main.jsx` 仍然保留 `BrowserRouter` 包裹。

### 1.2 CSS 变量对齐 (index.css)
- **问题**: `Layout.css` 使用的变量未定义。
- **操作**: 在 `index.css` 的 `:root` 中定义以下变量，并与 `App.jsx` 中的 AntD Token 保持同步：
  ```css
  :root {
    --color-base: #0d0d12;
    --color-surface: #15151d;
    --primary: #00e5ff;
    --spacing-lg: 24px;
    --spacing-md: 16px;
    --spacing-sm: 8px;
    --radius-lg: 12px;
    --glass-bg: rgba(21, 21, 29, 0.7);
    --glass-blur: blur(12px);
    --glass-saturate: saturate(180%);
  }
  ```

---

## 2. 布局优化 (Layout Refinement)

### 2.1 消除嵌套分栏 (Home/index.jsx)
- **问题**: `Home` 页面自带 `Row/Col` 分栏，与全局 `Layout` 的三栏架构冲突。
- **操作**: 
  - 移除 `Home` 页面外层的 `Row` 和 `Col`。
  - 将“板块列表”移动到专用的 `RightSidebar` 组件中，保持 `Home` 主区域仅显示帖子列表和 Tabs。

### 2.2 侧边栏内容填充
- **Sidebar (Left)**: 包含 Logo、主导航、热门分类快速入口。
- **RightSidebar (Right)**: 包含用户卡片、热门话题（从 Home 移过来）、统计信息。

---

## 3. 视觉与动效补全 (Visual & Animation)

### 3.1 增强科技感
- 给 `.glass` 类添加微弱的 RGB 边框渐变效果。
- 修复 `Layout.css` 中的 `fadeIn` 动画定义：
  ```css
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  ```

---

## 4. 执行优先级 (Action Priority)

1.  **Priority 1**: 修改 `App.jsx` 挂载路由，恢复页面渲染。
2.  **Priority 2**: 修改 `index.css` 定义变量，恢复三栏布局视觉。
3.  **Priority 3**: 迁移 `Home` 逻辑至 `RightSidebar`，清理布局冲突。
4.  **Priority 4**: 检查 `Header` 和 `Footer` 的 z-index，确保不遮挡侧边栏。

---
*注：请后续 AI 严格遵守以上修正方案，不要随意引入新的 UI 框架，保持 AntD 5.x + CSS Modules 的技术栈。*
