import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ScrollView, Modal, Platform, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import StyledSegmentedControl from '../components/StyledSegmentedControl';
import { TrashIcon, SunIcon, MoonIcon, SwatchIcon, BellAlertIcon, ArrowLeftIcon, ArrowRightIcon, PencilIcon } from 'react-native-heroicons/outline';
import { getWeek, startOfWeek, endOfWeek, format, subWeeks, addWeeks, addMinutes, differenceInSeconds } from 'date-fns';
import DateTimePicker from '@react-native-community/datetimepicker';

const iconColor = '#4A5C4D';

const MealIcon = ({ mealType, size = 22, color = "#4A5C4D" }) => {
    switch(mealType) {
        case 'Breakfast': return <SunIcon size={size} color={color} />;
        case 'Lunch': return <SwatchIcon size={size} color={color} />;
        case 'Dinner': return <MoonIcon size={size} color={color} />;
        case 'Snack': return <BellAlertIcon size={size} color={color} />;
        default: return null;
    }
};

const MealTypeButton = ({ icon, label, selected, onPress }) => (
    <TouchableOpacity style={[styles.mealButton, selected && styles.mealButtonSelected]} onPress={onPress}>
        {icon}
        <Text style={[styles.mealButtonText, selected && styles.mealButtonTextSelected]}>{label}</Text>
    </TouchableOpacity>
);

export default function EntriesScreen({ navigation }) {
    const [pendingEntries, setPendingEntries] = useState([]);
    const [completedEntries, setCompletedEntries] = useState([]);
    const [selectedTabIndex, setSelectedTabIndex] = useState(0);
    const [currentWeek, setCurrentWeek] = useState(new Date());
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingEntry, setEditingEntry] = useState(null);
    const [editedDate, setEditedDate] = useState(new Date());
    const [editedMealType, setEditedMealType] = useState('');
    const [editedFoodDescription, setEditedFoodDescription] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(Platform.OS === 'ios');
    const [timeRemaining, setTimeRemaining] = useState({});

    const fetchAllEntries = async () => {
        try {
            const existingEntries = await AsyncStorage.getItem('pending_entries');
            const entries = existingEntries ? JSON.parse(existingEntries) : [];

            const pending = entries.filter(e => e.status === 'pending');
            pending.sort((a, b) => new Date(b.phase1_completed_at) - new Date(a.phase1_completed_at));
            setPendingEntries(pending);

            setCompletedEntries(entries.filter(e => e.status === 'completed'));
        } catch (e) {
            console.error("Failed to fetch entries.", e);
        }
    };

    useFocusEffect(useCallback(() => { fetchAllEntries(); }, []));

    useEffect(() => {
        const calculateTimeRemaining = () => {
            const newTimeRemaining = {};
            pendingEntries.forEach(entry => {
                const completionTime = addMinutes(new Date(entry.phase1_completed_at), entry.reminder_minutes || 0);
                const secondsLeft = differenceInSeconds(completionTime, new Date());
                newTimeRemaining[entry.id] = secondsLeft > 0 ? secondsLeft : 0;
            });
            setTimeRemaining(newTimeRemaining);
        };

        calculateTimeRemaining(); // Initial calculation
        const timer = setInterval(calculateTimeRemaining, 1000); // Update every second

        return () => clearInterval(timer);
    }, [pendingEntries]);

    const handleDelete = async (id) => {
        try {
            let existingEntries = await AsyncStorage.getItem('pending_entries');
            let entries = existingEntries ? JSON.parse(existingEntries) : [];
            
            entries = entries.filter(entry => entry.id !== id);
            await AsyncStorage.setItem('pending_entries', JSON.stringify(entries));
            fetchAllEntries();
        } catch (e) {
            Alert.alert("Error", "Failed to delete the entry.");
        }
    };

    const confirmDelete = (id) => Alert.alert( "Delete Entry", "Are you sure you want to delete this entry?",
        [ { text: "Cancel", style: "cancel" }, { text: "Delete", style: "destructive", onPress: () => handleDelete(id) } ]
    );

    const handleStartEdit = (entry) => {
        setEditingEntry(entry);
        setEditedDate(new Date(entry.phase2_completed_at));
        setEditedMealType(entry.mealType);
        setEditedFoodDescription(entry.foodDescription);
        setShowDatePicker(Platform.OS === 'ios');
        setIsModalVisible(true);
    };

    const handleSaveEdit = async () => {
        if (!editingEntry) return;

        try {
            const existingEntriesJSON = await AsyncStorage.getItem('pending_entries');
            let entries = existingEntriesJSON ? JSON.parse(existingEntriesJSON) : [];

            const updatedEntries = entries.map(entry => {
                if (entry.id === editingEntry.id) {
                    return {
                        ...entry,
                        phase2_completed_at: editedDate.toISOString(),
                        date: editedDate.toISOString(),
                        mealType: editedMealType,
                        foodDescription: editedFoodDescription,
                    };
                }
                return entry;
            });

            await AsyncStorage.setItem('pending_entries', JSON.stringify(updatedEntries));
            
            setIsModalVisible(false);
            setEditingEntry(null);
            await fetchAllEntries();
        } catch (e) {
            Alert.alert("Error", "Failed to save changes.");
            console.error("Failed to save entry.", e);
        }
    };

    const weeklyGroupedEntries = useMemo(() => {
        const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
        const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });

        const filteredEntries = completedEntries.filter(entry => {
            const entryDate = new Date(entry.phase2_completed_at);
            return entryDate >= weekStart && entryDate <= weekEnd;
        });

        return filteredEntries.sort((a, b) => new Date(b.phase2_completed_at) - new Date(a.phase2_completed_at));
    }, [completedEntries, currentWeek]);

    const renderPendingItem = ({ item }) => {
        const remainingSeconds = timeRemaining[item.id] || 0;
        const minutes = Math.floor(remainingSeconds / 60);
        const seconds = Math.floor(remainingSeconds % 60);
        const timeLeft = remainingSeconds > 0 ? `${minutes}m ${seconds}s left` : 'Due now';
        const formattedDate = format(new Date(item.phase1_completed_at), 'd MMM yy, HH:mm');
    
        return (
            <View style={styles.entryCard}>
                <View style={styles.entryHeader}>
                    <Text style={styles.mealType}>{item.mealType}</Text>
                    <Text style={styles.entryDate}>{formattedDate}</Text>
                </View>
                <Text style={styles.foodDescription}>{item.foodDescription || "No description."}</Text>
                <View style={styles.timerContainer}>
                    <Text style={styles.timerText}>{timeLeft}</Text>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={() => confirmDelete(item.id)}>
                        <Text style={[styles.buttonText, styles.deleteButtonText]}>Delete</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, styles.completeButton]} onPress={() => navigation.navigate('CompleteStep1', { entryId: item.id })}>
                        <Text style={styles.buttonText}>Complete Meal</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    const renderCompletedItem = ({ item }) => {
        const beforeMood = item.emotions[0];
        const afterMood = item.emotionsAfter ? item.emotionsAfter[0] : 'N/A'; 

        const completionDate = new Date(item.phase2_completed_at);
        const dateString = completionDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const dayString = completionDate.toLocaleDateString('en-US', { weekday: 'short' });

        return (
            <View style={styles.entryCard}>
                <View style={styles.cardTopContainer}>
                    <View style={styles.dateContainer}>
                        <Text style={styles.dateText}>{dayString}</Text>
                        <Text style={styles.dayText}>{dateString}</Text>
                    </View>
                    <View style={styles.mainContentContainer}>
                        <View style={styles.entryHeader}>
                           <View style={{flexDirection: 'row', alignItems: 'center'}}>
                               <MealIcon mealType={item.mealType} />
                               <Text style={styles.mealType}>{item.mealType}</Text>
                           </View>
                           <View style={styles.iconActionsContainer}>
                                <TouchableOpacity onPress={() => handleStartEdit(item)} style={styles.iconButton}>
                                    <PencilIcon size={22} color="#4A5C4D" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => confirmDelete(item.id)}>
                                    <TrashIcon size={22} color="#FF6B6B" />
                                </TouchableOpacity>
                           </View>
                       </View>
                       <Text style={styles.foodDescription}>{item.foodDescription}</Text>
                       {item.motivations?.length > 0 && (
                            <View style={styles.motivationsContainer}>
                                {item.motivations.map(motivation => (
                                    <View key={motivation} style={styles.motivationTag}>
                                        <Text style={styles.motivationTagText}>{motivation}</Text>
                                    </View>
                                ))}
                            </View>
                       )}
                    </View>
                </View>
                
                <View style={styles.comparisonGrid}>
                    <View style={styles.comparisonItem}>
                        <Text style={styles.comparisonLabel}>Energy</Text>
                        <Text style={styles.comparisonValue}>{item.energyLevel} → {item.energy}</Text>
                    </View>
                    <View style={styles.comparisonItem}>
                        <Text style={styles.comparisonLabel}>Mood</Text>
                        <Text style={styles.comparisonValue}>{beforeMood} → {afterMood}</Text>
                    </View>
                </View>
            </View>
        );
    };

    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || editedDate;
        if (Platform.OS === 'android') {
            setShowDatePicker(false);
        }
        setEditedDate(currentDate);
    };

    const mealTypes = [
        { label: 'Breakfast', icon: <SunIcon color={editedMealType === 'Breakfast' ? '#FFFFFF' : iconColor} /> },
        { label: 'Lunch', icon: <SwatchIcon color={editedMealType === 'Lunch' ? '#FFFFFF' : iconColor} /> },
        { label: 'Dinner', icon: <MoonIcon color={editedMealType === 'Dinner' ? '#FFFFFF' : iconColor} /> },
        { label: 'Snack', icon: <BellAlertIcon color={editedMealType === 'Snack' ? '#FFFFFF' : iconColor} /> },
    ];

    const weekLabel = `Week of ${format(startOfWeek(currentWeek, { weekStartsOn: 1 }), 'MMM d')}`;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>My Entries</Text>
            <StyledSegmentedControl
                values={['Pending', 'Completed']}
                selectedIndex={selectedTabIndex}
                onChange={(event) => setSelectedTabIndex(event.nativeEvent.selectedSegmentIndex)}
            />
            {selectedTabIndex === 0 ? (
                <FlatList
                    data={pendingEntries}
                    renderItem={renderPendingItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={<View style={styles.emptyContainer}><Text style={styles.emptyText}>No pending entries.</Text></View>}
                />
            ) : (
                <>
                    <View style={styles.weekNavigator}>
                        <TouchableOpacity onPress={() => setCurrentWeek(subWeeks(currentWeek, 1))}>
                            <ArrowLeftIcon size={24} color="#4A5C4D" />
                        </TouchableOpacity>
                        <Text style={styles.weekLabel}>{weekLabel}</Text>
                        <TouchableOpacity onPress={() => setCurrentWeek(addWeeks(currentWeek, 1))}>
                            <ArrowRightIcon size={24} color="#4A5C4D" />
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={weeklyGroupedEntries}
                        renderItem={renderCompletedItem}
                        keyExtractor={item => item.id}
                        contentContainerStyle={styles.list}
                        ListEmptyComponent={<View style={styles.emptyContainer}><Text style={styles.emptyText}>No entries for this week.</Text></View>}
                    />
                </>
            )}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => {
                    setIsModalVisible(!isModalVisible);
                    setEditingEntry(null);
                }}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>Modify Entry</Text>
                        
                        {Platform.OS === 'android' && (
                            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
                                <Text style={styles.dateButtonText}>{editedDate.toLocaleString()}</Text>
                            </TouchableOpacity>
                        )}
                        {showDatePicker && (
                            <DateTimePicker
                                value={editedDate}
                                mode="datetime"
                                display="default"
                                onChange={onDateChange}
                                style={{marginBottom: 10, alignSelf: 'center'}}
                            />
                        )}

                        <View style={styles.mealTypeContainer}>
                            {mealTypes.map(meal => (
                                <MealTypeButton
                                    key={meal.label}
                                    icon={meal.icon}
                                    label={meal.label}
                                    selected={editedMealType === meal.label}
                                    onPress={() => setEditedMealType(meal.label)}
                                />
                            ))}
                        </View>

                        <TextInput
                            style={styles.input}
                            value={editedFoodDescription}
                            onChangeText={setEditedFoodDescription}
                            multiline
                            placeholder="Describe your meal..."
                        />

                        <View style={styles.modalButtonContainer}>
                            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setIsModalVisible(false)}>
                                <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSaveEdit}>
                                <Text style={styles.buttonText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F5E9', padding: 20, paddingTop: 80 },
    title: { fontSize: 28, fontFamily: 'serif', fontWeight: '600', color: '#4A5C4D', textAlign: 'center', marginBottom: 20 },
    segmentedControl: { marginBottom: 20 },
    list: { paddingBottom: 20 },
    entryCard: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 20, marginBottom: 15, borderWidth: 1, borderColor: '#E0E0E0' },
    cardTopContainer: {
        flexDirection: 'row',
        marginBottom: 15,
    },
    dateContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingRight: 15,
        borderRightWidth: 1,
        borderColor: '#E0E0E0',
        minWidth: 70,
    },
    dateText: {
        fontSize: 18,
        fontFamily: 'serif',
        fontWeight: '600',
        color: '#4A5C4D',
    },
    dayText: {
        fontSize: 14,
        color: '#AAB8C2',
    },
    mainContentContainer: {
        flex: 1,
        paddingLeft: 15,
    },
    entryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
    iconActionsContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    iconButton: {
        marginRight: 15,
    },
    mealType: { fontSize: 18, fontFamily: 'serif', fontWeight: '600', color: '#4A5C4D', marginLeft: 8 },
    foodDescription: { fontSize: 16, color: '#4A5C4D', marginBottom: 10 },
    timerContainer: {
        backgroundColor: '#F5F5E9',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 12,
        alignItems: 'center',
        marginBottom: 15,
    },
    timerText: {
        color: iconColor,
        fontSize: 16,
        fontFamily: 'serif',
        fontWeight: '600',
    },
    buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 },
    button: { paddingVertical: 12, borderRadius: 8, alignItems: 'center', width: '48%' },
    completeButton: { backgroundColor: '#4CAF50' },
    deleteButton: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#FF6B6B' },
    buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
    deleteButtonText: { color: '#FF6B6B' },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 50 },
    emptyText: { fontSize: 18, color: '#AAB8C2', fontFamily: 'serif' },
    comparisonGrid: {
        borderTopWidth: 1,
        borderColor: '#E0E0E0',
        paddingTop: 15,
    },
    comparisonItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    comparisonLabel: {
        fontSize: 16,
        fontFamily: 'serif',
        color: '#4A5C4D',
        fontWeight: '600',
    },
    comparisonValue: {
        fontSize: 16,
        fontFamily: 'serif',
        color: '#4A5C4D',
    },
    weekNavigator: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        marginBottom: 10,
    },
    weekLabel: {
        fontSize: 18,
        fontFamily: 'serif',
        fontWeight: '600',
        color: '#4A5C4D',
    },
    motivationsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    motivationTag: {
        backgroundColor: '#F5F5E9',
        borderRadius: 8,
        paddingVertical: 4,
        paddingHorizontal: 10,
        marginRight: 6,
        marginBottom: 6,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    motivationTagText: {
        color: '#4A5C4D',
        fontSize: 12,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '90%',
    },
    modalTitle: {
        fontSize: 24,
        fontFamily: 'serif',
        fontWeight: '600',
        color: '#4A5C4D',
        marginBottom: 25,
    },
    mealTypeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
        width: '100%',
    },
    mealButton: {
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 5,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        width: 75,
        minHeight: 60,
    },
    mealButtonSelected: {
        backgroundColor: iconColor,
    },
    mealButtonText: {
        marginTop: 5,
        color: iconColor,
        fontFamily: 'serif',
        fontSize: 12,
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
        width: '100%',
        marginBottom: 20,
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    saveButton: {
        backgroundColor: '#4CAF50',
    },
    cancelButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#AAB8C2',
    },
    cancelButtonText: {
        color: '#AAB8C2',
    },
    dateButton: {
        backgroundColor: '#FFFFFF',
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        width: '100%',
    },
    dateButtonText: {
        fontSize: 16,
        color: iconColor,
    },
}); 