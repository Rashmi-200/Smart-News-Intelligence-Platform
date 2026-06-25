import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function getUserId(req: Request): number {
  return (req as any).user?.id;
}

/* ------------------------------------------------------------------ */
/*  Date grouping helpers                                               */
/* ------------------------------------------------------------------ */
function getDateGroup(date: Date): 'today' | 'yesterday' | 'this_week' | 'older' {
  const now   = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const weekStart = new Date(today);
  weekStart.setDate(weekStart.getDate() - 7);

  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (d.getTime() === today.getTime())     return 'today';
  if (d.getTime() === yesterday.getTime()) return 'yesterday';
  if (d >= weekStart)                      return 'this_week';
  return 'older';
}

/* ------------------------------------------------------------------ */
/*  POST /api/history/:articleId                                        */
/*  Upsert — if already read, update readAt to "now"                   */
/* ------------------------------------------------------------------ */
export async function logReadingHistory(req: Request, res: Response) {
  try {
    const userId    = getUserId(req);
    const articleId = parseInt(req.params.articleId);

    if (isNaN(articleId)) {
      return res.status(400).json({ message: 'Invalid article ID' });
    }

    const article = await prisma.article.findUnique({ where: { id: articleId } });
    if (!article) return res.status(404).json({ message: 'Article not found' });

    const history = await prisma.readingHistory.upsert({
      where:  { userId_articleId: { userId, articleId } },
      update: { readAt: new Date() },
      create: { userId, articleId },
      include: {
        article: {
          select: {
            id: true, title: true, url: true,
            category: true, source: true, published: true, sentiment_score: true,
          },
        },
      },
    });

    res.status(201).json({ message: 'Reading history logged', history });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to log reading history' });
  }
}

/* ------------------------------------------------------------------ */
/*  GET /api/history                                                    */
/*  Returns grouped reading history: today / yesterday / this_week     */
/* ------------------------------------------------------------------ */
export async function getReadingHistory(req: Request, res: Response) {
  try {
    const userId = getUserId(req);
    const limit  = Math.min(200, Math.max(1, parseInt(req.query.limit as string) || 100));

    const records = await prisma.readingHistory.findMany({
      where:   { userId },
      orderBy: { readAt: 'desc' },
      take:    limit,
      include: {
        article: {
          select: {
            id: true, title: true, url: true, summary: true,
            category: true, source: true, published: true,
            sentiment_score: true, view_count: true,
          },
        },
      },
    });

    // Group by date bucket
    const grouped: Record<string, any[]> = {
      today:     [],
      yesterday: [],
      this_week: [],
      older:     [],
    };

    for (const record of records) {
      const bucket = getDateGroup(record.readAt);
      grouped[bucket].push({
        historyId: record.id,
        readAt:    record.readAt,
        ...record.article,
      });
    }

    res.json({
      total: records.length,
      groups: {
        today:     grouped.today,
        yesterday: grouped.yesterday,
        this_week: grouped.this_week,
        older:     grouped.older,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch reading history' });
  }
}

/* ------------------------------------------------------------------ */
/*  DELETE /api/history                                                 */
/*  Clear all reading history for the authenticated user               */
/* ------------------------------------------------------------------ */
export async function clearReadingHistory(req: Request, res: Response) {
  try {
    const userId = getUserId(req);

    const { count } = await prisma.readingHistory.deleteMany({ where: { userId } });

    res.json({ message: `Cleared ${count} reading history entries` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to clear reading history' });
  }
}
