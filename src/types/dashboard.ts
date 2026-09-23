// ============================================================
// BLOQUE 1: Tipos globales del dashboard
// Qué hace: define la forma exacta de cada dato (TypeScript
// estricto). Si el backend cambia, solo se ajusta aquí.
// ============================================================

export type Lang = 'es' | 'en';
export type Theme = 'light' | 'dark';
export type TxnStatus = 'completado' | 'pendiente' | 'fallido';

// ---- Moneda visible: auto sigue al idioma, o fija ----
export type Moneda = 'auto' | 'COP' | 'USD';
export type MonedaEfectiva = 'COP' | 'USD';

// ---- Vista activa del Sidebar (navegación sin router) ----
export type Vista = 'dashboard' | 'transacciones' | 'analisis' | 'clientes' | 'config';

// ---- KPI: tarjeta de métrica principal ----
export interface Kpi {
  id: 'ingresos' | 'suscripciones' | 'conversion' | 'pendiente';
  /** Valor base en USD (luego se convierte a COP si lang === 'es') */
  valorUSD: number;
  /** % de cambio vs mes anterior (+ sube, - baja) */
  deltaPct: number;
  /** true = el valor es dinero, false = es conteo/porcentaje */
  esMoneda: boolean;
  /** true = el valor ya es porcentaje (ej. 3.4%) */
  esPorcentaje?: boolean;
}

// ---- Punto mensual del gráfico Ingresos vs Gastos (USD base) ----
export interface RevenuePoint {
  mesKey: MonthKey;
  ingresos: number;
  gastos: number;
}

export type MonthKey =
  | 'ene' | 'feb' | 'mar' | 'abr' | 'may' | 'jun'
  | 'jul' | 'ago' | 'sep' | 'oct' | 'nov' | 'dic';

// ---- Porción de la dona por categoría de servicio ----
export interface CategorySlice {
  key: string; // clave para traducir el nombre
  valorUSD: number;
  color: string; // color fijo del segmento
}

// ---- Transacción de la tabla ----
export interface Transaction {
  id: string;
  cliente: string;
  email: string;
  fechaISO: string;
  estado: TxnStatus;
  montoUSD: number;
}

// ---- Notificación del header (textos por clave i18n) ----
export interface AppNotification {
  id: string;
  tituloKey: 'n1t' | 'n2t' | 'n3t';
  descKey: 'n1d' | 'n2d' | 'n3d';
  tiempoKey: 'n1h' | 'n2h' | 'n3h';
  noLeida: boolean;
}

// ---- Cliente agregado (derivado de transacciones) ----
export interface ClienteResumen {
  nombre: string;
  email: string;
  totalUSD: number;
  numFacturas: number;
  ultimaFechaISO: string;
  ultimoEstado: TxnStatus;
  transacciones: Transaction[];
}

// ---- Perfil editable + preferencias (Configuración) ----
export interface Perfil {
  nombre: string;
  rol: string;
  email: string;
  empresa: string;
}

export interface Prefs {
  notifEmail: boolean;
  notifPush: boolean;
  resumenSemanal: boolean;
  moneda: Moneda;
}
