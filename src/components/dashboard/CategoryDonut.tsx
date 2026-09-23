// ============================================================
// BLOQUE 1: CategoryDonut — dona de ingresos por categoría
// Qué hace: PieChart con total al centro + leyenda con % y
// montos (COP en ES, USD en EN). Nombres traducidos.
// ============================================================

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { useApp } from '../../context/AppContext';
import { mockCategories } from '../../data/mockData';
import { formatCurrency } from '../../services/format';
import { Card, CardHeader } from '../ui/Card';

export function CategoryDonut() {
  const { t, lang, theme, monedaEfectiva } = useApp();

  // ---- Total anual + datos con nombre traducido ----
  const total = mockCategories.reduce((acc, c) => acc + c.valorUSD, 0);
  const datos = mockCategories.map((c) => ({
    ...c,
    nombre: t.categorias[c.key as keyof typeof t.categorias] ?? c.key,
  }));

  return (
    <Card>
      <CardHeader titulo={t.graficos.donaTitulo} subtitulo={t.graficos.donaSub} />

      {/* Dona con total al centro */}
      <div className="relative h-60 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: theme === 'dark' ? '1px solid #334155' : '1px solid #e2e8f0',
                background: theme === 'dark' ? '#0f172a' : '#fff',
                fontSize: 12,
              }}
              formatter={(value, _name, item) => [
                formatCurrency(Number(value ?? 0), lang, monedaEfectiva),
                (item?.payload as { nombre?: string } | undefined)?.nombre ?? '',
              ]}
            />
            <Pie
              data={datos}
              dataKey="valorUSD"
              nameKey="nombre"
              innerRadius={78}
              outerRadius={100}
              paddingAngle={3}
              strokeWidth={0}
            >
              {datos.map((d) => (
                <Cell key={d.key} fill={d.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        {/* Total centrado sobre la dona */}
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <div className="max-w-[150px] px-2 text-center">
            <p className="text-[10px] uppercase tracking-wide text-slate-400">{t.graficos.totalAnual}</p>
            <p className="mt-0.5 break-words text-[15px] font-bold leading-tight tabular-nums text-slate-900 dark:text-white">
              {formatCurrency(total, lang, monedaEfectiva)}
            </p>
          </div>
        </div>
      </div>

      {/* Leyenda con % y monto por categoría */}
      <ul className="mt-4 space-y-2.5">
        {datos.map((d) => {
          const pct = ((d.valorUSD / total) * 100).toFixed(1);
          return (
            <li key={d.key} className="flex items-center gap-2.5 text-[13px]">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: d.color }} />
              <span className="truncate text-slate-600 dark:text-slate-300">{d.nombre}</span>
              <span className="ml-auto font-semibold text-slate-800 dark:text-slate-100">{pct}%</span>
              <span className="w-24 text-right tabular-nums text-slate-400">
                {formatCurrency(d.valorUSD, lang, monedaEfectiva)}
              </span>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
