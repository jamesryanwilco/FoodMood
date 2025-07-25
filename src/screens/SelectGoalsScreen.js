import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import StickyFooterLayout from '../components/StickyFooterLayout';
import { COLORS, FONTS, SPACING, BORDERS } from '../constants/theme';
import { PlusCircleIcon, XCircleIcon } from 'react-native-heroicons/solid';

const GOALS_STORAGE_KEY = 'user_goals';

const goalsData = [
    {
        emoji: '🌱',
        category: 'Awareness & Mindset',
        items: [
            'I want to understand my emotional eating triggers.',
            'I want to slow down and enjoy my meals more.',
            'I want to feel more in control of my food choices.',
            'I want to eat without guilt.',
        ],
    },
    {
        emoji: '⚡',
        category: 'Health & Energy',
        items: [
            'I want to have more consistent energy throughout the day.',
            'I want to reduce bloating and discomfort after meals.',
            'I want to improve my digestion.',
            'I want to support my immune system with better nutrition.',
        ],
    },
    {
        emoji: '💪',
        category: 'Strength & Performance',
        items: [
            'I want to fuel my body to support my workouts.',
            'I want to build muscle or maintain a healthy weight without strict tracking.',
            'I want to feel strong and nourished, not restricted.',
        ],
    },
];

export default function GoalsScreen() {
    const navigation = useNavigation();
    const [selectedGoals, setSelectedGoals] = useState([]);
    const [customGoals, setCustomGoals] = useState([]);
    const [customGoalInput, setCustomGoalInput] = useState('');

    const loadGoals = async () => {
        try {
            const storedGoals = await AsyncStorage.getItem(GOALS_STORAGE_KEY);
            if (storedGoals) {
                const { selected, custom } = JSON.parse(storedGoals);
                setSelectedGoals(selected || []);
                // Ensure custom goals are always an array to prevent crashes from old data formats
                if (Array.isArray(custom)) {
                    setCustomGoals(custom);
                } else if (custom) { // Handle old string format by converting it to an array
                    setCustomGoals([custom]);
                } else {
                    setCustomGoals([]);
                }
            }
        } catch (e) {
            console.error('Failed to load goals.', e);
        }
    };

    useFocusEffect(useCallback(() => { loadGoals(); }, []));

    const handleSelectGoal = (goal) => {
        const newSelectedGoals = selectedGoals.includes(goal)
            ? selectedGoals.filter(g => g !== goal)
            : [...selectedGoals, goal];
        setSelectedGoals(newSelectedGoals);
    };

    const handleAddCustomGoal = () => {
        if (customGoalInput.trim() !== '') {
            setCustomGoals(prev => [...prev, customGoalInput.trim()]);
            setCustomGoalInput('');
        }
    };

    const handleDeleteCustomGoal = (index) => {
        setCustomGoals(prev => prev.filter((_, i) => i !== index));
    };

    const handleSave = async () => {
        try {
            const dataToStore = JSON.stringify({ selected: selectedGoals, custom: customGoals });
            await AsyncStorage.setItem(GOALS_STORAGE_KEY, dataToStore);
            Alert.alert('Saved!', 'Your intentions have been saved.', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (e) {
            Alert.alert('Error', 'Failed to save your intentions.');
            console.error(e);
        }
    };

    const renderFooter = () => (
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save My Intentions</Text>
        </TouchableOpacity>
    );

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <StickyFooterLayout
                header={<Text style={styles.title}>Select Goals</Text>}
                footer={renderFooter()}
            >
                {goalsData.map(section => (
                    <View key={section.category} style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>{section.emoji} {section.category}</Text>
                        </View>
                        {section.items.map(item => {
                            const isSelected = selectedGoals.includes(item);
                            const medalIndex = selectedGoals.indexOf(item);
                            const medal = ['🥇', '🥈', '🥉'][medalIndex];

                            return (
                                <TouchableOpacity
                                    key={item}
                                    style={[styles.goalButton, isSelected && styles.goalButtonSelected]}
                                    onPress={() => handleSelectGoal(item)}
                                >
                                    <View style={styles.goalContent}>
                                        {isSelected && medal ? <Text style={styles.medal}>{medal}</Text> : null}
                                        <Text style={[styles.goalText, isSelected && styles.goalTextSelected]}>{item}</Text>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                ))}

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>✍️ Write your own intention</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="I want to..."
                            placeholderTextColor={COLORS.textLight}
                            value={customGoalInput}
                            onChangeText={setCustomGoalInput}
                        />
                        <TouchableOpacity onPress={handleAddCustomGoal} style={styles.addButton}>
                            <PlusCircleIcon color={COLORS.accent} size={32} />
                        </TouchableOpacity>
                    </View>

                    {customGoals.map((goal, index) => (
                        <View key={index} style={styles.customGoalChip}>
                            <Text style={styles.customGoalText}>{goal}</Text>
                            <TouchableOpacity onPress={() => handleDeleteCustomGoal(index)}>
                                <XCircleIcon color={COLORS.white} size={20} />
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            </StickyFooterLayout>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    title: {
        ...FONTS.h2,
        textAlign: 'center',
        padding: SPACING.md,
        backgroundColor: COLORS.background, // Match page background
    },
    subtitle: {
        ...FONTS.body,
        textAlign: 'center',
        marginTop: SPACING.sm,
        marginBottom: SPACING.lg,
    },
    section: {
        marginBottom: SPACING.lg,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    sectionTitle: {
        ...FONTS.h3,
    },
    goalButton: {
        backgroundColor: COLORS.white,
        padding: SPACING.md,
        borderRadius: BORDERS.radius,
        borderWidth: BORDERS.width,
        borderColor: COLORS.lightGray,
        marginBottom: SPACING.sm,
    },
    goalContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    medal: {
        fontSize: 20,
        marginRight: SPACING.sm,
    },
    goalButtonSelected: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    goalText: {
        ...FONTS.body,
        flexShrink: 1,
    },
    goalTextSelected: {
        color: COLORS.white,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        ...FONTS.body,
        flex: 1,
        backgroundColor: COLORS.white,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        borderRadius: BORDERS.radius,
        borderWidth: BORDERS.width,
        borderColor: COLORS.lightGray,
    },
    addButton: {
        marginLeft: SPACING.sm,
    },
    customGoalChip: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: COLORS.primary,
        padding: SPACING.sm,
        borderRadius: BORDERS.radius,
        marginTop: SPACING.sm,
    },
    customGoalText: {
        ...FONTS.body,
        color: COLORS.white,
        flex: 1,
        marginRight: SPACING.sm,
    },
    saveButton: {
        backgroundColor: COLORS.accent,
        paddingVertical: SPACING.md,
        borderRadius: BORDERS.radius,
        alignItems: 'center',
    },
    saveButtonText: {
        ...FONTS.button,
    },
}); 