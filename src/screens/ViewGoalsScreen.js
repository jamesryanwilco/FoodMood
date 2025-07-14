import React, { useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { FlagIcon } from 'react-native-heroicons/outline';
import PageContainer from '../components/PageContainer';
import { COLORS, FONTS, SPACING, BORDERS } from '../constants/theme';

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
        <PageContainer>
            <ScrollView>
                <FlagIcon size={48} color={COLORS.primary} style={styles.icon} />
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
        </PageContainer>
    );
}

const styles = StyleSheet.create({
    icon: {
        alignSelf: 'center',
        marginBottom: SPACING.md,
    },
    title: {
        ...FONTS.h2,
        textAlign: 'center',
        marginBottom: SPACING.lg,
    },
    goalCard: {
        backgroundColor: COLORS.white,
        padding: SPACING.md,
        borderRadius: BORDERS.radius,
        borderWidth: BORDERS.width * 2,
        borderColor: COLORS.lightGray,
        marginBottom: SPACING.sm,
        flexDirection: 'row',
        alignItems: 'center',
    },
    medal: {
        fontSize: 24,
        marginRight: SPACING.sm,
    },
    goalText: {
        ...FONTS.body,
        flexShrink: 1,
    },
    customGoalLabel: {
        ...FONTS.body,
        color: COLORS.textLight,
        fontStyle: 'italic',
        marginRight: SPACING.xs,
    },
    noGoalsText: {
        ...FONTS.body,
        fontSize: 18,
        textAlign: 'center',
        marginBottom: SPACING.xl,
        lineHeight: 26,
    },
    button: {
        backgroundColor: COLORS.primary,
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.xl,
        borderRadius: BORDERS.radius,
        alignItems: 'center',
        marginTop: SPACING.md,
    },
    buttonText: {
        ...FONTS.button,
    },
}); 