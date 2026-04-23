import React from 'react';
import { UserSettings, Substance } from '../types';
import { Camera, Calendar, User, ChevronRight, Hash, ShieldCheck, Lock } from 'lucide-react';
import { Camera as CapCamera, CameraResultType, CameraSource } from '@capacitor/camera';

const PhoenixLogo = () => (
  <svg viewBox="0 0 108 108" className="w-full h-full">
    <defs>
      <linearGradient id="phoenixGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FFD700" />
        <stop offset="50%" stopColor="#FF4500" />
        <stop offset="100%" stopColor="#8B0000" />
      </linearGradient>
    </defs>
    <path
      d="M54,25 C45,25 40,30 40,35 C40,40 45,45 54,45 C63,45 68,40 68,35 C68,30 63,25 54,25 Z M20,50 C10,60 15,85 54,95 C93,85 98,60 88,50 C80,45 70,50 54,50 C38,50 28,45 20,50 Z"
      fill="url(#phoenixGrad)"
    />
    <path d="M42,55 L42,75 M42,55 L52,75 L52,55" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M58,75 L63,55 L68,75 M60,68 L66,68" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

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

  const pickImage = async (field: 'bgImage' | 'userIcon' | 'appIcon') => {
    try {
      // 1. Richiesta esplicita permessi per Galleria e Fotocamera
      const perms = await CapCamera.requestPermissions({
        permissions: ['photos', 'camera']
      });

      if (perms.photos !== 'granted' && perms.camera !== 'granted') {
        alert("Permessi necessari per accedere ai media.");
        return;
      }

      // 2. Apertura selettore
      const image = await CapCamera.getPhoto({
        quality: 70,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Prompt,
        promptLabelHeader: 'CARICA IMMAGINE',
        promptLabelPhoto: 'Scegli dalla Galleria',
        promptLabelPicture: 'Scatta una Foto',
      });

      if (image && image.base64String) {
        onUpdate({ [field]: `data:image/${image.format};base64,${image.base64String}` });
      }
    } catch (error: any) {
      // Gestione silenziosa dell'annullamento utente
      if (!error.message?.includes('cancelled')) {
        console.error('Errore selezione immagine:', error);
      }
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
              Tutti i tuoi dati sono crittografati localmente con l'algoritmo **AES-256**. Nessuna informazione lascia mai questo dispositivo.
            </p>
          </div>
        </div>

        <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 ml-4">
          Personalizzazione Identità
        </label>
        <div className="glass-card rounded-[32px] p-4 space-y-6">
          {/* User Icon & Name */}
          <div className="flex items-center gap-6">
            <div className="space-y-3 shrink-0 text-center">
              <div className="w-24 h-24 rounded-[32px] bg-white/5 border border-white/10 flex items-center justify-center text-5xl shadow-2xl overflow-hidden relative group">
                {settings.userIcon?.startsWith('data:image/') ? (
                  <img src={settings.userIcon} alt="User" className="w-full h-full object-cover" />
                ) : (
                  settings.userIcon || '👤'
                )}

                <button
                  onClick={() => pickImage('userIcon')}
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                >
                  <Camera size={24} />
                </button>
              </div>

              <div className="relative">
                <button className="text-[10px] font-black uppercase text-emerald-500 tracking-widest bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20 active:scale-95 transition-all">
                  Scegli Emoji
                </button>
                <select
                  value={settings.userIcon?.length === 2 ? settings.userIcon : '👤'}
                  onChange={(e) => onUpdate({ userIcon: e.target.value })}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full"
                >
                  {['👤', '🧘', '🌟', '🚀', '🔥', '🛡️', '🌿', '🕊️', '🦅', '🦁', '💎', '🕯️', '⚓'].map(emoji => (
                    <option key={emoji} value={emoji}>{emoji}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex-1 space-y-2">
              <div className="space-y-1">
                <input
                  type="text"
                  value={settings.name}
                  onChange={(e) => onUpdate({ name: e.target.value })}
                  className="bg-transparent border-none focus:ring-0 w-full p-0 text-2xl font-black text-slate-50 placeholder:text-slate-600 italic"
                  placeholder="Il tuo nome..."
                />
                <div className="text-[10px] uppercase text-emerald-500 tracking-[3px] font-black opacity-80">Guerriero Phoenix</div>
              </div>
              <p className="text-[10px] text-slate-500 font-medium leading-tight">
                Questo nome e l'avatar sono salvati solo sul tuo telefono.
              </p>
            </div>
          </div>

          <div className="h-px bg-white/5 w-full" />

          {/* App Logo / Icon */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl border border-white/10 bg-white/5 overflow-hidden flex items-center justify-center shadow-lg">
                  {settings.appIcon === 'phoenix' ? (
                    <PhoenixLogo />
                  ) : settings.appIcon && settings.appIcon !== '' ? (
                    <img src={settings.appIcon} alt="Avatar Reale" className="w-full h-full object-cover" />
                  ) : (
                    <ShieldCheck size={20} className="text-emerald-500" />
                  )}
                </div>
                <div>
                  <span className="text-sm font-bold text-slate-50 block">Avatar Reale</span>
                  <span className="text-[10px] text-slate-500 uppercase tracking-tight">Cambia l'immagine del profilo</span>
                </div>
              </div>
              <button
                onClick={() => pickImage('appIcon')}
                className="bg-emerald-500 hover:bg-emerald-600 text-black px-4 py-2 rounded-xl text-[10px] uppercase font-black transition-all"
              >
                Carica Foto
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => onUpdate({ appIcon: 'phoenix' })}
                className={`flex-1 flex items-center gap-2 p-2 rounded-xl border transition-all ${settings.appIcon === 'phoenix' ? 'bg-emerald-500/20 border-emerald-500' : 'bg-white/5 border-white/5'}`}
              >
                <div className="w-6 h-6 rounded-md overflow-hidden"><PhoenixLogo /></div>
                <span className="text-[9px] font-bold uppercase text-left">NA Phoenix</span>
              </button>
              <button
                onClick={() => onUpdate({ appIcon: '' })}
                className={`flex-1 flex items-center gap-2 p-2 rounded-xl border transition-all ${settings.appIcon === '' ? 'bg-emerald-500/20 border-emerald-500' : 'bg-white/5 border-white/5'}`}
              >
                <div className="w-6 h-6 bg-white/5 flex items-center justify-center rounded-md"><ShieldCheck size={12} className="text-emerald-500" /></div>
                <span className="text-[9px] font-bold uppercase text-left">ScudoAvatar</span>
              </button>
            </div>
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

      {(settings.substances.includes('tabacco') || settings.substances.includes('alcool') || settings.substances.includes('droghe')) && (
        <section className="space-y-4">
          <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 ml-4">
            Dati Risparmio Economico
          </label>
          <div className="glass-card rounded-[32px] p-6 space-y-6">
            <div className="space-y-4">
              {settings.substances.includes('tabacco') && (
                <div className="space-y-4 border-b border-white/5 pb-4">
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[2px]">Tabacco</span>
                  <div>
                    <label className="text-[10px] uppercase text-slate-400 font-bold tracking-widest block mb-2 ml-1">Sigarette al giorno</label>
                    <input
                      type="number"
                      value={settings.cigPerDay || ''}
                      onChange={(e) => onUpdate({ cigPerDay: Number(e.target.value) })}
                      className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 text-slate-50 font-bold focus:ring-1 focus:ring-emerald-500/30"
                      placeholder="Es: 20"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase text-slate-400 font-bold tracking-widest block mb-2 ml-1">Prezzo Pacchetto (€)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={settings.pricePerPack || ''}
                        onChange={(e) => onUpdate({ pricePerPack: Number(e.target.value) })}
                        className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 text-slate-50 font-bold focus:ring-1 focus:ring-emerald-500/30"
                        placeholder="Es: 6.00"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase text-slate-400 font-bold tracking-widest block mb-2 ml-1">Pezzi nel Pacco</label>
                      <input
                        type="number"
                        value={settings.cigPerPack || ''}
                        onChange={(e) => onUpdate({ cigPerPack: Number(e.target.value) })}
                        className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 text-slate-50 font-bold focus:ring-1 focus:ring-emerald-500/30"
                        placeholder="Es: 20"
                      />
                    </div>
                  </div>
                </div>
              )}

              {settings.substances.includes('alcool') && (
                <div className="space-y-4 border-b border-white/5 pb-4">
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[2px]">Alcool</span>
                  <div>
                    <label className="text-[10px] uppercase text-slate-400 font-bold tracking-widest block mb-2 ml-1">Spesa media giornaliera (€)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={settings.alcDailyExpense || ''}
                      onChange={(e) => onUpdate({ alcDailyExpense: Number(e.target.value) })}
                      className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 text-slate-50 font-bold focus:ring-1 focus:ring-emerald-500/30"
                      placeholder="Es: 15.00"
                    />
                  </div>
                </div>
              )}

              {settings.substances.includes('droghe') && (
                <div className="space-y-4">
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[2px]">Droghe</span>
                  <div>
                    <label className="text-[10px] uppercase text-slate-400 font-bold tracking-widest block mb-2 ml-1">Spesa media giornaliera (€)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={settings.drugDailyExpense || ''}
                      onChange={(e) => onUpdate({ drugDailyExpense: Number(e.target.value) })}
                      className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 text-slate-50 font-bold focus:ring-1 focus:ring-emerald-500/30"
                      placeholder="Es: 50.00"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

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

      {settings.substances.includes('tabacco') && (
        <section className="space-y-4">
          <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 ml-4">
            Dati Risparmio Tabacco
          </label>
          <div className="glass-card rounded-[32px] p-6 space-y-6">
            <div className="space-y-4">
              <div>
                <label className="text-[10px] uppercase text-emerald-500 font-black tracking-widest block mb-2 ml-1">Sigarette al giorno</label>
                <input
                  type="number"
                  value={settings.cigPerDay || ''}
                  onChange={(e) => onUpdate({ cigPerDay: Number(e.target.value) })}
                  className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 text-slate-50 font-bold focus:ring-1 focus:ring-emerald-500/30"
                  placeholder="Es: 20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase text-emerald-500 font-black tracking-widest block mb-2 ml-1">Prezzo Pacchetto (€)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={settings.pricePerPack || ''}
                    onChange={(e) => onUpdate({ pricePerPack: Number(e.target.value) })}
                    className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 text-slate-50 font-bold focus:ring-1 focus:ring-emerald-500/30"
                    placeholder="Es: 6.00"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase text-emerald-500 font-black tracking-widest block mb-2 ml-1">Sigarette nel Pacco</label>
                  <input
                    type="number"
                    value={settings.cigPerPack || ''}
                    onChange={(e) => onUpdate({ cigPerPack: Number(e.target.value) })}
                    className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 text-slate-50 font-bold focus:ring-1 focus:ring-emerald-500/30"
                    placeholder="Es: 20"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="space-y-4">
        <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 ml-4">
          Sfondo Atmosferico
        </label>
        <div className="glass-card rounded-[32px] p-4">
          <div className="relative h-32 w-full rounded-2xl overflow-hidden group mb-4">
            <img src={settings.bgImage} className="w-full h-full object-cover transition-transform group-hover:scale-105" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px]">
              <button
                onClick={() => pickImage('bgImage')}
                className="bg-white text-black px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-2xl"
              >
                Sostituisci Sfondo
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4 px-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Camera size={16} />
            </div>
            <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
              Carica una foto che ti ispira pace e forza.
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
            </span>
          </p>
        </div>
        <p className="text-[10px] text-slate-500 px-8">
          Phoenix Rise Engine v3.1 • Crittografia Attiva
        </p>
      </div>
    </div>
  );
}
