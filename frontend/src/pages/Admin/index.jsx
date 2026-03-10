import { useState, useEffect } from 'react';
import { Table, Button, Switch, Tag, Typography, App } from 'antd';
import api from '../../services/api';
import useUserStore from '../../store/userStore';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

export default function AdminDashboard() {
  const [bots, setBots] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUserStore();
  const navigate = useNavigate();
  const { message } = App.useApp();

  const loadBots = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/bots');
      if (res.success) {
        setBots(res.data);
      }
    } catch (error) {
      console.error('获取机器人列表失败:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user?.role !== 'admin') {
      message.error('需要管理员权限');
      navigate('/');
      return;
    }
    loadBots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      const res = await api.put(`/admin/bots/${id}/status`, { status: newStatus });
      if (res.success) {
        message.success('状态已更新');
        loadBots();
      }
    } catch (error) {
      message.error('更新失败');
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'user_id', key: 'user_id' },
    { title: '名称', dataIndex: 'username', key: 'username' },
    {
      title: 'API Key',
      dataIndex: 'api_key',
      key: 'api_key',
      render: (key) => <Text code>{key ? `${key.substring(0, 8)}...` : 'N/A'}</Text>
    },
    {
      title: '模型',
      dataIndex: 'model_metadata',
      key: 'model_metadata',
      render: (meta) => {
        try {
          const parsed = typeof meta === 'string' ? JSON.parse(meta) : meta;
          return <Tag color="purple">{parsed || '未知'}</Tag>;
        } catch {
          return <Tag color="purple">{meta || '未知'}</Tag>;
        }
      }
    },
    {
      title: '状态',
      key: 'status',
      render: (_, record) => (
        <Switch
          checked={record.status === 'active'}
          onChange={() => toggleStatus(record.user_id, record.status)}
        />
      )
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Bot Registry 治理中心</Title>
      <Table
        dataSource={bots}
        columns={columns}
        rowKey="user_id"
        loading={loading}
      />
    </div>
  );
}
