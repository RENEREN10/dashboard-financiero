// ============================================================
// BLOQUE 1: SettingsView — configuración con guardado real
// Qué hace: edita perfil (se refleja en Header), cambia
// idioma/tema/moneda independiente y toggles. Todo persiste
// en localStorage vía AppContext. Botón Guardar con feedback.
// ============================================================

import { useState } from 'react';
import { Check, Loader2, RotateCcw, Save } from 'lucide-react';
import type { Lang, Moneda, Perfil, Prefs, Theme } from '../../types/dashboard';
import { useApp } from '../../context/AppContext';
import { Card, CardHeader } from '../ui/Card';

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'}`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${checked ? 'left-[22px]' : 'left-0.5'}`}
      />
    </button>
  );
}

export function SettingsView() {
  const { t, lang, setLang, theme, setTheme, perfil, setPerfil, prefs, setPrefs, monedaEfectiva } = useApp();

  // ---- Formularios locales (se confirman con Guardar) ----
  const [formPerfil, setFormPerfil] = useState<Perfil>(perfil);
  const [formPrefs, setFormPrefs] = useState<Prefs>(prefs);
  const [formLang, setFormLang] = useState<Lang>(lang);
  const [formTheme, setFormTheme] = useState<Theme>(theme);
  const [estado, setEstado] = useState<'idle' | 'guardando' | 'guardado'>('idle');

  const guardar = () => {
    setEstado('guardando');
    // Simula latencia de red para que se note el feedback
    setTimeout(() => {
      setPerfil({ ...formPerfil, nombre: formPerfil.nombre.trim() || perfil.nombre });
      setPrefs(formPrefs);
      setLang(formLang);
      setTheme(formTheme);
      setEstado('guardado');
      setTimeout(() => setEstado('idle'), 2200);
    }, 600);
  };

  const restablecer = () => {
    setFormPerfil(perfil);
    setFormPrefs(prefs);
    setFormLang(lang);
    setFormTheme(theme);
  };

  const inputCls =
    'h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100';

  const monedaOpts: { v: Moneda; label: string }[] = [
    { v: 'auto', label: t.config.monedaAutoOpt },
    { v: 'COP', label: t.config.monedaCOP },
    { v: 'USD', label: t.config.monedaUSD },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold tracking-tight">{t.vistas.configTitulo}</h2>
        <p className="text-[13px] text-slate-500 dark:text-slate-400">{t.vistas.configSub}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {/* ---- Perfil ---- */}
        <Card>
          <CardHeader titulo={t.config.perfilTitulo} subtitulo={t.config.perfilSub} />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400">
              {t.config.nombre}
              <input value={formPerfil.nombre} onChange={(e) => setFormPerfil({ ...formPerfil, nombre: e.target.value })}
                className={`${inputCls} mt-1`} />
            </label>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400">
              {t.config.rol}
              <input value={formPerfil.rol} onChange={(e) => setFormPerfil({ ...formPerfil, rol: e.target.value })}
                className={`${inputCls} mt-1`} />
            </label>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400">
              {t.config.email}
              <input type="email" value={formPerfil.email} onChange={(e) => setFormPerfil({ ...formPerfil, email: e.target.value })}
                className={`${inputCls} mt-1`} />
            </label>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400">
              {t.config.empresa}
              <input value={formPerfil.empresa} onChange={(e) => setFormPerfil({ ...formPerfil, empresa: e.target.value })}
                className={`${inputCls} mt-1`} />
            </label>
          </div>
        </Card>

        {/* ---- Apariencia, idioma y moneda ---- */}
        <Card>
          <CardHeader titulo={t.config.aparienciaTitulo} subtitulo={t.config.aparienciaSub} />
          <p className="mb-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">{t.config.tema}</p>
          <div className="flex gap-2">
            {(['light', 'dark'] as Theme[]).map((v) => (
              <button
                key={v}
                onClick={() => setFormTheme(v)}
                className={`flex-1 rounded-xl border px-3 py-2 text-sm font-semibold transition-colors ${
                  formTheme === v
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300'
                    : 'border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800'
                }`}
              >
                {v === 'light' ? t.config.claro : t.config.oscuro}
              </button>
            ))}
          </div>
          <p className="mb-1.5 mt-4 text-xs font-medium text-slate-500 dark:text-slate-400">{t.config.idioma}</p>
          <div className="flex gap-2">
            {(['es', 'en'] as Lang[]).map((v) => (
              <button
                key={v}
                onClick={() => setFormLang(v)}
                className={`flex-1 rounded-xl border px-3 py-2 text-sm font-semibold transition-colors ${
                  formLang === v
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300'
                    : 'border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800'
                }`}
              >
                {v === 'es' ? t.config.espanol : t.config.ingles}
              </button>
            ))}
          </div>

          {/* ---- Selector de moneda independiente ---- */}
          <div className="mt-4 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
              {t.config.monedaTitulo} · <span className="font-normal text-slate-400">ahora: {monedaEfectiva}</span>
            </p>
            <p className="mb-2 mt-0.5 text-[11px] text-slate-400">{t.config.monedaSub}</p>
            <div className="flex flex-col gap-1.5">
              {monedaOpts.map((o) => (
                <button
                  key={o.v}
                  onClick={() => setFormPrefs({ ...formPrefs, moneda: o.v })}
                  className={`rounded-lg border px-3 py-2 text-left text-[13px] font-medium transition-colors ${
                    formPrefs.moneda === o.v
                      ? 'border-indigo-600 bg-white text-indigo-700 dark:bg-slate-900 dark:text-indigo-300'
                      : 'border-transparent text-slate-500 hover:bg-white dark:hover:bg-slate-900'
                  }`}
                >
                  {o.v === 'auto' ? '✨ ' : o.v === 'COP' ? '🇨🇴 ' : '🇺🇸 '}
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* ---- Notificaciones ---- */}
      <Card>
        <CardHeader titulo={t.config.notifTitulo} subtitulo={t.config.notifSub} />
        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
          {[
            { key: 'notifEmail' as const, titulo: t.config.emailNotif, desc: t.config.emailNotifDesc },
            { key: 'notifPush' as const, titulo: t.config.pushNotif, desc: t.config.pushNotifDesc },
            { key: 'resumenSemanal' as const, titulo: t.config.resumen, desc: t.config.resumenDesc },
          ].map((item) => (
            <li key={item.key} className="flex items-center gap-3 py-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{item.titulo}</p>
                <p className="text-xs text-slate-400">{item.desc}</p>
              </div>
              <Toggle
                checked={formPrefs[item.key]}
                onChange={(v) => setFormPrefs({ ...formPrefs, [item.key]: v })}
                label={item.titulo}
              />
            </li>
          ))}
        </ul>
      </Card>

      {/* ---- Acciones guardar / restablecer ---- */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <button
          onClick={guardar}
          disabled={estado === 'guardando'}
          className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
        >
          {estado === 'guardando' ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {estado === 'guardando' ? t.config.guardando : t.config.guardar}
        </button>
        <button
          onClick={restablecer}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
        >
          <RotateCcw size={16} /> {t.config.restablecer}
        </button>
        {estado === 'guardado' && (
          <span className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600 dark:text-emerald-300">
            <Check size={16} /> {t.config.guardado} · {monedaEfectiva}
          </span>
        )}
      </div>
    </div>
  );
}
