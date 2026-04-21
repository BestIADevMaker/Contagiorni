import { useState, useEffect } from 'react';
import { intervalToDuration, formatDuration, differenceInDays } from 'date-fns';
import { it } from 'date-fns/locale';
import { UserSettings } from '../types';
import { motion } from 'motion/react';
import { Trophy, Lock } from 'lucide-react';

interface DashboardProps {
  settings: UserSettings;
}

export default function Dashboard({ settings }: DashboardProps) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const startDate = new Date(settings.startDate);
  const duration = intervalToDuration({
    start: startDate,
    end: now,
  });

  const totalDays = differenceInDays(now, startDate);

  return (
    <div className="flex flex-col items-center justify-center space-y-12 py-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="relative mx-auto w-24 h-24 mb-6">
          <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full animate-pulse" />
          <div className="relative w-full h-full rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-5xl shadow-2xl glass-card">
            {settings.userIcon || '👤'}
          </div>
          {settings.appIcon && (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-10 h-10 rounded-xl overflow-hidden border-2 border-emerald-500 shadow-lg bg-slate-900"
            >
              <img src={settings.appIcon} alt="Logo" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </motion.div>
          )}
        </div>

        <div className="space-y-1">
          <h2 className="text-3xl font-black tracking-tight text-white uppercase italic">
            {settings.name}
          </h2>
          <p className="text-[10px] font-black uppercase tracking-[4px] text-emerald-500">
            Percorso di Libertà
          </p>
        </div>
      </motion.div>

      <div className="relative group">
        <motion.div
           initial={{ scale: 0.8, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           className="w-72 h-72 rounded-full flex flex-col items-center justify-center relative z-10"
           style={{
             background: `conic-gradient(#10b981 ${Math.min(totalDays * 5, 100)}%, transparent 0)`,
             boxShadow: '0 0 40px rgba(16,185,129,0.2)'
           }}
        >
          <div className="w-[calc(100%-30px)] h-[calc(100%-30px)] bg-[#0f172a] rounded-full flex flex-col items-center justify-center shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
            <span className="text-7xl font-extrabold tracking-tighter leading-none mb-1 text-slate-50">
              {totalDays}
            </span>
            <span className="text-base font-medium tracking-[4px] uppercase text-slate-400">
              Giorni
            </span>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-3 gap-4 w-full">
        <div className="glass-card p-4 rounded-2xl text-center">
          <div className="text-xl font-bold text-slate-50">{duration.hours || 0}</div>
          <div className="text-[9px] uppercase tracking-widest text-slate-400">Ore</div>
        </div>
        <div className="glass-card p-4 rounded-2xl text-center">
          <div className="text-xl font-bold text-slate-50">{duration.minutes || 0}</div>
          <div className="text-[9px] uppercase tracking-widest text-slate-400">Minuti</div>
        </div>
        <div className="glass-card p-4 rounded-2xl text-center">
          <div className="text-xl font-bold text-slate-50">{duration.seconds || 0}</div>
          <div className="text-[9px] uppercase tracking-widest text-slate-400">Secondi</div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center italic text-slate-400 text-sm px-4"
        >
          "{settings.message}"
        </motion.div>

        <div className="px-3 py-1.5 bg-black/40 border border-emerald-500/20 rounded-xl flex items-center gap-2">
          <Lock size={12} className="text-emerald-500" />
          <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-500">Criptato AES-256</span>
        </div>
      </div>
    </div>
  );
}
