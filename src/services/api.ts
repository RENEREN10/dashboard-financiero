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

async function fetchJson<T>(ruta: string, fallback: T): Promise<T> {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 2500);
    const res = await fetch(`${API_BASE}${ruta}`, { signal: ctrl.signal });
    clearTimeout(t);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as T;
  } catch {
    return fallback;
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
    const res = await fetch(`${API_BASE}/api/clientes`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emailOriginal, nombre, email }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function apiEliminarCliente(email: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/api/clientes/${encodeURIComponent(email)}`, {
      method: 'DELETE',
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function apiRestaurar(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/api/reset`, { method: 'POST' });
    return res.ok;
  } catch {
    return false;
  }
}

export function backendDisponible(): Promise<boolean> {
  return fetchJson<{ ok: boolean }>('/api/health', { ok: false }).then((r) => r.ok);
}
