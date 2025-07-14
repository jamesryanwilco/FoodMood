import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Phase2_Step2_GoalScreen({ navigation, route }) {
    const { entryId, experienceData } = route.params;
    const [fulfilled, setFulfilled] = useState(null); // 'Yes', 'Partly', 'No'
    const [notes, setNotes] = useState('');
    const [originalMotivations, setOriginalMotivations] = useState([]);

    useEffect(() => {
        const loadOriginalReason = async () => {
            try {
                const storedEntries = await AsyncStorage.getItem('pending_entries');
                if (storedEntries) {
                    const entries = JSON.parse(storedEntries);
                    const entry = entries.find(e => e.id === entryId);
                    if (entry && entry.motivations) {
                        setOriginalMotivations(entry.motivations);
                    }
                }
            } catch (e) {
                console.error('Failed to load original motivations.', e);
            }
        };
        loadOriginalReason();
    }, [entryId]);

    const handleFinish = async () => {
        if (fulfilled === null) {
            Alert.alert("Selection Required", "Please select whether the meal fulfilled your original reason.");
            return;
        }
        try {
            const existingEntries = await AsyncStorage.getItem('pending_entries');
            let entries = existingEntries ? JSON.parse(existingEntries) : [];
            
            const entryIndex = entries.findIndex(e => e.id === entryId);
            if (entryIndex === -1) throw new Error("Entry not found");

            const entryToComplete = entries[entryIndex];
            
            const updatedEntry = {
                ...entryToComplete,
                ...experienceData,
                goalFulfilled: fulfilled,
                completionNotes: notes,
                status: 'completed',
                phase2_completed_at: new Date().toISOString(),
            };

            entries[entryIndex] = updatedEntry;

            await AsyncStorage.setItem('pending_entries', JSON.stringify(entries));
            
            Alert.alert('Entry Complete!', 'Your meal entry has been successfully completed.', [
                { text: 'OK', onPress: () => navigation.navigate('Main', { screen: 'Entries' }) }
            ]);

        } catch (e) {
            Alert.alert('Error', 'Failed to complete the entry.');
            console.error(e);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Did it fulfill your original reason?</Text>

            {originalMotivations.length > 0 && (
                <View style={styles.reasonContainer}>
                    <Text style={styles.reasonTitle}>Your original reason was:</Text>
                    {originalMotivations.map((reason, index) => (
                        <Text key={index} style={styles.reasonText}>• {reason}</Text>
                    ))}
                </View>
            )}

            <View style={styles.optionsContainer}>
                {['Yes', 'Partly', 'No'].map(option => (
                    <TouchableOpacity
                        key={option}
                        style={[styles.optionButton, fulfilled === option && styles.optionButtonSelected]}
                        onPress={() => setFulfilled(option)}
                    >
                        <Text style={[styles.optionButtonText, fulfilled === option && styles.optionButtonTextSelected]}>{option}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <Text style={styles.notesLabel}>Any other context? (Optional)</Text>
            <TextInput
                style={styles.input}
                placeholder="e.g., It helped with hunger but made me feel tired..."
                placeholderTextColor="#AAB8C2"
                value={notes}
                onChangeText={setNotes}
                multiline
            />
            
            <TouchableOpacity style={styles.finishButton} onPress={handleFinish}>
                <Text style={styles.finishButtonText}>Finish & Complete Entry</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5E9',
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontFamily: 'serif',
        fontWeight: '600',
        color: '#4A5C4D',
        textAlign: 'center',
        marginBottom: 40,
    },
    reasonContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 20,
        marginBottom: 30,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    reasonTitle: {
        fontSize: 18,
        fontFamily: 'serif',
        fontWeight: '600',
        color: '#4A5C4D',
        marginBottom: 10,
    },
    reasonText: {
        fontSize: 16,
        fontFamily: 'serif',
        color: '#4A5C4D',
        marginBottom: 5,
    },
    optionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 40,
    },
    optionButton: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    optionButtonSelected: {
        backgroundColor: '#4A5C4D',
        borderColor: '#4A5C4D',
    },
    optionButtonText: {
        fontSize: 18,
        fontFamily: 'serif',
        color: '#4A5C4D',
    },
    optionButtonTextSelected: {
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
    finishButton: {
        backgroundColor: '#4CAF50',
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