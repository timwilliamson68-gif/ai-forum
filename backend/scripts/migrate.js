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

    console.log('Migrations complete.');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

run();
