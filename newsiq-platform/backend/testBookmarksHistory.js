const http = require('http');

function request(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(body) });
        } catch {
          resolve({ status: res.statusCode, body });
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

const BASE = { hostname: 'localhost', port: 5000 };

(async () => {
  console.log('\n=== Testing Bookmark & Reading History Endpoints ===\n');

  // 1. Log in to get authentication token
  const credentials = JSON.stringify({ email: 'test@example.com', password: 'Test1234!' });
  const loginRes = await request(
    {
      ...BASE,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(credentials),
      },
    },
    credentials
  );

  if (loginRes.status !== 200) {
    console.error('Failed to log in:', loginRes.body);
    process.exit(1);
  }

  const token = loginRes.body.token;
  console.log('Successfully logged in. Token acquired.');

  const authHeaders = {
    'Authorization': `Bearer ${token}`,
  };

  // 2. Fetch an article to use for test
  const articlesList = await request({ ...BASE, path: '/api/articles?limit=1', method: 'GET', headers: {} });
  if (articlesList.status !== 200 || !articlesList.body.data || articlesList.body.data.length === 0) {
    console.error('Failed to retrieve articles for testing:', articlesList.body);
    process.exit(1);
  }

  const articleId = articlesList.body.data[0].id;
  const articleTitle = articlesList.body.data[0].title;
  console.log(`Using Article ID ${articleId} ("${articleTitle.slice(0, 50)}...") for testing.`);

  // ----------------------------------------------------
  // BOOKMARKS TESTING
  // ----------------------------------------------------
  console.log('\n--- 1. Bookmarks Endpoints ---');

  // Add bookmark
  const addB = await request({
    ...BASE,
    path: `/api/bookmarks/${articleId}`,
    method: 'POST',
    headers: { ...authHeaders, 'Content-Length': 0 },
  });
  console.log(`POST /api/bookmarks/${articleId} (Add) → Status: ${addB.status}`);
  console.log(`  Response:`, addB.body);

  // List bookmarks
  const listB = await request({
    ...BASE,
    path: '/api/bookmarks',
    method: 'GET',
    headers: authHeaders,
  });
  console.log(`GET /api/bookmarks (List) → Status: ${listB.status}`);
  console.log(`  Count: ${listB.body.totalCount}`);
  console.log(`  Items:`, listB.body.data?.map(b => ({ bookmarkId: b.bookmarkId, title: b.title })));

  // Remove bookmark
  const removeB = await request({
    ...BASE,
    path: `/api/bookmarks/${articleId}`,
    method: 'DELETE',
    headers: authHeaders,
  });
  console.log(`DELETE /api/bookmarks/${articleId} (Remove) → Status: ${removeB.status}`);
  console.log(`  Response:`, removeB.body);

  // List bookmarks again (should be empty/fewer)
  const listB2 = await request({
    ...BASE,
    path: '/api/bookmarks',
    method: 'GET',
    headers: authHeaders,
  });
  console.log(`GET /api/bookmarks (After Remove) → Status: ${listB2.status}`);
  console.log(`  Count: ${listB2.body.totalCount}`);

  // ----------------------------------------------------
  // HISTORY TESTING
  // ----------------------------------------------------
  console.log('\n--- 2. Reading History Endpoints ---');

  // Log article as read
  const addH = await request({
    ...BASE,
    path: `/api/history/${articleId}`,
    method: 'POST',
    headers: { ...authHeaders, 'Content-Length': 0 },
  });
  console.log(`POST /api/history/${articleId} (Log read) → Status: ${addH.status}`);
  console.log(`  Response:`, addH.body);

  // Get reading history
  const listH = await request({
    ...BASE,
    path: '/api/history',
    method: 'GET',
    headers: authHeaders,
  });
  console.log(`GET /api/history (List) → Status: ${listH.status}`);
  console.log(`  Total records: ${listH.body.total}`);
  console.log(`  Grouped keys:`, Object.keys(listH.body.groups));
  console.log(`  Today's reads:`, listH.body.groups?.today?.map(h => ({ historyId: h.historyId, title: h.title })));

  // Clear reading history
  const clearH = await request({
    ...BASE,
    path: '/api/history',
    method: 'DELETE',
    headers: authHeaders,
  });
  console.log(`DELETE /api/history (Clear all) → Status: ${clearH.status}`);
  console.log(`  Response:`, clearH.body);

  // Get reading history again (should be 0)
  const listH2 = await request({
    ...BASE,
    path: '/api/history',
    method: 'GET',
    headers: authHeaders,
  });
  console.log(`GET /api/history (After Clear) → Status: ${listH2.status}`);
  console.log(`  Total records: ${listH2.body.total}`);

  console.log('\n=== All Bookmarks and Reading History tests complete ===\n');
})();
