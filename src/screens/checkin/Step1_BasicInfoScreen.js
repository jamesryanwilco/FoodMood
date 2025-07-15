import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Platform, Alert, Keyboard, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SunIcon, MoonIcon, SwatchIcon, BellAlertIcon } from 'react-native-heroicons/outline';
import { useCheckIn } from '../../context/CheckInContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const iconColor = '#4A5C4D';

const MealTypeButton = ({ icon, label, selected, onPress }) => (
    <TouchableOpacity style={[styles.mealButton, selected && styles.mealButtonSelected]} onPress={onPress}>
        {icon}
        <Text style={[styles.mealButtonText, selected && styles.mealButtonTextSelected]}>{label}</Text>
    </TouchableOpacity>
);

export default function Step1_BasicInfoScreen({ navigation }) {
    const { checkInData, updateCheckInData } = useCheckIn();
    const [showDatePicker, setShowDatePicker] = useState(Platform.OS === 'ios');
    const [pastMeals, setPastMeals] = useState([]);
    const [isInputFocused, setIsInputFocused] = useState(false);
    
    useEffect(() => {
        const fetchPastMeals = async () => {
            const entriesString = await AsyncStorage.getItem('pending_entries');
            const entries = entriesString ? JSON.parse(entriesString) : [];
            
            const descriptions = entries
                .filter(e => e.status === 'completed' && e.foodDescription)
                .map(e => e.foodDescription);

            const frequencies = descriptions.reduce((acc, curr) => {
                acc[curr] = (acc[curr] || 0) + 1;
                return acc;
            }, {});

            const sortedMeals = Object.keys(frequencies).sort((a, b) => frequencies[b] - frequencies[a]);
            setPastMeals(sortedMeals);
        };
        fetchPastMeals();
    }, []);

    const suggestions = useMemo(() => {
        const searchText = checkInData.foodDescription.toLowerCase();
        if (searchText.length > 0) {
            return pastMeals.filter(meal => 
                meal.toLowerCase().includes(searchText)
            ).slice(0, 8); // Capped for performance
        } else {
            return pastMeals.slice(0, 5); // Show top 5 most frequent meals by default
        }
    }, [checkInData.foodDescription, pastMeals]);

    const handleNext = () => {
        if (!checkInData.foodDescription.trim()) {
            Alert.alert("Description Required", "Please describe your meal before proceeding.");
            return;
        }
        navigation.navigate('CheckInStep2');
    };

    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || checkInData.date;
        if (Platform.OS === 'android') {
            setShowDatePicker(false);
        }
        updateCheckInData({ date: currentDate });
    };

    const handleDescriptionChange = (text) => {
        updateCheckInData({ foodDescription: text });
    };
    
    const onSuggestionPress = (suggestion) => {
        updateCheckInData({ foodDescription: suggestion });
        setIsInputFocused(false);
        Keyboard.dismiss();
    };

    const mealTypes = [
        { label: 'Breakfast', icon: <SunIcon color={checkInData.mealType === 'Breakfast' ? '#FFFFFF' : iconColor} /> },
        { label: 'Lunch', icon: <SwatchIcon color={checkInData.mealType === 'Lunch' ? '#FFFFFF' : iconColor} /> },
        { label: 'Dinner', icon: <MoonIcon color={checkInData.mealType === 'Dinner' ? '#FFFFFF' : iconColor} /> },
        { label: 'Snack', icon: <BellAlertIcon color={checkInData.mealType === 'Snack' ? '#FFFFFF' : iconColor} /> },
    ];

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollContainer} keyboardShouldPersistTaps="always">
                <Text style={styles.title}>What are you about to eat?</Text>

                {Platform.OS === 'android' && (
                    <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
                        <Text style={styles.dateButtonText}>{checkInData.date.toLocaleString()}</Text>
                    </TouchableOpacity>
                )}
                {showDatePicker && (
                    <DateTimePicker
                        value={checkInData.date}
                        mode="datetime"
                        display="default"
                        onChange={onDateChange}
                        style={styles.datePicker}
                    />
                )}

                <View style={styles.mealTypeContainer}>
                    {mealTypes.map(meal => (
                        <MealTypeButton
                            key={meal.label}
                            icon={meal.icon}
                            label={meal.label}
                            selected={checkInData.mealType === meal.label}
                            onPress={() => updateCheckInData({ mealType: meal.label })}
                        />
                    ))}
                </View>

                <TextInput
                    style={styles.input}
                    placeholder="Describe your meal..."
                    placeholderTextColor="#AAB8C2"
                    value={checkInData.foodDescription}
                    onChangeText={handleDescriptionChange}
                    onFocus={() => setIsInputFocused(true)}
                    onBlur={() => setIsInputFocused(false)}
                />
                {isInputFocused && suggestions.length > 0 && (
                    <View style={styles.suggestionsContainer}>
                        {suggestions.map(item => (
                            <TouchableOpacity 
                                key={item}
                                style={styles.suggestionItem} 
                                onPress={() => onSuggestionPress(item)}
                            >
                                <Text style={styles.suggestionText}>{item}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
                
                <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                    <Text style={styles.nextButtonText}>Next</Text>
                </TouchableOpacity>
            </ScrollView>
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
    },
    title: {
        fontSize: 28,
        fontFamily: 'serif',
        fontWeight: '600',
        color: '#4A5C4D',
        textAlign: 'center',
        marginTop: 40,
        marginBottom: 30,
    },
    dateButton: {
        backgroundColor: '#FFFFFF',
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 20,
    },
    dateButtonText: {
        fontSize: 16,
        color: iconColor,
    },
    datePicker: {
        marginBottom: 20,
        alignSelf: 'center',
    },
    mealTypeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 30,
    },
    mealButton: {
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 5,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        width: 85,
        minHeight: 70,
    },
    mealButtonSelected: {
        backgroundColor: iconColor,
    },
    mealButtonText: {
        marginTop: 5,
        color: iconColor,
        fontFamily: 'serif',
        fontSize: 13,
        textAlign: 'center',
    },
    mealButtonTextSelected: {
        color: '#FFFFFF',
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
        minHeight: 100,
        textAlignVertical: 'top',
    },
    suggestionsContainer: {
        maxHeight: 150,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderTopWidth: 0,
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
    },
    suggestionItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    suggestionText: {
        fontSize: 16,
        color: '#4A5C4D',
    },
    nextButton: {
        backgroundColor: '#4A5C4D',
        paddingVertical: 18,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 30,
    },
    nextButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
}); 