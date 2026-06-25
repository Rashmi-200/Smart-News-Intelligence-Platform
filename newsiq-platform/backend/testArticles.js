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
  console.log('\n=== Testing Article Endpoints ===\n');

  // 1. GET /api/articles
  const list = await request({ ...BASE, path: '/api/articles?page=1&limit=3', method: 'GET', headers: {} });
  console.log(`GET /api/articles → ${list.status}`);
  console.log(`  totalCount: ${list.body.totalCount}, page: ${list.body.page}, totalPages: ${list.body.totalPages}`);
  console.log(`  First article: "${list.body.data?.[0]?.title?.slice(0, 60)}..."`);

  // 2. GET /api/articles?category=...
  const firstCategory = list.body.data?.[0]?.category;
  const byCategory = await request({ ...BASE, path: `/api/articles?category=${encodeURIComponent(firstCategory || 'Technology')}&limit=2`, method: 'GET', headers: {} });
  console.log(`\nGET /api/articles?category=${firstCategory} → ${byCategory.status}`);
  console.log(`  totalCount: ${byCategory.body.totalCount}`);

  // 3. GET /api/articles?search=...
  const search = await request({ ...BASE, path: '/api/articles?search=news&limit=2', method: 'GET', headers: {} });
  console.log(`\nGET /api/articles?search=news → ${search.status}`);
  console.log(`  totalCount: ${search.body.totalCount}`);

  // 4. GET /api/articles/trending
  const trending = await request({ ...BASE, path: '/api/articles/trending?limit=3', method: 'GET', headers: {} });
  console.log(`\nGET /api/articles/trending → ${trending.status}`);
  console.log(`  Top article: "${trending.body.data?.[0]?.title?.slice(0, 60)}..." view_count=${trending.body.data?.[0]?.view_count}`);

  // 5. GET /api/articles/search?q=...
  const searchEndpoint = await request({ ...BASE, path: '/api/articles/search?q=ai&limit=2', method: 'GET', headers: {} });
  console.log(`\nGET /api/articles/search?q=ai → ${searchEndpoint.status}`);
  console.log(`  totalCount: ${searchEndpoint.body.totalCount}`);

  // 6. GET /api/articles/:id
  const firstId = list.body.data?.[0]?.id;
  const single = await request({ ...BASE, path: `/api/articles/${firstId}`, method: 'GET', headers: {} });
  console.log(`\nGET /api/articles/${firstId} → ${single.status}`);
  console.log(`  Title: "${single.body.title?.slice(0, 60)}..."`);
  console.log(`  Related articles count: ${single.body.related?.length}`);

  // 7. POST /api/articles/:id/view
  const view = await request(
    { ...BASE, path: `/api/articles/${firstId}/view`, method: 'POST', headers: { 'Content-Length': 0 } },
    null
  );
  console.log(`\nPOST /api/articles/${firstId}/view → ${view.status}`);
  console.log(`  view_count now: ${view.body.view_count}`);

  // 8. GET /api/categories
  const categories = await request({ ...BASE, path: '/api/categories', method: 'GET', headers: {} });
  console.log(`\nGET /api/categories → ${categories.status}`);
  console.log(`  Total categories: ${categories.body.total}`);
  console.log(`  Top 3:`, categories.body.data?.slice(0, 3));

  console.log('\n=== All tests complete ===\n');
})();
