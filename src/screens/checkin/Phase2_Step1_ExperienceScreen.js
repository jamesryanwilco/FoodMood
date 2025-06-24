import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import { SparklesIcon, ClockIcon, Battery50Icon, FireIcon } from 'react-native-heroicons/outline';

const iconColor = '#4A5C4D';

const LevelGauge = ({ label, icon, value, onValueChange, minimumTrackTintColor, maximumTrackTintColor }) => (
    <View style={styles.gaugeContainer}>
        <View style={styles.gaugeHeader}>
            {icon}
            <Text style={styles.gaugeLabel}>{label}</Text>
        </View>
        <Slider
            style={styles.slider}
            value={value}
            onValueChange={onValueChange}
            minimumValue={0}
            maximumValue={10}
            step={1}
            minimumTrackTintColor={minimumTrackTintColor}
            maximumTrackTintColor={maximumTrackTintColor}
            thumbTintColor={iconColor}
        />
        <Text style={styles.gaugeValue}>{Math.round(value)}</Text>
    </View>
);

export default function Phase2_Step1_ExperienceScreen({ navigation, route }) {
    const { entryId } = route.params;
    const [mindfulness, setMindfulness] = useState(5);
    const [eatingSpeed, setEatingSpeed] = useState(5);
    const [energy, setEnergy] = useState(5);
    const [fullness, setFullness] = useState(5);

    const handleNext = () => {
        const experienceData = { mindfulness, eatingSpeed, energy, fullness };
        navigation.navigate('CompleteStep1a', { entryId, experienceData });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>How was the experience?</Text>

            <LevelGauge
                label="Mindfulness"
                icon={<SparklesIcon size={32} color={iconColor} />}
                value={mindfulness}
                onValueChange={setMindfulness}
                minimumTrackTintColor="#8E44AD"
                maximumTrackTintColor="#E0E0E0"
            />
            <LevelGauge
                label="Eating Speed"
                icon={<ClockIcon size={32} color={iconColor} />}
                value={eatingSpeed}
                onValueChange={setEatingSpeed}
                minimumTrackTintColor="#3498DB"
                maximumTrackTintColor="#E0E0E0"
            />
            <LevelGauge
                label="Energy"
                icon={<Battery50Icon size={32} color={iconColor} />}
                value={energy}
                onValueChange={setEnergy}
                minimumTrackTintColor="#4CAF50"
                maximumTrackTintColor="#D32F2F"
            />
            <LevelGauge
                label="Fullness"
                icon={<FireIcon size={32} color={iconColor} />}
                value={fullness}
                onValueChange={setFullness}
                minimumTrackTintColor="#FFC107"
                maximumTrackTintColor="#E0E0E0"
            />
            
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
        paddingTop: 80,
        justifyContent: 'center',
    },
    title: {
        fontSize: 28,
        fontFamily: 'serif',
        fontWeight: '600',
        color: '#4A5C4D',
        textAlign: 'center',
        marginBottom: 40,
    },
    gaugeContainer: {
        marginBottom: 30,
        alignItems: 'center',
    },
    gaugeHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    gaugeLabel: {
        fontSize: 20,
        fontFamily: 'serif',
        color: iconColor,
        marginLeft: 10,
    },
    slider: {
        width: '100%',
        height: 40,
    },
    gaugeValue: {
        fontSize: 18,
        fontFamily: 'serif',
        color: iconColor,
        marginTop: 5,
    },
    nextButton: {
        backgroundColor: '#4A5C4D',
        paddingVertical: 18,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20,
    },
    nextButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
}); 