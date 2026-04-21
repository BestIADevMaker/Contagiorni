import { UserSettings } from '../types';
import { Bell, BellRing, BellOff, Info } from 'lucide-react';
import { motion } from 'motion/react';

interface NotificationsProps {
  settings: UserSettings;
  onUpdate: (partial: Partial<UserSettings>) => void;
}

export default function Notifications({ settings, onUpdate }: NotificationsProps) {
  return (
    <div className="space-y-8 py-4">
      <h1 className="text-3xl font-bold tracking-tight text-slate-50">Notifiche</h1>

      <div className="bg-blue-500/5 border border-blue-500/10 p-4 rounded-2xl flex gap-3 text-blue-300 glass-card">
        <Info size={20} className="shrink-0" />
        <p className="text-xs font-medium leading-relaxed">
          Le notifiche push reali richiedono l'installazione dell'app sulla homescreen (PWA). Qui puoi configurare i promemoria.
        </p>
      </div>

      <section className="space-y-4">
        <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 ml-4">
          Frequenza
        </label>
        <div className="space-y-3">
          {(['daily', 'weekly', 'milestones'] as const).map((freq) => (
            <button
              key={freq}
              onClick={() => onUpdate({ notificationFrequency: freq })}
              className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
                settings.notificationFrequency === freq
                  ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                  : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-3">
                {freq === 'daily' && <BellRing size={18} />}
                {freq === 'weekly' && <Bell size={18} />}
                {freq === 'milestones' && <BellOff size={18} />}
                <span className="text-xs font-bold uppercase tracking-widest">
                  {freq === 'daily' ? 'Giornaliera' : freq === 'weekly' ? 'Settimanale' : 'Solo Traguardi'}
                </span>
              </div>
              {settings.notificationFrequency === freq && (
                <motion.div layoutId="check" className="w-1.5 h-1.5 bg-black rounded-full" />
              )}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 ml-4">
          Anteprima
        </label>
        <div className="glass-card rounded-[32px] p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center text-white shadow-lg">
              <span className="font-black text-lg uppercase">{settings.name ? settings.name[0] : 'S'}</span>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-0.5">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-100">SoberFlow</span>
                <span className="text-[9px] text-slate-500 font-bold">ADESSO</span>
              </div>
              <p className="text-xs font-bold text-slate-100">Grande vittoria, {settings.name}!</p>
              <p className="text-[10px] text-slate-400 font-medium">Oggi festeggiamo un altro passo avanti.</p>
            </div>
          </div>
        </div>
      </section>
      
      <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
        <h3 className="font-bold mb-2">Personalizzazione Icona</h3>
        <p className="text-sm text-white/60 mb-4">
          Cambia l'immagine che vedi all'interno delle notifiche e nella dashboard.
        </p>
        <div className="flex gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center border-dashed">
             <Bell size={24} className="opacity-30" />
          </div>
          <button className="flex-1 bg-white/10 hover:bg-white/20 rounded-2xl text-sm font-semibold transition-colors">
            Carica Icona Personalizzata
          </button>
        </div>
      </div>
    </div>
  );
}
