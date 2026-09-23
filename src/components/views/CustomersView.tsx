// ============================================================
// BLOQUE 1: CustomersView — cartera editable
// Qué hace: agrupa transacciones globales por cliente, busca,
// abre detalle, edita nombre/email y elimina con confirmación.
// Todo persiste en localStorage vía AppContext.
// ============================================================

import { useEffect, useMemo, useState } from 'react';
import { Pencil, Receipt, RotateCcw, Search, SearchX, Trash2, X } from 'lucide-react';
import type { ClienteResumen } from '../../types/dashboard';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatDate } from '../../services/format';
import { agruparClientes } from '../../services/clientes';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';

export function CustomersView() {
  const {
    t, lang, monedaEfectiva, busquedaGlobal,
    transacciones, actualizarCliente, eliminarCliente, restaurarTransacciones,
  } = useApp();

  const [busquedaLocal, setBusquedaLocal] = useState('');
  const [selEmail, setSelEmail] = useState<string | null>(null);
  const [editando, setEditando] = useState<ClienteResumen | null>(null);
  const [editNombre, setEditNombre] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [confirmando, setConfirmando] = useState<ClienteResumen | null>(null);
  const [aviso, setAviso] = useState('');

  const estadoTexto = {
    completado: t.tabla.completado,
    pendiente: t.tabla.pendiente,
    fallido: t.tabla.fallido,
  } as const;

  // ---- Agrupado desde la fuente global (refleja edits/deletes) ----
  const clientes = useMemo(() => agruparClientes(transacciones), [transacciones]);
  const filtrados = useMemo(() => {
    const q = `${busquedaGlobal} ${busquedaLocal}`.trim().toLowerCase();
    if (!q) return clientes;
    return clientes.filter(
      (c) => c.nombre.toLowerCase().includes(q) || c.email.toLowerCase().includes(q),
    );
  }, [clientes, busquedaGlobal, busquedaLocal]);

  const seleccionado = useMemo(
    () => clientes.find((c) => c.email.toLowerCase() === selEmail?.toLowerCase()) ?? null,
    [clientes, selEmail],
  );

  // ---- Cerrar modales con Escape ----
  useEffect(() => {
    if (!seleccionado && !editando && !confirmando) return;
    const cerrar = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelEmail(null);
        setEditando(null);
        setConfirmando(null);
      }
    };
    document.addEventListener('keydown', cerrar);
    return () => document.removeEventListener('keydown', cerrar);
  }, [seleccionado, editando, confirmando]);

  const abrirEdicion = (c: ClienteResumen) => {
    setEditando(c);
    setEditNombre(c.nombre);
    setEditEmail(c.email);
  };

  const guardarEdicion = () => {
    if (!editando) return;
    if (!editNombre.trim() || !editEmail.trim()) return;
    actualizarCliente(editando.email, editNombre, editEmail);
    // Si estaba viendo el detalle, sigue al nuevo email
    if (selEmail?.toLowerCase() === editando.email.toLowerCase()) {
      setSelEmail(editEmail.trim());
    }
    setEditando(null);
    setAviso(t.clientes.editadoOk);
    setTimeout(() => setAviso(''), 2200);
  };

  const confirmarEliminar = () => {
    if (!confirmando) return;
    eliminarCliente(confirmando.email);
    if (selEmail?.toLowerCase() === confirmando.email.toLowerCase()) setSelEmail(null);
    setConfirmando(null);
    setEditando(null);
  };

  const inputCls =
    'h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800 outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100';

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-bold tracking-tight">{t.vistas.clientesTitulo}</h2>
          <p className="text-[13px] text-slate-500 dark:text-slate-400">{t.vistas.clientesSub}</p>
          {aviso && <p className="mt-1 text-xs font-semibold text-emerald-600 dark:text-emerald-300">✓ {aviso}</p>}
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={busquedaLocal}
              onChange={(e) => setBusquedaLocal(e.target.value)}
              placeholder={t.clientes.buscar}
              className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none placeholder:text-slate-400 focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>
          <button
            onClick={restaurarTransacciones}
            title={t.clientes.restaurar}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {filtrados.length === 0 ? (
        <Card>
          <div className="flex flex-col items-center gap-3 py-10 text-slate-400">
            <SearchX size={28} />
            <p className="text-sm">{t.clientes.sinResultados}</p>
            <button
              onClick={restaurarTransacciones}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500"
            >
              <RotateCcw size={14} /> {t.clientes.restaurar}
            </button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtrados.map((c) => (
            <article
              key={c.email}
              onClick={() => setSelEmail(c.email)}
              className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-indigo-50 text-sm font-bold text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
                  {c.nombre.slice(0, 2).toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-slate-900 dark:text-white">{c.nombre}</p>
                  <p className="truncate text-xs text-slate-400">{c.email}</p>
                </div>
                <span className="shrink-0">
                  <Badge estado={c.ultimoEstado} texto={estadoTexto[c.ultimoEstado]} />
                </span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-[13px]">
                <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
                  <p className="text-[11px] text-slate-400">{t.clientes.totalAcumulado}</p>
                  <p className="mt-0.5 font-bold tabular-nums text-slate-800 dark:text-slate-100">
                    {formatCurrency(c.totalUSD, lang, monedaEfectiva)}
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
                  <p className="text-[11px] text-slate-400">{t.clientes.ultimaCompra}</p>
                  <p className="mt-0.5 font-semibold text-slate-700 dark:text-slate-200">
                    {formatDate(c.ultimaFechaISO, lang)}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <p className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600">
                  <Receipt size={14} />
                  {c.numFacturas} {t.clientes.facturas} · {t.clientes.verDetalle} →
                </p>
                <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => abrirEdicion(c)}
                    title={t.clientes.editar}
                    className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-slate-800"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => setConfirmando(c)}
                    title={t.clientes.eliminar}
                    className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* -------------------------------------------------- */}
      {/* BLOQUE 2: Modal detalle del cliente                */}
      {/* -------------------------------------------------- */}
      {seleccionado && !editando && !confirmando && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4" onClick={() => setSelEmail(null)}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-700 dark:bg-slate-900"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-indigo-600 text-base font-bold text-white">
                  {seleccionado.nombre.slice(0, 2).toUpperCase()}
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{seleccionado.nombre}</h3>
                  <p className="text-xs text-slate-400">{seleccionado.email}</p>
                </div>
              </div>
              <button
                onClick={() => setSelEmail(null)}
                aria-label={t.clientes.cerrar}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-3 flex gap-2">
              <button
                onClick={() => abrirEdicion(seleccionado)}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <Pencil size={14} /> {t.clientes.editar}
              </button>
              <button
                onClick={() => setConfirmando(seleccionado)}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:border-rose-500/30 dark:hover:bg-rose-500/10"
              >
                <Trash2 size={14} /> {t.clientes.eliminar}
              </button>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
                <p className="text-[11px] text-slate-400">{t.clientes.totalAcumulado}</p>
                <p className="mt-1 text-sm font-bold tabular-nums text-slate-800 dark:text-slate-100">
                  {formatCurrency(seleccionado.totalUSD, lang, monedaEfectiva)}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
                <p className="text-[11px] text-slate-400">{t.clientes.ticketPromedio}</p>
                <p className="mt-1 text-sm font-bold tabular-nums text-slate-800 dark:text-slate-100">
                  {formatCurrency(seleccionado.totalUSD / seleccionado.numFacturas, lang, monedaEfectiva)}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
                <p className="text-[11px] text-slate-400">{t.clientes.facturas}</p>
                <p className="mt-1 text-sm font-bold text-slate-800 dark:text-slate-100">
                  {seleccionado.numFacturas}
                </p>
              </div>
            </div>

            <h4 className="mb-2 mt-5 text-sm font-semibold text-slate-800 dark:text-slate-100">
              {t.clientes.historial}
            </h4>
            <ul className="space-y-2">
              {[...seleccionado.transacciones]
                .sort((a, b) => b.fechaISO.localeCompare(a.fechaISO))
                .map((tx) => (
                  <li
                    key={tx.id}
                    className="flex items-center gap-3 rounded-xl border border-slate-100 px-3 py-2.5 text-[13px] dark:border-slate-800"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-700 dark:text-slate-200">{tx.id}</p>
                      <p className="text-xs text-slate-400">{formatDate(tx.fechaISO, lang)}</p>
                    </div>
                    <Badge estado={tx.estado} texto={estadoTexto[tx.estado]} />
                    <span className="font-bold tabular-nums text-slate-800 dark:text-slate-100">
                      {formatCurrency(tx.montoUSD, lang, monedaEfectiva)}
                    </span>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      )}

      {/* -------------------------------------------------- */}
      {/* BLOQUE 3: Modal editar cliente                     */}
      {/* -------------------------------------------------- */}
      {editando && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4" onClick={() => setEditando(null)}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-700 dark:bg-slate-900"
          >
            <h3 className="text-base font-bold text-slate-900 dark:text-white">{t.clientes.editarTitulo}</h3>
            <p className="mt-0.5 text-xs text-slate-400">{editando.email} · {editando.numFacturas} {t.clientes.facturas}</p>
            <label className="mt-4 block text-xs font-medium text-slate-500 dark:text-slate-400">
              {t.clientes.nombre}
              <input value={editNombre} onChange={(e) => setEditNombre(e.target.value)} className={`${inputCls} mt-1`} />
            </label>
            <label className="mt-3 block text-xs font-medium text-slate-500 dark:text-slate-400">
              {t.clientes.email}
              <input type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} className={`${inputCls} mt-1`} />
            </label>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setEditando(null)}
                className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
              >
                {t.clientes.cancelar}
              </button>
              <button
                onClick={guardarEdicion}
                disabled={!editNombre.trim() || !editEmail.trim()}
                className="flex-1 rounded-xl bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
              >
                {t.clientes.guardar}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------- */}
      {/* BLOQUE 4: Confirmar eliminación                     */}
      {/* -------------------------------------------------- */}
      {confirmando && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4" onClick={() => setConfirmando(null)}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-700 dark:bg-slate-900"
          >
            <div className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-300">
              <Trash2 size={20} />
            </div>
            <h3 className="mt-3 text-center text-base font-bold text-slate-900 dark:text-white">
              {t.clientes.confirmarEliminar}
            </h3>
            <p className="mt-1 text-center text-[13px] font-semibold text-slate-600 dark:text-slate-300">
              {confirmando.nombre} · {confirmando.email}
            </p>
            <p className="mt-1 text-center text-xs text-slate-400">{t.clientes.eliminarDesc}</p>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setConfirmando(null)}
                className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
              >
                {t.clientes.cancelar}
              </button>
              <button
                onClick={confirmarEliminar}
                className="flex-1 rounded-xl bg-rose-600 px-3 py-2 text-sm font-semibold text-white hover:bg-rose-500"
              >
                {t.clientes.confirmarSi}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
