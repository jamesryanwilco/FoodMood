import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import PageContainer from '../components/PageContainer';
import { COLORS, FONTS, SPACING, BORDERS } from '../constants/theme';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import { TrashIcon } from 'react-native-heroicons/outline';

const GOALS_STORAGE_KEY = 'user_goals';

const medalColors = {
    '🥇': '#FFD700', // Gold
    '🥈': '#C0C0C0', // Silver
    '🥉': '#CD7F32', // Bronze
};

export default function ViewGoalsScreen({ navigation }) {
    const [savedGoals, setSavedGoals] = React.useState({ selected: [], custom: [] });

    const loadGoals = async () => {
        try {
            const storedGoals = await AsyncStorage.getItem(GOALS_STORAGE_KEY);
            if (storedGoals) {
                const { selected, custom } = JSON.parse(storedGoals);
                // Ensure custom goals are always an array
                const customArray = Array.isArray(custom) ? custom : (custom ? [custom] : []);
                setSavedGoals({ selected: selected || [], custom: customArray });
            } else {
                setSavedGoals({ selected: [], custom: [] });
            }
        } catch (e) {
            console.error('Failed to load goals.', e);
        }
    };

    useFocusEffect(useCallback(() => { loadGoals(); }, []));

    const handleDelete = async (goalToDelete) => {
        const updatedSelectedGoals = savedGoals.selected.filter(goal => goal !== goalToDelete);
        const newGoals = {
            ...savedGoals,
            selected: updatedSelectedGoals,
        };
        setSavedGoals(newGoals);
        try {
            await AsyncStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(newGoals));
        } catch (e) {
            console.error('Failed to save after deletion.', e);
        }
    };

    const handleDragEnd = async (data) => {
        const reorderedGoals = {
            selected: data,
            custom: savedGoals.custom,
        };
        setSavedGoals(reorderedGoals);
        try {
            await AsyncStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(reorderedGoals));
        } catch (e) {
            console.error('Failed to save reordered goals.', e);
        }
    };

    const { selected = [], custom = [] } = savedGoals;
    const hasGoals = selected.length > 0 || custom.length > 0;

    const renderGoal = (goal, index) => {
        const medal = ['🥇', '🥈', '🥉'][index];
        return (
            <View key={goal} style={[styles.goalCard, medal && { borderColor: medalColors[medal] }]}>
                {medal && <Text style={styles.medal}>{medal}</Text>}
                <Text style={styles.goalText}>{goal}</Text>
            </View>
        );
    };

    const renderRightActions = (item) => (
        <TouchableOpacity
            onPress={() => handleDelete(item)}
            style={styles.deleteBox}
        >
            <TrashIcon color={COLORS.white} size={24} />
            <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
    );

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <PageContainer>
                <View style={styles.header} />
                <Text style={styles.title}>Your Current Intentions</Text>
                <View style={styles.scrollContainer}>
                    {hasGoals ? (
                        <DraggableFlatList
                            data={selected}
                            renderItem={({ item, getIndex, drag }) => (
                                <View style={{ marginBottom: SPACING.sm }}>
                                    <Swipeable renderRightActions={() => renderRightActions(item)}>
                                        <TouchableOpacity onLongPress={drag} disabled={!drag}>
                                            {renderGoal(item, getIndex())}
                                        </TouchableOpacity>
                                    </Swipeable>
                                </View>
                            )}
                            keyExtractor={(item) => item}
                            onDragEnd={({ data }) => handleDragEnd(data)}
                        />
                    ) : (
                        <Text style={styles.noGoalsText}>
                            You haven't set any intentions yet. Tap below to get started!
                        </Text>
                    )}
                     {custom.map((goal, index) => (
                        <View key={index} style={[styles.goalCard, { marginTop: SPACING.md }]}>
                            <Text style={styles.customGoalLabel}>Your custom intention:</Text>
                            <Text style={styles.goalText}>{goal}</Text>
                        </View>
                    ))}
                </View>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('SelectGoals')}
                >
                    <Text style={styles.buttonText}>{hasGoals ? 'Reselect My Intentions' : 'Set My Intentions'}</Text>
                </TouchableOpacity>
            </PageContainer>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    header: {
        height: 60, // A standard header height
        // backgroundColor: COLORS.white, // Can be styled later
        // borderBottomWidth: BORDERS.width,
        // borderBottomColor: COLORS.lightGray,
    },
    icon: {
        alignSelf: 'center',
        marginBottom: SPACING.md,
    },
    title: {
        ...FONTS.h2,
        textAlign: 'center',
        marginBottom: SPACING.lg,
        marginTop: SPACING.sm, // Adjusted for the new header
    },
    scrollContainer: {
        flex: 1, // Allows the scroll view to take up the available space
    },
    goalCard: {
        backgroundColor: COLORS.white,
        padding: SPACING.md,
        borderRadius: BORDERS.radius,
        borderWidth: BORDERS.width * 2,
        borderColor: COLORS.lightGray,
        flexDirection: 'row',
        alignItems: 'center',
    },
    medal: {
        fontSize: 24,
        marginRight: SPACING.sm,
    },
    goalText: {
        ...FONTS.body,
        flexShrink: 1,
    },
    customGoalLabel: {
        ...FONTS.body,
        color: COLORS.textLight,
        fontStyle: 'italic',
        marginRight: SPACING.xs,
    },
    noGoalsText: {
        ...FONTS.body,
        fontSize: 18,
        textAlign: 'center',
        marginBottom: SPACING.xl,
        lineHeight: 26,
    },
    button: {
        backgroundColor: COLORS.primary,
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.xl,
        borderRadius: BORDERS.radius,
        alignItems: 'center',
        marginTop: SPACING.md,
        marginBottom: SPACING.md, // Add some margin at the bottom
    },
    buttonText: {
        ...FONTS.button,
    },
    deleteBox: {
        backgroundColor: COLORS.accent,
        justifyContent: 'center',
        alignItems: 'center',
        width: 100,
        borderRadius: BORDERS.radius,
    },
    deleteText: {
        ...FONTS.button,
        color: COLORS.white,
        marginTop: SPACING.xs,
    },
}); 