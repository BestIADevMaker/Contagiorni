import { useState, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, Settings as SettingsIcon, BarChart3, Bell } from 'lucide-react';
import { loadSettings, saveSettings } from './lib/storage';
import { UserSettings } from './types';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';
import Stats from './components/Stats';
import Notifications from './components/Notifications';

export default function App() {
  const [settings, setSettings] = useState<UserSettings>(() => loadSettings());
  const [activeTab, setActiveTab] = useState<'home' | 'stats' | 'notifications' | 'settings'>('home');

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  const updateSettings = (partial: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...partial }));
  };

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
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm -z-10" />

      <main className="pb-24 pt-8 px-4 max-w-lg mx-auto min-h-screen flex flex-col">
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

      {/* Navigation Rail */}
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
