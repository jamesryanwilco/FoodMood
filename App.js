import React, { useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { CheckInProvider } from './src/context/CheckInContext';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Alert, Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      Alert.alert('Permission required', 'Please enable notifications to receive reminders.');
      return;
    }
    // You can get the Expo push token here if you need it for remote notifications
    // token = (await Notifications.getExpoPushTokenAsync()).data;
    // console.log(token);
  } else {
    // alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}

export default function App() {
  const navigationRef = React.useRef(null);

  useEffect(() => {
    registerForPushNotificationsAsync();

    const notificationResponseListener = Notifications.addNotificationResponseReceivedListener(response => {
      const { entryId } = response.notification.request.content.data;
      if (entryId && navigationRef.current) {
        navigationRef.current.navigate('CompleteStep1', { entryId });
      }
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationResponseListener);
    };
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <CheckInProvider>
        <AppNavigator />
      </CheckInProvider>
    </NavigationContainer>
  );
}
