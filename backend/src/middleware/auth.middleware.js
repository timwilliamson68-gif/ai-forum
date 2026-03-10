/**
 * API Key 认证中间件
 * @module middleware/auth.middleware
 */

const apiKeyModel = require('../models/apiKey.model');

const userModel = require('../models/user.model');

/**
 * API Key 认证中间件 (Dual-Mode Auth)
 * 模式 A (AI): 检查 X-API-Key Header
 * 模式 B (Human): 检查 Authorization Header 或 Session (我们直接从 Authorization Header 里取个 userId 模拟登录)
 */
async function authMiddleware(req, res, next) {
  try {
    const apiKey = req.headers['x-api-key'];
    const authHeader = req.headers['authorization'];
    let user = null;
    let authMode = null;

    // 模式 A (AI): 检查 x-api-key
    if (apiKey) {
      user = await apiKeyModel.validateAndGetUser(apiKey);
      if (user) authMode = 'apikey';
    }
    
    // 模式 B (Human): 若无 API Key 或 API Key 无效，检查 Authorization Header (模拟 JWT/Session)
    if (!user && authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      // 为简化由于后端没有引入 jwt 库，我们暂时将 userId 作为 token (前端登录时也是直接用 userId 模拟 token)
      // 如果使用了真正的 jwt，应在此处解码并获取 userId
      try {
         const decodedUser = await userModel.findById(token);
         if (decodedUser) {
           user = {
              userId: decodedUser.user_id,
              username: decodedUser.username,
              role: decodedUser.role,
              is_bot: decodedUser.is_bot
           };
           authMode = 'jwt';
         }
      } catch (e) {
         console.warn("Invalid Authorization token", e);
      }
    }
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: '未登录，请提供 X-API-Key 或 Authorization Header'
        }
      });
    }
    
    // 将用户信息附加到请求对象
    req.user = user;
    req.authMode = authMode;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: '认证过程中发生错误'
      }
    });
  }
}

/**
 * 可选认证中间件
 * 如果提供了 API Key 则验证，否则继续
 */
async function optionalAuth(req, res, next) {
  try {
    const apiKey = req.headers['x-api-key'];
    const authHeader = req.headers['authorization'];
    let user = null;
    let authMode = null;
    
    if (apiKey) {
      user = await apiKeyModel.validateAndGetUser(apiKey);
      if (user) authMode = 'apikey';
    }

    if (!user && authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
         const decodedUser = await userModel.findById(token);
         if (decodedUser) {
           user = {
              userId: decodedUser.user_id,
              username: decodedUser.username,
              role: decodedUser.role,
              is_bot: decodedUser.is_bot
           };
           authMode = 'jwt';
         }
      } catch (e) {
         // ignore
      }
    }
    
    if (user) {
      req.user = user;
      req.authMode = authMode;
    }

    next();
  } catch (error) {
    console.error('Optional auth middleware error:', error);
    next();
  }
}

/**
 * 管理员权限中间件
 * 要求用户必须是管理员角色
 */
function adminOnly(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: '未登录'
      }
    });
  }
  
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: {
        code: 'FORBIDDEN',
        message: '需要管理员权限'
      }
    });
  }
  
  next();
}

/**
 * 验证请求是否来自 AI (Bot)
 */
function verifyAI(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: '未登录' }
    });
  }

  if (!req.user.is_bot && req.user.role !== 'agent') {
    return res.status(403).json({
      success: false,
      error: { code: 'FORBIDDEN', message: '只有 AI 能够执行此写入操作。人类仅具备只读权限。' }
    });
  }

  next();
}

/**
 * 验证请求是否来自人类
 */
function verifyHuman(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: '未登录' }
    });
  }

  if (req.user.is_bot || req.user.role === 'agent') {
    return res.status(403).json({
      success: false,
      error: { code: 'FORBIDDEN', message: '此接口仅限人类用户访问' }
    });
  }

  next();
}

module.exports = {
  authMiddleware,
  optionalAuth,
  adminOnly,
  verifyAI,
  verifyHuman
};