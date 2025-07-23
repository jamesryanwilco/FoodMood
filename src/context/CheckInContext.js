import React, { createContext, useState, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CheckInContext = createContext();

export const useCheckIn = () => useContext(CheckInContext);

export const CheckInProvider = ({ children }) => {
    const [checkInData, setCheckInData] = useState({
        // Step 1
        date: new Date(),
        mealType: 'Breakfast',
        foodDescription: '',
        mealCompletionTime: new Date(new Date().getTime() + 60 * 60000).toISOString(), // Default to 60 mins
        notificationId: null,
        // Step 2
        emotions: [],
        // Step 3
        energyLevel: 5,
        hungerLevel: 5,
        // Step 4
        motivations: [],
        notes: '',
    });

    const updateCheckInData = (newData) => {
        setCheckInData(prevData => ({ ...prevData, ...newData }));
    };

    const resetCheckInData = () => {
        setCheckInData({
            date: new Date(),
            mealType: 'Breakfast',
            foodDescription: '',
            mealCompletionTime: new Date(new Date().getTime() + 60 * 60000).toISOString(),
            notificationId: null,
            emotions: [],
            energyLevel: 5,
            hungerLevel: 5,
            motivations: [],
            notes: '',
        });
    };

    const startNewCheckIn = () => {
        resetCheckInData();
    };

    const updatePhase2Data = async (entryId, newData) => {
        try {
            const existingEntries = await AsyncStorage.getItem('pending_entries');
            let entries = existingEntries ? JSON.parse(existingEntries) : [];
            
            const entryIndex = entries.findIndex(e => e.id === entryId);

            if (entryIndex === -1) {
                console.error('Could not find entry to update');
                return;
            }

            // Merge new data into the existing entry
            entries[entryIndex] = { ...entries[entryIndex], ...newData };

            await AsyncStorage.setItem('pending_entries', JSON.stringify(entries));
        } catch (e) {
            console.error("Failed to update phase 2 data:", e);
        }
    };

    const completeCheckIn = async (entryId, phase2Data) => {
        try {
            const existingEntries = await AsyncStorage.getItem('pending_entries');
            let entries = existingEntries ? JSON.parse(existingEntries) : [];
            
            const entryIndex = entries.findIndex(e => e.id === entryId);

            if (entryIndex === -1) {
                console.error('Could not find entry to complete');
                return;
            }

            const updatedEntry = {
                ...entries[entryIndex],
                ...phase2Data,
                status: 'completed',
                phase2_completed_at: new Date().toISOString(),
            };

            entries[entryIndex] = updatedEntry;

            await AsyncStorage.setItem('pending_entries', JSON.stringify(entries));
        } catch (e) {
            console.error("Failed to complete check-in:", e);
        }
    };

    const value = {
        checkInData,
        updateCheckInData,
        startNewCheckIn,
        resetCheckInData,
        completeCheckIn,
        updatePhase2Data,
    };

    return (
        <CheckInContext.Provider value={value}>
            {children}
        </CheckInContext.Provider>
    );
}; 