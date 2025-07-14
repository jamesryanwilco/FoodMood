import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

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
    const [customGoal, setCustomGoal] = useState('');
    const [expandedSections, setExpandedSections] = useState({});

    const loadGoals = async () => {
        try {
            const storedGoals = await AsyncStorage.getItem(GOALS_STORAGE_KEY);
            if (storedGoals) {
                const { selected, custom } = JSON.parse(storedGoals);
                setSelectedGoals(selected || []);
                setCustomGoal(custom || '');
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

    const toggleSection = (category) => {
        setExpandedSections(prev => ({
            ...prev,
            [category]: !prev[category]
        }));
    };

    const handleSave = async () => {
        try {
            const dataToStore = JSON.stringify({ selected: selectedGoals, custom: customGoal });
            await AsyncStorage.setItem(GOALS_STORAGE_KEY, dataToStore);
            Alert.alert('Saved!', 'Your intentions have been saved.', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (e) {
            Alert.alert('Error', 'Failed to save your intentions.');
            console.error(e);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollContainer}>
                <Text style={styles.title}>What matters most to you right now?</Text>
                <Text style={styles.subtitle}>Choose what resonates with you. You can always change this later.</Text>

                {goalsData.map(section => (
                    <View key={section.category} style={styles.section}>
                        <TouchableOpacity onPress={() => toggleSection(section.category)} style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>{section.emoji} {section.category}</Text>
                            <Text style={styles.sectionToggle}>{expandedSections[section.category] ? '−' : '+'}</Text>
                        </TouchableOpacity>
                        {expandedSections[section.category] && section.items.map(item => {
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
                    <Text style={styles.sectionTitle}>✍️ Write your own intention (optional)</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="I want to..."
                        placeholderTextColor="#AAB8C2"
                        value={customGoal}
                        onChangeText={setCustomGoal}
                    />
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>Save My Intentions</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5E9',
    },
    scrollContainer: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 100,
    },
    title: {
        fontSize: 28,
        fontFamily: 'serif',
        fontWeight: '600',
        color: '#4A5C4D',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 18,
        fontFamily: 'serif',
        color: '#4A5C4D',
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 30,
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 22,
        fontFamily: 'serif',
        fontWeight: '600',
        color: '#4A5C4D',
        marginBottom: 15,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    sectionToggle: {
        fontSize: 28,
        color: '#4A5C4D',
        fontWeight: '300',
    },
    goalButton: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        marginBottom: 10,
    },
    goalContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    medal: {
        fontSize: 20,
        marginRight: 10,
    },
    goalButtonSelected: {
        backgroundColor: '#4A5C4D',
        borderColor: '#4A5C4D',
    },
    goalText: {
        fontSize: 16,
        fontFamily: 'serif',
        color: '#4A5C4D',
    },
    goalTextSelected: {
        color: '#FFFFFF',
    },
    input: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 12,
        fontSize: 16,
        color: '#4A5C4D',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    saveButton: {
        backgroundColor: '#FF6B6B',
        paddingVertical: 18,
        borderRadius: 12,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    footerText: {
        fontSize: 14,
        fontFamily: 'serif',
        color: '#AAB8C2',
        textAlign: 'center',
        marginBottom: 40,
        fontStyle: 'italic',
    },
    footer: {
        paddingTop: 20,
        paddingHorizontal: 20,
        paddingBottom: 60,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
        backgroundColor: '#F5F5E9',
    },
}); 