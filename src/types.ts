export type Substance = 'alcool' | 'droghe' | 'tabacco' | 'altro';

export interface UserSettings {
  name: string;
  startDate: string; // ISO format
  substances: Substance[];
  bgImage: string; // URL or base64
  appIcon: string; // URL or base64
  userIcon: string; // emoji or icon name
  notificationFrequency: 'daily' | 'weekly' | 'milestones';
  message: string;
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
];
