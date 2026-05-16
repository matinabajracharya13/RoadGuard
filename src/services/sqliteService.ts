import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('roadguard.db');

export const initDatabase = () => {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS pending_hazard_reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      hazardType TEXT NOT NULL,
      severity TEXT NOT NULL,
      description TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      syncStatus TEXT DEFAULT 'pending',
      createdAt TEXT NOT NULL
    );
  `);
};

export const savePendingHazardReport = (
  hazardType: string,
  severity: string,
  description: string,
  latitude: number,
  longitude: number
) => {
  db.runSync(
    `
    INSERT INTO pending_hazard_reports 
    (hazardType, severity, description, latitude, longitude, syncStatus, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?);
    `,
    [
      hazardType,
      severity,
      description,
      latitude,
      longitude,
      'pending',
      new Date().toISOString(),
    ]
  );
};

export const getPendingHazardReports = () => {
  return db.getAllSync(`
    SELECT * FROM pending_hazard_reports 
    WHERE syncStatus = 'pending'
    ORDER BY createdAt DESC;
  `);
};

export const markHazardReportAsSynced = (id: number) => {
  db.runSync(
    `
    UPDATE pending_hazard_reports 
    SET syncStatus = 'synced'
    WHERE id = ?;
    `,
    [id]
  );
};