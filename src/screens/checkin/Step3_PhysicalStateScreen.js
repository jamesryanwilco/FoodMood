import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import { Battery50Icon, FireIcon } from 'react-native-heroicons/outline';
import { useCheckIn } from '../../context/CheckInContext';

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

export default function Step3_PhysicalStateScreen({ navigation }) {
    const { checkInData, updateCheckInData } = useCheckIn();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>How's your physical state?</Text>
            
            <LevelGauge
                label="Energy Level"
                icon={<Battery50Icon size={32} color={iconColor} />}
                value={checkInData.energyLevel}
                onValueChange={(value) => updateCheckInData({ energyLevel: value })}
                minimumTrackTintColor="#4CAF50"
                maximumTrackTintColor="#D32F2F"
            />

            <LevelGauge
                label="Hunger Level"
                icon={<FireIcon size={32} color={iconColor} />}
                value={checkInData.hungerLevel}
                onValueChange={(value) => updateCheckInData({ hungerLevel: value })}
                minimumTrackTintColor="#FFC107"
                maximumTrackTintColor="#E0E0E0"
            />
            
            <TouchableOpacity 
                style={styles.nextButton}
                onPress={() => navigation.navigate('CheckInStep4')}
            >
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
        paddingTop: 100,
        justifyContent: 'center',
    },
    title: {
        fontSize: 28,
        fontFamily: 'serif',
        fontWeight: '600',
        color: '#4A5C4D',
        textAlign: 'center',
        marginBottom: 60,
    },
    gaugeContainer: {
        marginBottom: 50,
        alignItems: 'center',
    },
    gaugeHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    gaugeLabel: {
        fontSize: 22,
        fontFamily: 'serif',
        color: iconColor,
        marginLeft: 10,
    },
    slider: {
        width: '100%',
        height: 40,
    },
    gaugeValue: {
        fontSize: 20,
        fontFamily: 'serif',
        color: iconColor,
        marginTop: 10,
    },
    nextButton: {
        backgroundColor: '#4A5C4D',
        paddingVertical: 18,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 40,
    },
    nextButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
}); 