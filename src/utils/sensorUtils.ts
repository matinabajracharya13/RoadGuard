export const calculateMovementMagnitude = (
  x: number,
  y: number,
  z: number
) => {
  return Math.sqrt(x * x + y * y + z * z);
};

export const isPotholeDetected = (
  magnitude: number,
  threshold: number
) => {
  return magnitude > threshold;
};