import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.phoenixrise.app',
  appName: 'Phoenix Rise',
  webDir: 'dist',
  plugins: {
    LocalNotifications: {
      smallIcon: "ic_stat_name",
      iconColor: "#10b981",
    },
  },
};

export default config;
