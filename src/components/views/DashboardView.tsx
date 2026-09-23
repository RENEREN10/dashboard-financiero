// ============================================================
// BLOQUE 1: DashboardView — vista principal (la de siempre)
// Qué hace: KPIs + gráficas + tabla reciente. Extraída de
// App.tsx para que App solo enrute por `vistaActiva`.
// ============================================================

import { useApp } from '../../context/AppContext';
import { mockKpis } from '../../data/mockData';
import { KpiCard } from '../dashboard/KpiCard';
import { RevenueChart } from '../dashboard/RevenueChart';
import { CategoryDonut } from '../dashboard/CategoryDonut';
import { TransactionsTable } from '../dashboard/TransactionsTable';

export function DashboardView() {
  const { t } = useApp();

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold tracking-tight">{t.kpi.titulo}</h2>
        <p className="text-[13px] text-slate-500 dark:text-slate-400">{t.kpi.subtitulo}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {mockKpis.map((kpi) => (
          <KpiCard key={kpi.id} kpi={kpi} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <RevenueChart />
        <CategoryDonut />
      </div>

      <TransactionsTable />
    </div>
  );
}
