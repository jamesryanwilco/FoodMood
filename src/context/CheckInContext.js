import React, { createContext, useState, useContext } from 'react';

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

    const value = {
        checkInData,
        updateCheckInData,
        resetCheckInData,
    };

    return (
        <CheckInContext.Provider value={value}>
            {children}
        </CheckInContext.Provider>
    );
}; 