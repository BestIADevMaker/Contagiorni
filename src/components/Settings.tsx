import React from 'react';
import { UserSettings, Substance } from '../types';
import { Camera, Calendar, User, ChevronRight, Hash } from 'lucide-react';

interface SettingsProps {
  settings: UserSettings;
  onUpdate: (partial: Partial<UserSettings>) => void;
}

export default function Settings({ settings, onUpdate }: SettingsProps) {
  const toggleSubstance = (s: Substance) => {
    const newSubstances = settings.substances.includes(s)
      ? settings.substances.filter(item => item !== s)
      : [...settings.substances, s];
    onUpdate({ substances: newSubstances });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdate({ bgImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8 py-4">
      <h1 className="text-3xl font-bold tracking-tight text-slate-50">Impostazioni</h1>

      <section className="space-y-4">
        <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 ml-4">
          Profilo & Percorso
        </label>
        <div className="glass-card rounded-[32px] overflow-hidden">
          <div className="p-4 flex items-center gap-4 border-b border-white/5">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <User size={20} className="text-slate-400" />
            </div>
            <div className="flex-1">
              <input
                type="text"
                value={settings.name}
                onChange={(e) => onUpdate({ name: e.target.value })}
                className="bg-transparent border-none focus:ring-0 w-full p-0 text-lg font-semibold text-slate-50"
                placeholder="Il tuo nome"
              />
              <div className="text-[10px] uppercase text-slate-400 tracking-wider font-bold">Nome Profilo</div>
            </div>
          </div>
          
          <div className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Calendar size={20} />
            </div>
            <div className="flex-1">
              <input
                type="datetime-local"
                value={settings.startDate.slice(0, 16)}
                onChange={(e) => onUpdate({ startDate: new Date(e.target.value).toISOString() })}
                className="bg-transparent border-none focus:ring-0 w-full p-0 text-sm text-slate-50 font-medium"
              />
              <div className="text-[10px] uppercase text-slate-400 tracking-wider font-bold">Inizio Percorso</div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 ml-4">
          Sostanze monitorate
        </label>
        <div className="grid grid-cols-2 gap-3">
          {(['alcool', 'droghe', 'tabacco', 'altro'] as Substance[]).map(s => (
            <button
              key={s}
              onClick={() => toggleSubstance(s)}
              className={`p-4 rounded-2xl border text-xs font-bold uppercase tracking-widest transition-all ${
                settings.substances.includes(s)
                  ? 'bg-emerald-500 text-emerald-900 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                  : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 ml-4">
          Personalizzazione
        </label>
        <div className="glass-card rounded-[32px] p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                <Camera size={20} />
              </div>
              <span className="text-sm font-semibold text-slate-50">Sfondo</span>
            </div>
            <label className="cursor-pointer bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-[10px] tracking-widest uppercase font-bold transition-colors">
              Cambia
              <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
            </label>
          </div>

          <div className="space-y-2 pt-2 border-t border-white/5">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-10 h-10 rounded-xl bg-slate-500/10 text-slate-400 flex items-center justify-center">
                <Hash size={20} />
              </div>
              <span className="text-sm font-semibold text-slate-50">Messaggio</span>
            </div>
            <textarea
              value={settings.message}
              onChange={(e) => onUpdate({ message: e.target.value })}
              rows={2}
              className="w-full bg-white/5 border border-white/5 rounded-2xl p-3 text-sm text-slate-300 focus:ring-1 focus:ring-emerald-500/30 focus:outline-none transition-all"
              placeholder="Scrivi qualcosa che ti motiva..."
            />
          </div>
        </div>
      </section>

      <div className="pt-4 text-center">
        <p className="text-[10px] text-white/20 px-8">
          Tutti i dati sono salvati localmente sul tuo dispositivo per garantire la massima privacy.
        </p>
      </div>
    </div>
  );
}
