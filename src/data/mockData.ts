// ============================================================
// BLOQUE 1: Mock data realista (se ve lleno desde el 1er render)
// Qué hace: simula lo que luego devolverá el backend.
// Todos los montos están en USD base; format.ts los convierte.
// ============================================================

import type {
  AppNotification,
  CategorySlice,
  Kpi,
  RevenuePoint,
  Transaction,
} from '../types/dashboard';

// ---- KPIs principales ----
export const mockKpis: Kpi[] = [
  { id: 'ingresos', valorUSD: 128540, deltaPct: 12.4, esMoneda: true },
  { id: 'suscripciones', valorUSD: 2847, deltaPct: 8.1, esMoneda: false },
  { id: 'conversion', valorUSD: 3.42, deltaPct: -0.6, esMoneda: false, esPorcentaje: true },
  { id: 'pendiente', valorUSD: 18420, deltaPct: 4.2, esMoneda: true },
];

// ---- Ingresos vs Gastos, 12 meses (USD) ----
export const mockRevenue: RevenuePoint[] = [
  { mesKey: 'ene', ingresos: 48200, gastos: 31400 },
  { mesKey: 'feb', ingresos: 51400, gastos: 29800 },
  { mesKey: 'mar', ingresos: 53800, gastos: 33200 },
  { mesKey: 'abr', ingresos: 49600, gastos: 35100 },
  { mesKey: 'may', ingresos: 61200, gastos: 36700 },
  { mesKey: 'jun', ingresos: 65800, gastos: 38200 },
  { mesKey: 'jul', ingresos: 62400, gastos: 41900 },
  { mesKey: 'ago', ingresos: 71300, gastos: 39800 },
  { mesKey: 'sep', ingresos: 78900, gastos: 44600 },
  { mesKey: 'oct', ingresos: 83400, gastos: 47200 },
  { mesKey: 'nov', ingresos: 91200, gastos: 51800 },
  { mesKey: 'dic', ingresos: 98500, gastos: 55300 },
];

// ---- Distribución por categoría de servicio ----
export const mockCategories: CategorySlice[] = [
  { key: 'suscripciones', valorUSD: 214000, color: '#6366f1' },
  { key: 'servicios', valorUSD: 98000, color: '#10b981' },
  { key: 'publicidad', valorUSD: 64000, color: '#f59e0b' },
  { key: 'soporte', valorUSD: 42000, color: '#0ea5e9' },
  { key: 'integraciones', valorUSD: 31000, color: '#f43f5e' },
];

// ---- Transacciones recientes ----
export const mockTransactions: Transaction[] = [
  { id: 'INV-2041', cliente: 'Acme Corp', email: 'billing@acme.co', fechaISO: '2026-09-20', estado: 'completado', montoUSD: 4999 },
  { id: 'INV-2040', cliente: 'Globex', email: 'finance@globex.com', fechaISO: '2026-09-19', estado: 'completado', montoUSD: 1299 },
  { id: 'INV-2039', cliente: 'Soylent', email: 'cuentas@soylent.com', fechaISO: '2026-09-18', estado: 'fallido', montoUSD: 899 },
  { id: 'INV-2038', cliente: 'Initech', email: 'pago@initech.io', fechaISO: '2026-09-17', estado: 'pendiente', montoUSD: 2499 },
  { id: 'INV-2037', cliente: 'Umbrella Labs', email: 'admin@umbrella.dev', fechaISO: '2026-09-15', estado: 'completado', montoUSD: 349 },
  { id: 'INV-2036', cliente: 'Hooli', email: 'billing@hooli.com', fechaISO: '2026-09-14', estado: 'completado', montoUSD: 1899 },
  { id: 'INV-2035', cliente: 'Stark Industries', email: 'ap@stark.com', fechaISO: '2026-09-12', estado: 'pendiente', montoUSD: 4200 },
  { id: 'INV-2034', cliente: 'Wayne Enterprises', email: 'finance@wayne.co', fechaISO: '2026-09-10', estado: 'completado', montoUSD: 749 },
  { id: 'INV-2033', cliente: 'Massive Dynamic', email: 'billing@massive.io', fechaISO: '2026-09-08', estado: 'fallido', montoUSD: 1599 },
  { id: 'INV-2032', cliente: 'Cyberdyne', email: 'cuentas@cyberdyne.ai', fechaISO: '2026-09-05', estado: 'completado', montoUSD: 999 },
  { id: 'INV-2031', cliente: 'Acme Corp', email: 'billing@acme.co', fechaISO: '2026-08-28', estado: 'completado', montoUSD: 3200 },
  { id: 'INV-2030', cliente: 'Globex', email: 'finance@globex.com', fechaISO: '2026-08-25', estado: 'pendiente', montoUSD: 2100 },
  { id: 'INV-2029', cliente: 'Initech', email: 'pago@initech.io', fechaISO: '2026-08-22', estado: 'completado', montoUSD: 1150 },
  { id: 'INV-2028', cliente: 'Hooli', email: 'billing@hooli.com', fechaISO: '2026-08-20', estado: 'fallido', montoUSD: 2750 },
  { id: 'INV-2027', cliente: 'Stark Industries', email: 'ap@stark.com', fechaISO: '2026-08-18', estado: 'completado', montoUSD: 5100 },
  { id: 'INV-2026', cliente: 'Wayne Enterprises', email: 'finance@wayne.co', fechaISO: '2026-08-15', estado: 'completado', montoUSD: 1890 },
  { id: 'INV-2025', cliente: 'Umbrella Labs', email: 'admin@umbrella.dev', fechaISO: '2026-08-12', estado: 'pendiente', montoUSD: 640 },
  { id: 'INV-2024', cliente: 'Massive Dynamic', email: 'billing@massive.io', fechaISO: '2026-08-10', estado: 'completado', montoUSD: 2300 },
  { id: 'INV-2023', cliente: 'Cyberdyne', email: 'cuentas@cyberdyne.ai', fechaISO: '2026-08-08', estado: 'completado', montoUSD: 1450 },
  { id: 'INV-2022', cliente: 'Soylent', email: 'cuentas@soylent.com', fechaISO: '2026-08-05', estado: 'completado', montoUSD: 1750 },
  { id: 'INV-2021', cliente: 'Acme Corp', email: 'billing@acme.co', fechaISO: '2026-07-29', estado: 'pendiente', montoUSD: 4100 },
  { id: 'INV-2020', cliente: 'Globex', email: 'finance@globex.com', fechaISO: '2026-07-26', estado: 'completado', montoUSD: 980 },
  { id: 'INV-2019', cliente: 'Hooli', email: 'billing@hooli.com', fechaISO: '2026-07-22', estado: 'completado', montoUSD: 3100 },
  { id: 'INV-2018', cliente: 'Stark Industries', email: 'ap@stark.com', fechaISO: '2026-07-18', estado: 'fallido', montoUSD: 2900 },
  { id: 'INV-2017', cliente: 'Initech', email: 'pago@initech.io', fechaISO: '2026-07-15', estado: 'completado', montoUSD: 1320 },
  { id: 'INV-2016', cliente: 'Wayne Enterprises', email: 'finance@wayne.co', fechaISO: '2026-07-10', estado: 'pendiente', montoUSD: 860 },
  { id: 'INV-2015', cliente: 'Cyberdyne', email: 'cuentas@cyberdyne.ai', fechaISO: '2026-07-06', estado: 'completado', montoUSD: 2210 },
  { id: 'INV-2014', cliente: 'Umbrella Labs', email: 'admin@umbrella.dev', fechaISO: '2026-07-02', estado: 'completado', montoUSD: 540 },
];

// ---- Notificaciones del header ----
export const mockNotifications: AppNotification[] = [
  { id: 'n1', tituloKey: 'n1t', descKey: 'n1d', tiempoKey: 'n1h', noLeida: true },
  { id: 'n2', tituloKey: 'n2t', descKey: 'n2d', tiempoKey: 'n2h', noLeida: true },
  { id: 'n3', tituloKey: 'n3t', descKey: 'n3d', tiempoKey: 'n3h', noLeida: false },
];
