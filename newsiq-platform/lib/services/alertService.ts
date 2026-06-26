import api from "@/lib/api";

export interface Alert {
  id: number;
  userId: number;
  keyword: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAlertPayload {
  keyword: string;
}

// ── GET /api/alerts ───────────────────────────────────────────────────────────
export async function getAlerts(): Promise<Alert[]> {
  const { data } = await api.get<Alert[]>("/alerts");
  return data;
}

// ── POST /api/alerts ──────────────────────────────────────────────────────────
export async function createAlert(payload: CreateAlertPayload): Promise<Alert> {
  const { data } = await api.post<Alert>("/alerts", payload);
  return data;
}

// ── PATCH /api/alerts/:id — toggle active state ───────────────────────────────
export async function toggleAlert(id: number): Promise<Alert> {
  const { data } = await api.patch<Alert>(`/alerts/${id}`);
  return data;
}

// ── DELETE /api/alerts/:id ────────────────────────────────────────────────────
export async function deleteAlert(id: number): Promise<void> {
  await api.delete(`/alerts/${id}`);
}
