import api from "@/lib/api";

export interface Notification {
  id: number;
  userId: number;
  title: string;
  body: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  articleId?: number | null;
}

// ── GET /api/notifications ────────────────────────────────────────────────────
export async function getNotifications(): Promise<Notification[]> {
  const { data } = await api.get<Notification[]>("/notifications");
  return data;
}

// ── PATCH /api/notifications/:id/read ────────────────────────────────────────
export async function markAsRead(id: number): Promise<Notification> {
  const { data } = await api.patch<Notification>(`/notifications/${id}/read`);
  return data;
}

// ── PATCH /api/notifications/read-all ────────────────────────────────────────
export async function markAllAsRead(): Promise<{ count: number }> {
  const { data } = await api.patch<{ count: number }>("/notifications/read-all");
  return data;
}

// ── DELETE /api/notifications/:id ────────────────────────────────────────────
export async function deleteNotification(id: number): Promise<void> {
  await api.delete(`/notifications/${id}`);
}
