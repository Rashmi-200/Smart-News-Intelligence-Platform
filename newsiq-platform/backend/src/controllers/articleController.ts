import { Request, Response } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */
function parsePagination(query: Record<string, any>) {
  const page = Math.max(1, parseInt(query.page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit as string) || 20));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

function paginatedResponse(data: any[], totalCount: number, page: number, limit: number) {
  return {
    data,
    page,
    totalPages: Math.ceil(totalCount / limit),
    totalCount,
  };
}

/* ------------------------------------------------------------------ */
/*  GET /api/articles                                                   */
/*  Query: page, limit, category, source, sentiment, search            */
/* ------------------------------------------------------------------ */
export async function getArticles(req: Request, res: Response) {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const { category, source, sentiment, search } = req.query as Record<string, string>;

    const where: Prisma.ArticleWhereInput = {};

    if (category) where.category = { equals: category, mode: 'insensitive' };
    if (source)   where.source   = { equals: source,   mode: 'insensitive' };

    if (sentiment) {
      const val = parseFloat(sentiment);
      if (!isNaN(val)) {
        if (sentiment === 'positive') where.sentiment_score = { gte: 0.1 };
        else if (sentiment === 'negative') where.sentiment_score = { lte: -0.1 };
        else if (sentiment === 'neutral')  where.sentiment_score = { gt: -0.1, lt: 0.1 };
        else where.sentiment_score = { gte: val };
      }
    }

    if (search) {
      where.OR = [
        { title:   { contains: search, mode: 'insensitive' } },
        { summary: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [articles, totalCount] = await Promise.all([
      prisma.article.findMany({
        where,
        orderBy: { scraped_at: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          url: true,
          summary: true,
          category: true,
          source: true,
          published: true,
          scraped_at: true,
          sentiment_score: true,
          view_count: true,
        },
      }),
      prisma.article.count({ where }),
    ]);

    res.json(paginatedResponse(articles, totalCount, page, limit));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch articles' });
  }
}

/* ------------------------------------------------------------------ */
/*  GET /api/articles/trending                                          */
/*  Top articles by view_count (all time — view-based trending)        */
/* ------------------------------------------------------------------ */
export async function getTrendingArticles(req: Request, res: Response) {
  try {
    const { page, limit, skip } = parsePagination(req.query);

    // Trending = highest view_count, published within the last 24 hours if available
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    // Try last-24h first
    const recentCount = await prisma.article.count({
      where: { scraped_at: { gte: since } },
    });

    const where: Prisma.ArticleWhereInput =
      recentCount >= limit ? { scraped_at: { gte: since } } : {};

    const [articles, totalCount] = await Promise.all([
      prisma.article.findMany({
        where,
        orderBy: { view_count: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          url: true,
          summary: true,
          category: true,
          source: true,
          published: true,
          scraped_at: true,
          sentiment_score: true,
          view_count: true,
        },
      }),
      prisma.article.count({ where }),
    ]);

    res.json(paginatedResponse(articles, totalCount, page, limit));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch trending articles' });
  }
}

/* ------------------------------------------------------------------ */
/*  GET /api/articles/search                                            */
/*  Query: q (required), page, limit                                   */
/* ------------------------------------------------------------------ */
export async function searchArticles(req: Request, res: Response) {
  try {
    const { q } = req.query as Record<string, string>;
    if (!q || q.trim() === '') {
      return res.status(400).json({ message: 'Search query "q" is required' });
    }

    const { page, limit, skip } = parsePagination(req.query);

    const where: Prisma.ArticleWhereInput = {
      OR: [
        { title:   { contains: q, mode: 'insensitive' } },
        { summary: { contains: q, mode: 'insensitive' } },
        { source:  { contains: q, mode: 'insensitive' } },
      ],
    };

    const [articles, totalCount] = await Promise.all([
      prisma.article.findMany({
        where,
        orderBy: [{ view_count: 'desc' }, { scraped_at: 'desc' }],
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          url: true,
          summary: true,
          category: true,
          source: true,
          published: true,
          scraped_at: true,
          sentiment_score: true,
          view_count: true,
        },
      }),
      prisma.article.count({ where }),
    ]);

    res.json(paginatedResponse(articles, totalCount, page, limit));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Search failed' });
  }
}

/* ------------------------------------------------------------------ */
/*  GET /api/articles/:id                                               */
/*  Single article + related articles (same category)                  */
/* ------------------------------------------------------------------ */
export async function getArticleById(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: 'Invalid article ID' });

    const article = await prisma.article.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        url: true,
        summary: true,
        category: true,
        source: true,
        published: true,
        scraped_at: true,
        sentiment_score: true,
        view_count: true,
      },
    });

    if (!article) return res.status(404).json({ message: 'Article not found' });

    // Fetch related articles in same category, excluding self
    const related = await prisma.article.findMany({
      where: {
        category: article.category ?? undefined,
        NOT: { id },
      },
      orderBy: { view_count: 'desc' },
      take: 6,
      select: {
        id: true,
        title: true,
        url: true,
        summary: true,
        category: true,
        source: true,
        published: true,
        sentiment_score: true,
        view_count: true,
      },
    });

    res.json({ ...article, related });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch article' });
  }
}

/* ------------------------------------------------------------------ */
/*  POST /api/articles/:id/view                                         */
/*  Increment view count atomically                                     */
/* ------------------------------------------------------------------ */
export async function incrementViewCount(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: 'Invalid article ID' });

    const updated = await prisma.article.update({
      where: { id },
      data: { view_count: { increment: 1 } },
      select: { id: true, view_count: true },
    });

    res.json({ message: 'View count updated', ...updated });
  } catch (err: any) {
    if (err?.code === 'P2025') {
      return res.status(404).json({ message: 'Article not found' });
    }
    console.error(err);
    res.status(500).json({ message: 'Failed to increment view count' });
  }
}

/* ------------------------------------------------------------------ */
/*  GET /api/categories                                                 */
/*  All distinct categories with article counts                        */
/* ------------------------------------------------------------------ */
export async function getCategories(req: Request, res: Response) {
  try {
    const groups = await prisma.article.groupBy({
      by: ['category'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
    });

    const categories = groups
      .filter((g) => g.category !== null)
      .map((g) => ({
        category: g.category,
        count: g._count.id,
      }));

    res.json({ data: categories, total: categories.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch categories' });
  }
}
