import { useState, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, Settings as SettingsIcon, BarChart3, Bell, ShieldCheck } from 'lucide-react';
import { loadSettings, saveSettings, loadSettingsSync } from './lib/storage';
import { UserSettings } from './types';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';
import Stats from './components/Stats';
import Notifications from './components/Notifications';

const PhoenixLogo = () => (
  <svg viewBox="0 0 108 108" className="w-full h-full">
    <defs>
      <linearGradient id="phoenixGradApp" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FFD700" />
        <stop offset="50%" stopColor="#FF4500" />
        <stop offset="100%" stopColor="#8B0000" />
      </linearGradient>
    </defs>
    <path
      d="M54,25 C45,25 40,30 40,35 C40,40 45,45 54,45 C63,45 68,40 68,35 C68,30 63,25 54,25 Z M20,50 C10,60 15,85 54,95 C93,85 98,60 88,50 C80,45 70,50 54,50 C38,50 28,45 20,50 Z"
      fill="url(#phoenixGradApp)"
    />
    <path d="M42,55 L42,75 M42,55 L52,75 L52,55" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M58,75 L63,55 L68,75 M60,68 L66,68" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function App() {
  const [settings, setSettings] = useState<UserSettings>(loadSettingsSync());
  const [activeTab, setActiveTab] = useState<'home' | 'stats' | 'notifications' | 'settings'>('home');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function init() {
      const saved = await loadSettings();
      setSettings(saved);
      setIsLoading(false);
    }
    init();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      saveSettings(settings);
    }
  }, [settings, isLoading]);

  const updateSettings = (partial: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...partial }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div
      className="relative min-h-screen font-sans text-white overflow-hidden bg-black"
      style={{
        backgroundImage: settings.bgImage ? `url(${settings.bgImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] -z-10" />

      <main className="pb-24 pt-8 px-4 max-w-lg mx-auto min-h-screen flex flex-col">
        {/* Top Header Branding */}
        <div className="flex items-center justify-between px-6 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
              {settings.appIcon === 'phoenix' ? (
                <PhoenixLogo />
              ) : settings.appIcon && settings.appIcon !== '' ? (
                <img src={settings.appIcon} alt="App Logo" className="w-full h-full object-cover" />
              ) : (
                <ShieldCheck size={16} className="text-emerald-500" />
              )}
            </div>
            <span className="text-[10px] font-black uppercase tracking-[3px] text-slate-100">Phoenix Rise</span>
          </div>
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
        </div>

        <div className="glass rounded-[40px] p-6 flex-1 flex flex-col relative overflow-hidden">
          <AnimatePresence mode="wait">
            {activeTab === 'home' && (
              <motion.div
                key="home"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="flex-1"
              >
                <Dashboard settings={settings} />
              </motion.div>
            )}
            {activeTab === 'stats' && (
              <motion.div
                key="stats"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1"
              >
                <Stats settings={settings} />
              </motion.div>
            )}
            {activeTab === 'notifications' && (
              <motion.div
                key="notifications"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1"
              >
                <Notifications settings={settings} onUpdate={updateSettings} />
              </motion.div>
            )}
            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex-1"
              >
                <Settings settings={settings} onUpdate={updateSettings} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <AnimatePresence>
        {!settings.hasSeenDisclaimer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="glass-card p-8 rounded-[40px] max-w-sm w-full border-emerald-500/30 text-center space-y-6"
            >
              <div className="w-20 h-20 bg-emerald-500/20 rounded-3xl flex items-center justify-center mx-auto text-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                <ShieldCheck size={40} />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black uppercase tracking-tight text-white italic">Sicurezza Totale</h2>
                <div className="h-1 w-12 bg-emerald-500 mx-auto rounded-full" />
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                Questa applicazione è stata progettata con un'architettura <span className="text-emerald-400 font-bold">Zero-Knowledge</span>.
                <br/><br/>
                Tutti i tuoi dati, comprese le <span className="text-white font-bold underline">immagini del profilo</span> e i progressi, rimangono salvati <span className="text-emerald-400 font-bold">esclusivamente sul tuo dispositivo</span>.
                <br/><br/>
                Io, come sviluppatore, non ho accesso a nulla. Nessuna informazione viene inviata a terzi o salvata online.
              </p>
              <button
                onClick={() => {
                  // Eseguiamo le richieste in background senza bloccare l'avvio dell'app
                  import('@capacitor/camera').then(async ({ Camera }) => {
                    // Chiediamo prima la fotocamera
                    await Camera.requestPermissions({ permissions: ['camera'] });
                    // Piccolo ritardo e poi chiediamo la galleria (photos)
                    setTimeout(async () => {
                      await Camera.requestPermissions({ permissions: ['photos'] });
                    }, 500);
                  }).catch(e => console.log(e));

                  import('@capacitor/local-notifications').then(({ LocalNotifications }) => {
                    LocalNotifications.requestPermissions().catch(e => console.log(e));
                  });

                  // Sblocca l'app immediatamente
                  updateSettings({ hasSeenDisclaimer: true });
                }}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-black py-4 rounded-2xl uppercase tracking-[2px] transition-all shadow-lg active:scale-95"
              >
                Accetto e Comprendo
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-48px)] max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl px-6 py-4 z-50">
        <div className="flex justify-between items-center">
          <NavButton 
            active={activeTab === 'home'} 
            onClick={() => setActiveTab('home')} 
            icon={<Home size={22} />} 
          />
          <NavButton 
            active={activeTab === 'stats'} 
            onClick={() => setActiveTab('stats')} 
            icon={<BarChart3 size={22} />} 
          />
          <NavButton 
            active={activeTab === 'notifications'} 
            onClick={() => setActiveTab('notifications')} 
            icon={<Bell size={22} />} 
          />
          <NavButton 
            active={activeTab === 'settings'} 
            onClick={() => setActiveTab('settings')} 
            icon={<SettingsIcon size={22} />} 
          />
        </div>
      </nav>
    </div>
  );
}

function NavButton({ active, onClick, icon }: { active: boolean; onClick: () => void; icon: ReactNode }) {
  return (
    <button 
      onClick={onClick}
      className={`relative p-2 rounded-full transition-colors ${active ? 'text-white' : 'text-white/40 hover:text-white/70'}`}
    >
      {active && (
        <motion.div
          layoutId="nav-glow"
          className="absolute inset-0 bg-white/10 rounded-full blur-md"
          transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
        />
      )}
      {icon}
    </button>
  );
}
