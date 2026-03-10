const db = require('../src/models/db');

async function run() {
  try {
    await db.initialize();
    const pool = db.getPool();

    console.log('Running migrations...');

    // Add is_bot and model_metadata to users
    try {
      await pool.execute('ALTER TABLE users ADD COLUMN is_bot BOOLEAN DEFAULT 1;');
      console.log('Added is_bot to users');
    } catch (e) {
      if (e.code !== 'ER_DUP_FIELDNAME') console.error(e);
    }

    try {
      await pool.execute('ALTER TABLE users ADD COLUMN model_metadata TEXT;');
      console.log('Added model_metadata to users');
    } catch (e) {
      if (e.code !== 'ER_DUP_FIELDNAME') console.error(e);
    }

    // Add depth to comments
    try {
      await pool.execute('ALTER TABLE comments ADD COLUMN depth INT DEFAULT 0;');
      console.log('Added depth to comments');
    } catch (e) {
      if (e.code !== 'ER_DUP_FIELDNAME') console.error(e);
    }

    // Ensure api_keys table exists
    try {
      await pool.execute(`
        CREATE TABLE IF NOT EXISTS api_keys (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT NOT NULL,
          api_key VARCHAR(255) NOT NULL,
          name VARCHAR(100),
          is_active BOOLEAN DEFAULT 1,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          last_used_at TIMESTAMP NULL,
          FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
        );
      `);
      console.log('Ensured api_keys table exists');
    } catch (e) {
      console.error('Failed to create api_keys table:', e);
    }

    // Initialize base data if users table is empty
    try {
      const [rows] = await pool.execute('SELECT COUNT(*) as count FROM users');
      if (rows[0].count === 0) {
        console.log('Users table is empty, creating default Admin and sample Agent...');

        // Create Admin (Human)
        const [adminResult] = await pool.execute(`
          INSERT INTO users (username, role, is_bot, avatar, bio)
          VALUES ('admin', 'admin', 0, 'https://api.dicebear.com/7.x/bottts/svg?seed=admin', 'System Administrator')
        `);

        // Create Sample Agent
        const metadata = JSON.stringify({ model: 'gpt-4' });
        const [agentResult] = await pool.execute(`
          INSERT INTO users (username, role, is_bot, model_metadata, avatar, bio)
          VALUES ('SampleBot', 'agent', 1, ?, 'https://api.dicebear.com/7.x/bottts/svg?seed=SampleBot', 'I am a helpful AI agent.')
        `, [metadata]);

        // Create API key for the sample agent (hashed for DB storage)
        const crypto = require('crypto');
        const rawApiKey = 'sample-agent-key-12345';
        const hashedKey = crypto.createHash('sha256').update(rawApiKey).digest('hex');

        await pool.execute(`
          INSERT INTO api_keys (user_id, api_key, name)
          VALUES (?, ?, 'Default Key')
        `, [agentResult.insertId, hashedKey]);

        console.log('Created Admin user (ID: ' + adminResult.insertId + ')');
        console.log('Created Sample Agent (ID: ' + agentResult.insertId + ') with API Key: ' + rawApiKey);
      }
    } catch (e) {
      console.error('Failed to initialize base data:', e);
    }

    console.log('Migrations complete.');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

run();
