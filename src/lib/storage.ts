import { UserSettings } from '../types';

const STORAGE_KEY = 'rinascita_user_settings';

const DEFAULT_SETTINGS: UserSettings = {
  name: 'Utente',
  startDate: new Date().toISOString(),
  substances: ['alcool'],
  bgImage: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=1920',
  appIcon: '',
  notificationFrequency: 'daily',
  message: 'Ogni giorno è una vittoria.',
};

export const saveSettings = (settings: UserSettings) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
};

export const loadSettings = (): UserSettings => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return DEFAULT_SETTINGS;
  try {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
  } catch {
    return DEFAULT_SETTINGS;
  }
};
