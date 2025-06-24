import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useCheckIn } from '../../context/CheckInContext';

const motivationOptions = [
    'Hunger', 'Stress', 'Celebration', 'Boredom', 'Craving', 
    'Social', 'Habit', 'Sadness', 'Tiredness', 'Routine', 'Energy', 'Performance'
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
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Why are you eating?</Text>

            <View style={styles.motivationsContainer}>
                {motivationOptions.map(option => (
                    <TouchableOpacity
                        key={option}
                        style={[styles.motivationTag, checkInData.motivations.includes(option) && styles.motivationTagSelected]}
                        onPress={() => handleMotivationToggle(option)}
                    >
                        <Text style={[styles.motivationTagText, checkInData.motivations.includes(option) && styles.motivationTagTextSelected]}>{option}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <Text style={styles.notesLabel}>Any other context? (Optional)</Text>
            <TextInput
                style={styles.input}
                placeholder="e.g., feeling tired after a long day..."
                placeholderTextColor="#AAB8C2"
                value={checkInData.notes}
                onChangeText={(text) => updateCheckInData({ notes: text })}
                multiline
            />
            
            <TouchableOpacity 
                style={styles.nextButton}
                onPress={handleNext}
            >
                <Text style={styles.nextButtonText}>Next</Text>
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
        marginBottom: 30,
    },
    motivationsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: 40,
    },
    motivationTag: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 12,
        paddingHorizontal: 18,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        margin: 6,
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
        marginBottom: 30,
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