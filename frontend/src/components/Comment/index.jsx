import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Avatar, Typography, Button, Input, Space, Tag } from 'antd';
import { AnimatePresence } from 'framer-motion';
import { UserOutlined, LikeOutlined, LikeFilled, MessageOutlined } from '@ant-design/icons';
import './Comment.css';

const { Text, Paragraph } = Typography;
const { TextArea } = Input;

// Framer Motion 动画配置
const commentVariants = {
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
      damping: 12,
      staggerChildren: 0.1
    }
  },
  hover: {
    backgroundColor: "rgba(0, 229, 255, 0.02)"
  }
};

const replyVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: { 
    opacity: 1, 
    height: "auto",
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  },
  exit: { 
    opacity: 0, 
    height: 0,
    transition: { duration: 0.2 }
  }
};

export default function Comment({ comment, index = 0, onLike, onReply, isLiked = false }) {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState('');
  
  const handleReplySubmit = () => {
    if (replyText.trim() && onReply) {
      onReply(comment.commentId, replyText);
      setReplyText('');
      setShowReplyInput(false);
    }
  };
  
  return (
    <motion.div
      className="comment-wrapper"
      variants={commentVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      transition={{ delay: index * 0.05 }}
    >
      <div className="comment-item">
        <Link to={`/user/${comment.author?.userId}`}>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Avatar 
              src={comment.author?.avatar} 
              icon={<UserOutlined />}
              className="comment-avatar"
            />
          </motion.div>
        </Link>
        
        <div className="comment-body">
          <div className="comment-header">
            <Link to={`/user/${comment.author?.userId}`} className="author-link" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Text strong className="author-name">{comment.author?.username}</Text>
              {comment.author?.is_bot && (
                <Tag color="purple" style={{ margin: 0, fontSize: 10, lineHeight: '16px' }}>
                  [Bot] {comment.author?.model_metadata || 'AI'}
                </Tag>
              )}
            </Link>
            <Text type="secondary" className="comment-time">
              {formatTime(comment.createdAt)}
            </Text>
          </div>
          
          <Paragraph className="comment-text">
            {comment.content}
          </Paragraph>
          
          <div className="comment-actions">
            <motion.span 
              className={`action-item ${isLiked ? 'liked' : ''}`}
              onClick={() => onLike && onLike(comment.commentId)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isLiked ? (
                <LikeFilled className="action-icon liked" />
              ) : (
                <LikeOutlined className="action-icon" />
              )}
              <span>{comment.likeCount || 0}</span>
            </motion.span>
            
            <motion.span 
              className="action-item"
              onClick={() => setShowReplyInput(!showReplyInput)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <MessageOutlined className="action-icon" />
              <span>回复</span>
            </motion.span>
          </div>
          
          <AnimatePresence>
            {showReplyInput && (
              <motion.div
                className="reply-input"
                variants={replyVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <TextArea
                  rows={2}
                  placeholder={`回复 ${comment.author?.username}...`}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="reply-textarea"
                />
                <Space style={{ marginTop: 8 }}>
                  <Button 
                    type="primary" 
                    size="small"
                    onClick={handleReplySubmit}
                  >
                    发送
                  </Button>
                  <Button 
                    size="small"
                    onClick={() => setShowReplyInput(false)}
                  >
                    取消
                  </Button>
                </Space>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* 子评论 */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="replies-list">
              {comment.replies.map((reply, i) => (
                <Comment 
                  key={reply.commentId} 
                  comment={reply} 
                  index={i}
                  onLike={onLike}
                  onReply={onReply}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// 时间格式化
function formatTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes} 分钟前`;
  if (hours < 24) return `${hours} 小时前`;
  if (days < 7) return `${days} 天前`;
  
  return date.toLocaleDateString();
}