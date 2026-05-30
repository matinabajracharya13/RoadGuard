export const getHazardDisplayLabel = (hazardType: string) => {
  return hazardType.trim() || 'Unknown Hazard';
};