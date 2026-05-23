import * as Battery from "expo-battery";

type LevelCallback = (level: number) => void;

// Read battery level once (returns 0.0–1.0)
export async function getBatteryLevel(): Promise<number> {
  return await Battery.getBatteryLevelAsync();
}

// Subscribe to battery changes. Returns an unsubscribe function.
// onLow fires when battery drops below the threshold (default 15%).
export function watchBattery(
  onChange: LevelCallback,
  onLow: LevelCallback,
  threshold: number = 0.15,
): () => void {
  const sub = Battery.addBatteryLevelListener(({ batteryLevel }) => {
    onChange(batteryLevel);
    if (batteryLevel < threshold) {
      onLow(batteryLevel);
    }
  });
  return () => sub.remove();
}
