import { PrismaClient, Article, KeywordAlert } from '@prisma/client';

const prisma = new PrismaClient();

let lastProcessedArticleId = 0;
let isRunning = false;

/**
 * Checks if a keyword matches an article (case-insensitive check in title or summary).
 */
function isMatch(article: Article, keyword: string): boolean {
  const cleanKeyword = keyword.trim().toLowerCase();
  if (!cleanKeyword) return false;

  const titleMatch = article.title ? article.title.toLowerCase().includes(cleanKeyword) : false;
  const summaryMatch = article.summary ? article.summary.toLowerCase().includes(cleanKeyword) : false;

  return titleMatch || summaryMatch;
}

/**
 * Process a list of articles against active keyword alerts and generate notifications.
 */
export async function processArticles(articles: Article[]) {
  if (articles.length === 0) return;

  console.log(`[AlertMatcher] Processing ${articles.length} new articles against alerts...`);

  // Fetch all active alerts
  const activeAlerts = await prisma.keywordAlert.findMany({
    where: { isActive: true },
  });

  if (activeAlerts.length === 0) {
    console.log('[AlertMatcher] No active alerts to check.');
    return;
  }

  const notificationsToCreate: { userId: number; message: string }[] = [];

  for (const article of articles) {
    for (const alert of activeAlerts) {
      if (isMatch(article, alert.keyword)) {
        notificationsToCreate.push({
          userId: alert.userId,
          message: `Keyword Alert Match: "${alert.keyword}" found in article "${article.title || 'Untitled'}"`,
        });
      }
    }
  }

  if (notificationsToCreate.length > 0) {
    console.log(`[AlertMatcher] Creating ${notificationsToCreate.length} matching notifications...`);
    // Create notifications
    await prisma.notification.createMany({
      data: notificationsToCreate,
    });
  }
}

/**
 * Periodically queries for newly inserted articles and matches them.
 */
export async function checkNewArticles() {
  if (isRunning) return;
  isRunning = true;

  try {
    const newArticles = await prisma.article.findMany({
      where: {
        id: { gt: lastProcessedArticleId },
      },
      orderBy: { id: 'asc' },
      take: 100, // Process in batches of 100
    });

    if (newArticles.length > 0) {
      await processArticles(newArticles);
      lastProcessedArticleId = newArticles[newArticles.length - 1].id;
    }
  } catch (error) {
    console.error('[AlertMatcher] Error in checkNewArticles loop:', error);
  } finally {
    isRunning = false;
  }
}

/**
 * Initializes the alert matcher background process.
 */
export async function initAlertMatcher() {
  try {
    // Find the latest article ID to start checking from
    const latestArticle = await prisma.article.findFirst({
      orderBy: { id: 'desc' },
      select: { id: true },
    });

    lastProcessedArticleId = latestArticle ? latestArticle.id : 0;
    console.log(`[AlertMatcher] Initialized. Last processed article ID set to: ${lastProcessedArticleId}`);

    // Poll database for new articles every 10 seconds
    setInterval(async () => {
      await checkNewArticles();
    }, 10000);
  } catch (error) {
    console.error('[AlertMatcher] Failed to initialize alert matcher:', error);
  }
}
