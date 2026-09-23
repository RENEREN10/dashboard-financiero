// ============================================================
// BLOQUE 1: Sidebar — navegación lateral del SaaS
// Qué hace: logo + 5 links con navegación real por vista.
// Sin router: cambia `vistaActiva` en el contexto.
// Móvil = drawer deslizante, Desktop = fijo y colapsable.
// ============================================================

import {
  ArrowLeftRight,
  BarChart3,
  ChevronsLeft,
  ChevronsRight,
  LayoutDashboard,
  Settings,
  Users,
  Wallet,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { Vista } from '../../types/dashboard';

export function Sidebar() {
  // ---- Estado global: idioma, textos, drawer, colapso y vista ----
  const { t, sidebarAbierto, setSidebarAbierto, colapsado, setColapsado, vistaActiva, setVistaActiva } = useApp();

  // ---- Links: navegación real, sin píldora "Pronto" ----
  const links: { vista: Vista; label: string; icon: typeof LayoutDashboard }[] = [
    { vista: 'dashboard', label: t.nav.dashboard, icon: LayoutDashboard },
    { vista: 'transacciones', label: t.nav.transacciones, icon: ArrowLeftRight },
    { vista: 'analisis', label: t.nav.analisis, icon: BarChart3 },
    { vista: 'clientes', label: t.nav.clientes, icon: Users },
    { vista: 'config', label: t.nav.config, icon: Settings },
  ];

  const ancho = colapsado ? 'lg:w-20' : 'lg:w-64';

  return (
    <>
      {/* -------------------------------------------------- */}
      {/* BLOQUE 2: Overlay oscuro (solo móvil, cierra drawer) */}
      {/* -------------------------------------------------- */}
      {sidebarAbierto && (
        <div
          className="fixed inset-0 z-30 bg-slate-950/50 lg:hidden"
          onClick={() => setSidebarAbierto(false)}
          aria-hidden
        />
      )}

      {/* -------------------------------------------------- */}
      {/* BLOQUE 3: Panel lateral fijo */}
      {/* -------------------------------------------------- */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white transition-all duration-300 dark:border-slate-800 dark:bg-slate-900 ${ancho} ${
          sidebarAbierto ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* ---- Logo empresa/SaaS ---- */}
        <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-5 dark:border-slate-800">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-indigo-600 text-white">
            <Wallet size={18} />
          </span>
          {!colapsado && (
            <span className="leading-tight">
              <span className="block text-sm font-bold text-slate-900 dark:text-white">
                {t.marca.nombre}
              </span>
              <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                {t.marca.subtitulo}
              </span>
            </span>
          )}
          {/* Cerrar en móvil */}
          <button
            className="ml-auto rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden dark:hover:bg-slate-800"
            onClick={() => setSidebarAbierto(false)}
            aria-label="Cerrar menú"
          >
            <X size={18} />
          </button>
        </div>

        {/* ---- Links de navegación ---- */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {!colapsado && (
            <p className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              {t.nav.panel}
            </p>
          )}
          {links.map(({ vista, label, icon: Icon }) => {
            const activo = vistaActiva === vista;
            return (
              <button
                key={vista}
                onClick={() => setVistaActiva(vista)}
                title={colapsado ? label : undefined}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  activo
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                } ${colapsado ? 'lg:justify-center' : ''}`}
              >
                <Icon size={19} className="shrink-0" />
                {!colapsado && <span className="truncate">{label}</span>}
              </button>
            );
          })}
        </nav>

        {/* ---- Botón colapsar (solo desktop) ---- */}
        <div className="hidden border-t border-slate-200 p-3 lg:block dark:border-slate-800">
          <button
            onClick={() => setColapsado(!colapsado)}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            title={colapsado ? t.nav.expandir : t.nav.colapsar}
          >
            {colapsado ? <ChevronsRight size={19} /> : <ChevronsLeft size={19} />}
            {!colapsado && <span>{t.nav.colapsar}</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
