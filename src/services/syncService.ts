import { getAllPendingReports, markHazardReportAsSynced } from './sqliteService';
import { submitHazardReport } from './hazardService';

export const syncPendingReports = async () => {
  const pendingReports = getAllPendingReports() as any[];

  let syncedCount = 0;

  for (const report of pendingReports) {
    try {
      await submitHazardReport({
        hazardType: report.hazardType,
        severity: report.severity,
        description: report.description,
        latitude: report.latitude,
        longitude: report.longitude,
      });

      markHazardReportAsSynced(report.id);
      syncedCount++;
    } catch (error) {
      console.log('Sync failed for report:', report.id);
    }
  }

  return syncedCount;
};