// ============================================================
// BLOQUE 1: TransactionsTable — tabla de transacciones recientes
// Qué hace: columnas Cliente / Fecha / Estado / Monto.
// Filtros: búsqueda global del header (por nombre) + chips
// por estado + buscador local. Montos en COP (ES) o USD (EN).
// ============================================================

import { useMemo, useState } from 'react';
import { ChevronDown, Search, SearchX } from 'lucide-react';
import type { TxnStatus } from '../../types/dashboard';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatDate } from '../../services/format';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';

type Filtro = 'todos' | TxnStatus;

export function TransactionsTable() {
  // ---- Textos, idioma, moneda y búsqueda que viene del header ----
  const { t, lang, monedaEfectiva, busquedaGlobal, transacciones } = useApp();

  // ---- Estado local: filtro por estado + búsqueda local + ver todo ----
  const [filtro, setFiltro] = useState<Filtro>('todos');
  const [busquedaLocal, setBusquedaLocal] = useState('');
  const [expandida, setExpandida] = useState(false);

  // ---- Etiquetas de estado traducidas ----
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
  // BLOQUE 2: Filtrado combinado (estado + ambas búsquedas)
  // ------------------------------------------------------------
  const filtradas = useMemo(() => {
    const q = `${busquedaGlobal} ${busquedaLocal}`.trim().toLowerCase();
    return transacciones.filter((tx) => {
      const pasaEstado = filtro === 'todos' || tx.estado === filtro;
      const pasaQuery =
        q === '' ||
        tx.cliente.toLowerCase().includes(q) ||
        tx.email.toLowerCase().includes(q) ||
        tx.id.toLowerCase().includes(q);
      return pasaEstado && pasaQuery;
    });
  }, [filtro, busquedaGlobal, busquedaLocal, transacciones]);

  // Muestra 6 filas salvo que se expanda
  const visibles = expandida ? filtradas : filtradas.slice(0, 6);

  return (
    <Card>
      {/* -------------------------------------------------- */}
      {/* BLOQUE 3: Título + buscador local + chips de estado */}
      {/* -------------------------------------------------- */}
      <div className="mb-4 flex flex-col gap-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{t.tabla.titulo}</h3>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{t.tabla.subtitulo}</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative sm:w-64">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={busquedaLocal}
              onChange={(e) => setBusquedaLocal(e.target.value)}
              placeholder={t.tabla.buscar}
              className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-[13px] outline-none placeholder:text-slate-400 focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {chips.map((c) => (
              <button
                key={c.key}
                onClick={() => setFiltro(c.key)}
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
      </div>

      {/* -------------------------------------------------- */}
      {/* BLOQUE 4: Tabla (scroll horizontal en móvil)        */}
      {/* -------------------------------------------------- */}
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
              <tr
                key={tx.id}
                className="border-b border-slate-50 last:border-0 hover:bg-slate-50/70 dark:border-slate-800/60 dark:hover:bg-slate-800/40"
              >
                {/* Cliente: avatar iniciales + nombre + email */}
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-100 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {tx.cliente.slice(0, 2).toUpperCase()}
                    </span>
                    <span>
                      <span className="block text-[13px] font-semibold text-slate-800 dark:text-slate-100">
                        {tx.cliente}
                      </span>
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

        {/* Estado vacío */}
        {visibles.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-10 text-slate-400">
            <SearchX size={28} />
            <p className="text-sm">{t.tabla.sinResultados}</p>
          </div>
        )}
      </div>

      {/* -------------------------------------------------- */}
      {/* BLOQUE 5: Pie — conteo + botón ver más/menos        */}
      {/* -------------------------------------------------- */}
      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-400 dark:border-slate-800">
        <span>
          {t.tabla.mostrando} {visibles.length} {t.tabla.de} {filtradas.length}
        </span>
        {filtradas.length > 6 && (
          <button
            onClick={() => setExpandida((v) => !v)}
            className="flex items-center gap-1 font-semibold text-indigo-600 hover:underline"
          >
            {expandida ? t.tabla.verMenos : t.tabla.verMas}
            <ChevronDown size={14} className={`transition-transform ${expandida ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>
    </Card>
  );
}
