// ============================================================
// BLOQUE 1: KpiCard — tarjeta de métrica principal
// Qué hace: muestra 1 KPI (valor + % vs mes anterior).
// El valor se formatea según idioma: COP en ES, USD en EN.
// ============================================================

import { ArrowDownRight, ArrowUpRight, Percent, UserCheck, Wallet, Clock } from 'lucide-react';
import type { Kpi } from '../../types/dashboard';
import { useApp } from '../../context/AppContext';
import { formatCount, formatCurrency, formatPercent } from '../../services/format';

// ---- Icono y color por cada KPI ----
const CONFIG = {
  ingresos: { icon: Wallet, fondo: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300' },
  suscripciones: { icon: UserCheck, fondo: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300' },
  conversion: { icon: Percent, fondo: 'bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-300' },
  pendiente: { icon: Clock, fondo: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300' },
} as const;

export function KpiCard({ kpi }: { kpi: Kpi }) {
  // ---- Textos, idioma y moneda efectiva ----
  const { t, lang, monedaEfectiva } = useApp();
  const { icon: Icon, fondo } = CONFIG[kpi.id];

  // ---- Título traducido por id ----
  const titulo = {
    ingresos: t.kpi.ingresos,
    suscripciones: t.kpi.suscripciones,
    conversion: t.kpi.conversion,
    pendiente: t.kpi.pendiente,
  }[kpi.id];

  // ---- Valor visible: moneda / porcentaje / conteo ----
  let valorVisible: string;
  if (kpi.esMoneda) valorVisible = formatCurrency(kpi.valorUSD, lang, monedaEfectiva);
  else if (kpi.esPorcentaje) valorVisible = `${kpi.valorUSD.toFixed(2)}%`;
  else valorVisible = `${formatCount(kpi.valorUSD, lang)}`;

  // ---- Tendencia positiva o negativa ----
  const sube = kpi.deltaPct >= 0;
  const TrendIcon = sube ? ArrowUpRight : ArrowDownRight;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
      {/* Fila superior: icono + badge de tendencia */}
      <div className="flex items-start justify-between">
        <span className={`grid h-10 w-10 place-items-center rounded-xl ${fondo}`}>
          <Icon size={20} />
        </span>
        <span
          className={`flex items-center gap-0.5 rounded-full px-2 py-1 text-xs font-semibold ${
            sube
              ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300'
              : 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-300'
          }`}
        >
          <TrendIcon size={14} />
          {sube ? '+' : ''}
          {kpi.esPorcentaje
            ? `${kpi.deltaPct.toFixed(1)} pts`
            : formatPercent(kpi.deltaPct, lang)}
        </span>
      </div>

      {/* Valor + etiqueta */}
      <p className="mt-4 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
        {valorVisible}
      </p>
      <p className="mt-1 text-[13px] font-medium text-slate-500 dark:text-slate-400">
        {titulo}
        <span className="block text-xs font-normal text-slate-400">{t.kpi.vsMesAnterior}</span>
      </p>
    </article>
  );
}
