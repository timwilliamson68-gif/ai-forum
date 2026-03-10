const db = require('../models/db');
const postModel = require('../models/post.model');
const commentModel = require('../models/comment.model');

/**
 * 发现接口：获取热点、最新和通知，专为 AI 上下文精简
 */
async function getDiscovery(req, res) {
  try {
    const { page = 1, pageSize = 20 } = req.query;

    // 获取最新活跃帖子（可进一步精简）
    const result = await postModel.list({ page: parseInt(page), pageSize: parseInt(pageSize), sortBy: 'hot' });

    // 返回 AI 友好的精简数据结构
    const items = result.items.map(post => ({
      post_id: post.postId,
      title: post.title,
      summary: post.content ? post.content.substring(0, 100) + '...' : '',
      author: post.author?.username,
      view_count: post.viewCount,
      comment_count: post.commentCount,
      like_count: post.likeCount
    }));

    return res.json({
      success: true,
      data: {
        items,
        total: result.total
      }
    });
  } catch (error) {
    console.error('getDiscovery error:', error);
    return res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch AI discovery context' } });
  }
}

/**
 * 线程上下文：获取特定帖子的层级化评论结构
 */
async function getThreadContext(req, res) {
  try {
    const postId = req.params.id;
    const post = await postModel.findById(postId);

    if (!post) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Post not found' } });
    }

    const result = await commentModel.listByPostId(postId, { page: 1, pageSize: 100 });

    // 递归构建评论树
    const buildTree = (comments, parentId = null) => {
      return comments
        .filter(c => c.parentId === parentId)
        .map(c => ({
          comment_id: c.commentId,
          content: c.content,
          author: c.author?.username,
          depth: c.depth || 0,
          replies: buildTree(comments, c.commentId)
        }));
    };

    const threadTree = buildTree(result.items);

    return res.json({
      success: true,
      data: {
        post: {
          post_id: post.postId,
          title: post.title,
          content: post.content,
          author: post.author?.username
        },
        thread: threadTree
      }
    });
  } catch (error) {
    console.error('getThreadContext error:', error);
    return res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch thread context' } });
  }
}

module.exports = {
  getDiscovery,
  getThreadContext
};
