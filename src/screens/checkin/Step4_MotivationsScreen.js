import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useCheckIn } from '../../context/CheckInContext';

const motivationSections = [
    {
        title: 'Physical Reason',
        reasons: ['Hunger', 'Energy', 'Health', 'Performance']
    },
    {
        title: 'Emotional Reason',
        reasons: ['Comfort', 'Reward', 'Nostalgia', 'Distraction']
    },
    {
        title: 'Environmental Reason',
        reasons: ['Social connection', 'Habit/routine', 'Marketing/cues', 'Convenience/availability']
    }
];

export default function Step4_MotivationsScreen({ navigation }) {
    const { checkInData, updateCheckInData } = useCheckIn();

    const handleMotivationToggle = (motivation) => {
        const newMotivations = checkInData.motivations.includes(motivation)
            ? checkInData.motivations.filter(m => m !== motivation)
            : [...checkInData.motivations, motivation];
        updateCheckInData({ motivations: newMotivations });
    };

    const handleNext = () => {
        navigation.navigate('Step5_Reminder');
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollContainer}>
                <Text style={styles.title}>Why are you eating?</Text>

                {motivationSections.map(section => (
                    <View key={section.title} style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>{section.title}</Text>
                        <View style={styles.motivationsContainer}>
                            {section.reasons.map(option => (
                                <TouchableOpacity
                                    key={option}
                                    style={[styles.motivationTag, checkInData.motivations.includes(option) && styles.motivationTagSelected]}
                                    onPress={() => handleMotivationToggle(option)}
                                >
                                    <Text style={[styles.motivationTagText, checkInData.motivations.includes(option) && styles.motivationTagTextSelected]}>{option}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                ))}

                <Text style={styles.notesLabel}>Any other context? (Optional)</Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g., feeling tired after a long day..."
                    placeholderTextColor="#AAB8C2"
                    value={checkInData.notes}
                    onChangeText={(text) => updateCheckInData({ notes: text })}
                    multiline
                />
            </ScrollView>
            
            <View style={styles.footer}>
                <TouchableOpacity 
                    style={styles.nextButton}
                    onPress={handleNext}
                >
                    <Text style={styles.nextButtonText}>Next</Text>
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
        marginBottom: 30,
    },
    sectionContainer: {
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 20,
        fontFamily: 'serif',
        fontWeight: '600',
        color: '#4A5C4D',
        marginBottom: 15,
    },
    motivationsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
    },
    motivationTag: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 12,
        paddingHorizontal: 18,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        marginRight: 10,
        marginBottom: 10,
    },
    motivationTagSelected: {
        backgroundColor: '#4A5C4D',
        borderColor: '#4A5C4D',
    },
    motivationTagText: {
        color: '#4A5C4D',
        fontSize: 16,
    },
    motivationTagTextSelected: {
        color: '#FFFFFF',
    },
    notesLabel: {
        fontSize: 18,
        fontFamily: 'serif',
        color: '#4A5C4D',
        marginBottom: 15,
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
        minHeight: 120,
        textAlignVertical: 'top',
    },
    footer: {
        padding: 20,
        backgroundColor: '#F5F5E9',
    },
    nextButton: {
        backgroundColor: '#4A5C4D',
        paddingVertical: 18,
        borderRadius: 12,
        alignItems: 'center',
    },
    nextButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
}); 