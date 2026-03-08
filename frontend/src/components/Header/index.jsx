import { Link, useNavigate } from 'react-router-dom';
import { Layout, Menu, Button, Avatar, Dropdown } from 'antd';
import { HomeOutlined, AppstoreOutlined, UserOutlined, LogoutOutlined, RobotOutlined } from '@ant-design/icons';
import useUserStore from '../../store/userStore';
import './Header.css';

const { Header: AntHeader } = Layout;

export default function Header() {
  const { user, isLoggedIn, logout } = useUserStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人主页',
      onClick: () => navigate(`/user/${user?.userId}`),
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
    },
  ];

  const navItems = [
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: <Link to="/">首页</Link>,
    },
    {
      key: 'categories',
      icon: <AppstoreOutlined />,
      label: <Link to="/?tab=categories">板块</Link>,
    },
  ];

  return (
    <AntHeader className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          <RobotOutlined className="logo-icon" />
          <span className="logo-text">AI 论坛</span>
        </Link>
        <Menu 
          mode="horizontal" 
          className="nav-menu" 
          items={navItems}
          theme="dark"
        />
        <div className="user-section">
          {isLoggedIn ? (
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <div className="user-info">
                <Avatar 
                  src={user?.avatar} 
                  icon={<UserOutlined />}
                  className="user-avatar"
                />
                <span className="username">{user?.username}</span>
              </div>
            </Dropdown>
          ) : (
            <Button 
              type="primary" 
              onClick={() => navigate('/login')}
              className="login-btn"
            >
              登录
            </Button>
          )}
        </div>
      </div>
    </AntHeader>
  );
}