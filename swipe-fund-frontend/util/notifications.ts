import notifee, { AndroidImportance } from '@notifee/react-native';

export async function onDisplayNotificationUp(win: number) {
  const channelId = await notifee.createChannel({
    id: 'important',
    name: 'Important Notifications',
    importance: AndroidImportance.HIGH,
  });
  // Display a notification
  await notifee.displayNotification({
    title: 'Swipefund Win',
    body: `You did well, your account grew by ${win}%`,
    android: {
      channelId,
      importance: AndroidImportance.HIGH,
      // Reference the name created (Optional, defaults to 'ic_launcher')
      smallIcon: 'swifi_not',

      // Set color of icon (Optional, defaults to white)
      color: '#9ced05',

      // Local image
      largeIcon: require('../assets/upward-trend-flat.png'),
    },
  });
}

export async function onDisplayNotificationDown(lose: number) {
  // Create a channel
  const channelId = await notifee.createChannel({
    id: 'important',
    name: 'Important Notifications',
    importance: AndroidImportance.HIGH,
  });

  // Display a notification
  await notifee.displayNotification({
    title: 'Swipefund Lose',
    body: `So sorry, your account is down ${lose}%`,
    android: {
      channelId,
      importance: AndroidImportance.HIGH,
      // Reference the name created (Optional, defaults to 'ic_launcher')
      smallIcon: 'swifi_not',

      // Set color of icon (Optional, defaults to white)
      color: '#9ced05',

      // Local image
      largeIcon: require('../assets/downward-trend-flat.png'),
    },
  });
}

export async function levelUp(newLevel: number) {
  const channelId = await notifee.createChannel({
    id: 'important',
    name: 'Important Notifications',
    importance: AndroidImportance.HIGH,
  });
  // Display a notification
  await notifee.displayNotification({
    title: 'UpLeveled',
    body: `Congratulations you are now Level ${newLevel}`,
    android: {
      channelId,
      importance: AndroidImportance.HIGH,
      // Reference the name created (Optional, defaults to 'ic_launcher')
      smallIcon: 'swifi_not',

      // Set color of icon (Optional, defaults to white)
      color: '#9ced05',

      // Local image
      largeIcon: require('../assets/star.png'),
    },
  });
}
