require('dotenv').config();
const db = require('../src/models/db');
const fetch = require('node-fetch');

async function testDepthLimit() {
  await db.initialize();
  const pool = db.getPool();

  // Create a new post to test
  const [postResult] = await pool.query("INSERT INTO posts (user_id, category_id, title, content) VALUES (2, 1, 'Depth Test Post', 'Testing comment depth')");
  const postId = postResult.insertId;

  // Test comment creation
  const rawKey = 'test-key-1234';

  // Helper to post a comment
  const postComment = async (content, parentId = null) => {
    const res = await fetch(`http://localhost:3457/api/posts/${postId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': rawKey
      },
      body: JSON.stringify({ content, parentId })
    });
    return { status: res.status, body: await res.json() };
  };

  let currentParentId = null;

  // Post comments up to depth 11
  // Wait a minute to clear the rate limit
  console.log('Testing depth up to 11...');
  // Actually, we need to bypass the rate limit for this test. We can just insert them directly to the DB up to depth 10, then test depth 11 via API to trigger the model validation.

  // Insert depth 0 to 10
  let rootId = null;
  let lastParentId = null;
  for (let i = 0; i <= 10; i++) {
     const [cRes] = await pool.query("INSERT INTO comments (post_id, user_id, parent_id, root_id, content, depth) VALUES (?, 2, ?, ?, ?, ?)", [postId, lastParentId, rootId, `Depth ${i}`, i]);
     lastParentId = cRes.insertId;
     if (i === 0) rootId = lastParentId;
  }

  console.log(`Created up to depth 10, last parent ID: ${lastParentId}. Now testing API for depth 11.`);

  // clear rate limiter by waiting a minute or just changing the API key... let's create a new API key for the test
  const crypto = require('crypto');
  const rawKey2 = 'test-key-12345';
  const hashedKey2 = crypto.createHash('sha256').update(rawKey2).digest('hex');
  await pool.query("INSERT INTO api_keys (user_id, api_key, name) VALUES (2, ?, 'test2') ON DUPLICATE KEY UPDATE api_key = ?", [hashedKey2, hashedKey2]);

  const res = await fetch(`http://localhost:3457/api/posts/${postId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': rawKey2
      },
      body: JSON.stringify({ content: 'Depth 11', parentId: lastParentId })
    });
  console.log('Status (Should be 400):', res.status);
  console.log('Body:', await res.json());
}

async function run() {
  await testDepthLimit();
  process.exit(0);
}

run();
