import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function getUserId(req: Request): number {
  return (req as any).user?.id;
}

/* ------------------------------------------------------------------ */
/*  POST /api/alerts                                                 */
/*  Create a keyword alert for the user                              */
/* ------------------------------------------------------------------ */
export async function createAlert(req: Request, res: Response) {
  try {
    const userId = getUserId(req);
    const { keyword } = req.body;

    if (!keyword || typeof keyword !== 'string' || !keyword.trim()) {
      return res.status(400).json({ message: 'Keyword is required and must be a valid string' });
    }

    const trimmedKeyword = keyword.trim();

    // Check if alert already exists for this user with the same keyword
    const existing = await prisma.keywordAlert.findFirst({
      where: { userId, keyword: { equals: trimmedKeyword, mode: 'insensitive' } },
    });

    if (existing) {
      return res.status(400).json({ message: 'An alert for this keyword already exists' });
    }

    const alert = await prisma.keywordAlert.create({
      data: {
        userId,
        keyword: trimmedKeyword,
        isActive: true,
      },
    });

    res.status(201).json({ message: 'Alert created successfully', alert });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create alert' });
  }
}

/* ------------------------------------------------------------------ */
/*  GET /api/alerts                                                  */
/*  Get user's keyword alerts, each annotated with total match count */
/* ------------------------------------------------------------------ */
export async function getAlerts(req: Request, res: Response) {
  try {
    const userId = getUserId(req);

    const alerts = await prisma.keywordAlert.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    // Compute match count for each keyword alert
    const alertsWithMatchCount = await Promise.all(
      alerts.map(async (alert) => {
        const matchCount = await prisma.article.count({
          where: {
            OR: [
              { title: { contains: alert.keyword, mode: 'insensitive' } },
              { summary: { contains: alert.keyword, mode: 'insensitive' } },
            ],
          },
        });

        return {
          ...alert,
          matchCount,
        };
      })
    );

    res.json({ data: alertsWithMatchCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch alerts' });
  }
}

/* ------------------------------------------------------------------ */
/*  PATCH /api/alerts/:id                                            */
/*  Toggle alert status on/off (or set explicitly via body)          */
/* ------------------------------------------------------------------ */
export async function toggleAlert(req: Request, res: Response) {
  try {
    const userId = getUserId(req);
    const alertId = parseInt(req.params.id);

    if (isNaN(alertId)) {
      return res.status(400).json({ message: 'Invalid alert ID' });
    }

    const alert = await prisma.keywordAlert.findUnique({
      where: { id: alertId },
    });

    if (!alert || alert.userId !== userId) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    // Toggle logic: use body's isActive if provided, otherwise flip current status
    const targetStatus = typeof req.body.isActive === 'boolean' 
      ? req.body.isActive 
      : !alert.isActive;

    const updated = await prisma.keywordAlert.update({
      where: { id: alertId },
      data: { isActive: targetStatus },
    });

    res.json({ message: `Alert turned ${targetStatus ? 'on' : 'off'}`, alert: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update alert' });
  }
}

/* ------------------------------------------------------------------ */
/*  DELETE /api/alerts/:id                                           */
/*  Delete an alert                                                  */
/* ------------------------------------------------------------------ */
export async function deleteAlert(req: Request, res: Response) {
  try {
    const userId = getUserId(req);
    const alertId = parseInt(req.params.id);

    if (isNaN(alertId)) {
      return res.status(400).json({ message: 'Invalid alert ID' });
    }

    const alert = await prisma.keywordAlert.findUnique({
      where: { id: alertId },
    });

    if (!alert || alert.userId !== userId) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    await prisma.keywordAlert.delete({
      where: { id: alertId },
    });

    res.json({ message: 'Alert deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete alert' });
  }
}
