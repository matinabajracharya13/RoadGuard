import * as Battery from "expo-battery";

type LevelCallback = (level: number) => void;

// Read battery level once (returns 0.0–1.0)
export async function getBatteryLevel(): Promise<number> {
  return await Battery.getBatteryLevelAsync();
}

// Subscribe to live battery changes.
// onChange fires on every update.
// onLow fires once when battery crosses below the threshold.
// Returns an unsubscribe function.
export function watchBattery(
  onChange: LevelCallback,
  onLow: LevelCallback,
  threshold: number = 0.15,
): () => void {
  let wasLow = false;

  const sub = Battery.addBatteryLevelListener(({ batteryLevel }) => {
    onChange(batteryLevel);

    const isNowLow = batteryLevel < threshold;
    if (isNowLow && !wasLow) {
      onLow(batteryLevel);
    }
    wasLow = isNowLow;
  });

  return () => sub.remove();
}