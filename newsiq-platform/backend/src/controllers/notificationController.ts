import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function getUserId(req: Request): number {
  return (req as any).user?.id;
}

/* ------------------------------------------------------------------ */
/*  GET /api/notifications                                           */
/*  Get user's notifications, paginated                             */
/* ------------------------------------------------------------------ */
export async function getNotifications(req: Request, res: Response) {
  try {
    const userId = getUserId(req);
    const page   = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit  = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
    const skip   = (page - 1) * limit;

    const [notifications, totalCount] = await Promise.all([
      prisma.notification.findMany({
        where:   { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.notification.count({ where: { userId } }),
    ]);

    res.json({
      data: notifications,
      page,
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
}

/* ------------------------------------------------------------------ */
/*  PATCH /api/notifications/:id/read                                */
/*  Mark single notification as read                                 */
/* ------------------------------------------------------------------ */
export async function markAsRead(req: Request, res: Response) {
  try {
    const userId = getUserId(req);
    const notificationId = parseInt(req.params.id);

    if (isNaN(notificationId)) {
      return res.status(400).json({ message: 'Invalid notification ID' });
    }

    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification || notification.userId !== userId) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    const updated = await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });

    res.json({ message: 'Notification marked as read', notification: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update notification' });
  }
}

/* ------------------------------------------------------------------ */
/*  PATCH /api/notifications/read-all                                */
/*  Mark all user notifications as read                              */
/* ------------------------------------------------------------------ */
export async function markAllAsRead(req: Request, res: Response) {
  try {
    const userId = getUserId(req);

    const { count } = await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });

    res.json({ message: `Successfully marked ${count} notifications as read` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update notifications' });
  }
}

/* ------------------------------------------------------------------ */
/*  DELETE /api/notifications/:id                                    */
/*  Delete a single notification                                     */
/* ------------------------------------------------------------------ */
export async function deleteNotification(req: Request, res: Response) {
  try {
    const userId = getUserId(req);
    const notificationId = parseInt(req.params.id);

    if (isNaN(notificationId)) {
      return res.status(400).json({ message: 'Invalid notification ID' });
    }

    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification || notification.userId !== userId) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    await prisma.notification.delete({
      where: { id: notificationId },
    });

    res.json({ message: 'Notification deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete notification' });
  }
}
