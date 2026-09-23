// ============================================================
// BLOQUE 1: TransactionsView — página completa de transacciones
// Qué hace: filtros por estado + búsqueda + rango de fechas,
// total filtrado, paginación (8 por página) y exportar CSV.
// La búsqueda global del header también filtra.
// ============================================================

import { useMemo, useState } from 'react';
import { Calendar, Download, Eraser, Search, SearchX } from 'lucide-react';
import type { TxnStatus } from '../../types/dashboard';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatDate } from '../../services/format';
import { exportarCSV } from '../../services/clientes';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';

type Filtro = 'todos' | TxnStatus;
const POR_PAGINA = 8;

export function TransactionsView() {
  const { t, lang, monedaEfectiva, busquedaGlobal, transacciones } = useApp();

  // ---- Filtros locales ----
  const [filtro, setFiltro] = useState<Filtro>('todos');
  const [busquedaLocal, setBusquedaLocal] = useState('');
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');
  const [pagina, setPagina] = useState(1);

  const estadoTexto: Record<TxnStatus, string> = {
    completado: t.tabla.completado,
    pendiente: t.tabla.pendiente,
    fallido: t.tabla.fallido,
  };

  const chips: { key: Filtro; label: string }[] = [
    { key: 'todos', label: t.tabla.todos },
    { key: 'completado', label: t.tabla.completado },
    { key: 'pendiente', label: t.tabla.pendiente },
    { key: 'fallido', label: t.tabla.fallido },
  ];

  // ------------------------------------------------------------
  // BLOQUE 2: Filtrado combinado (estado + textos + fechas)
  // ------------------------------------------------------------
  const filtradas = useMemo(() => {
    const q = `${busquedaGlobal} ${busquedaLocal}`.trim().toLowerCase();
    return transacciones.filter((tx) => {
      if (filtro !== 'todos' && tx.estado !== filtro) return false;
      if (q) {
        const hit =
          tx.cliente.toLowerCase().includes(q) ||
          tx.email.toLowerCase().includes(q) ||
          tx.id.toLowerCase().includes(q);
        if (!hit) return false;
      }
      if (desde && tx.fechaISO < desde) return false;
      if (hasta && tx.fechaISO > hasta) return false;
      return true;
    });
  }, [filtro, busquedaGlobal, busquedaLocal, desde, hasta, transacciones]);

  const totalUSD = useMemo(() => filtradas.reduce((a, tx) => a + tx.montoUSD, 0), [filtradas]);
  const totalPaginas = Math.max(1, Math.ceil(filtradas.length / POR_PAGINA));
  const paginaSafe = Math.min(pagina, totalPaginas);
  const visibles = filtradas.slice((paginaSafe - 1) * POR_PAGINA, paginaSafe * POR_PAGINA);

  const resetFiltros = () => {
    setFiltro('todos');
    setBusquedaLocal('');
    setDesde('');
    setHasta('');
    setPagina(1);
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold tracking-tight">{t.vistas.transaccionesTitulo}</h2>
        <p className="text-[13px] text-slate-500 dark:text-slate-400">{t.vistas.transaccionesSub}</p>
      </div>

      <Card>
        {/* ---- Barra de filtros ---- */}
        <div className="mb-4 flex flex-col gap-3">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
            <div className="relative lg:w-72">
              <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={busquedaLocal}
                onChange={(e) => { setBusquedaLocal(e.target.value); setPagina(1); }}
                placeholder={t.txFull.buscar}
                className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-[13px] outline-none placeholder:text-slate-400 focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {chips.map((c) => (
                <button
                  key={c.key}
                  onClick={() => { setFiltro(c.key); setPagina(1); }}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    filtro === c.key
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:flex-wrap">
            <label className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <Calendar size={14} />
              {t.txFull.desde}
              <input
                type="date"
                value={desde}
                onChange={(e) => { setDesde(e.target.value); setPagina(1); }}
                className="h-9 rounded-xl border border-slate-200 bg-slate-50 px-2 text-[13px] text-slate-700 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </label>
            <label className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              {t.txFull.hasta}
              <input
                type="date"
                value={hasta}
                onChange={(e) => { setHasta(e.target.value); setPagina(1); }}
                className="h-9 rounded-xl border border-slate-200 bg-slate-50 px-2 text-[13px] text-slate-700 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </label>
            <div className="flex gap-2 sm:ml-auto">
              <button
                onClick={resetFiltros}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
              >
                <Eraser size={14} /> {t.txFull.limpiar}
              </button>
              <button
                onClick={() => exportarCSV(filtradas)}
                className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-500"
              >
                <Download size={14} /> {t.txFull.exportar}
              </button>
            </div>
          </div>
        </div>

        {/* ---- Total filtrado ---- */}
        <div className="mb-3 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-2.5 text-[13px] dark:bg-slate-800/60">
          <span className="text-slate-500 dark:text-slate-400">
            {t.txFull.total}: <strong className="text-slate-800 dark:text-slate-100">{formatCurrency(totalUSD, lang, monedaEfectiva)}</strong>
          </span>
          <span className="text-xs text-slate-400">
            {filtradas.length} {t.txFull.facturas}
          </span>
        </div>

        {/* ---- Tabla ---- */}
        <div className="-mx-5 overflow-x-auto px-5">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-y border-slate-100 text-xs uppercase tracking-wide text-slate-400 dark:border-slate-800">
                <th className="py-2.5 pr-4 font-semibold">{t.tabla.colCliente}</th>
                <th className="py-2.5 pr-4 font-semibold">{t.tabla.colFecha}</th>
                <th className="py-2.5 pr-4 font-semibold">{t.tabla.colEstado}</th>
                <th className="py-2.5 text-right font-semibold">{t.tabla.colMonto}</th>
              </tr>
            </thead>
            <tbody>
              {visibles.map((tx) => (
                <tr key={tx.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/70 dark:border-slate-800/60 dark:hover:bg-slate-800/40">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-100 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {tx.cliente.slice(0, 2).toUpperCase()}
                      </span>
                      <span>
                        <span className="block text-[13px] font-semibold text-slate-800 dark:text-slate-100">{tx.cliente}</span>
                        <span className="block text-xs text-slate-400">{tx.id} · {tx.email}</span>
                      </span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap py-3 pr-4 text-[13px] text-slate-500 dark:text-slate-400">
                    {formatDate(tx.fechaISO, lang)}
                  </td>
                  <td className="py-3 pr-4">
                    <Badge estado={tx.estado} texto={estadoTexto[tx.estado]} />
                  </td>
                  <td className="py-3 text-right text-[13px] font-bold tabular-nums text-slate-800 dark:text-slate-100">
                    {formatCurrency(tx.montoUSD, lang, monedaEfectiva)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {visibles.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-10 text-slate-400">
              <SearchX size={28} />
              <p className="text-sm">{t.tabla.sinResultados}</p>
            </div>
          )}
        </div>

        {/* ---- Paginación ---- */}
        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
          <span>{t.txFull.pagina} {paginaSafe} / {totalPaginas}</span>
          <div className="flex gap-2">
            <button
              disabled={paginaSafe <= 1}
              onClick={() => setPagina((p) => Math.max(1, p - 1))}
              className="rounded-lg border border-slate-200 px-3 py-1.5 font-semibold hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              {t.txFull.anterior}
            </button>
            <button
              disabled={paginaSafe >= totalPaginas}
              onClick={() => setPagina((p) => p + 1)}
              className="rounded-lg border border-slate-200 px-3 py-1.5 font-semibold hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              {t.txFull.siguiente}
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
