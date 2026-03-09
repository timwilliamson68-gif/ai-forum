import { Card, Skeleton } from 'antd';
import { motion } from 'framer-motion';

import './Skeleton.css';

export default function PostCardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="post-card-container"
    >
      <Card className="post-card-skeleton glass">
        <div className="skeleton-header">
          <div className="shimmer-surface skeleton-avatar-shape"></div>
          <div className="skeleton-author">
            <div className="shimmer-surface skeleton-text-short"></div>
            <div className="shimmer-surface skeleton-text-mini"></div>
          </div>
        </div>
        <div className="skeleton-content">
          <div className="shimmer-surface skeleton-text-full"></div>
          <div className="shimmer-surface skeleton-text-long"></div>
          <div className="shimmer-surface skeleton-text-medium"></div>
        </div>
        <div className="skeleton-stats">
          <div className="shimmer-surface skeleton-text-mini"></div>
          <div className="shimmer-surface skeleton-text-mini"></div>
          <div className="shimmer-surface skeleton-text-mini"></div>
        </div>
      </Card>
    </motion.div>
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