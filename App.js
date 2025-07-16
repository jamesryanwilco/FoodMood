import React, { useEffect, useRef, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { CheckInProvider } from './src/context/CheckInContext';
import * as Font from 'expo-font';
import { initialize as initializeAnalytics, screen as analyticsScreen } from './src/services/AnalyticsService';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Alert, Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
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
  const navigationRef = useRef(null);
  const routeNameRef = useRef();
  const [isAppReady, setAppReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Initialize analytics
        initializeAnalytics();
        
        // Pre-load fonts, make any API calls you need to do here
        await Font.loadAsync({
          // ... existing code ...
        });

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
      } catch (e) {
        console.warn(e);
      } finally {
        setAppReady(true);
      }
    }

    prepare();
  }, []);

  if (!isAppReady) {
    return null; // Or a loading spinner
  }

  return (
    <CheckInProvider>
      <NavigationContainer
        ref={navigationRef}
        onReady={() => {
          routeNameRef.current = navigationRef.current.getCurrentRoute().name;
        }}
        onStateChange={async () => {
          const previousRouteName = routeNameRef.current;
          const currentRouteName = navigationRef.current.getCurrentRoute().name;

          if (previousRouteName !== currentRouteName) {
            analyticsScreen(currentRouteName);
          }
          routeNameRef.current = currentRouteName;
        }}
      >
        <AppNavigator />
      </NavigationContainer>
    </CheckInProvider>
  );
}
