import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const requestNotificationPermission = async () => {
  const { status } = await Notifications.requestPermissionsAsync();

  if (status !== 'granted') {
    throw new Error('Notification permission denied');
  }

  return true;
};

export const sendHazardNotification = async (
  hazardType: string,
  severity: string
) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'RoadGuard Hazard Alert',
      body: `${severity} severity ${hazardType} reported. Drive carefully.`,
      sound: true,
    },
    trigger: null,
  });
};