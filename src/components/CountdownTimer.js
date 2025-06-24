import React, { useState, useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';

const CountdownTimer = ({ completionTime }) => {
    const calculateTimeLeft = () => {
        const expiryTime = new Date(completionTime).getTime();
        const difference = expiryTime - new Date().getTime();

        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }
        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearTimeout(timer);
    });

    if (!Object.keys(timeLeft).length) {
        return <Text style={styles.timerText}>Ready to complete!</Text>;
    }

    const timerText = 
        `${String(timeLeft.hours).padStart(2, '0')}:` +
        `${String(timeLeft.minutes).padStart(2, '0')}:` +
        `${String(timeLeft.seconds).padStart(2, '0')}`;

    return <Text style={styles.timerText}>Completes in: {timerText}</Text>;
};

const styles = StyleSheet.create({
    timerText: {
        fontSize: 14,
        color: '#FF6B6B',
        fontFamily: 'serif',
        textAlign: 'center',
        marginTop: 15,
    },
});

export default CountdownTimer; 