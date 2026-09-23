// ============================================================
// BLOQUE ÚNICO: Badge de estado (Completado / Pendiente / Fallido)
// Qué hace: píldora de color por estado. El texto ya viene
// traducido desde el componente padre.
// ============================================================

import type { TxnStatus } from '../../types/dashboard';

const ESTILOS: Record<TxnStatus, string> = {
  completado:
    'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/30',
  pendiente:
    'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/30',
  fallido:
    'bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-500/30',
};

const PUNTO: Record<TxnStatus, string> = {
  completado: 'bg-emerald-500',
  pendiente: 'bg-amber-500',
  fallido: 'bg-rose-500',
};

export function Badge({ estado, texto }: { estado: TxnStatus; texto: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${ESTILOS[estado]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${PUNTO[estado]}`} />
      {texto}
    </span>
  );
}
