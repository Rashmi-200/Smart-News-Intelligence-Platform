import api from "@/lib/api";

export interface MarketData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume?: number;
  marketCap?: number;
}

export interface FinancialNewsItem {
  id: number;
  title: string;
  summary: string | null;
  source: string | null;
  url: string;
  publishedAt: string | null;
  sentiment: string | null;
}

export interface SentimentPoint {
  date: string;
  positive: number;
  negative: number;
  neutral: number;
}

export interface Company {
  id: number;
  name: string;
  ticker: string;
  price: number;
  change: number;
  changePercent: number;
  sector: string;
}

// ── GET /api/financial/market-data ───────────────────────────────────────────
export async function getMarketData(): Promise<MarketData[]> {
  const { data } = await api.get<MarketData[]>("/financial/market-data");
  return data;
}

// ── GET /api/financial/news ───────────────────────────────────────────────────
export async function getFinancialNews(): Promise<FinancialNewsItem[]> {
  const { data } = await api.get<FinancialNewsItem[]>("/financial/news");
  return data;
}

// ── GET /api/financial/sentiment-trend ───────────────────────────────────────
export async function getSentimentTrend(): Promise<SentimentPoint[]> {
  const { data } = await api.get<SentimentPoint[]>("/financial/sentiment-trend");
  return data;
}

// ── GET /api/financial/top-companies ─────────────────────────────────────────
export async function getTopCompanies(): Promise<Company[]> {
  const { data } = await api.get<Company[]>("/financial/top-companies");
  return data;
}
