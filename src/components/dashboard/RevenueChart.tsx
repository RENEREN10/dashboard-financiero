// ============================================================
// BLOQUE 1: RevenueChart — Ingresos mensuales vs Gastos
// Qué hace: gráfica principal de área (Recharts). Eje X con
// meses traducidos, eje Y y tooltip en COP (ES) o USD (EN).
// ============================================================

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { mockRevenue } from '../../data/mockData';
import { formatCurrency, formatCurrencyCompact } from '../../services/format';
import { Card, CardHeader } from '../ui/Card';

export function RevenueChart() {
  // ---- Idioma, moneda, textos y tema (para colores del grid) ----
  const { t, lang, theme, monedaEfectiva } = useApp();
  const gridColor = theme === 'dark' ? '#1e293b' : '#e2e8f0';
  const tickColor = theme === 'dark' ? '#94a3b8' : '#64748b';

  // ---- Datos con mes ya traducido (ene/Jan...) ----
  const datos = mockRevenue.map((p) => ({
    ...p,
    mes: t.meses[p.mesKey],
  }));

  return (
    <Card className="xl:col-span-2">
      <CardHeader titulo={t.graficos.ingresosTitulo} subtitulo={t.graficos.ingresosSub} />

      {/* Leyenda manual (colores = series) */}
      <div className="mb-3 flex gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" /> {t.graficos.ingresos}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-slate-300 dark:bg-slate-600" /> {t.graficos.gastos}
        </span>
      </div>

      {/* Gráfica responsive */}
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={datos} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="gradIngresos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={gridColor} strokeDasharray="4 4" vertical={false} />
            <XAxis
              dataKey="mes"
              tick={{ fill: tickColor, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: tickColor, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={70}
              tickFormatter={(v: number) => formatCurrencyCompact(v, lang, monedaEfectiva)}
            />
            {/* Tooltip con moneda completa localizada */}
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: theme === 'dark' ? '1px solid #334155' : '1px solid #e2e8f0',
                background: theme === 'dark' ? '#0f172a' : '#fff',
                fontSize: 12,
              }}
              formatter={(value, name) => [
                formatCurrency(Number(value ?? 0), lang, monedaEfectiva),
                name === 'ingresos' ? t.graficos.ingresos : t.graficos.gastos,
              ]}
            />
            <Area
              type="monotone"
              dataKey="ingresos"
              stroke="#6366f1"
              strokeWidth={2.5}
              fill="url(#gradIngresos)"
            />
            <Area
              type="monotone"
              dataKey="gastos"
              stroke="#94a3b8"
              strokeWidth={2}
              strokeDasharray="6 4"
              fill="transparent"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
