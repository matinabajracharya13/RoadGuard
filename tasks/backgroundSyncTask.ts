import * as TaskManager from 'expo-task-manager';
import * as BackgroundTask from 'expo-background-task';
import { syncPendingReports } from '../services/syncService';
import { syncPendingReports } from '../src/services/syncService';

export const BACKGROUND_SYNC_TASK = 'ROADGUARD_BACKGROUND_SYNC';

TaskManager.defineTask(BACKGROUND_SYNC_TASK, async () => {
  try {
    await syncPendingReports();
    console.log('Background sync task running...');

    return BackgroundTask.BackgroundTaskResult.Success;
  } catch (error) {
    console.log('Background sync failed:', error);

    return BackgroundTask.BackgroundTaskResult.Failed;
  }
});

export const registerBackgroundSyncTask = async () => {
  const isRegistered = await TaskManager.isTaskRegisteredAsync(
    BACKGROUND_SYNC_TASK
  );

  if (!isRegistered) {
    await BackgroundTask.registerTaskAsync(BACKGROUND_SYNC_TASK, {
      minimumInterval: 15,
    });
  }
};