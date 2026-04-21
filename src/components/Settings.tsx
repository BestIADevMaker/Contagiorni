import React from 'react';
import { UserSettings, Substance } from '../types';
import { Camera, Calendar, User, ChevronRight, Hash, ShieldCheck, Lock } from 'lucide-react';

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
        <div className="bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-3xl flex gap-4 items-start">
          <div className="bg-emerald-500/20 p-2 rounded-xl text-emerald-500">
            <Lock size={20} />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-black uppercase tracking-widest text-emerald-500">Sicurezza AES-256</h3>
            <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
              Tutti i tuoi dati sono crittografati localmente con l'algoritmo **AES-256** (Standard Militare). Nessuna informazione lascia mai questo dispositivo.
            </p>
          </div>
        </div>

        <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 ml-4">
          Personalizzazione Identità
        </label>
        <div className="glass-card rounded-[32px] p-4 space-y-6">
          {/* User Icon & Name */}
          <div className="flex items-center gap-6">
            <div className="relative group">
              <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-4xl shadow-xl">
                {settings.userIcon || '👤'}
              </div>
              <select 
                value={settings.userIcon}
                onChange={(e) => onUpdate({ userIcon: e.target.value })}
                className="absolute inset-0 opacity-0 cursor-pointer"
              >
                {['👤', '🧘', '🌟', '🚀', '🔥', '🛡️', '🌿', '🕊️', '🦅', '🦁'].map(emoji => (
                  <option key={emoji} value={emoji}>{emoji}</option>
                ))}
              </select>
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 rounded-lg p-1 text-black shadow-lg">
                <ChevronRight size={12} className="rotate-90" />
              </div>
            </div>
            
            <div className="flex-1 space-y-1">
              <input
                type="text"
                value={settings.name}
                onChange={(e) => onUpdate({ name: e.target.value })}
                className="bg-transparent border-none focus:ring-0 w-full p-0 text-xl font-black text-slate-50 placeholder:text-slate-600"
                placeholder="Il tuo nome..."
              />
              <div className="text-[10px] uppercase text-emerald-500 tracking-widest font-black">Avatar Utente</div>
            </div>
          </div>

          <div className="h-px bg-white/5 w-full" />

          {/* App Logo / Icon */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl border border-white/10 bg-white/5 overflow-hidden flex items-center justify-center">
                {settings.appIcon ? (
                  <img src={settings.appIcon} alt="App Icon" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <ShieldCheck size={20} className="text-slate-500" />
                )}
              </div>
              <div>
                <span className="text-sm font-bold text-slate-50 block">Icona Applicazione</span>
                <span className="text-[10px] text-slate-500 uppercase tracking-tight">Cambia il logo interno</span>
              </div>
            </div>
            <label className="cursor-pointer bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-[10px] uppercase font-black transition-all">
              Carica
              <input 
                type="file" 
                className="hidden" 
                accept="image/*" 
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => onUpdate({ appIcon: reader.result as string });
                    reader.readAsDataURL(file);
                  }
                }} 
              />
            </label>
          </div>
        </div>

        {/* Date Section */}
        <div className="glass-card rounded-[32px] p-4 flex items-center gap-4">
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
          Sfondo Atmosferico
        </label>
        <div className="glass-card rounded-[32px] p-4">
          <div className="relative h-32 w-full rounded-2xl overflow-hidden group mb-4">
            <img src={settings.bgImage} className="w-full h-full object-cover transition-transform group-hover:scale-105" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px]">
              <label className="cursor-pointer bg-white text-black px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-2xl">
                Sostituisci Sfondo
                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
              </label>
            </div>
          </div>
          <div className="flex items-center gap-4 px-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Camera size={16} />
            </div>
            <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
              Carica una foto che ti ispira pace e forza. L'immagine verrà applicata con un effetto sfocato per non disturbare la lettura.
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-white/5 space-y-3">
            <div className="flex items-center gap-3 ml-2">
              <Hash size={14} className="text-slate-500" />
              <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">Messaggio Motivazionale</span>
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

      <div className="pt-4 text-center space-y-4">
        <div className="glass-card p-6 border-emerald-500/20">
          <div className="flex items-center justify-center gap-2 text-emerald-500 mb-2 font-bold text-xs uppercase tracking-[2px]">
            <ShieldCheck size={16} />
            Architettura Zero-Knowledge
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
            Questa applicazione è stata progettata per la tua totale riservatezza. 
            <span className="block mt-2 text-emerald-400">
              Ogni utente che installa l'app ha un proprio database locale isolato e crittografato. 
              In quanto sviluppatori, non abbiamo alcun accesso tecnico ai tuoi dati.
            </span>
          </p>
        </div>
        <p className="text-[10px] text-slate-500 px-8">
          SoberFlow Vault Engine v2.0 • Crittografia Attiva
        </p>
      </div>
    </div>
  );
}
