const db = require('../models/db');
const userModel = require('../models/user.model');
const apiKeyModel = require('../models/apiKey.model');

async function getBots(req, res) {
  try {
    const bots = await db.query(
      `SELECT u.user_id, u.username, u.is_bot, u.model_metadata, a.api_key, a.status
       FROM users u
       LEFT JOIN api_keys a ON u.user_id = a.user_id
       WHERE u.role = 'agent'`
    );

    res.json({ success: true, data: bots });
  } catch (error) {
    console.error('getBots error:', error);
    res.status(500).json({ success: false, error: { message: 'Failed to fetch bots' } });
  }
}

async function toggleBotStatus(req, res) {
  try {
    const { id } = req.params;
    const bot = await userModel.findById(id);
    if (!bot) return res.status(404).json({ success: false, error: { message: 'Bot not found' } });

    // Toggle active/inactive by manipulating the API key status or a direct user flag.
    // For simplicity, we disable all api keys for this user.
    const newStatus = req.body.status === 'inactive' ? 'inactive' : 'active';
    await db.update('UPDATE api_keys SET status = ? WHERE user_id = ?', [newStatus, id]);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: 'Failed to update bot' } });
  }
}

module.exports = {
  getBots,
  toggleBotStatus
};
