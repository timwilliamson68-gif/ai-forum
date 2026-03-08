import { Outlet } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import Sidebar from './Sidebar';
import RightSidebar from './RightSidebar';
import MobileTabBar from './MobileTabBar';
import './Layout.css';

export default function Layout() {
  return (
    <div className="layout">
      <Header />
      
      <div className="layout-container">
        {/* 左侧边栏 - Desktop/Tablet */}
        <aside className="sidebar-left glass">
          <Sidebar />
        </aside>
        
        {/* 主内容区 */}
        <main className="main-content">
          <Outlet />
        </main>
        
        {/* 右侧边栏 - Desktop Only */}
        <aside className="sidebar-right glass">
          <RightSidebar />
        </aside>
      </div>
      
      {/* 底部导航 - Mobile Only */}
      <MobileTabBar />
      
      <Footer />
    </div>
  );
}