export const getSeverityColor = (severity: string) => {
  switch (severity.toLowerCase()) {
    case 'high':
      return '#dc2626';
    case 'medium':
      return '#f59e0b';
    default:
      return '#16a34a';
  }
};