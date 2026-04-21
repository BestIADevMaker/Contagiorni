import CryptoJS from 'crypto-js';
import { UserSettings } from '../types';

const STORAGE_KEY = 'rinascita_user_settings_v2';
const SECRET_KEY = 'rinascita_sober_flow_vault'; // Internal salt/key base

const DEFAULT_SETTINGS: UserSettings = {
  name: 'Utente',
  startDate: new Date().toISOString(),
  substances: ['alcool'],
  bgImage: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=1920',
  appIcon: 'https://cdn-icons-png.flaticon.com/512/3233/3233512.png',
  userIcon: '👤',
  notificationFrequency: 'daily',
  message: 'Ogni giorno è una vittoria.',
};

export const saveSettings = (settings: UserSettings) => {
  try {
    const stringified = JSON.stringify(settings);
    // AES-256 Encryption
    const encrypted = CryptoJS.AES.encrypt(stringified, SECRET_KEY).toString();
    localStorage.setItem(STORAGE_KEY, encrypted);
  } catch (error) {
    console.error('Errore durante il salvataggio crittografato:', error);
  }
};

export const loadSettings = (): UserSettings => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return DEFAULT_SETTINGS;
  
  try {
    // AES-256 Decryption
    const bytes = CryptoJS.AES.decrypt(stored, SECRET_KEY);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    
    if (!decryptedData) return DEFAULT_SETTINGS;
    
    return { ...DEFAULT_SETTINGS, ...JSON.parse(decryptedData) };
  } catch (error) {
    console.error('Errore durante la decrittografia dei dati:', error);
    return DEFAULT_SETTINGS;
  }
};
