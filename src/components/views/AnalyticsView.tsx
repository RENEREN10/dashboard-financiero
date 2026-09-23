// ============================================================
// BLOQUE 1: AnalyticsView — análisis profundo
// Qué hace: barras Ingresos vs Gastos, evolución del margen
// y top categorías. Todo derivado del mock existente.
// ============================================================

import { useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { mockCategories, mockRevenue } from '../../data/mockData';
import { formatCurrency, formatCurrencyCompact } from '../../services/format';
import { Card, CardHeader } from '../ui/Card';

export function AnalyticsView() {
  const { t, lang, theme, monedaEfectiva, transacciones } = useApp();
  const gridColor = theme === 'dark' ? '#1e293b' : '#e2e8f0';
  const tickColor = theme === 'dark' ? '#94a3b8' : '#64748b';
  const tooltipStyle = {
    borderRadius: 12,
    border: theme === 'dark' ? '1px solid #334155' : '1px solid #e2e8f0',
    background: theme === 'dark' ? '#0f172a' : '#fff',
    fontSize: 12,
  };

  // ---- Datos mensuales con margen ----
  const datos = useMemo(
    () =>
      mockRevenue.map((p) => ({
        ...p,
        mes: t.meses[p.mesKey],
        margen: p.ingresos - p.gastos,
        margenPct: ((p.ingresos - p.gastos) / p.ingresos) * 100,
      })),
    [t],
  );

  const totalIngresos = mockRevenue.reduce((a, p) => a + p.ingresos, 0);
  const totalGastos = mockRevenue.reduce((a, p) => a + p.gastos, 0);
  const margenTotal = totalIngresos - totalGastos;
  const margenPct = (margenTotal / totalIngresos) * 100;
  const ticketPromedio =
    transacciones.reduce((a, tx) => a + tx.montoUSD, 0) / Math.max(1, transacciones.length);

  const mejor = [...datos].sort((a, b) => b.ingresos - a.ingresos)[0];
  const peor = [...datos].sort((a, b) => a.ingresos - b.ingresos)[0];
  const topCats = [...mockCategories].sort((a, b) => b.valorUSD - a.valorUSD).slice(0, 3);
  const totalCats = mockCategories.reduce((a, c) => a + c.valorUSD, 0);

  const stats = [
    { label: t.analisis.margen, valor: formatCurrency(margenTotal, lang, monedaEfectiva), sub: `${margenPct.toFixed(1)}%` },
    { label: t.analisis.promedio, valor: formatCurrency(ticketPromedio, lang, monedaEfectiva), sub: `${transacciones.length} tx` },
    { label: t.analisis.mejorMes, valor: mejor.mes, sub: formatCurrency(mejor.ingresos, lang, monedaEfectiva) },
    { label: t.analisis.peorMes, valor: peor.mes, sub: formatCurrency(peor.ingresos, lang, monedaEfectiva) },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold tracking-tight">{t.vistas.analisisTitulo}</h2>
        <p className="text-[13px] text-slate-500 dark:text-slate-400">{t.vistas.analisisSub}</p>
      </div>

      {/* ---- Mini stats ---- */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{s.label}</p>
            <p className="mt-1 text-xl font-bold tracking-tight text-slate-900 dark:text-white">{s.valor}</p>
            <p className="mt-0.5 text-xs text-slate-400">{s.sub}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {/* ---- Barras mensuales ---- */}
        <Card>
          <CardHeader titulo={t.analisis.barrasTitulo} subtitulo={t.analisis.barrasSub} />
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={datos} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                <CartesianGrid stroke={gridColor} strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="mes" tick={{ fill: tickColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: tickColor, fontSize: 11 }} axisLine={false} tickLine={false} width={70}
                  tickFormatter={(v: number) => formatCurrencyCompact(v, lang, monedaEfectiva)} />
                <Tooltip contentStyle={tooltipStyle}
                  formatter={(value, name) => [
                    formatCurrency(Number(value ?? 0), lang, monedaEfectiva),
                    name === 'ingresos' ? t.graficos.ingresos : t.graficos.gastos,
                  ]} />
                <Bar dataKey="ingresos" fill="#6366f1" radius={[6, 6, 0, 0]} />
                <Bar dataKey="gastos" fill="#94a3b8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* ---- Evolución del margen ---- */}
        <Card>
          <CardHeader titulo={t.analisis.margenTitulo} subtitulo={t.analisis.margenSub} />
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={datos} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                <CartesianGrid stroke={gridColor} strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="mes" tick={{ fill: tickColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: tickColor, fontSize: 11 }} axisLine={false} tickLine={false} width={70}
                  tickFormatter={(v: number) => formatCurrencyCompact(v, lang, monedaEfectiva)} />
                <Tooltip contentStyle={tooltipStyle}
                  formatter={(value) => [formatCurrency(Number(value ?? 0), lang, monedaEfectiva), t.analisis.margen]} />
                <Line type="monotone" dataKey="margen" stroke="#10b981" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* ---- Top categorías ---- */}
      <Card>
        <CardHeader titulo={t.analisis.topTitulo} subtitulo={t.analisis.topSub} />
        <ul className="space-y-3">
          {topCats.map((c, i) => {
            const nombre = t.categorias[c.key as keyof typeof t.categorias] ?? c.key;
            const pct = (c.valorUSD / totalCats) * 100;
            return (
              <li key={c.key} className="flex items-center gap-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-sm font-bold text-white" style={{ background: c.color }}>
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2 text-[13px]">
                    <span className="truncate font-semibold text-slate-700 dark:text-slate-200">{nombre}</span>
                    <span className="shrink-0 font-bold tabular-nums text-slate-800 dark:text-slate-100">
                      {formatCurrency(c.valorUSD, lang, monedaEfectiva)} · {pct.toFixed(1)}%
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: c.color }} />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </Card>
    </div>
  );
}
