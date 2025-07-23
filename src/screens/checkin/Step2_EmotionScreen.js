import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { emotionMatrix } from '../../data/emotions';
import { BoltIcon, UserMinusIcon, QuestionMarkCircleIcon, FaceSmileIcon, MinusCircleIcon, FaceFrownIcon, FireIcon, BeakerIcon, MoonIcon } from 'react-native-heroicons/outline';
import { useCheckIn } from '../../context/CheckInContext';

const iconColor = '#4A5C4D';

const SelectionCard = ({ icon, label, onPress, style }) => (
    <TouchableOpacity style={[styles.card, style]} onPress={onPress}>
        {icon}
        <Text style={styles.cardText}>{label}</Text>
    </TouchableOpacity>
);

const GuidedDiscovery = ({ onComplete }) => {
    const [step, setStep] = useState(0);
    const [selections, setSelections] = useState({});

    const handleSelection = (key, value) => {
        const newSelections = { ...selections, [key]: value };
        setSelections(newSelections);
        if (step < 2) {
            setStep(step + 1);
        } else {
            const result = emotionMatrix.find(e => 
                e.state === newSelections.bodyState &&
                e.tone === newSelections.emotionTone &&
                e.energy === newSelections.energyLevel
            );
            onComplete(result ? result.words : []);
        }
    };

    const steps = [
        {
            title: "How does your body feel?",
            key: "bodyState",
            options: [
                { label: "Tense", icon: <BoltIcon color={iconColor} size={32}/> },
                { label: "Relaxed", icon: <UserMinusIcon color={iconColor} size={32}/> },
                { label: "Not Sure", icon: <QuestionMarkCircleIcon color={iconColor} size={32}/> },
            ],
        },
        {
            title: "What is your emotional tone?",
            key: "emotionTone",
            options: [
                { label: "Pleasant", icon: <FaceSmileIcon color={iconColor} size={32}/> },
                { label: "Neutral", icon: <MinusCircleIcon color={iconColor} size={32}/> },
                { label: "Unpleasant", icon: <FaceFrownIcon color={iconColor} size={32}/> },
            ],
        },
        {
            title: "What is your energy level?",
            key: "energyLevel",
            options: [
                { label: "High", icon: <FireIcon color={iconColor} size={32}/> },
                { label: "Moderate", icon: <BeakerIcon color={iconColor} size={32}/> },
                { label: "Low", icon: <MoonIcon color={iconColor} size={32}/> },
            ],
        },
    ];

    return (
        <View>
            <Text style={styles.stepTitle}>{steps[step].title}</Text>
            <View style={styles.cardContainer}>
                {steps[step].options.map(option => (
                    <SelectionCard 
                        key={option.label}
                        label={option.label}
                        icon={option.icon}
                        onPress={() => handleSelection(steps[step].key, option.label)}
                    />
                ))}
            </View>
        </View>
    );
};

export default function Step2_EmotionScreen({ navigation }) {
    const { checkInData, updateCheckInData } = useCheckIn();
    const [mode, setMode] = useState(null); // 'guided' or 'quick'
    const [emotionResult, setEmotionResult] = useState([]);
    
    const handleNext = () => {
        if (checkInData.emotions.length === 0) {
            Alert.alert("Emotion Required", "Please select at least one emotion to continue.");
            return;
        }
        navigation.navigate('CheckInStep3');
    };

    const handleEmotionToggle = (emotion) => {
        const newEmotions = checkInData.emotions.includes(emotion)
            ? checkInData.emotions.filter(e => e !== emotion)
            : [...checkInData.emotions, emotion];
        updateCheckInData({ emotions: newEmotions });
    };

    if (emotionResult.length > 0) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>You might be feeling...</Text>
                <View style={styles.resultsContainer}>
                    {emotionResult.map(emotion => (
                        <TouchableOpacity 
                            key={emotion}
                            style={[styles.emotionTag, checkInData.emotions.includes(emotion) && styles.emotionTagSelected]}
                            onPress={() => handleEmotionToggle(emotion)}
                        >
                            <Text style={[styles.emotionTagText, checkInData.emotions.includes(emotion) && styles.emotionTagTextSelected]}>{emotion}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                 <TouchableOpacity 
                    style={styles.nextButton}
                    onPress={handleNext}
                >
                    <Text style={styles.nextButtonText}>Next</Text>
                </TouchableOpacity>
            </View>
        )
    }

    if (!mode) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>How do you want to find your emotion?</Text>
                <SelectionCard label="Guided Discovery" onPress={() => setMode('guided')} style={styles.modeCard} />
                <SelectionCard label="Mood Meter" onPress={() => navigation.navigate('CheckInStep2a')} style={styles.modeCard}/>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {mode === 'guided' && <GuidedDiscovery onComplete={setEmotionResult} />}
        </View>
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
        marginBottom: 30,
    },
    stepTitle: {
        fontSize: 22,
        fontFamily: 'serif',
        color: '#4A5C4D',
        textAlign: 'center',
        marginBottom: 20,
    },
    modeCard: {
        marginBottom: 20,
        paddingVertical: 30,
    },
    disabledCard: {
        backgroundColor: '#E0E0E0',
        opacity: 0.6,
    },
    cardContainer: {
        
    },
    card: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        alignItems: 'center',
        marginBottom: 15,
    },
    cardText: {
        fontSize: 18,
        fontFamily: 'serif',
        color: iconColor,
        marginTop: 10,
    },
    resultsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: 30,
    },
    emotionTag: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        margin: 5,
    },
    emotionTagSelected: {
        backgroundColor: iconColor,
        borderColor: iconColor,
    },
    emotionTagText: {
        color: iconColor,
        fontSize: 16,
    },
    emotionTagTextSelected: {
        color: '#FFFFFF',
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
    groupContainer: {
        marginBottom: 20,
    },
    groupTitle: {
        fontSize: 20,
        fontFamily: 'serif',
        fontWeight: '600',
        color: '#4A5C4D',
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        paddingBottom: 5,
    },
}); 