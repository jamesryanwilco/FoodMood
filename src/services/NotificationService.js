import * as Notifications from 'expo-notifications';
import { Platform, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { calculateStreak } from '../utils/streakUtils';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

export async function registerForPushNotificationsAsync() {
    let token;
    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== 'granted') {
        Alert.alert('Enable Notifications', 'Please enable notifications in your settings to receive meal completion reminders.');
        return;
    }
    
    // This is where you would get the push token for remote notifications.
    // We don't need it for local notifications, but the setup is good to have.
    // token = (await Notifications.getExpoPushTokenAsync()).data;
    // console.log(token);

    return token;
}

export async function scheduleGeneralReminder() {
    // First, cancel any existing general reminder to avoid duplicates
    await cancelGeneralReminder();

    const existingEntries = await AsyncStorage.getItem('pending_entries');
    const allEntries = existingEntries ? JSON.parse(existingEntries) : [];
    const completedEntries = allEntries.filter(e => e.status === 'completed');
    const streak = calculateStreak(completedEntries);

    let body = "Don't forget to check in with your food and mood today!";
    if (streak > 0) {
        body = `You're on a ${streak}-day streak! Keep it going by checking in today.`;
    }

    await Notifications.scheduleNotificationAsync({
        content: {
            title: 'Mindful Eating Reminder',
            body: body,
            data: { type: 'general_reminder' },
        },
        trigger: {
            hour: 12, // 12:00 PM
            minute: 0,
            repeats: true,
        },
        identifier: 'general-reminder',
    });
}

export async function cancelGeneralReminder() {
    await Notifications.cancelScheduledNotificationAsync('general-reminder');
}

export async function scheduleMealCompletionReminder(entryId, completionTime) {
    const trigger = new Date(completionTime);
    
    // For testing: schedule for 10 seconds from now
    // const trigger = new Date(Date.now() + 10 * 1000);

    const identifier = await Notifications.scheduleNotificationAsync({
        content: {
            title: "Ready to complete your meal?",
            body: "Tap here to reflect on your recent meal and complete your entry.",
            data: { entryId },
        },
        trigger: {
            date: trigger,
        },
    });
    return identifier; // This is the notification ID
}

export async function cancelNotification(identifier) {
    await Notifications.cancelScheduledNotificationAsync(identifier);
} 