# AI 论坛 UI 重构与现代化适配 - 最终执行方案 (V2.0)

本方案旨在指导 AI 开发者将 `ai-forum` 项目从初级 Web 界面重构为具备**极致科技感、丝滑交互、全响应式**的现代化社区平台。

---

## 1. 视觉设计系统 (Tech-Minimalism & Cyber-Glow)

### 1.1 色彩系统 (基于 OKLCH 模式)
使用现代浏览器支持的 `oklch()` 调色，确保色彩在高动态范围显示器上的表现：
- **背景层级**:
  - `Base`: `oklch(12% 0.01 260)` (极深蓝黑)
  - `Surface`: `oklch(18% 0.02 260)` (卡片层)
  - `Border`: `oklch(25% 0.03 260 / 0.1)` (半透明分割线)
- **品牌色 (Neon)**:
  - `Primary`: `oklch(70% 0.18 200)` (电光青)
  - `Secondary`: `oklch(65% 0.22 290)` (极光紫)
- **玻璃拟态**: `backdrop-filter: blur(12px) saturate(180%);`

### 1.2 字体与排版
- **系统字体**: `Inter, system-ui, sans-serif`
- **等宽字体 (代码/元数据)**: `JetBrains Mono`
- **字阶**: 采用 1.25 倍比率 (Major Third)，标题使用 `font-weight: 700` 并配合 `-webkit-background-clip: text` 实现微光渐变。

---

## 2. 响应式布局架构 (Modern Grid & Container Queries)

### 2.1 全局三栏式布局 (Layout.jsx)
- **Mobile (< 768px)**: 单列流。顶部 Slim Header + 底部浮动 TabBar。
- **Tablet (768px - 1199px)**: 双栏。左侧侧边栏折叠为图标，主内容占满，右侧栏隐藏。
- **Desktop (>= 1200px)**: 三栏。
  - **Left (260px)**: 固定侧边导航 (Nav, Categories)。
  - **Center (Flexible)**: 主内容流，最大宽度 800px 以保证阅读舒适度。
  - **Right (320px)**: 侧边栏 (User Profile, Hot Topics, Stats)。

### 2.2 组件自适应 (Container Queries)
- 使用 `@container` 属性。`PostCard` 组件在侧边栏显示时自动切换为“紧凑模式”，在主流显示时切换为“详情模式”，无需依赖 Media Query。

---

## 3. 丝滑交互逻辑 (Micro-interactions)

### 3.1 Framer Motion 动效指南
- **页面切换 (AnimatePresence)**:
  - `initial: { opacity: 0, y: 10 }`
  - `animate: { opacity: 1, y: 0 }`
  - `exit: { opacity: 0, scale: 0.98 }`
- **列表加载**: 使用 `staggerChildren` 实现卡片逐个弹出的“流体感”。
- **按钮反馈**: 点击时触发 `scale: 0.95` 的物理回弹。

### 3.2 骨架屏 (Skeleton Screens)
- 严禁使用空白 Loading。使用具备 `shimmer` 动画的占位符，背景色采用 `Surface` 颜色。

---

## 4. 技术实施细节 (Critical Implementation)

### 4.1 样式治理与 Ant Design 适配
- **弃用 `!important`**: 
  - 使用 AntD 5.x 的 `theme.useToken()`。
  - 自定义组件使用 **CSS Modules**。
- **全局变量**: 在 `index.css` 定义 `--primary`, `--bg-base` 等 CSS 变量，便于 JS 和 CSS 同步。

### 4.2 路由与状态修复
- **[FIX] 编码问题**: 强制 `index.html` 编码，移除所有原生 Emoji，替换为 `Lucide-react` 或 `@ant-design/icons`。
- **[FIX] Store 初始化**: 在 `App.jsx` 的 `useEffect` 中执行 `userStore.initialize()`，确保刷新不掉线。
- **[FIX] 首页 Tabs**: 将 `Home` 页面的 Tabs 与 URL Query (`?tab=latest`) 绑定，监听 `onChange` 触发 `fetch`。

### 4.3 现代化特性利用
- **View Transitions**: 在路由切换时使用 `document.startViewTransition`（如浏览器支持）。
- **Scrollbar**: 定制极细的半透明滚动条。

---

## 5. 执行优先级 (Task Roadmap)

1.  **Phase 1 (Global Context)**: 重构 `App.jsx` 为核心容器，配置 `ConfigProvider` 暗色 Token，清理 `main.jsx`。
2.  **Phase 2 (Structural Layout)**: 编写新的 `Layout` 组件（Grid 架构），实现三栏适配逻辑。
3.  **Phase 3 (Component Refactor)**: 重写 `PostCard` 和 `Comment` 组件，引入 Framer Motion。
4.  **Phase 4 (Logic Fixes)**: 修复 Home Tab 联动、登录状态持久化、API 错误 Toast 化。
5.  **Phase 5 (Polish)**: 注入 OKLCH 色彩渐变、玻璃拟态效果、响应式细节微调。

---
*注：请在执行过程中保持代码简洁，优先使用函数式组件与 Hooks，所有样式必须符合响应式标准。*
