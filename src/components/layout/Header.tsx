// ============================================================
// BLOQUE 1: Header — barra superior del dashboard
// Qué hace: botón menú (móvil) + búsqueda global + toggle
// idioma ES/EN + toggle tema + notificaciones + perfil.
// La búsqueda vive en el contexto y filtra la tabla.
// ============================================================

import { useEffect, useRef, useState } from 'react';
import { Bell, CheckCheck, Menu, Moon, Search, Sun } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { mockNotifications } from '../../data/mockData';
import type { Lang } from '../../types/dashboard';

export function Header() {
  // ---- Estado global ----
  const {
    t, lang, setLang, theme, toggleTheme,
    setSidebarAbierto, busquedaGlobal, setBusquedaGlobal,
    perfil,
  } = useApp();

  // ---- Estado local: dropdown notificaciones + leídas ----
  const [notifAbierto, setNotifAbierto] = useState(false);
  const [leidas, setLeidas] = useState<string[]>([]);
  const notifRef = useRef<HTMLDivElement>(null);
  const noLeidas = mockNotifications.filter((n) => !leidas.includes(n.id)).length;

  // Cierra el dropdown al hacer clic fuera
  useEffect(() => {
    const cerrar = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifAbierto(false);
      }
    };
    document.addEventListener('mousedown', cerrar);
    return () => document.removeEventListener('mousedown', cerrar);
  }, []);

  const cambiarIdioma = (l: Lang) => setLang(l);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-2 border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:gap-3 sm:px-6 dark:border-slate-800 dark:bg-slate-900/90">
      {/* -------------------------------------------------- */}
      {/* BLOQUE 2: Botón menú móvil (abre el Sidebar drawer) */}
      {/* -------------------------------------------------- */}
      <button
        onClick={() => setSidebarAbierto(true)}
        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden dark:hover:bg-slate-800"
        aria-label={t.header.abrirMenu}
      >
        <Menu size={20} />
      </button>

      {/* -------------------------------------------------- */}
      {/* BLOQUE 3: Búsqueda global (filtra tabla en vivo)    */}
      {/* -------------------------------------------------- */}
      <div className="relative w-full max-w-md">
        <Search size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={busquedaGlobal}
          onChange={(e) => setBusquedaGlobal(e.target.value)}
          placeholder={t.header.buscar}
          className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-indigo-500/20"
        />
      </div>

      <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
        {/* -------------------------------------------------- */}
        {/* BLOQUE 4: Toggle de idioma ES / EN (segmentado)    */}
        {/* -------------------------------------------------- */}
        <div
          className="flex rounded-xl bg-slate-100 p-1 text-xs font-semibold dark:bg-slate-800"
          role="group"
          aria-label={t.header.idioma}
        >
          {(['es', 'en'] as Lang[]).map((l) => (
            <button
              key={l}
              onClick={() => cambiarIdioma(l)}
              className={`rounded-lg px-2.5 py-1.5 uppercase transition-colors ${
                lang === l
                  ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-700 dark:text-white'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        {/* -------------------------------------------------- */}
        {/* BLOQUE 5: Toggle de tema Claro / Oscuro            */}
        {/* -------------------------------------------------- */}
        <button
          onClick={toggleTheme}
          className="rounded-xl p-2.5 text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          title={theme === 'dark' ? t.header.temaClaro : t.header.temaOscuro}
        >
          {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
        </button>

        {/* -------------------------------------------------- */}
        {/* BLOQUE 6: Notificaciones con dropdown              */}
        {/* -------------------------------------------------- */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifAbierto((v) => !v)}
            className="relative rounded-xl p-2.5 text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            title={t.header.notificaciones}
          >
            <Bell size={19} />
            {noLeidas > 0 && (
              <span className="absolute right-1.5 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                {noLeidas}
              </span>
            )}
          </button>

          {notifAbierto && (
            <div className="absolute right-0 mt-2 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800">
                <span className="text-sm font-semibold text-slate-800 dark:text-white">
                  {t.header.notificaciones}
                </span>
                <button
                  onClick={() => setLeidas(mockNotifications.map((n) => n.id))}
                  className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:underline"
                >
                  <CheckCheck size={14} /> {t.header.marcarLeidas}
                </button>
              </div>
              <ul className="max-h-72 overflow-y-auto">
                {mockNotifications.map((n) => (
                  <li
                    key={n.id}
                    className="flex gap-3 border-b border-slate-50 px-4 py-3 last:border-0 dark:border-slate-800"
                  >
                    <span
                      className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                        leidas.includes(n.id) ? 'bg-slate-300' : 'bg-indigo-500'
                      }`}
                    />
                    <span>
                      <span className="block text-[13px] font-semibold text-slate-800 dark:text-slate-100">
                        {t.notif[n.tituloKey]}
                      </span>
                      <span className="block text-xs text-slate-500 dark:text-slate-400">
                        {t.notif[n.descKey]}
                      </span>
                      <span className="mt-0.5 block text-[11px] text-slate-400">
                        {t.notif[n.tiempoKey]}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* -------------------------------------------------- */}
        {/* BLOQUE 7: Perfil de usuario (avatar + nombre)      */}
        {/* -------------------------------------------------- */}
        <div className="ml-1 flex items-center gap-2.5 border-l border-slate-200 pl-3 dark:border-slate-700">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-sm font-bold text-white">
            {(perfil.nombre.trim().charAt(0) || 'R').toUpperCase()}
          </span>
          <span className="hidden leading-tight md:block">
            <span className="block max-w-32 truncate text-[13px] font-semibold text-slate-800 dark:text-slate-100">
              {perfil.nombre || t.header.perfilNombre}
            </span>
            <span className="block max-w-32 truncate text-[11px] text-slate-500 dark:text-slate-400">
              {perfil.rol || t.header.perfilRol}
            </span>
          </span>
        </div>
      </div>
    </header>
  );
}
