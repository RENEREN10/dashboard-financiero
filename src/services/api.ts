// ============================================================
// BLOQUE 1: Capa de servicio con backend real + fallback mock
// Qué hace: intenta fetch a VITE_API_URL; si el backend está
// apagado, cae al mock para que la plantilla siga viéndose.
// Así `npm run dev` funciona con o sin `npm run dev` del API.
// ============================================================

import {
  mockCategories,
  mockKpis,
  mockNotifications,
  mockRevenue,
  mockTransactions,
} from '../data/mockData';
import type {
  AppNotification,
  CategorySlice,
  Kpi,
  RevenuePoint,
  Transaction,
} from '../types/dashboard';

const API_BASE = import.meta.env.VITE_API_URL as string | undefined ?? 'http://localhost:3001';

// Render free tarda ~50s en despertar: 10s de margen, con reintento del efecto.
const TIMEOUT_MS = 10000;

async function fetchJson<T>(ruta: string, fallback: T, timeoutMs = TIMEOUT_MS): Promise<T> {
  const r = await fetchJsonCrudo<T>(ruta, timeoutMs);
  return r.fromBackend ? r.data : fallback;
}

// ============================================================
// BLOQUE 1b: Fetch crudo — distingue backend real de fallo.
// Qué hace: NUNCA devuelve fallback; si el API no responde,
// fromBackend=false y el contexto conserva el localStorage
// en vez de pisar tus ediciones con el mock original.
// ============================================================

async function fetchJsonCrudo<T>(
  ruta: string,
  timeoutMs = TIMEOUT_MS,
): Promise<{ data: T; fromBackend: true } | { data: null; fromBackend: false }> {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), timeoutMs);
    const res = await fetch(`${API_BASE}${ruta}`, { signal: ctrl.signal });
    clearTimeout(t);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return { data: (await res.json()) as T, fromBackend: true };
  } catch {
    return { data: null, fromBackend: false };
  }
}

// ---- Lecturas (mismo shape que mockData) ----
export const getKpis = (): Promise<Kpi[]> =>
  fetchJson<Kpi[]>('/api/kpis', mockKpis);
export const getRevenue = (): Promise<RevenuePoint[]> =>
  fetchJson<RevenuePoint[]>('/api/revenue', mockRevenue);
export const getCategories = (): Promise<CategorySlice[]> =>
  fetchJson<CategorySlice[]>('/api/categories', mockCategories);
export const getTransactions = (): Promise<Transaction[]> =>
  fetchJson<Transaction[]>('/api/transactions', mockTransactions);
export const getNotifications = (): Promise<AppNotification[]> =>
  fetchJson<AppNotification[]>('/api/notifications', mockNotifications);

// Solo el contexto usa esta: sincroniza caché ÚNICAMENTE con backend real.
export const getTransactionsRaw = (): Promise<
  { data: Transaction[]; fromBackend: true } | { data: null; fromBackend: false }
> =>
  fetchJsonCrudo<Transaction[]>('/api/transactions');

// ============================================================
// BLOQUE 2: Escrituras de clientes (devuelven true si el API
// confirmó; false si hay que quedarse solo con localStorage)
// ============================================================

export async function apiActualizarCliente(
  emailOriginal: string,
  nombre: string,
  email: string,
): Promise<boolean> {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
    const res = await fetch(`${API_BASE}/api/clientes`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emailOriginal, nombre, email }),
      signal: ctrl.signal,
    });
    clearTimeout(t);
    return res.ok;
  } catch {
    return false;
  }
}

export async function apiEliminarCliente(email: string): Promise<boolean> {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
    const res = await fetch(`${API_BASE}/api/clientes/${encodeURIComponent(email)}`, {
      method: 'DELETE',
      signal: ctrl.signal,
    });
    clearTimeout(t);
    return res.ok;
  } catch {
    return false;
  }
}

export async function apiRestaurar(): Promise<boolean> {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
    const res = await fetch(`${API_BASE}/api/reset`, { method: 'POST', signal: ctrl.signal });
    clearTimeout(t);
    return res.ok;
  } catch {
    return false;
  }
}

export function backendDisponible(): Promise<boolean> {
  return fetchJson<{ ok: boolean }>('/api/health', { ok: false }).then((r) => r.ok);
}
