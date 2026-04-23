import CryptoJS from 'crypto-js';
import { UserSettings } from '../types';
import { Preferences } from '@capacitor/preferences';

const STORAGE_KEY = 'rinascita_user_settings_v3';
const SECRET_KEY = 'rinascita_sober_flow_vault_secure';

const DEFAULT_SETTINGS: UserSettings = {
  name: 'Utente',
  startDate: new Date().toISOString(),
  substances: ['alcool'],
  bgImage: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=1920',
  appIcon: 'phoenix',
  notificationIcon: 'phoenix', // Inizializzato a phoenix
  userIcon: '👤',
  notificationFrequency: 'daily',
  message: 'Ogni giorno è una vittoria.',
  hasSeenDisclaimer: false,
  naStep: 1,
  naStepReminder: 'Oggi lavoro sul Primo Passo: Ammettiamo di essere impotenti.',
  customNotifications: [],
  soloPerOggiTime: '08:00',
  cigPerDay: 0,
  pricePerPack: 6.0,
  cigPerPack: 20,
  alcDailyExpense: 0,
  drugDailyExpense: 0,
};

export const saveSettings = async (settings: UserSettings) => {
  try {
    const stringified = JSON.stringify(settings);
    const encrypted = CryptoJS.AES.encrypt(stringified, SECRET_KEY).toString();
    await Preferences.set({
      key: STORAGE_KEY,
      value: encrypted,
    });
  } catch (error) {
    console.error('Errore durante il salvataggio:', error);
  }
};

export const loadSettingsSync = (): UserSettings => {
  // We'll keep a sync version for initial state, but it might be empty on first run
  // because Preferences is async. The App.tsx should handle the async load.
  return DEFAULT_SETTINGS;
};

export const loadSettings = async (): Promise<UserSettings> => {
  try {
    const { value } = await Preferences.get({ key: STORAGE_KEY });
    if (!value) return DEFAULT_SETTINGS;

    const bytes = CryptoJS.AES.decrypt(value, SECRET_KEY);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    
    if (!decryptedData) return DEFAULT_SETTINGS;
    
    return { ...DEFAULT_SETTINGS, ...JSON.parse(decryptedData) };
  } catch (error) {
    console.error('Errore durante il caricamento:', error);
    return DEFAULT_SETTINGS;
  }
};
