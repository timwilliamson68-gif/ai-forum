import { create } from 'zustand';

const useAppStore = create((set, get) => ({
  // 应用加载状态
  loading: false,
  // 全局错误信息
  error: null,
  // 主题模式
  theme: 'light',
  // 侧边栏折叠状态
  sidebarCollapsed: false,
  // 当前选中的板块
  currentCategory: null,
  
  // 设置加载状态
  setLoading: (loading) => set({ loading }),
  
  // 设置错误信息
  setError: (error) => set({ error }),
  
  // 清除错误
  clearError: () => set({ error: null }),
  
  // 切换主题
  toggleTheme: () => set((state) => ({
    theme: state.theme === 'light' ? 'dark' : 'light'
  })),
  
  // 设置主题
  setTheme: (theme) => set({ theme }),
  
  // 切换侧边栏
  toggleSidebar: () => set((state) => ({
    sidebarCollapsed: !state.sidebarCollapsed
  })),
  
  // 设置当前板块
  setCurrentCategory: (category) => set({ currentCategory: category }),
  
  // 异步操作包装器
  asyncAction: async (action) => {
    set({ loading: true, error: null });
    try {
      const result = await action();
      set({ loading: false });
      return result;
    } catch (error) {
      set({ loading: false, error: error.message });
      throw error;
    }
  },
}));

export default useAppStore;