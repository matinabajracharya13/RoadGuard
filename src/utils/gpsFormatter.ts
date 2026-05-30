export const formatGps = (latitude: number, longitude: number) => {
  return `GPS (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
};