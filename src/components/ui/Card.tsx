// ============================================================
// BLOQUE ÚNICO: Card reutilizable (contenedor SaaS estándar)
// Qué hace: fondo, borde, radio y sombra consistentes en
// KPIs, gráficas y tabla. Evita repetir clases Tailwind.
// ============================================================

import type { ReactNode } from 'react';

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <section
      className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 ${className}`}
    >
      {children}
    </section>
  );
}

// ---- Encabezado estándar de cada card (título + subtítulo) ----
export function CardHeader({ titulo, subtitulo }: { titulo: string; subtitulo?: string }) {
  return (
    <header className="mb-4">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{titulo}</h3>
      {subtitulo && <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{subtitulo}</p>}
    </header>
  );
}
