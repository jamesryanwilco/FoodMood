import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { useCheckIn } from '../../context/CheckInContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import * as Notifications from 'expo-notifications';

export default function Step5_ReminderScreen({ navigation }) {
    const { checkInData, resetCheckInData } = useCheckIn();
    const [minutes, setMinutes] = useState('30'); // Default to 30 minutes

    const handleFinish = async () => {
        const reminderMinutes = parseInt(minutes, 10);
        if (isNaN(reminderMinutes) || reminderMinutes <= 0) {
            Alert.alert('Invalid Time', 'Please enter a valid number of minutes.');
            return;
        }

        try {
            const pendingEntry = {
                ...checkInData,
                id: uuidv4(),
                phase1_completed_at: new Date().toISOString(),
                status: 'pending',
                reminder_minutes: reminderMinutes,
            };

            const existingEntries = await AsyncStorage.getItem('pending_entries');
            const entries = existingEntries ? JSON.parse(existingEntries) : [];
            entries.push(pendingEntry);

            await AsyncStorage.setItem('pending_entries', JSON.stringify(entries));
            
            // Schedule the notification with a specific date
            const triggerDate = new Date(Date.now() + reminderMinutes * 60 * 1000);
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: "Meal Reminder",
                    body: "Time to complete your meal entry!",
                    data: { entryId: pendingEntry.id },
                },
                trigger: {
                    type: 'date',
                    date: triggerDate,
                },
            });

            Alert.alert('Entry Saved', `Your pending meal entry has been saved. You'll be reminded in ${reminderMinutes} minutes.`, [
                { text: 'OK', onPress: () => {
                    resetCheckInData();
                    navigation.popToTop();
                    navigation.navigate('Main', { screen: 'Entries' });
                }}
            ]);

        } catch (e) {
            Alert.alert('Error', 'Failed to save the entry.');
            console.error(e);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Set a Reminder</Text>
            <Text style={styles.subtitle}>
                When should we remind you to complete your entry?
            </Text>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={minutes}
                    onChangeText={setMinutes}
                    keyboardType="number-pad"
                    maxLength={3}
                />
                <Text style={styles.inputLabel}>minutes</Text>
            </View>
            
            <TouchableOpacity 
                style={styles.finishButton}
                onPress={handleFinish}
            >
                <Text style={styles.finishButtonText}>Finish & Save Pending Entry</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5E9',
        padding: 20,
        paddingTop: 100,
    },
    title: {
        fontSize: 28,
        fontFamily: 'serif',
        fontWeight: '600',
        color: '#4A5C4D',
        textAlign: 'center',
        marginBottom: 15,
    },
    subtitle: {
        fontSize: 18,
        fontFamily: 'serif',
        color: '#4A5C4D',
        textAlign: 'center',
        marginBottom: 40,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 50,
    },
    input: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 12,
        fontSize: 24,
        color: '#4A5C4D',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        textAlign: 'center',
        minWidth: 100,
    },
    inputLabel: {
        fontSize: 20,
        fontFamily: 'serif',
        color: '#4A5C4D',
        marginLeft: 15,
    },
    finishButton: {
        backgroundColor: '#FF6B6B',
        paddingVertical: 18,
        borderRadius: 12,
        alignItems: 'center',
    },
    finishButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
}); 