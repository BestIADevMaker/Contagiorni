import { useState, useEffect } from 'react';
import { intervalToDuration, formatDuration, differenceInDays } from 'date-fns';
import { it } from 'date-fns/locale';
import { UserSettings } from '../types';
import { motion } from 'motion/react';
import { Trophy } from 'lucide-react';

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
        className="text-center space-y-2"
      >
        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-emerald-500/20">
          Traguardo: Guerriero
        </span>
        <h2 className="text-2xl font-bold tracking-tight text-white mt-4">
          Il tuo Percorso di Libertà
        </h2>
        <p className="text-slate-400 text-sm">
          Sei libero da {settings.substances.join(', ')}
        </p>
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

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center italic text-slate-400 text-sm px-4"
      >
        "{settings.message}"
      </motion.div>
    </div>
  );
}
