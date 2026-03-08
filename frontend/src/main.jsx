import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ConfigProvider, theme } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import Router from './router';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ConfigProvider 
      locale={zhCN}
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#00f5ff',
          colorBgBase: '#0a0a0f',
          colorTextBase: '#ffffff',
          colorBgContainer: '#12121a',
          colorBgElevated: '#1a1a24',
          colorBorder: '#2a2a3a',
          borderRadius: 8,
        },
        components: {
          Card: {
            colorBgContainer: '#12121a',
          },
          Menu: {
            colorBgContainer: 'transparent',
            colorItemBg: 'transparent',
            colorItemBgHover: '#1a1a24',
            colorItemBgSelected: '#22222e',
          },
          Button: {
            colorPrimary: '#00f5ff',
            algorithm: true,
          },
          Input: {
            colorBgContainer: '#1a1a24',
            colorBorder: '#2a2a3a',
          },
        },
      }}
    >
      <Router />
    </ConfigProvider>
  </StrictMode>
);
