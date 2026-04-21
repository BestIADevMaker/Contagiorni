import { differenceInDays, addDays, format, isAfter } from 'date-fns';
import { it } from 'date-fns/locale';
import { UserSettings, DEFAULT_MILESTONES } from '../types';
import { motion } from 'motion/react';
import { Milestone as MilestoneIcon, CheckCircle2, Circle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface StatsProps {
  settings: UserSettings;
}

export default function Stats({ settings }: StatsProps) {
  const now = new Date();
  const startDate = new Date(settings.startDate);
  const totalDays = differenceInDays(now, startDate);

  const nextMilestone = DEFAULT_MILESTONES.find(m => m.days > totalDays) || DEFAULT_MILESTONES[DEFAULT_MILESTONES.length - 1];
  const lastMilestone = [...DEFAULT_MILESTONES].reverse().find(m => m.days <= totalDays) || { days: 0, label: 'Inizio' };
  
  const daysInCurrentSegment = totalDays - lastMilestone.days;
  const segmentRange = nextMilestone.days - lastMilestone.days;
  const progressPercent = Math.min(100, Math.max(0, (daysInCurrentSegment / segmentRange) * 100));

  const chartData = [
    { name: 'Completato', value: daysInCurrentSegment },
    { name: 'Rimanente', value: segmentRange - daysInCurrentSegment },
  ];

  return (
    <div className="space-y-8 py-4">
      <h1 className="text-3xl font-bold tracking-tight text-slate-50">Statistiche</h1>

      <div className="glass-card p-6 flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Prossimo obiettivo</p>
          <h2 className="text-2xl font-bold text-slate-50">{nextMilestone.label}</h2>
          <p className="text-xs text-emerald-500 font-medium">Tra {nextMilestone.days - totalDays} giorni</p>
        </div>
        <div className="w-16 h-16">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                innerRadius={20}
                outerRadius={28}
                paddingAngle={0}
                dataKey="value"
                stroke="none"
                startAngle={90}
                endAngle={-270}
              >
                <Cell fill="#10b981" />
                <Cell fill="rgba(255,255,255,0.05)" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <section className="space-y-4">
        <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 ml-4">
          Progressi
        </label>
        <div className="glass-card p-6 space-y-4">
          <div className="flex justify-between text-[11px] mb-2 uppercase tracking-wider font-bold">
            <span className="text-slate-400">{lastMilestone.label}</span>
            <span className="text-emerald-500">{Math.round(progressPercent)}%</span>
            <span className="text-slate-400">{nextMilestone.label}</span>
          </div>
          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 ml-4">
          Traguardi raggiunti
        </label>
        <div className="space-y-3">
          {DEFAULT_MILESTONES.map((m) => {
            const isCompleted = totalDays >= m.days;
            const milestoneDate = addDays(startDate, m.days);
            
            return (
              <div 
                key={m.days} 
                className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                  isCompleted ? 'bg-white/10 border-white/20' : 'bg-white/2 border-white/5 opacity-40'
                }`}
              >
                <div className={isCompleted ? 'text-emerald-500' : 'text-slate-500'}>
                  {isCompleted ? <CheckCircle2 size={22} /> : <Circle size={22} />}
                </div>
                <div className="flex-1">
                  <h3 className={`text-sm font-bold ${isCompleted ? 'text-slate-50' : 'text-slate-400'}`}>{m.label}</h3>
                  <p className="text-[10px] uppercase tracking-wide text-slate-400 font-medium">
                    {m.days} Giorni • {format(milestoneDate, 'dd MMM yyyy', { locale: it })}
                  </p>
                </div>
                {isCompleted && (
                  <div className="text-[9px] bg-emerald-900/50 text-emerald-500 px-2 py-0.5 rounded-md uppercase font-black border border-emerald-500/20">
                    Sbloccato
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
