import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';

const MoodMeterSliders = ({ pleasantness, energy, onValueChange }) => {
    return (
        <View style={styles.container}>
            <View style={styles.sliderContainer}>
                <Text style={styles.label}>Pleasantness</Text>
                <Slider
                    style={styles.slider}
                    minimumValue={1}
                    maximumValue={10}
                    step={1}
                    value={pleasantness}
                    onValueChange={(value) => onValueChange(value, energy)}
                    minimumTrackTintColor="#2ECC71"
                    maximumTrackTintColor="#E74C3C"
                    thumbTintColor="#4A5C4D"
                />
            </View>
            <View style={styles.sliderContainer}>
                <Text style={styles.label}>Energy</Text>
                <Slider
                    style={styles.slider}
                    minimumValue={1}
                    maximumValue={10}
                    step={1}
                    value={energy}
                    onValueChange={(value) => onValueChange(pleasantness, value)}
                    minimumTrackTintColor="#3498DB"
                    maximumTrackTintColor="#F1C40F"
                    thumbTintColor="#4A5C4D"
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingVertical: 20,
    },
    sliderContainer: {
        marginBottom: 1, // Halved from 20
    },
    label: {
        fontSize: 18,
        fontFamily: 'serif',
        color: '#4A5C4D',
        textAlign: 'center',
        marginBottom: 10,
    },
    slider: {
        width: '100%',
        height: 40,
    },
});

export default MoodMeterSliders; 