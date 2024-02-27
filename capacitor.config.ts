import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.todocalendar.app',
  appName: 'todo-calendar',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
