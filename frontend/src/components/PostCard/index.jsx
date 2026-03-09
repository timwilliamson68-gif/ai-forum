import { Link, useNavigate } from 'react-router-dom';
import { Card, Avatar, Typography, Tag } from 'antd';

import { UserOutlined, EyeOutlined, MessageOutlined, LikeOutlined, FireOutlined } from '@ant-design/icons';
import './PostCard.css';

const { Text, Paragraph } = Typography;

// Framer Motion 动画配置
const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.98
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12
    }
  },
  hover: {
    y: -4,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  }
};

export default function PostCard({ post }) {
  const navigate = useNavigate();
  const isHot = (post.viewCount || 0) > 100 || (post.likeCount || 0) > 10;
  
  const handleNavigation = (e, path) => {
    e.preventDefault();
    if (document.startViewTransition) {
      document.startViewTransition(() => navigate(path));
    } else {
      navigate(path);
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      whileHover="hover"
      className="post-card-container"
    >
      <Card className="post-card glass" hoverable>
        <div className="post-card-header">
          <a href={`/user/${post.author?.userId}`} onClick={(e) => handleNavigation(e, `/user/${post.author?.userId}`)} className="author-link">
            <Avatar 
              src={post.author?.avatar} 
              icon={<UserOutlined />}
              className="author-avatar"
            />
            <div className="author-info">
              <Text strong className="author-name">{post.author?.username}</Text>
              <Text type="secondary" className="post-time">
                {new Date(post.createdAt).toLocaleDateString()}
              </Text>
            </div>
          </a>
          <div className="post-tags">
            {isHot && (
              <Tag color="orange" className="hot-tag animate-pulse">
                <FireOutlined /> 热门
              </Tag>
            )}
            {post.categoryName && (
              <Tag color="cyan" className="category-tag">{post.categoryName}</Tag>
            )}
          </div>
        </div>
        
        <a href={`/post/${post.postId}`} onClick={(e) => handleNavigation(e, `/post/${post.postId}`)} className="post-content-link">
          <h3 className="post-title gradient-text-hover">{post.title}</h3>
          <Paragraph ellipsis={{ rows: 2 }} className="post-excerpt">
            {post.content}
          </Paragraph>
        </a>
        
        <div className="post-stats">
          <span className="stat-item">
            <EyeOutlined className="stat-icon" />
            <span>{post.viewCount || 0}</span>
          </span>
          <span className="stat-item">
            <MessageOutlined className="stat-icon" />
            <span>{post.commentCount || 0}</span>
          </span>
          <span className="stat-item like">
            <LikeOutlined className="stat-icon" />
            <span>{post.likeCount || 0}</span>
          </span>
        </div>
      </Card>
    </motion.div>
  );
}