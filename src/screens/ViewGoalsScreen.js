import React, { useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { FlagIcon } from 'react-native-heroicons/outline';

const GOALS_STORAGE_KEY = 'user_goals';

const medalColors = {
    '🥇': '#FFD700', // Gold
    '🥈': '#C0C0C0', // Silver
    '🥉': '#CD7F32', // Bronze
};

export default function ViewGoalsScreen({ navigation }) {
    const [savedGoals, setSavedGoals] = React.useState({ selected: [], custom: '' });

    const loadGoals = async () => {
        try {
            const storedGoals = await AsyncStorage.getItem(GOALS_STORAGE_KEY);
            if (storedGoals) {
                setSavedGoals(JSON.parse(storedGoals));
            } else {
                setSavedGoals({ selected: [], custom: '' });
            }
        } catch (e) {
            console.error('Failed to load goals.', e);
        }
    };

    useFocusEffect(useCallback(() => { loadGoals(); }, []));

    const { selected = [], custom = '' } = savedGoals;
    const hasGoals = selected.length > 0 || custom;

    const renderGoal = (goal, index) => {
        const medal = ['🥇', '🥈', '🥉'][index];
        return (
            <View key={goal} style={[styles.goalCard, medal && { borderColor: medalColors[medal] }]}>
                {medal && <Text style={styles.medal}>{medal}</Text>}
                <Text style={styles.goalText}>{goal}</Text>
            </View>
        );
    };

    return (
        <ScrollView style={styles.container}>
            <FlagIcon size={48} color="#4A5C4D" style={styles.icon} />
            <Text style={styles.title}>Your Current Intentions</Text>

            {hasGoals ? (
                <>
                    {selected.map(renderGoal)}
                    {custom ? (
                        <View style={styles.goalCard}>
                            <Text style={styles.customGoalLabel}>Your custom intention:</Text>
                            <Text style={styles.goalText}>{custom}</Text>
                        </View>
                    ) : null}
                </>
            ) : (
                <Text style={styles.noGoalsText}>
                    You haven't set any intentions yet. Tap below to get started!
                </Text>
            )}

            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('SelectGoals')}
            >
                <Text style={styles.buttonText}>{hasGoals ? 'Reselect My Intentions' : 'Set My Intentions'}</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5E9',
        padding: 20,
        paddingTop: 80,
    },
    icon: {
        alignSelf: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontFamily: 'serif',
        fontWeight: '600',
        color: '#4A5C4D',
        textAlign: 'center',
        marginBottom: 30,
    },
    goalCard: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#E0E0E0',
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
    },
    medal: {
        fontSize: 24,
        marginRight: 15,
    },
    goalText: {
        fontSize: 16,
        fontFamily: 'serif',
        color: '#4A5C4D',
        flexShrink: 1,
    },
    customGoalLabel: {
        fontSize: 16,
        fontFamily: 'serif',
        color: '#AAB8C2',
        fontStyle: 'italic',
        marginRight: 5,
    },
    noGoalsText: {
        fontSize: 18,
        fontFamily: 'serif',
        color: '#4A5C4D',
        textAlign: 'center',
        marginBottom: 40,
        lineHeight: 26,
    },
    button: {
        backgroundColor: '#4A5C4D',
        paddingVertical: 18,
        paddingHorizontal: 40,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
}); 