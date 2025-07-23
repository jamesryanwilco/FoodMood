import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useCheckIn } from '../../context/CheckInContext';
import { moodMeterData } from '../../data/moodMeter';
import MoodMeterGrid from '../../components/MoodMeterGrid';
import MoodMeterSliders from '../../components/MoodMeterSliders';

export default function Phase2_Step1ba_MoodMeterScreen({ route, navigation }) {
    const { entryId } = route.params;
    const { updatePhase2Data } = useCheckIn();
    const [pleasantness, setPleasantness] = useState(5);
    const [energy, setEnergy] = useState(5);

    const selectedEmotion = useMemo(() => {
        return moodMeterData.find(e => e.pleasantness === pleasantness && e.energy === energy);
    }, [pleasantness, energy]);

    const handleSliderChange = (p, e) => {
        setPleasantness(p);
        setEnergy(e);
    };

    const handleCellPress = (item) => {
        setPleasantness(item.pleasantness);
        setEnergy(item.energy);
    };

    const handleNext = () => {
        if (!selectedEmotion) {
            Alert.alert("Selection Error", "Could not find a matching emotion.");
            return;
        }
        updatePhase2Data(entryId, { emotionsAfter: [selectedEmotion.word] });
        navigation.navigate('CompleteStep2', { entryId });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Select Your Mood Now</Text>
            
            <MoodMeterGrid 
                selectedValue={selectedEmotion} 
                onCellPress={handleCellPress}
            />
            
            <MoodMeterSliders 
                pleasantness={pleasantness} 
                energy={energy} 
                onValueChange={handleSliderChange} 
            />

            <View style={styles.selectionContainer}>
                <Text style={styles.selectionText}>
                    You have selected: 
                    <Text style={{ color: selectedEmotion?.color, fontWeight: 'bold' }}>
                        {` ${selectedEmotion?.word}`}
                    </Text>
                </Text>
            </View>

            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5E9',
        padding: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontFamily: 'serif',
        fontWeight: '600',
        color: '#4A5C4D',
        textAlign: 'center',
        marginBottom: 20,
    },
    selectionContainer: {
        marginTop: 10,
        padding: 15,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        width: '100%',
        alignItems: 'center',
    },
    selectionText: {
        fontSize: 18,
        fontFamily: 'serif',
        color: '#4A5C4D',
    },
    nextButton: {
        backgroundColor: '#4A5C4D',
        paddingVertical: 18,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 'auto',
        width: '100%',
    },
    nextButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
}); 