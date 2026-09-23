// ============================================================
// BLOQUE 1: Agregación de clientes desde transacciones
// Qué hace: agrupa por cliente+email para la vista Clientes.
// No toca el mock original, solo deriva resúmenes.
// ============================================================

import type { ClienteResumen, Transaction } from '../types/dashboard';

export function agruparClientes(transacciones: Transaction[]): ClienteResumen[] {
  const mapa = new Map<string, ClienteResumen>();

  for (const tx of transacciones) {
    const clave = `${tx.cliente}||${tx.email}`;
    const existente = mapa.get(clave);
    if (existente) {
      existente.transacciones.push(tx);
      existente.totalUSD += tx.montoUSD;
      existente.numFacturas += 1;
      if (tx.fechaISO > existente.ultimaFechaISO) {
        existente.ultimaFechaISO = tx.fechaISO;
        existente.ultimoEstado = tx.estado;
      }
    } else {
      mapa.set(clave, {
        nombre: tx.cliente,
        email: tx.email,
        totalUSD: tx.montoUSD,
        numFacturas: 1,
        ultimaFechaISO: tx.fechaISO,
        ultimoEstado: tx.estado,
        transacciones: [tx],
      });
    }
  }

  return [...mapa.values()].sort((a, b) => b.totalUSD - a.totalUSD);
}

// ============================================================
// BLOQUE 2: Exportación a CSV (Transacciones)
// Qué hace: genera y descarga un .csv del filtro actual.
// ============================================================

export function exportarCSV(
  filas: Transaction[],
  nombreArchivo = 'transacciones.csv',
): void {
  const encabezado = 'id,cliente,email,fecha,estado,montoUSD';
  const lineas = filas.map((tx) =>
    [tx.id, `"${tx.cliente}"`, tx.email, tx.fechaISO, tx.estado, String(tx.montoUSD)].join(','),
  );
  const blob = new Blob([[encabezado, ...lineas].join('\n')], {
    type: 'text/csv;charset=utf-8;',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nombreArchivo;
  a.click();
  URL.revokeObjectURL(url);
}
