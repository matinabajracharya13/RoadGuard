export const isReportValid = (
  hazardType: string,
  severity: string,
  description: string,
  hasLocation: boolean
) => {
  return Boolean(
    hazardType.trim() &&
      severity.trim() &&
      description.trim() &&
      hasLocation
  );
};