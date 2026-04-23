import { UserSettings, CustomNotification } from '../types';
import { Bell, BellRing, BellOff, Info, CheckCircle2, MessageSquareText, Plus, Trash2, Clock, BookOpen, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Camera as CapCamera, CameraResultType, CameraSource } from '@capacitor/camera';

interface NotificationsProps {
  settings: UserSettings;
  onUpdate: (partial: Partial<UserSettings>) => void;
}

const NA_STEPS = [
  "1. Ammettiamo di essere impotenti...",
  "2. Siamo giunti a credere che un Potere...",
  "3. Abbiamo deciso di affidare la nostra volontà...",
  "4. Abbiamo fatto un inventario morale...",
  "5. Abbiamo ammesso davanti a Dio...",
  "6. Eravamo pronti a far sì che Dio...",
  "7. Gli abbiamo chiesto con umiltà...",
  "8. Abbiamo fatto un elenco di tutte le persone...",
  "9. Abbiamo fatto ammende dirette...",
  "10. Abbiamo continuato a fare l'inventario...",
  "11. Abbiamo cercato attraverso la preghiera...",
  "12. Avendo ottenuto un risveglio spirituale..."
];

export default function Notifications({ settings, onUpdate }: NotificationsProps) {

  const requestPermission = async () => {
    const perm = await LocalNotifications.requestPermissions();
    if (perm.display === 'granted') {
      alert("Notifiche attivate con successo!");
    }
  };

  const scheduleAll = async (notifs: CustomNotification[], spoTime: string) => {
    try {
      const pending = await LocalNotifications.getPending();
      if (pending.notifications.length > 0) {
        await LocalNotifications.cancel({ notifications: pending.notifications });
      }

      const scheduleList: any[] = [];

      notifs.forEach((n, i) => {
        if (n.enabled) {
          const [hours, minutes] = n.time.split(':').map(Number);
          scheduleList.push({
            title: "Phoenix Rise",
            body: n.message,
            id: i + 100,
            schedule: { on: { hour: hours, minute: minutes }, repeats: true },
            smallIcon: 'ic_stat_name',
          });
        }
      });

      if (spoTime) {
        const [sh, sm] = spoTime.split(':').map(Number);
        scheduleList.push({
          title: "Solo Per Oggi",
          body: "È ora della tua lettura quotidiana.",
          id: 500,
          schedule: { on: { hour: sh, minute: sm }, repeats: true },
          smallIcon: 'ic_stat_name',
        });
      }

      if (scheduleList.length > 0) {
        await LocalNotifications.schedule({ notifications: scheduleList });
      }
    } catch (e) {
      console.error("Errore schedulazione:", e);
    }
  };

  const addNotification = () => {
    if ((settings.customNotifications || []).length >= 50) {
      alert("Puoi aggiungere massimo 50 promemoria.");
      return;
    }
    const newNotif: CustomNotification = {
      id: Date.now().toString(),
      message: 'Continua così!',
      time: '12:00',
      enabled: true
    };
    const updated = [...(settings.customNotifications || []), newNotif];
    onUpdate({ customNotifications: updated });
    scheduleAll(updated, settings.soloPerOggiTime || '08:00');
  };

  const removeNotification = (id: string) => {
    const updated = settings.customNotifications.filter(n => n.id !== id);
    onUpdate({ customNotifications: updated });
    scheduleAll(updated, settings.soloPerOggiTime || '08:00');
  };

  const updateNotification = (id: string, partial: Partial<CustomNotification>) => {
    const updated = settings.customNotifications.map(n =>
      n.id === id ? { ...n, ...partial } : n
    );
    onUpdate({ customNotifications: updated });
    scheduleAll(updated, settings.soloPerOggiTime || '08:00');
  };

  const pickImage = async (source: CameraSource) => {
    try {
      const image = await CapCamera.getPhoto({
        quality: 70,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: source
      });

      if (image && image.base64String) {
        onUpdate({ notificationIcon: `data:image/${image.format};base64,${image.base64String}` });
      }
    } catch (error) {
      console.log('User cancelled or error picking image', error);
    }
  };

  return (
    <div className="space-y-8 py-4 pb-32">
      <div className="flex justify-between items-center px-4">
        <h1 className="text-3xl font-bold tracking-tight text-slate-50">Notifiche</h1>
        <button
          onClick={requestPermission}
          className="p-3 bg-white/5 border border-white/10 rounded-2xl text-emerald-500 shadow-lg active:scale-95 transition-all"
        >
          <BellRing size={20} />
        </button>
      </div>

      <section className="space-y-4">
        <div className="flex items-center gap-2 ml-4">
          <BookOpen size={16} className="text-emerald-500" />
          <label className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Solo Per Oggi
          </label>
        </div>
        <div className="glass-card p-6 rounded-[32px] flex items-center justify-between mx-2">
          <div className="space-y-1">
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest block">Lettura Quotidiana</span>
            <p className="text-xs text-slate-400 font-medium italic">Ricevi un promemoria per la tua lettura.</p>
          </div>
          <input
            type="time"
            value={settings.soloPerOggiTime || '08:00'}
            onChange={(e) => {
              onUpdate({ soloPerOggiTime: e.target.value });
              scheduleAll(settings.customNotifications || [], e.target.value);
            }}
            className="bg-white/5 border border-white/10 rounded-xl p-2 text-white text-xs font-bold outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2 ml-4">
          <MessageSquareText size={16} className="text-emerald-500" />
          <label className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Lavoro sui Passi NA
          </label>
        </div>

        <div className="glass-card p-6 rounded-[32px] space-y-6 mx-2">
          <div className="space-y-2">
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Passo Attuale</span>
            <select
              value={settings.naStep || 1}
              onChange={(e) => {
                const step = parseInt(e.target.value);
                onUpdate({
                  naStep: step,
                  naStepReminder: `Riflessione sul Passo ${step}: ${NA_STEPS[step-1]}`
                });
              }}
              className="w-full bg-slate-900/50 border border-white/10 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              {NA_STEPS.map((step, i) => (
                <option key={i} value={i + 1} className="bg-slate-900">{step}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Promemoria Passo</span>
            <textarea
              value={settings.naStepReminder}
              onChange={(e) => onUpdate({ naStepReminder: e.target.value })}
              placeholder="Scrivi qui il tuo impegno di oggi..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs font-medium min-h-[80px] focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
            />
          </div>
        </div>
      </section>

      <section className="space-y-4 px-2">
        <div className="flex items-center justify-between ml-2 mr-2">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-emerald-500" />
            <label className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Promemoria Personalizzati ({(settings.customNotifications || []).length}/50)
            </label>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (confirm("Sei sicuro di voler eliminare tutti i promemoria?")) {
                  onUpdate({ customNotifications: [] });
                  scheduleAll([], settings.soloPerOggiTime || '08:00');
                }
              }}
              className="p-2 bg-red-500/20 text-red-500 rounded-full active:scale-95 transition-all border border-red-500/30"
              title="Reset tutti i promemoria"
            >
              <Trash2 size={16} />
            </button>
            <button
              onClick={addNotification}
              className="p-2 bg-emerald-500 rounded-full text-black active:scale-95 transition-all shadow-lg"
            >
              <Plus size={16} strokeWidth={3} />
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <AnimatePresence>
            {(settings.customNotifications || []).map((n) => (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-card p-5 rounded-[28px] space-y-4"
              >
                <div className="flex gap-4 items-center">
                  <input
                    type="time"
                    value={n.time}
                    onChange={(e) => updateNotification(n.id, { time: e.target.value })}
                    className="bg-white/5 border border-white/10 rounded-xl p-2 text-white text-[10px] font-black outline-none"
                  />
                  <input
                    type="text"
                    value={n.message}
                    onChange={(e) => updateNotification(n.id, { message: e.target.value })}
                    className="flex-1 bg-transparent border-none p-0 text-sm font-bold text-slate-100 placeholder:text-slate-600 focus:ring-0"
                  />
                  <button
                    onClick={() => removeNotification(n.id)}
                    className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      <section className="space-y-4 px-2">
        <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 ml-4">
          Personalizzazione Avatar Notifica
        </label>
        <div className="glass-card p-6 rounded-[32px] flex items-center gap-6">
          <div className="w-20 h-20 rounded-2xl border border-white/10 bg-white/5 overflow-hidden flex items-center justify-center shadow-2xl shrink-0">
            {settings.notificationIcon === 'phoenix' ? (
               <div className="p-2 w-full h-full"><ShieldCheck className="w-full h-full text-emerald-500" /></div>
            ) : settings.notificationIcon ? (
              <img src={settings.notificationIcon} alt="Avatar Notifica" className="w-full h-full object-cover" />
            ) : (
              <Bell size={30} className="text-slate-600" />
            )}
          </div>
          <div className="flex-1 space-y-3">
            <p className="text-[10px] text-slate-400 font-medium leading-tight uppercase tracking-tight">
              Questa immagine è indipendente dal tuo avatar del profilo.
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => pickImage(CameraSource.Photos)}
                className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
              >
                Galleria
              </button>
              <button
                onClick={() => pickImage(CameraSource.Camera)}
                className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
              >
                Fotocamera
              </button>
              <button
                onClick={() => onUpdate({ notificationIcon: 'phoenix' })}
                className="px-4 py-3 bg-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-emerald-500/30"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
