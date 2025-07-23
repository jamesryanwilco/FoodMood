import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Linking, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { XMarkIcon } from 'react-native-heroicons/solid';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { scheduleGeneralReminder, cancelGeneralReminder } from '../services/NotificationService';

// Dark theme colors
const darkColors = {
    background: '#121212',
    text: '#EAEAEA',
    primary: '#BB86FC',
    secondary: '#03DAC6',
    surface: '#1E1E1E',
    border: '#2E2E2E',
};

export default function SettingsScreen() {
    const navigation = useNavigation();
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);
    const [generalRemindersEnabled, setGeneralRemindersEnabled] = useState(false);

    useEffect(() => {
        const initializeSettings = async () => {
            // Check system notification permissions
            const { status } = await Notifications.getPermissionsAsync();
            const hasPermissions = status === 'granted';
            setNotificationsEnabled(hasPermissions);

            // Check for saved preference for general reminders
            const remindersPref = await AsyncStorage.getItem('general_reminders_enabled');
            
            if (remindersPref === null) {
                // First time: default to enabled.
                setGeneralRemindersEnabled(true);
                await AsyncStorage.setItem('general_reminders_enabled', JSON.stringify(true));
                // If permissions already exist, schedule the reminder immediately.
                if (hasPermissions) {
                    await scheduleGeneralReminder();
                }
            } else {
                // Preference exists: load it.
                const isEnabled = JSON.parse(remindersPref);
                // Sync state if permissions were revoked externally.
                if (isEnabled && !hasPermissions) {
                    setGeneralRemindersEnabled(false);
                    await AsyncStorage.setItem('general_reminders_enabled', JSON.stringify(false));
                } else {
                    setGeneralRemindersEnabled(isEnabled);
                }
            }
        };
        initializeSettings();
    }, []);

    const handleToggleNotifications = async (value) => {
        const { status: currentStatus } = await Notifications.getPermissionsAsync();
        
        if (currentStatus === 'granted' && !value) {
            // User is disabling notifications via device settings.
            Linking.openSettings();
            setNotificationsEnabled(false);
            // Also disable general reminders.
            setGeneralRemindersEnabled(false);
            await AsyncStorage.setItem('general_reminders_enabled', JSON.stringify(false));
            await cancelGeneralReminder();
        } else if (currentStatus !== 'granted' && value) {
            // User is enabling notifications.
            if (currentStatus === 'denied' && Platform.OS === 'ios') {
                Linking.openSettings();
            } else {
                const { status: newStatus } = await Notifications.requestPermissionsAsync();
                const nowEnabled = newStatus === 'granted';
                setNotificationsEnabled(nowEnabled);

                // If permissions were just granted, check if general reminders should be scheduled.
                if (nowEnabled) {
                    const remindersPref = await AsyncStorage.getItem('general_reminders_enabled');
                    if (remindersPref === null || JSON.parse(remindersPref) === true) {
                        setGeneralRemindersEnabled(true); // Ensure toggle is visually on
                        await scheduleGeneralReminder();
                    }
                }
            }
        }
    };

    const handleToggleGeneralReminders = async (value) => {
        setGeneralRemindersEnabled(value);
        await AsyncStorage.setItem('general_reminders_enabled', JSON.stringify(value));

        if (value) {
            // The service function will handle permission checks, but we assume
            // this toggle is only visible when notifications are enabled.
            await scheduleGeneralReminder();
        } else {
            await cancelGeneralReminder();
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
                    <XMarkIcon color={darkColors.primary} size={30} />
                </TouchableOpacity>
            </View>
            <View style={styles.content}>
                <Text style={styles.title}>Settings</Text>
                
                <View style={styles.settingItem}>
                    <View style={styles.settingTextContainer}>
                        <Text style={styles.settingLabel}>Enable Notifications</Text>
                        <Text style={styles.settingDescription}>
                            Receive reminders to complete your check-ins after a meal.
                        </Text>
                    </View>
                    <Switch
                        trackColor={{ false: '#767577', true: darkColors.secondary }}
                        thumbColor={notificationsEnabled ? darkColors.primary : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={handleToggleNotifications}
                        value={notificationsEnabled}
                    />
                </View>

                {notificationsEnabled && (
                    <View style={[styles.settingItem, { marginTop: 20 }]}>
                        <View style={styles.settingTextContainer}>
                            <Text style={styles.settingLabel}>General Reminders</Text>
                            <Text style={styles.settingDescription}>
                                Receive a daily reminder at noon to check in.
                            </Text>
                        </View>
                        <Switch
                            trackColor={{ false: '#767577', true: darkColors.secondary }}
                            thumbColor={generalRemindersEnabled ? darkColors.primary : '#f4f3f4'}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={handleToggleGeneralReminders}
                            value={generalRemindersEnabled}
                        />
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: darkColors.background,
    },
    header: {
        alignItems: 'flex-end',
        paddingTop: 60,
        paddingHorizontal: 20,
    },
    closeButton: {
        padding: 10,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 32,
        fontFamily: 'serif',
        fontWeight: 'bold',
        color: darkColors.text,
        marginBottom: 40,
        textAlign: 'center',
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: darkColors.surface,
        borderRadius: 12,
        padding: 20,
        borderWidth: 1,
        borderColor: darkColors.border,
    },
    settingTextContainer: {
        flex: 1,
        marginRight: 20,
    },
    settingLabel: {
        fontSize: 18,
        fontFamily: 'serif',
        color: darkColors.text,
        marginBottom: 5,
    },
    settingDescription: {
        fontSize: 14,
        fontFamily: 'serif',
        color: '#AAB8C2', // Lighter text for description
    },
}); 