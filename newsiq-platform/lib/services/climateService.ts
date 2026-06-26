import api from "@/lib/api";

export interface ClimateNewsItem {
  id: number;
  title: string;
  summary: string | null;
  source: string | null;
  url: string;
  publishedAt: string | null;
  category: string | null;
  sentiment: string | null;
}

export interface DisasterAlert {
  id: number;
  type: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  location: string;
  description: string;
  issuedAt: string;
  activeUntil: string | null;
}

export interface WeatherData {
  city: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  description: string;
  windSpeed: number;
  updatedAt: string;
}

// ── GET /api/climate/news ─────────────────────────────────────────────────────
export async function getClimateNews(): Promise<ClimateNewsItem[]> {
  const { data } = await api.get<ClimateNewsItem[]>("/climate/news");
  return data;
}

// ── GET /api/climate/alerts ───────────────────────────────────────────────────
export async function getDisasterAlerts(): Promise<DisasterAlert[]> {
  const { data } = await api.get<DisasterAlert[]>("/climate/alerts");
  return data;
}

// ── GET /api/climate/weather/:city ───────────────────────────────────────────
export async function getWeather(city: string): Promise<WeatherData> {
  const { data } = await api.get<WeatherData>(`/climate/weather/${encodeURIComponent(city)}`);
  return data;
}
