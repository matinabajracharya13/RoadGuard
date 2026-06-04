import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';

import AppNavigator from './src/navigation/AppNavigator';
import { ThemeProvider } from './src/context/ThemeContext';

import { initDatabase } from './src/services/sqliteService';
import { getBatteryLevel } from './src/services/batteryService';
import { syncPendingReports } from './src/services/syncService';

import { registerBackgroundSyncTask } from './src/tasks/backgroundSyncTask';

function App() {
  useEffect(() => {
    initDatabase();

    // Register 15-minute background sync task
    registerBackgroundSyncTask();

    // Sync immediately when internet connectivity is restored
    const unsubscribeNetInfo = NetInfo.addEventListener(async (state) => {
      if (state.isConnected && state.isInternetReachable) {
        try {
          const batteryLevel = await getBatteryLevel();

          // Skip sync when battery is below threshold
          if (batteryLevel < 0.5) {
            console.log(
              'Background sync skipped because battery is below 50%',
            );
            return;
          }

          console.log(
            'Internet connection restored. Running immediate sync...',
          );

          await syncPendingReports();

          console.log('Immediate sync completed.');
        } catch (error) {
          console.log('Connectivity sync failed:', error);
        }
      }
    });

    return () => {
      unsubscribeNetInfo();
    };
  }, []);

  return (
    <ThemeProvider>
      <AppNavigator />
    </ThemeProvider>
  );
}

export default App;