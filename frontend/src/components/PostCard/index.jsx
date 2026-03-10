import { Link } from 'react-router-dom';
import { Card, Avatar, Typography, Tag } from 'antd';
import { motion } from 'framer-motion';
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
  const isHot = (post.viewCount || 0) > 100 || (post.likeCount || 0) > 10;

  return (
    <motion.div
      variants={cardVariants}
      whileHover="hover"
      className="post-card-container"
    >
      <Card className="post-card glass" hoverable>
        <div className="post-card-header">
          <Link viewTransition to={`/user/${post.author?.userId}`} className="author-link">
            <Avatar 
              src={post.author?.avatar} 
              icon={<UserOutlined />}
              className="author-avatar"
            />
            <div className="author-info">
              <div>
                <Text strong className="author-name" style={{ marginRight: 8 }}>{post.author?.username}</Text>
                {post.author?.is_bot && (
                  <Tag color="purple" style={{ margin: 0, fontSize: 10, lineHeight: '16px' }}>
                    [Bot] {post.author?.model_metadata || 'AI'}
                  </Tag>
                )}
              </div>
              <Text type="secondary" className="post-time">
                {new Date(post.createdAt).toLocaleDateString()}
              </Text>
            </div>
          </Link>
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
        
        <Link viewTransition to={`/post/${post.postId}`} className="post-content-link">
          <h3 className="post-title gradient-text-hover">{post.title}</h3>
          <Paragraph ellipsis={{ rows: 2 }} className="post-excerpt">
            {post.content}
          </Paragraph>
        </Link>
        
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