import { Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeOutlined,
  AppstoreOutlined,
  FireOutlined,
  ClockCircleOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import './Sidebar.css';

export default function Sidebar() {
  const location = useLocation();
  
  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: <Link to="/">首页</Link>,
    },
    {
      key: '/?tab=hot',
      icon: <FireOutlined />,
      label: <Link to="/?tab=hot">热门</Link>,
    },
    {
      key: '/?tab=latest',
      icon: <ClockCircleOutlined />,
      label: <Link to="/?tab=latest">最新</Link>,
    },
    {
      key: 'categories',
      icon: <AppstoreOutlined />,
      label: <Link to="/?tab=categories">板块</Link>,
    },
    {
      type: 'divider',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '设置',
    },
  ];

  const getSelectedKey = () => {
    const path = location.pathname;
    const tab = new URLSearchParams(location.search).get('tab');
    if (path === '/') {
      return tab ? `/?tab=${tab}` : '/';
    }
    return path;
  };

  return (
    <div className="sidebar">
      <Menu
        mode="inline"
        selectedKeys={[getSelectedKey()]}
        items={menuItems}
        className="sidebar-menu"
      />
    </div>
  );
}