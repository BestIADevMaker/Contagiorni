export type Substance = 'alcool' | 'droghe' | 'tabacco' | 'altro';

export interface UserSettings {
  name: string;
  startDate: string; // ISO format
  substances: Substance[];
  bgImage: string; // URL or base64
  appIcon: string; // URL or base64 (Avatar Reale)
  notificationIcon: string; // Nuova campo specifico per l'avatar delle notifiche
  userIcon: string; // emoji or icon name
  notificationFrequency: 'daily' | 'weekly' | 'milestones';
  message: string;
  hasSeenDisclaimer?: boolean;
  naStep?: number;
  naStepReminder?: string;
  customNotifications: CustomNotification[];
  soloPerOggiTime?: string; // HH:mm
  cigPerDay?: number;
  pricePerPack?: number;
  cigPerPack?: number;
  alcDailyExpense?: number;
  drugDailyExpense?: number;
}

export interface CustomNotification {
  id: string;
  message: string;
  time: string; // HH:mm
  enabled: boolean;
}

export interface Milestone {
  days: number;
  label: string;
}

export const DEFAULT_MILESTONES: Milestone[] = [
  { days: 1, label: 'Primo Giorno' },
  { days: 3, label: 'Tre Giorni' },
  { days: 7, label: 'Una Settimana' },
  { days: 14, label: 'Due Settimane' },
  { days: 30, label: 'Un Mese' },
  { days: 90, label: 'Tre Mesi' },
  { days: 180, label: 'Sei Mesi' },
  { days: 365, label: 'Un Anno' },
  { days: 730, label: 'Due Anni' },
  { days: 1095, label: 'Tre Anni' },
  { days: 1460, label: 'Quattro Anni' },
  { days: 1825, label: 'Cinque Anni' },
  { days: 3650, label: 'Dieci Anni' },
];
