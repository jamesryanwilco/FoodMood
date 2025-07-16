import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { useCheckIn } from '../context/CheckInContext';
import { trackEvent } from '../services/AnalyticsService';

const iconColor = '#4A5C4D';
const circleSize = 280;
const strokeWidth = 25;
const radius = (circleSize - strokeWidth) / 2;
const circumference = radius * 2 * Math.PI;

export default function CheckInScreen() {
    const navigation = useNavigation();
    const { pendingEntries, startNewCheckIn } = useCheckIn();

    const handleStartNew = () => {
        trackEvent('Check-In Started');
        startNewCheckIn();
        navigation.navigate('CheckInStep1');
    };
    
    const handleComplete = (entryId) => {
        // This function is not defined in the original file, so it's not included in the new_code.
        // It's kept as is to avoid introducing unrelated changes.
    };

    const spinValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const startAnimation = () => {
            spinValue.setValue(0);
            Animated.timing(spinValue, {
                toValue: 1,
                duration: 20000,
                easing: Easing.linear,
                useNativeDriver: true,
            }).start(({ finished }) => {
                if (finished) {
                    startAnimation();
                }
            });
        };
        startAnimation();
        
        return () => {
            spinValue.stopAnimation();
        };
    }, [spinValue]);

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>How are you feeling?</Text>
                
                <View style={styles.circleContainer}>
                    <Animated.View style={{ transform: [{ rotate: spin }] }}>
                        <Svg width={circleSize} height={circleSize} style={{ transform: [{ rotate: '-90deg' }]}}>
                            <Defs>
                                <LinearGradient id="grad" x1="1" y1="1" x2="0" y2="0">
                                    <Stop offset="0" stopColor="#FFC1CC" stopOpacity="1" />
                                    <Stop offset="1" stopColor="#FF6B6B" stopOpacity="1" />
                                </LinearGradient>
                            </Defs>
                            <Circle
                                stroke="url(#grad)"
                                fill="none"
                                cx={circleSize / 2}
                                cy={circleSize / 2}
                                r={radius}
                                strokeWidth={strokeWidth}
                                strokeDasharray={circumference}
                                strokeDashoffset={circumference * 0.25} // Example: 75% progress
                                strokeLinecap="round"
                            />
                        </Svg>
                    </Animated.View>
                    <TouchableOpacity 
                        style={styles.checkInButton}
                        onPress={handleStartNew}
                    >
                        <Text style={styles.checkInButtonText}>+</Text>
                        <Text style={styles.checkInButtonSubText}>Check In</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.footer}></View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5E9',
        justifyContent: 'space-between',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 36,
        fontFamily: 'serif',
        color: '#4A5C4D',
        textAlign: 'center',
        marginBottom: 60,
    },
    circleContainer: {
        width: circleSize,
        height: circleSize,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkInButton: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
    },
    checkInButtonText: {
        fontSize: 48,
        color: '#4A5C4D',
        fontWeight: '200',
        lineHeight: 50,
    },
    checkInButtonSubText: {
        fontSize: 18,
        color: '#4A5C4D',
        fontFamily: 'serif',
    },
    footer: {
        height: 80, // To reserve space for tab bar
    },
}); 