import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { identifyUser } from '../services/AnalyticsService';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

export default function OnboardingScreen() {
    const navigation = useNavigation();

    const handleDone = async () => {
        try {
            const userId = uuidv4();
            identifyUser(userId);
            await AsyncStorage.setItem('hasOnboarded', 'true');
            await AsyncStorage.setItem('userId', userId);
            navigation.navigate('SelectGoals');
        } catch (error) {
            console.error('Failed to complete onboarding:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to FoodMood</Text>
            <Text style={styles.subtitle}>
                Let's start by setting up your journey towards mindful eating.
            </Text>
            <TouchableOpacity style={styles.button} onPress={handleDone}>
                <Text style={styles.buttonText}>Get Started</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5E9',
        padding: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#4A5C4D',
        textAlign: 'center',
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 18,
        color: '#4A5C4D',
        textAlign: 'center',
        marginBottom: 40,
    },
    button: {
        backgroundColor: '#4A5C4D',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 25,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
}); 