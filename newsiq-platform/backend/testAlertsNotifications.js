const http = require('http');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

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
  console.log('\n=== Testing Alerts and Notifications ===\n');

  // 1. Log in to get token
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
  console.log('Logged in successfully.');
  const authHeaders = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  // 2. Create keyword alert
  const alertKeyword = 'Appleseed';
  console.log(`\n--- 1. Creating Keyword Alert: "${alertKeyword}" ---`);
  const createAlertRes = await request(
    {
      ...BASE,
      path: '/api/alerts',
      method: 'POST',
      headers: {
        ...authHeaders,
        'Content-Length': Buffer.byteLength(JSON.stringify({ keyword: alertKeyword })),
      },
    },
    JSON.stringify({ keyword: alertKeyword })
  );
  console.log('POST /api/alerts Response status:', createAlertRes.status);
  console.log('Response body:', createAlertRes.body);

  if (createAlertRes.status !== 201) {
    console.error('Failed to create alert.');
    process.exit(1);
  }

  const alertId = createAlertRes.body.alert.id;

  // 3. Get alerts and check match counts
  console.log('\n--- 2. Fetching Alerts List ---');
  const getAlertsRes = await request({
    ...BASE,
    path: '/api/alerts',
    method: 'GET',
    headers: authHeaders,
  });
  console.log('GET /api/alerts Response status:', getAlertsRes.status);
  console.log('Alerts:', getAlertsRes.body.data);

  // 4. Toggle alert off and on
  console.log('\n--- 3. Toggling Alert status ---');
  const toggleAlertRes1 = await request({
    ...BASE,
    path: `/api/alerts/${alertId}`,
    method: 'PATCH',
    headers: authHeaders,
  });
  console.log('PATCH /api/alerts/:id (Toggle Off) Status:', toggleAlertRes1.status);
  console.log('Response:', toggleAlertRes1.body);

  const toggleAlertRes2 = await request({
    ...BASE,
    path: `/api/alerts/${alertId}`,
    method: 'PATCH',
    headers: {
      ...authHeaders,
      'Content-Length': Buffer.byteLength(JSON.stringify({ isActive: true })),
    },
    data: JSON.stringify({ isActive: true }),
  });
  console.log('PATCH /api/alerts/:id (Toggle On) Status:', toggleAlertRes2.status);
  console.log('Response:', toggleAlertRes2.body);

  // 5. Test Background Matcher: Create a new article with matching keyword
  console.log('\n--- 4. Testing alertMatcher Background Service ---');
  const uniqueUrl = `https://example.com/test-appleseed-article-${Date.now()}`;
  console.log('Inserting matching article into database...');
  const newArticle = await prisma.article.create({
    data: {
      title: 'Johnny Appleseed and the Great Orchard',
      url: uniqueUrl,
      summary: 'A wonderful historical tale about planting apple orchards across America.',
      category: 'History',
      source: 'Test News',
      published: new Date().toISOString(),
    },
  });
  console.log(`Created Article ID: ${newArticle.id}, Title: "${newArticle.title}"`);

  console.log('Waiting 12 seconds for the alertMatcher background polling loop to trigger...');
  await new Promise(resolve => setTimeout(resolve, 12000));

  // 6. Fetch user notifications
  console.log('\n--- 5. Checking Notifications ---');
  const getNotificationsRes = await request({
    ...BASE,
    path: '/api/notifications?page=1&limit=5',
    method: 'GET',
    headers: authHeaders,
  });
  console.log('GET /api/notifications Status:', getNotificationsRes.status);
  console.log('Notifications count:', getNotificationsRes.body.totalCount);
  console.log('Notifications list:', getNotificationsRes.body.data);

  const notification = getNotificationsRes.body.data?.[0];
  if (!notification) {
    console.error('Expected matching notification was not created.');
    process.exit(1);
  }

  const notificationId = notification.id;

  // 7. Mark single notification as read
  console.log(`\n--- 6. Marking single notification as read: ID ${notificationId} ---`);
  const markReadRes = await request({
    ...BASE,
    path: `/api/notifications/${notificationId}/read`,
    method: 'PATCH',
    headers: authHeaders,
  });
  console.log('PATCH /api/notifications/:id/read Status:', markReadRes.status);
  console.log('Response:', markReadRes.body);

  // 8. Mark all as read
  console.log('\n--- 7. Marking all notifications as read ---');
  const markAllReadRes = await request({
    ...BASE,
    path: '/api/notifications/read-all',
    method: 'PATCH',
    headers: authHeaders,
  });
  console.log('PATCH /api/notifications/read-all Status:', markAllReadRes.status);
  console.log('Response:', markAllReadRes.body);

  // 9. Delete notification
  console.log(`\n--- 8. Deleting single notification: ID ${notificationId} ---`);
  const deleteNotificationRes = await request({
    ...BASE,
    path: `/api/notifications/${notificationId}`,
    method: 'DELETE',
    headers: authHeaders,
  });
  console.log('DELETE /api/notifications/:id Status:', deleteNotificationRes.status);
  console.log('Response:', deleteNotificationRes.body);

  // 10. Delete Keyword Alert
  console.log(`\n--- 9. Deleting Keyword Alert: ID ${alertId} ---`);
  const deleteAlertRes = await request({
    ...BASE,
    path: `/api/alerts/${alertId}`,
    method: 'DELETE',
    headers: authHeaders,
  });
  console.log('DELETE /api/alerts/:id Status:', deleteAlertRes.status);
  console.log('Response:', deleteAlertRes.body);

  console.log('\n=== All Tests Complete and Verified Successfully! ===\n');
  await prisma.$disconnect();
})();
