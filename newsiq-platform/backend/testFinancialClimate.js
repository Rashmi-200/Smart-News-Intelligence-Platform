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
  console.log('\n=== Testing Financial & Climate Endpoints ===\n');

  let testMentionId = null;
  let testAlertId = null;

  try {
    // 1. Seed test data to check database operations
    console.log('Seeding temporary test database records...');
    
    // Find an article ID for mapping
    const article = await prisma.article.findFirst({ select: { id: true } });
    if (!article) {
      console.error('No articles found in database. Please run scraper first.');
      process.exit(1);
    }
    const articleId = article.id;

    // Create a CompanyMention
    const mention = await prisma.companyMention.create({
      data: {
        companyName: 'Lanka Test Group PLC',
        articleId,
      },
    });
    testMentionId = mention.id;
    console.log(`Created CompanyMention ID: ${testMentionId}`);

    // Create a DisasterAlert
    const alert = await prisma.disasterAlert.create({
      data: {
        region: 'Trincomalee',
        type: 'Cyclone Warning',
        severity: 'Critical',
        message: 'Severe cyclone warning issued for the Trincomalee coastal belt.',
        isActive: true,
      },
    });
    testAlertId = alert.id;
    console.log(`Created DisasterAlert ID: ${testAlertId}`);

    // ----------------------------------------------------------------
    // FINANCIAL TESTS
    // ----------------------------------------------------------------
    console.log('\n--- 1. Testing Financial Endpoints ---');

    // GET /api/financial/market-data
    const market = await request({ ...BASE, path: '/api/financial/market-data', method: 'GET' });
    console.log(`GET /api/financial/market-data → Status: ${market.status}`);
    console.log('Market Data Sample (LKR/USD):', market.body.lkr_usd);
    console.log('Market Data Sample (CSE ASPI):', market.body.cse_index);

    // GET /api/financial/news
    const finNews = await request({ ...BASE, path: '/api/financial/news?limit=2', method: 'GET' });
    console.log(`\nGET /api/financial/news → Status: ${finNews.status}`);
    console.log('Total matches found:', finNews.body.totalCount);
    console.log('Sample news items (including marketImpact):', finNews.body.data?.map(n => ({ id: n.id, title: n.title?.slice(0, 50), impact: n.marketImpact })));

    // GET /api/financial/sentiment-trend
    const trend = await request({ ...BASE, path: '/api/financial/sentiment-trend', method: 'GET' });
    console.log(`\nGET /api/financial/sentiment-trend → Status: ${trend.status}`);
    console.log('Trend data (first 3 days):', trend.body.trend?.slice(0, 3));

    // GET /api/financial/top-companies
    const companies = await request({ ...BASE, path: '/api/financial/top-companies', method: 'GET' });
    console.log(`\nGET /api/financial/top-companies → Status: ${companies.status}`);
    console.log('Source:', companies.body.source);
    console.log('Top companies:', companies.body.data);

    // ----------------------------------------------------------------
    // CLIMATE TESTS
    // ----------------------------------------------------------------
    console.log('\n--- 2. Testing Climate Endpoints ---');

    // GET /api/climate/news
    const cliNews = await request({ ...BASE, path: '/api/climate/news?limit=2', method: 'GET' });
    console.log(`GET /api/climate/news → Status: ${cliNews.status}`);
    console.log('Total matches found:', cliNews.body.totalCount);
    console.log('Sample news item:', cliNews.body.data?.[0] ? { id: cliNews.body.data[0].id, title: cliNews.body.data[0].title?.slice(0, 60) } : 'No climate news in DB');

    // GET /api/climate/alerts
    const alerts = await request({ ...BASE, path: '/api/climate/alerts', method: 'GET' });
    console.log(`\nGET /api/climate/alerts → Status: ${alerts.status}`);
    console.log('Source:', alerts.body.source);
    console.log('Active Alerts:', alerts.body.data?.map(a => ({ id: a.id, region: a.region, type: a.type, severity: a.severity, message: a.message })));

    // GET /api/climate/weather/:city (Valid City: Colombo)
    const weatherColombo = await request({ ...BASE, path: '/api/climate/weather/colombo', method: 'GET' });
    console.log(`\nGET /api/climate/weather/colombo → Status: ${weatherColombo.status}`);
    console.log('Colombo Weather:', { condition: weatherColombo.body.condition, temp: weatherColombo.body.temperature, humidity: weatherColombo.body.humidity });

    // GET /api/climate/weather/:city (Valid City: Kandy)
    const weatherKandy = await request({ ...BASE, path: '/api/climate/weather/kandy', method: 'GET' });
    console.log(`\nGET /api/climate/weather/kandy → Status: ${weatherKandy.status}`);
    console.log('Kandy Weather:', { condition: weatherKandy.body.condition, temp: weatherKandy.body.temperature });

    // GET /api/climate/weather/:city (Invalid City: London)
    const weatherInvalid = await request({ ...BASE, path: '/api/climate/weather/london', method: 'GET' });
    console.log(`\nGET /api/climate/weather/london (Invalid) → Status: ${weatherInvalid.status}`);
    console.log('Response body:', weatherInvalid.body);

  } catch (err) {
    console.error('Test error encountered:', err);
  } finally {
    // 2. Cleanup test data
    console.log('\nCleaning up test database records...');
    if (testMentionId) {
      await prisma.companyMention.delete({ where: { id: testMentionId } });
      console.log('Deleted temporary CompanyMention');
    }
    if (testAlertId) {
      await prisma.disasterAlert.delete({ where: { id: testAlertId } });
      console.log('Deleted temporary DisasterAlert');
    }
    
    console.log('\n=== All Tests Complete ===\n');
    await prisma.$disconnect();
  }
})();
