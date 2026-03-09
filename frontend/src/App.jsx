import { useEffect } from 'react';
import { ConfigProvider, theme, App as AntApp } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import useUserStore from './store/userStore';
import Router from './router';
import GlobalApp from './components/GlobalApp';
import './index.css';

// OKLCH 色彩系统
const colorTokens = {
  // 背景色
  colorBgBase: 'oklch(12% 0.01 260)', // oklch(12% 0.01 260) 极深蓝黑
  colorBgContainer: 'oklch(18% 0.02 260)', // oklch(18% 0.02 260) 卡片层
  colorBgElevated: 'oklch(22% 0.02 260)', // oklch(22% 0.02 260) 悬浮层
  colorBgLayout: '#0a0a0f', // 最深背景
  
  // 品牌色
  colorPrimary: 'oklch(70% 0.18 200)', // oklch(70% 0.18 200) 电光青
  colorSecondary: 'oklch(65% 0.22 290)',
  colorInfo: 'oklch(70% 0.18 200)',
  colorSuccess: '#00ff88', // 霓虹绿
  colorWarning: '#ff8c00', // 霓虹橙
  colorError: '#ff3366', // 霓虹红
  
  // 文字色
  colorTextBase: '#ffffff',
  colorTextSecondary: 'rgba(255, 255, 255, 0.65)',
  colorTextTertiary: 'rgba(255, 255, 255, 0.45)',
  
  // 边框色
  colorBorder: 'oklch(25% 0.03 260 / 0.1)',
  colorBorderSecondary: '#1e1e28',
  
  // 圆角
  borderRadius: 8,
};

function App() {
  // 初始化用户状态
  useEffect(() => {
    useUserStore.getState().initialize();
  }, []);
  
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        algorithm: theme.darkAlgorithm,
        token: colorTokens,
        components: {
          Card: {
            colorBgContainer: colorTokens.colorBgContainer,
            boxShadowTertiary: '0 4px 24px rgba(0, 229, 255, 0.06)',
          },
          Menu: {
            colorBgContainer: 'transparent',
            itemBg: 'transparent',
            itemHoverBg: 'rgba(0, 229, 255, 0.08)',
            itemSelectedBg: 'rgba(0, 229, 255, 0.12)',
            itemColor: 'rgba(255, 255, 255, 0.85)',
            itemHoverColor: '#00e5ff',
            itemSelectedColor: '#00e5ff',
          },
          Button: {
            colorPrimary: colorTokens.colorPrimary,
            primaryShadow: '0 4px 12px rgba(0, 229, 255, 0.3)',
          },
          Input: {
            colorBgContainer: colorTokens.colorBgElevated,
            colorBorder: colorTokens.colorBorder,
            hoverBorderColor: '#00e5ff',
            activeBorderColor: '#00e5ff',
          },
          Tabs: {
            colorPrimary: colorTokens.colorPrimary,
            itemSelectedColor: colorTokens.colorPrimary,
            itemHoverColor: colorTokens.colorPrimary,
            inkBarColor: colorTokens.colorPrimary,
          },
          Layout: {
            bodyBg: colorTokens.colorBgLayout,
            headerBg: colorTokens.colorBgContainer,
            triggerBg: colorTokens.colorBgElevated,
          },
          Avatar: {
            colorBgContainer: colorTokens.colorBgElevated,
          },
        },
      }}
    >
      <AntApp>
        <GlobalApp />
        <Router />
      </AntApp>
    </ConfigProvider>
  );
}

export default App;