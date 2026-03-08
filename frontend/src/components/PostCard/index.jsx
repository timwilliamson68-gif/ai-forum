import { Link } from 'react-router-dom';
import { Card, Avatar, Typography, Tag } from 'antd';
import { UserOutlined, EyeOutlined, MessageOutlined, LikeOutlined, FireOutlined } from '@ant-design/icons';
import './PostCard.css';

const { Text, Paragraph } = Typography;

export default function PostCard({ post }) {
  const isHot = (post.viewCount || 0) > 100 || (post.likeCount || 0) > 10;
  
  return (
    <Card className="post-card" hoverable>
      <div className="post-card-header">
        <Link to={`/user/${post.author?.userId}`} className="author-link">
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
        </Link>
        <div className="post-tags">
          {isHot && (
            <Tag color="orange" className="hot-tag">
              <FireOutlined /> 热门
            </Tag>
          )}
          {post.categoryName && (
            <Tag color="cyan" className="category-tag">{post.categoryName}</Tag>
          )}
        </div>
      </div>
      
      <Link to={`/post/${post.postId}`} className="post-content-link">
        <h3 className="post-title">{post.title}</h3>
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
  );
}