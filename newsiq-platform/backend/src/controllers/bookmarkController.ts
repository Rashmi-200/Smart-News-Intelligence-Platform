import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function getUserId(req: Request): number {
  return (req as any).user?.id;
}

/* ------------------------------------------------------------------ */
/*  POST /api/bookmarks/:articleId                                      */
/* ------------------------------------------------------------------ */
export async function addBookmark(req: Request, res: Response) {
  try {
    const userId    = getUserId(req);
    const articleId = parseInt(req.params.articleId);

    if (isNaN(articleId)) {
      return res.status(400).json({ message: 'Invalid article ID' });
    }

    // Verify article exists
    const article = await prisma.article.findUnique({ where: { id: articleId } });
    if (!article) return res.status(404).json({ message: 'Article not found' });

    // Upsert — silently succeed if already bookmarked
    const bookmark = await prisma.bookmark.upsert({
      where:  { userId_articleId: { userId, articleId } },
      update: {},
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

    res.status(201).json({ message: 'Bookmarked', bookmark });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to add bookmark' });
  }
}

/* ------------------------------------------------------------------ */
/*  DELETE /api/bookmarks/:articleId                                    */
/* ------------------------------------------------------------------ */
export async function removeBookmark(req: Request, res: Response) {
  try {
    const userId    = getUserId(req);
    const articleId = parseInt(req.params.articleId);

    if (isNaN(articleId)) {
      return res.status(400).json({ message: 'Invalid article ID' });
    }

    const existing = await prisma.bookmark.findUnique({
      where: { userId_articleId: { userId, articleId } },
    });

    if (!existing) {
      return res.status(404).json({ message: 'Bookmark not found' });
    }

    await prisma.bookmark.delete({
      where: { userId_articleId: { userId, articleId } },
    });

    res.json({ message: 'Bookmark removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to remove bookmark' });
  }
}

/* ------------------------------------------------------------------ */
/*  GET /api/bookmarks                                                  */
/*  Returns user's bookmarks, most recent first, with article details  */
/* ------------------------------------------------------------------ */
export async function getBookmarks(req: Request, res: Response) {
  try {
    const userId = getUserId(req);
    const page   = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit  = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
    const skip   = (page - 1) * limit;

    const [bookmarks, totalCount] = await Promise.all([
      prisma.bookmark.findMany({
        where:   { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          article: {
            select: {
              id: true, title: true, url: true, summary: true,
              category: true, source: true, published: true,
              scraped_at: true, sentiment_score: true, view_count: true,
            },
          },
        },
      }),
      prisma.bookmark.count({ where: { userId } }),
    ]);

    res.json({
      data: bookmarks.map((b) => ({
        bookmarkId:  b.id,
        bookmarkedAt: b.createdAt,
        ...b.article,
      })),
      page,
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch bookmarks' });
  }
}
