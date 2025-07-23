import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, interpolate, Extrapolate } from 'react-native-reanimated';
import { moodMeterData } from '../data/moodMeter';

const { width } = Dimensions.get('window');
const gridSize = width * 0.9;
const cellSize = gridSize / 10;
const MAX_SCALE = 3;
const MIN_SCALE = 1;

const MoodMeterGrid = ({ selectedValue, onCellPress }) => {
    const scale = useSharedValue(1);
    const savedScale = useSharedValue(1);
    const targetX = useSharedValue(0);
    const targetY = useSharedValue(0);

    useEffect(() => {
        if (selectedValue) {
            const newTargetX = (selectedValue.pleasantness - 5.5) * cellSize;
            const newTargetY = (5.5 - selectedValue.energy) * cellSize;

            targetX.value = withTiming(newTargetX, { duration: 300 });
            targetY.value = withTiming(newTargetY, { duration: 300 });
        }
    }, [selectedValue]);

    const pinchGesture = Gesture.Pinch()
        .onStart(() => {
            savedScale.value = scale.value;
        })
        .onUpdate((event) => {
            const newScale = savedScale.value * event.scale;
            scale.value = Math.max(MIN_SCALE, Math.min(newScale, MAX_SCALE));
        })
        .onEnd(() => {
            // If the user zooms out and is close to the original scale, snap back.
            if (scale.value < 1.1) {
                scale.value = withTiming(1);
            }
        });

    const animatedStyle = useAnimatedStyle(() => {
        // Interpolate translation based on the current scale.
        // The translation is 0 when scale is 1.
        // It becomes fully active when scale reaches 1.1, centering the selected emotion.
        const translateX = interpolate(
            scale.value,
            [1, 1.1],
            [0, -targetX.value],
            Extrapolate.CLAMP
        );
        const translateY = interpolate(
            scale.value,
            [1, 1.1],
            [0, -targetY.value],
            Extrapolate.CLAMP
        );

        return {
            transform: [
                { translateX },
                { translateY },
                { scale: scale.value },
            ],
        };
    });

    const renderGrid = () => {
        const rows = [];
        for (let energy = 10; energy >= 1; energy--) {
            const rowItems = [];
            for (let pleasantness = 1; pleasantness <= 10; pleasantness++) {
                const item = moodMeterData.find(d => d.pleasantness === pleasantness && d.energy === energy);
                rowItems.push(
                    <View 
                        key={item.id} 
                        style={[
                            styles.cell, 
                            { backgroundColor: item.color },
                            selectedValue && selectedValue.id === item.id && styles.selectedCell
                        ]}
                    >
                        <Text 
                            style={styles.cellText}
                            adjustsFontSizeToFit
                            numberOfLines={1}
                        >
                            {item.word}
                        </Text>
                    </View>
                );
            }
            rows.push(<View key={`row-${energy}`} style={styles.row}>{rowItems}</View>);
        }
        return rows;
    };

    return (
        <View style={styles.gridWrapper}>
            <GestureDetector gesture={pinchGesture}>
                <Animated.View style={[styles.gridContainer, animatedStyle]}>
                    {moodMeterData.map(item => {
                        // Calculate position based on pleasantness (x) and energy (y)
                        const top = (10 - item.energy) * cellSize;
                        const left = (item.pleasantness - 1) * cellSize;

                        return (
                            <Pressable
                                key={item.id}
                                style={[styles.cellPressable, { top, left }]}
                                onPress={() => onCellPress && onCellPress(item)}
                            >
                                <View 
                                    style={[
                                        styles.cell, 
                                        { backgroundColor: item.color },
                                        selectedValue && selectedValue.id === item.id && styles.selectedCell
                                    ]}
                                >
                                    <Text 
                                        style={[
                                            styles.cellText,
                                            selectedValue && selectedValue.id === item.id && styles.selectedCellText
                                        ]}
                                        adjustsFontSizeToFit
                                        numberOfLines={1}
                                    >
                                        {item.word}
                                    </Text>
                                </View>
                            </Pressable>
                        );
                    })}
                </Animated.View>
            </GestureDetector>
        </View>
    );
};

const styles = StyleSheet.create({
    gridWrapper: {
        width: gridSize,
        height: gridSize,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    gridContainer: {
        width: gridSize,
        height: gridSize,
    },
    row: {
        flexDirection: 'row',
    },
    cellPressable: {
        position: 'absolute',
        width: cellSize,
        height: cellSize,
    },
    cell: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 0.5,
        borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    selectedCell: {
        borderWidth: 2.5,
        borderColor: '#FFFFFF',
        zIndex: 1,
    },
    cellText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingHorizontal: 1,
    },
    selectedCellText: {
        fontSize: 12,
        fontWeight: '900',
    },
});

export default MoodMeterGrid; 