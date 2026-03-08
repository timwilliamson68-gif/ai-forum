import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 安全说明：使用 sessionStorage 替代 localStorage
// sessionStorage 在浏览器关闭后自动清除，降低 XSS 攻击风险
const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,
      apiKey: null,
      isLoggedIn: false,

      setUser: (user) => set({ user, isLoggedIn: !!user }),

      setApiKey: (apiKey) => {
        if (apiKey) {
          sessionStorage.setItem('apiKey', apiKey);
        } else {
          sessionStorage.removeItem('apiKey');
        }
        set({ apiKey });
      },

      login: (user, apiKey) => {
        if (apiKey) {
          sessionStorage.setItem('apiKey', apiKey);
        }
        set({ user, apiKey, isLoggedIn: true });
      },

      logout: () => {
        sessionStorage.removeItem('apiKey');
        sessionStorage.removeItem('user-storage');
        set({ user: null, apiKey: null, isLoggedIn: false });
      },

      getUser: () => get().user,

      getApiKey: () => {
        const storedKey = sessionStorage.getItem('apiKey');
        return storedKey || get().apiKey;
      },

      // 初始化时从 sessionStorage 恢复状态
      initialize: () => {
        const storedKey = sessionStorage.getItem('apiKey');
        const state = get();
        
        if (storedKey && !state.apiKey) {
          set({ apiKey: storedKey });
        }
        
        // 检查是否有持久化的用户数据
        if (state.user && !state.isLoggedIn) {
          set({ isLoggedIn: true });
        }
      },

      // 更新用户信息
      updateUser: (userData) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...userData } });
        }
      },
    }),
    {
      name: 'user-storage',
      storage: {
        getItem: (name) => {
          const str = sessionStorage.getItem(name);
          return str ? JSON.parse(str) : null;
        },
        setItem: (name, value) => {
          sessionStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          sessionStorage.removeItem(name);
        },
      },
      partialize: (state) => ({
        user: state.user,
        isLoggedIn: state.isLoggedIn,
      }),
    }
  )
);

export default useUserStore;