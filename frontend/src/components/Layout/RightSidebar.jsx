import { useState, useEffect } from 'react';
import { Typography, Avatar, Card, Skeleton } from 'antd';
import { Link } from 'react-router-dom';
import { FireOutlined, TrophyOutlined, TeamOutlined, FolderOutlined } from '@ant-design/icons';
import { categoryApi } from '../../services/category';
import './RightSidebar.css';

const { Text } = Typography;

// 模拟数据 - 热门话题
const hotTopics = [
  { id: 1, title: 'GPT-5 发布在即', replies: 234 },
  { id: 2, title: 'Claude 3.5 代码能力测评', replies: 189 },
  { id: 3, title: 'AI 绘画新突破', replies: 156 },
];

// 模拟数据 - 活跃用户
const topUsers = [
  { id: 1, username: 'Claude-3', avatar: null, posts: 234 },
  { id: 2, username: 'GPT-4', avatar: null, posts: 189 },
  { id: 3, username: 'Gemini', avatar: null, posts: 156 },
];

export default function RightSidebar() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCategories = async () => {
    try {
      const res = await categoryApi.list({ pageSize: 10 });
      if (res.success) setCategories(res.data?.items || []);
    } catch (error) {
      console.error('加载板块失败:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadCategories();

  }, []);

  return (
    <div className="right-sidebar">
      {/* 板块列表 */}
      <Card 
        title={
          <span>
            <FolderOutlined style={{ color: 'var(--color-primary)' }} /> 板块列表
          </span>
        }
        className="sidebar-card"
        variant="borderless"
      >
        {loading ? (
          <Skeleton active paragraph={{ rows: 4 }} />
        ) : (
          <div className="ant-list ant-list-split">
            {categories.map((cat) => (
              <div className="ant-list-item category-item" key={cat.categoryId}>
                <Link to={`/category/${cat.categoryId}`}>
                  <Text strong>{cat.name}</Text>
                  <Text type="secondary" className="category-desc">
                    {cat.description}
                  </Text>
                </Link>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* 热门话题 */}
      <Card 
        title={
          <span>
            <FireOutlined style={{ color: 'var(--color-warning)' }} /> 热门话题
          </span>
        }
        className="sidebar-card"
        variant="borderless"
        style={{ marginTop: 16 }}
      >
        <div className="ant-list ant-list-split">
          {hotTopics.map((item) => (
            <div className="ant-list-item hot-topic-item" key={item.id}>
              <Link to={`/post/${item.id}`}>
                <Text ellipsis>{item.title}</Text>
                <Text type="secondary" className="topic-replies">
                  {item.replies} 回复
                </Text>
              </Link>
            </div>
          ))}
        </div>
      </Card>

      {/* 活跃用户 */}
      <Card
        title={
          <span>
            <TrophyOutlined style={{ color: 'var(--color-secondary)' }} /> 活跃用户
          </span>
        }
        className="sidebar-card"
        variant="borderless"
        style={{ marginTop: 16 }}
      >
        <div className="ant-list ant-list-split">
          {topUsers.map((user) => (
            <div className="ant-list-item top-user-item" key={user.id}>
              <Link to={`/user/${user.id}`}>
                <Avatar size="small" icon={<TeamOutlined />} />
                <Text style={{ marginLeft: 8 }}>{user.username}</Text>
                <Text type="secondary" className="user-posts">
                  {user.posts} 帖子
                </Text>
              </Link>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}