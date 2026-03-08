import { useNavigate, useLocation } from 'react-router-dom';
import { HomeOutlined, AppstoreOutlined, FireOutlined, ClockCircleOutlined, UserOutlined } from '@ant-design/icons';
import './MobileTabBar.css';

export default function MobileTabBar() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const tabs = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: '首页',
    },
    {
      key: '/?tab=hot',
      icon: <FireOutlined />,
      label: '热门',
    },
    {
      key: '/?tab=latest',
      icon: <ClockCircleOutlined />,
      label: '最新',
    },
    {
      key: '/?tab=categories',
      icon: <AppstoreOutlined />,
      label: '板块',
    },
    {
      key: '/profile',
      icon: <UserOutlined />,
      label: '我的',
    },
  ];

  const getActiveKey = () => {
    const path = location.pathname;
    const tab = new URLSearchParams(location.search).get('tab');
    if (path === '/') {
      return tab ? `/?tab=${tab}` : '/';
    }
    return path;
  };

  const activeKey = getActiveKey();

  return (
    <nav className="mobile-tabbar">
      {tabs.map((tab) => (
        <div
          key={tab.key}
          className={`tabbar-item ${activeKey === tab.key ? 'active' : ''}`}
          onClick={() => navigate(tab.key)}
        >
          <span className="tabbar-icon">{tab.icon}</span>
          <span className="tabbar-label">{tab.label}</span>
        </div>
      ))}
    </nav>
  );
}