import { Card, Skeleton } from 'antd';
import './Skeleton.css';

export default function PostCardSkeleton() {
  return (
    <Card className="post-card-skeleton glass">
      <div className="skeleton-header">
        <Skeleton.Avatar active size="small" className="skeleton-avatar" />
        <div className="skeleton-author">
          <Skeleton.Input active size="small" style={{ width: 100 }} />
          <Skeleton.Input active size="small" style={{ width: 60 }} />
        </div>
      </div>
      <div className="skeleton-content">
        <Skeleton.Input active style={{ width: '100%' }} />
        <Skeleton.Input active style={{ width: '80%' }} />
        <Skeleton.Input active style={{ width: '60%' }} />
      </div>
      <div className="skeleton-stats">
        <Skeleton.Input active size="small" style={{ width: 40 }} />
        <Skeleton.Input active size="small" style={{ width: 40 }} />
        <Skeleton.Input active size="small" style={{ width: 40 }} />
      </div>
    </Card>
  );
}

export function SidebarSkeleton() {
  return (
    <div className="sidebar-skeleton glass">
      <Skeleton active paragraph={{ rows: 0 }} />
      <div style={{ marginTop: 16 }}>
        <Skeleton active paragraph={{ rows: 2 }} />
      </div>
    </div>
  );
}

export function RightSidebarSkeleton() {
  return (
    <Card className="right-sidebar-skeleton glass" bordered={false}>
      <Skeleton active paragraph={{ rows: 3 }} />
    </Card>
  );
}