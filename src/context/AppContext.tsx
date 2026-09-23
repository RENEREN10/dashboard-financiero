/* eslint-disable react-refresh/only-export-components -- Provider + hook useApp conviven a propósito */
// ============================================================
// BLOQUE 1: Estado global de la app (idioma, tema, UI)
// Qué hace: un solo Provider evita prop-drilling. Guarda
// lang/theme en localStorage y aplica la clase `.dark` al <html>
// para que Tailwind v4 cambie todo el tema.
// ============================================================

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Lang, MonedaEfectiva, Perfil, Prefs, Theme, Transaction, Vista } from '../types/dashboard';
import { getTranslation, type Translation } from '../i18n/translations';
import { mockTransactions } from '../data/mockData';
import { resolverMoneda } from '../services/format';
import { apiActualizarCliente, apiEliminarCliente, apiRestaurar, getTransactions } from '../services/api';

interface AppContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
  t: Translation;
  sidebarAbierto: boolean; // drawer en móvil
  setSidebarAbierto: (v: boolean) => void;
  colapsado: boolean; // sidebar angosto en desktop
  setColapsado: (v: boolean) => void;
  busquedaGlobal: string; // búsqueda del header → filtra tablas
  setBusquedaGlobal: (v: string) => void;
  vistaActiva: Vista; // navegación lateral sin router
  setVistaActiva: (v: Vista) => void;
  perfil: Perfil; // editable en Configuración, visible en Header
  setPerfil: (p: Perfil) => void;
  prefs: Prefs; // notificaciones + moneda, con persistencia
  setPrefs: (p: Prefs) => void;
  monedaEfectiva: MonedaEfectiva; // COP/USD ya resuelta (auto→idioma)
  transacciones: Transaction[]; // fuente global editable (Clientes)
  setTransacciones: (txs: Transaction[]) => void;
  actualizarCliente: (emailOriginal: string, nombre: string, email: string) => void;
  eliminarCliente: (email: string) => void;
  restaurarTransacciones: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

// ------------------------------------------------------------
// BLOQUE 2: Lectura inicial (respeta lo guardado + sistema)
// ------------------------------------------------------------
function leerTemaInicial(): Theme {
  const guardado = localStorage.getItem('findash-theme') as Theme | null;
  if (guardado === 'light' || guardado === 'dark') return guardado;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function leerIdiomaInicial(): Lang {
  return localStorage.getItem('findash-lang') === 'en' ? 'en' : 'es';
}

const PERFIL_DEFAULT: Perfil = {
  nombre: 'René Cárdenas',
  rol: 'Administrador',
  email: 'rene@findash.co',
  empresa: 'FinDash SAS',
};

const PREFS_DEFAULT: Prefs = {
  notifEmail: true,
  notifPush: true,
  resumenSemanal: true,
  moneda: 'auto',
};

function leerPerfilInicial(): Perfil {
  try {
    const raw = localStorage.getItem('findash-perfil');
    if (raw) return { ...PERFIL_DEFAULT, ...(JSON.parse(raw) as Partial<Perfil>) };
  } catch { /* usa default */ }
  return PERFIL_DEFAULT;
}

function leerPrefsInicial(): Prefs {
  try {
    const raw = localStorage.getItem('findash-prefs');
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<Prefs> & { monedaAuto?: boolean };
      // Migración: antes era boolean monedaAuto → ahora Moneda
      let moneda = parsed.moneda;
      if (!moneda) {
        moneda = parsed.monedaAuto === false ? 'USD' : 'auto';
      }
      return { ...PREFS_DEFAULT, ...parsed, moneda };
    }
  } catch { /* usa default */ }
  return PREFS_DEFAULT;
}

function leerTransaccionesInicial(): Transaction[] {
  try {
    const raw = localStorage.getItem('findash-transacciones');
    if (raw) {
      const parsed = JSON.parse(raw) as Transaction[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch { /* usa mock */ }
  return mockTransactions;
}

// ------------------------------------------------------------
// BLOQUE 3: Provider — envuelve toda la app en App.tsx
// ------------------------------------------------------------
export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(leerIdiomaInicial);
  const [theme, setThemeState] = useState<Theme>(leerTemaInicial);
  const [sidebarAbierto, setSidebarAbierto] = useState(false);
  const [colapsado, setColapsado] = useState(false);
  const [busquedaGlobal, setBusquedaGlobal] = useState('');
  const [vistaActiva, setVistaActivaState] = useState<Vista>('dashboard');
  const [perfil, setPerfilState] = useState<Perfil>(leerPerfilInicial);
  const [prefs, setPrefsState] = useState<Prefs>(leerPrefsInicial);
  const [transacciones, setTransaccionesState] = useState<Transaction[]>(leerTransaccionesInicial);

  // Moneda ya resuelta para toda la UI (auto→idioma)
  const monedaEfectiva: MonedaEfectiva = useMemo(
    () => resolverMoneda(lang, prefs.moneda),
    [lang, prefs.moneda],
  );

  // Aplica .dark / .light al <html> cada vez que cambia el tema
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('findash-theme', theme);
  }, [theme]);

  // Sincroniza transacciones con el backend al arrancar (si está prendido).
  // Si el API responde, manda esa data; si no, se queda el mock/localStorage.
  useEffect(() => {
    let vivo = true;
    getTransactions().then((txs) => {
      if (!vivo || !Array.isArray(txs) || txs.length === 0) return;
      const actual = localStorage.getItem('findash-transacciones');
      // Solo pisa el caché si el backend trae algo distinto (evita loops)
      if (actual !== JSON.stringify(txs)) {
        setTransaccionesState(txs);
        localStorage.setItem('findash-transacciones', JSON.stringify(txs));
      }
    });
    return () => {
      vivo = false;
    };
  }, []);

  const setTheme = useCallback((v: Theme) => {
    setThemeState(v);
  }, []);

  const setVistaActiva = useCallback((v: Vista) => {
    setVistaActivaState(v);
    setSidebarAbierto(false); // cierra drawer en móvil al navegar
    setBusquedaGlobal(''); // limpia búsqueda entre vistas
  }, []);

  const setPerfil = useCallback((p: Perfil) => {
    setPerfilState(p);
    localStorage.setItem('findash-perfil', JSON.stringify(p));
  }, []);

  const setPrefs = useCallback((p: Prefs) => {
    setPrefsState(p);
    localStorage.setItem('findash-prefs', JSON.stringify(p));
  }, []);

  const setTransacciones = useCallback((txs: Transaction[]) => {
    setTransaccionesState(txs);
    localStorage.setItem('findash-transacciones', JSON.stringify(txs));
  }, []);

  const actualizarCliente = useCallback((emailOriginal: string, nombre: string, email: string) => {
    setTransaccionesState((prev) => {
      const next = prev.map((tx) =>
        tx.email.toLowerCase() === emailOriginal.toLowerCase()
          ? { ...tx, cliente: nombre.trim() || tx.cliente, email: email.trim() || tx.email }
          : tx,
      );
      localStorage.setItem('findash-transacciones', JSON.stringify(next));
      return next;
    });
    // Intenta persistir en el backend sin bloquear la UI (fallback = localStorage)
    void apiActualizarCliente(emailOriginal, nombre, email);
  }, []);

  const eliminarCliente = useCallback((email: string) => {
    setTransaccionesState((prev) => {
      const next = prev.filter((tx) => tx.email.toLowerCase() !== email.toLowerCase());
      localStorage.setItem('findash-transacciones', JSON.stringify(next));
      return next;
    });
    void apiEliminarCliente(email);
  }, []);

  const restaurarTransacciones = useCallback(() => {
    setTransaccionesState(mockTransactions);
    localStorage.removeItem('findash-transacciones');
    // Restaura también el db.json del backend y re-sincroniza
    void apiRestaurar().then(() => {
      void getTransactions().then((txs) => {
        if (Array.isArray(txs) && txs.length > 0) {
          setTransaccionesState(txs);
          localStorage.setItem('findash-transacciones', JSON.stringify(txs));
        }
      });
    });
  }, []);

  const setLang = useCallback((l: Lang) => {
    localStorage.setItem('findash-lang', l);
    setLangState(l);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((t) => (t === 'dark' ? 'light' : 'dark'));
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      lang,
      setLang,
      theme,
      setTheme,
      toggleTheme,
      t: getTranslation(lang),
      sidebarAbierto,
      setSidebarAbierto,
      colapsado,
      setColapsado,
      busquedaGlobal,
      setBusquedaGlobal,
      vistaActiva,
      setVistaActiva,
      perfil,
      setPerfil,
      prefs,
      setPrefs,
      monedaEfectiva,
      transacciones,
      setTransacciones,
      actualizarCliente,
      eliminarCliente,
      restaurarTransacciones,
    }),
    [lang, setLang, theme, setTheme, toggleTheme, sidebarAbierto, colapsado, busquedaGlobal, vistaActiva, setVistaActiva, perfil, setPerfil, prefs, setPrefs, monedaEfectiva, transacciones, setTransacciones, actualizarCliente, eliminarCliente, restaurarTransacciones],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// ------------------------------------------------------------
// BLOQUE 4: Hook de consumo — `const { t, lang } = useApp()`
// ------------------------------------------------------------
export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp debe usarse dentro de <AppProvider>');
  return ctx;
}
