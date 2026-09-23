// ============================================================
// BLOQUE 1: Formato de moneda / número / fecha según idioma
// Qué hace: convierte el valor base USD a la moneda visible.
// Por defecto sigue al idioma (ES→COP, EN→USD), pero si se
// pasa `moneda` explícita (COP/USD) manda esa. Así Config
// puede fijar moneda sin cambiar el idioma.
// ============================================================

import type { Lang, Moneda, MonedaEfectiva } from '../types/dashboard';

/** Tasa fija de demostración: 1 USD = 4.120 COP */
export const TRM_MOCK = 4120;

/** Resuelve COP/USD efectiva: auto→idioma, o la fijada */
export function resolverMoneda(lang: Lang, moneda: Moneda | MonedaEfectiva = 'auto'): MonedaEfectiva {
  if (moneda === 'COP' || moneda === 'USD') return moneda;
  return lang === 'es' ? 'COP' : 'USD';
}

/** Locale según moneda efectiva (no según idioma) */
function localeDe(moneda: MonedaEfectiva): string {
  return moneda === 'COP' ? 'es-CO' : 'en-US';
}

/** Convierte USD base a valor visible según moneda efectiva */
export function toDisplayAmount(
  montoUSD: number,
  lang: Lang,
  moneda: Moneda | MonedaEfectiva = 'auto',
): number {
  return resolverMoneda(lang, moneda) === 'COP' ? montoUSD * TRM_MOCK : montoUSD;
}

/** Moneda completa para KPIs, tabla y tooltips */
export function formatCurrency(
  montoUSD: number,
  lang: Lang,
  moneda: Moneda | MonedaEfectiva = 'auto',
): string {
  const efectiva = resolverMoneda(lang, moneda);
  const valor = efectiva === 'COP' ? montoUSD * TRM_MOCK : montoUSD;
  return new Intl.NumberFormat(localeDe(efectiva), {
    style: 'currency',
    currency: efectiva,
    maximumFractionDigits: 0,
  }).format(valor);
}

/** Moneda compacta para ejes de gráficas ($48 M / $12K) */
export function formatCurrencyCompact(
  montoUSD: number,
  lang: Lang,
  moneda: Moneda | MonedaEfectiva = 'auto',
): string {
  const efectiva = resolverMoneda(lang, moneda);
  const valor = efectiva === 'COP' ? montoUSD * TRM_MOCK : montoUSD;
  return new Intl.NumberFormat(localeDe(efectiva), {
    style: 'currency',
    currency: efectiva,
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(valor);
}

// ============================================================
// BLOQUE 2: Porcentajes, conteos y fechas localizadas
// ============================================================

export function formatPercent(valor: number, lang: Lang, decimales = 1): string {
  return new Intl.NumberFormat(lang === 'es' ? 'es-CO' : 'en-US', {
    style: 'percent',
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales,
  }).format(valor / 100);
}

export function formatCount(valor: number, lang: Lang): string {
  return new Intl.NumberFormat(lang === 'es' ? 'es-CO' : 'en-US').format(valor);
}

export function formatDate(fechaISO: string, lang: Lang): string {
  return new Intl.DateTimeFormat(lang === 'es' ? 'es-CO' : 'en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(fechaISO));
}
