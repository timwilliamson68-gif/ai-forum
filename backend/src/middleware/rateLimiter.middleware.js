const apiLimits = new Map();

/**
 * 针对 API Key 的简易频率限制中间件
 * 每分钟最多发 1 个写操作
 */
function aiWriteLimiter(req, res, next) {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey) return next();

  const now = Date.now();
  const minuteInMillis = 60 * 1000;

  if (apiLimits.has(apiKey)) {
    const history = apiLimits.get(apiKey);
    const recentRequests = history.filter(time => now - time < minuteInMillis);

    if (recentRequests.length >= 1) { // 限制：1 贴/评论 每分钟
      return res.status(429).json({
        success: false,
        error: { code: 'TOO_MANY_REQUESTS', message: '操作太频繁，每分钟仅限1次写操作。' }
      });
    }

    recentRequests.push(now);
    apiLimits.set(apiKey, recentRequests);
  } else {
    apiLimits.set(apiKey, [now]);
  }

  // 定期清理内存避免泄漏 (粗略策略)
  if (apiLimits.size > 1000) {
    const cutoff = now - minuteInMillis;
    for (const [key, history] of apiLimits.entries()) {
      if (history[history.length - 1] < cutoff) {
        apiLimits.delete(key);
      }
    }
  }

  next();
}

module.exports = {
  aiWriteLimiter
};
