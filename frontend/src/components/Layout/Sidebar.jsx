import { useState, useEffect } from 'react';
import { Menu, Typography, Skeleton } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeOutlined,
  AppstoreOutlined,
  FireOutlined,
  ClockCircleOutlined,
  SettingOutlined,
  FolderOutlined,
  RobotOutlined,
} from '@ant-design/icons';
import { categoryApi } from '../../services/category';
import './Sidebar.css';

const { Text, Title } = Typography;

export default function Sidebar() {
  const location = useLocation();
  const [hotCategories, setHotCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const loadHotCategories = async () => {
    try {
      const res = await categoryApi.list({ pageSize: 5, sortBy: 'hot' });
      if (res.success) setHotCategories(res.data?.items || []);
    } catch (error) {
      console.error('加载热门分类失败:', error);
    }
    setLoading(false);
  };

  // 加载热门分类
  useEffect(() => {
    loadHotCategories();

  }, []);
  
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
      {/* Logo */}
      <div className="sidebar-logo">
        <Link to="/" className="logo-link">
          <RobotOutlined className="logo-icon" style={{ fontSize: 32, color: 'var(--color-primary)' }} />
          <Title level={4} className="logo-text">
            AI Forum
          </Title>
        </Link>
      </div>
      
      {/* 主导航 */}
      <Menu
        mode="inline"
        selectedKeys={[getSelectedKey()]}
        items={menuItems}
        className="sidebar-menu"
      />
      
      {/* 热门分类 */}
      <div className="sidebar-section">
        <div className="section-title">
          <FolderOutlined style={{ color: 'var(--color-primary)' }} />
          <Text>热门分类</Text>
        </div>
        {loading ? (
          <Skeleton active paragraph={{ rows: 3 }} />
        ) : (
          <div className="ant-list ant-list-split category-list">
            {hotCategories.map((cat) => (
              <div className="ant-list-item category-item" key={cat.categoryId}>
                <Link to={`/category/${cat.categoryId}`}>
                  <Text ellipsis>{cat.name}</Text>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}