// ============================================================
// BLOQUE 1: App — composición raíz del dashboard
// Qué hace: envuelve todo en AppProvider (idioma/tema/vista)
// y arma el layout: Sidebar fijo + columna (Header + contenido).
// El contenido cambia según `vistaActiva` del Sidebar.
// ============================================================

import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardView } from './components/views/DashboardView';
import { TransactionsView } from './components/views/TransactionsView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { CustomersView } from './components/views/CustomersView';
import { SettingsView } from './components/views/SettingsView';

// ------------------------------------------------------------
// BLOQUE 2: Página con navegación por vista (usa el contexto)
// ------------------------------------------------------------
function DashboardPage() {
  const { colapsado, vistaActiva } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {/* Navegación lateral */}
      <Sidebar />

      {/* Columna principal: se desplaza según ancho del sidebar */}
      <div className={`transition-all duration-300 ${colapsado ? 'lg:pl-20' : 'lg:pl-64'}`}>
        <Header />

        {/* Contenido central por vista */}
        <main className="mx-auto w-full max-w-7xl space-y-5 p-4 sm:p-6">
          {vistaActiva === 'dashboard' && <DashboardView />}
          {vistaActiva === 'transacciones' && <TransactionsView />}
          {vistaActiva === 'analisis' && <AnalyticsView />}
          {vistaActiva === 'clientes' && <CustomersView />}
          {vistaActiva === 'config' && <SettingsView />}
        </main>
      </div>
    </div>
  );
}

// ------------------------------------------------------------
// BLOQUE 3: Export raíz — Provider arriba de todo
// ------------------------------------------------------------
export default function App() {
  return (
    <AppProvider>
      <DashboardPage />
    </AppProvider>
  );
}
