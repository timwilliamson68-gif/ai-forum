import { useState, useEffect } from 'react';
import { Row, Col, Card, List, Typography, Spin, Tabs } from 'antd';
import { AppstoreOutlined, FireOutlined, ClockCircleOutlined, FolderOutlined } from '@ant-design/icons';
import { Link, useSearchParams } from 'react-router-dom';
import PostCard from '../../components/PostCard';
import { categoryApi } from '../../services/category';
import { postApi } from '../../services/post';

const { Title } = Typography;

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 从 URL Query 获取当前 tab
  const activeTab = searchParams.get('tab') || 'hot';

  useEffect(() => {
    loadData(activeTab);
  }, [activeTab]);

  const loadData = async (tab) => {
    setLoading(true);
    try {
      // 根据 tab 决定排序方式
      const sortBy = tab === 'latest' ? 'latest' : 'hot';
      
      const [catRes, postRes] = await Promise.all([
        categoryApi.list({ pageSize: 20 }),
        postApi.list({ pageSize: 10, sortBy }),
      ]);
      if (catRes.success) setCategories(catRes.data?.items || []);
      if (postRes.success) setPosts(postRes.data?.items || []);
    } catch (error) {
      console.error('加载数据失败:', error);
    }
    setLoading(false);
  };

  const handleTabChange = (key) => {
    setSearchParams({ tab: key });
  };

  const tabItems = [
    { 
      key: 'hot', 
      label: (
        <span>
          <FireOutlined /> 热门
        </span>
      )
    },
    { 
      key: 'latest', 
      label: (
        <span>
          <ClockCircleOutlined /> 最新
        </span>
      )
    },
    { 
      key: 'categories', 
      label: (
        <span>
          <FolderOutlined /> 板块
        </span>
      )
    },
  ];

  return (
    <div className="home-page">
      <Tabs activeKey={activeTab} items={tabItems} onChange={handleTabChange} />

      <Row gutter={24}>
        <Col xs={24} lg={16}>
          <Spin spinning={loading}>
            <Title level={4}>
              {activeTab === 'hot' ? '热门帖子' : activeTab === 'latest' ? '最新帖子' : '板块帖子'}
            </Title>
            <List
              dataSource={posts}
              renderItem={(post) => (
                <List.Item>
                  <PostCard post={post} />
                </List.Item>
              )}
            />
          </Spin>
        </Col>
        <Col xs={24} lg={8}>
          <Title level={4}><AppstoreOutlined /> 板块列表</Title>
          <Card>
            <List
              dataSource={categories}
              renderItem={(cat) => (
                <List.Item>
                  <Link to={`/category/${cat.categoryId}`}>
                    <strong>{cat.name}</strong>
                    <br />
                    <Typography.Text type="secondary">{cat.description}</Typography.Text>
                  </Link>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}