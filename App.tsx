import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { ThemeProvider } from './src/context/ThemeContext';
import { initDatabase } from './src/services/sqliteService';
import { registerBackgroundSyncTask } from './tasks/backgroundSyncTask';

export default function App() {
  useEffect(() => {
    initDatabase();
    registerBackgroundSyncTask();
  }, []);

  return (
    <ThemeProvider>
      <AppNavigator />
    </ThemeProvider>
  );
}