import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Modal, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { PieChart } from 'react-native-chart-kit';
import StyledSegmentedControl from '../components/StyledSegmentedControl';
import { isAfter, startOfWeek, startOfMonth, parseISO, differenceInCalendarDays, endOfWeek, endOfMonth, format } from 'date-fns';
import { FireIcon, SunIcon, MoonIcon } from 'react-native-heroicons/solid';
import { ArrowRightIcon } from 'react-native-heroicons/outline';
import { XMarkIcon, SwatchIcon, BellAlertIcon } from 'react-native-heroicons/solid';
import { LineChart } from 'react-native-chart-kit';
import { calculateStreak } from '../utils/streakUtils';

const screenWidth = Dimensions.get("window").width;

const InsightsHeader = ({ title, dateRange, streakCount, filterIndex, onFilterChange }) => (
    <View style={styles.headerContainer}>
        <View style={styles.header}>
            <View>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.dateRange}>{dateRange}</Text>
            </View>
            <View style={styles.streakContainer}>
                <FireIcon color="#FF6B6B" size={28} />
                <Text style={styles.streakText}>{streakCount}</Text>
            </View>
        </View>
        <View style={styles.filterContainer}>
            <StyledSegmentedControl
                values={['This Week', 'This Month', 'All Time']}
                selectedIndex={filterIndex}
                onChange={(event) => onFilterChange(event.nativeEvent.selectedSegmentIndex)}
            />
        </View>
    </View>
);

const MealIcon = ({ mealType, size = 22, color = "#4A5C4D" }) => {
    switch(mealType) {
        case 'Breakfast': return <SunIcon size={size} color={color} />;
        case 'Lunch': return <SwatchIcon size={size} color={color} />;
        case 'Dinner': return <MoonIcon size={size} color={color} />;
        case 'Snack': return <BellAlertIcon size={size} color={color} />;
        default: return <SunIcon size={size} color={color} />;
    }
};

// Helper function to find the most frequent item in an array
const findMostFrequent = (arr) => {
    if (!arr || arr.length === 0) return 'N/A';
    const counts = arr.reduce((acc, value) => {
        acc[value] = (acc[value] || 0) + 1;
        return acc;
    }, {});
    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
};

// Define a color map for motivations for consistency, aligned with the new motivation options
const motivationColors = {
    // Physical Reasons
    'Hunger': '#4CAF50',        // Green
    'Energy': '#00BCD4',        // Cyan
    'Health': '#81C784',        // Light Green
    'Performance': '#3F51B5',   // Indigo

    // Emotional Reasons
    'Comfort': '#FFB74D',       // Soft Orange
    'Reward': '#E91E63',        // Pink
    'Nostalgia': '#A1887F',     // Sepia/Brown
    'Distraction': '#FFC107',   // Amber

    // Environmental Reasons
    'Social connection': '#FF9800',  // Orange
    'Habit/routine': '#9575CD',   // Light Purple
    'Marketing/cues': '#F44336',    // Red
    'Convenience/availability': '#607D8B', // Slate Blue/Grey

    // Default
    'Other': '#9E9E9E'          // Default Grey
};

export default function InsightsScreen() {
  const [totalEntries, setTotalEntries] = useState(0);
  const [avgEnergyBoost, setAvgEnergyBoost] = useState(0);
  const [topMeals, setTopMeals] = useState([]);
  const [motivationData, setMotivationData] = useState([]);
  const [topMoodShifts, setTopMoodShifts] = useState([]);
  const [filterIndex, setFilterIndex] = useState(0); // 0: Week, 1: Month, 2: All
  const [streakCount, setStreakCount] = useState(0);
  const [dateRangeText, setDateRangeText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedShift, setSelectedShift] = useState(null);
  const [plotData, setPlotData] = useState(null);
  const [isPlotModalVisible, setIsPlotModalVisible] = useState(false);
  const [selectedPlotPoint, setSelectedPlotPoint] = useState(null);
  const [selectedPointIndex, setSelectedPointIndex] = useState(null);
  const [hungerPlotData, setHungerPlotData] = useState(null);
  const [isHungerModalVisible, setIsHungerModalVisible] = useState(false);
  const [selectedHungerPoint, setSelectedHungerPoint] = useState(null);
  const [howWeEatPlotData, setHowWeEatPlotData] = useState(null);
  const [isHowWeEatModalVisible, setIsHowWeEatModalVisible] = useState(false);
  const [selectedHowWeEatPoint, setSelectedHowWeEatPoint] = useState(null);

  const handleShiftPress = (shiftData) => {
    const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
    const groupedFoods = mealTypes.reduce((acc, type) => {
        acc[type] = [];
        return acc;
    }, {});

    shiftData.meals.forEach(meal => {
        if (groupedFoods[meal.mealType]) {
            groupedFoods[meal.mealType].push(meal.food);
        }
    });

    setSelectedShift({
        shift: shiftData.shift,
        groupedFoods: groupedFoods,
    });
    setModalVisible(true);
  };

  const handleDataPointClick = ({ index }) => {
    const pointData = plotData.rawData[index];
    setSelectedPlotPoint(pointData);
    setSelectedPointIndex(index);
    setIsPlotModalVisible(true);
  };

  const closePlotModal = () => {
    setIsPlotModalVisible(false);
    setSelectedPointIndex(null);
  };

  const handleHungerDataPointClick = ({ index }) => {
    const pointData = hungerPlotData.rawData[index];
    setSelectedHungerPoint(pointData);
    setIsHungerModalVisible(true);
  };

  const closeHungerPlotModal = () => {
    setIsHungerModalVisible(false);
  };

  const handleHowWeEatDataPointClick = ({ index }) => {
    const pointData = howWeEatPlotData.rawData[index];
    setSelectedHowWeEatPoint(pointData);
    setIsHowWeEatModalVisible(true);
  };

  const closeHowWeEatPlotModal = () => {
    setIsHowWeEatModalVisible(false);
  };

  const loadData = useCallback(async () => {
    try {
      const existingEntries = await AsyncStorage.getItem('pending_entries');
      const allEntries = existingEntries ? JSON.parse(existingEntries) : [];
      
      const completedEntries = allEntries.filter(e => e.status === 'completed');

      const now = new Date();
      // Filter entries based on selected index FIRST
      const filteredEntries = completedEntries.filter(entry => {
        const entryDate = parseISO(entry.date);
        if (filterIndex === 0) { // This Week (Monday-Sunday)
          const start = startOfWeek(now, { weekStartsOn: 1 });
          const end = endOfWeek(now, { weekStartsOn: 1 });
          return entryDate >= start && entryDate <= end;
        }
        if (filterIndex === 1) { // This Month
          const start = startOfMonth(now);
          const end = endOfMonth(now);
          return entryDate >= start && entryDate <= end;
        }
        return true; // All Time
      });
      
      // --- Energy Plot Calculation ---
      if (filteredEntries.length > 0) {
        setPlotData({
            labels: filteredEntries.map((_, i) => i + 1), // Simple numeric labels
            datasets: [
                {
                    data: filteredEntries.map(e => e.energyLevel || 0),
                    color: (opacity = 1) => `rgba(107, 122, 255, ${opacity})`, // Blue for 'Before'
                    strokeWidth: 2,
                },
                {
                    data: filteredEntries.map(e => e.energy || 0),
                    color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`, // Green for 'After'
                    strokeWidth: 2,
                }
            ],
            legend: ["Energy Before", "Energy After"],
            rawData: filteredEntries, // Keep raw data for modal
        });
      } else {
        setPlotData(null);
      }

      // --- Hunger/Fullness Plot ---
      if (filteredEntries.length > 0) {
        setHungerPlotData({
            labels: filteredEntries.map((_, i) => i + 1),
            datasets: [
                {
                    data: filteredEntries.map(e => e.hungerLevel || 0),
                    color: (opacity = 1) => `rgba(255, 152, 0, ${opacity})`, // Orange for 'Hunger'
                    strokeWidth: 2,
                },
                {
                    data: filteredEntries.map(e => e.fullness || 0),
                    color: (opacity = 1) => `rgba(121, 85, 72, ${opacity})`, // Brown for 'Fullness'
                    strokeWidth: 2,
                }
            ],
            legend: ["Hunger Before", "Fullness After"],
            rawData: filteredEntries,
        });
      } else {
        setHungerPlotData(null);
      }

      // --- How We Eat Plot ---
      if (filteredEntries.length > 0) {
        setHowWeEatPlotData({
            labels: filteredEntries.map((_, i) => i + 1),
            datasets: [
                {
                    data: filteredEntries.map(e => e.mindfulness || 0),
                    color: (opacity = 1) => `rgba(142, 68, 173, ${opacity})`, // Purple
                    strokeWidth: 2,
                },
                {
                    data: filteredEntries.map(e => e.eatingSpeed || 0),
                    color: (opacity = 1) => `rgba(0, 150, 136, ${opacity})`, // Teal
                    strokeWidth: 2,
                }
            ],
            legend: ["Mindfulness", "Eating Speed"],
            rawData: filteredEntries,
        });
      } else {
        setHowWeEatPlotData(null);
      }

      // --- Mood Shift Calculation ---
      const moodShiftDetails = filteredEntries.reduce((acc, entry) => {
        if (entry.emotions?.length > 0 && entry.emotionsAfter?.length > 0) {
            const before = entry.emotions[0];
            const after = entry.emotionsAfter[0];
            const key = `${before} → ${after}`;
            
            if (!acc[key]) {
                acc[key] = { count: 0, meals: [] };
            }
            
            acc[key].count++;
            if(entry.mealType && entry.foodDescription) {
                acc[key].meals.push({ mealType: entry.mealType, food: entry.foodDescription });
            }
        }
        return acc;
      }, {});

      const sortedShifts = Object.entries(moodShiftDetails)
        .sort(([, a], [, b]) => b.count - a.count)
        .slice(0, 3)
        .map(([shift, details]) => ({
            shift,
            count: details.count,
            meals: details.meals,
        }));
      
      setTopMoodShifts(sortedShifts);

      // --- Date Range Text Calculation ---
      let rangeText = '';

      if (filterIndex === 0) { // This Week
        const start = startOfWeek(now, { weekStartsOn: 1 });
        const end = endOfWeek(now, { weekStartsOn: 1 });
        rangeText = `${format(start, 'd MMM')} - ${format(end, 'd MMM, yyyy')}`;
      } else if (filterIndex === 1) { // This Month
        rangeText = format(now, 'MMMM yyyy');
      } else { // All Time
        if (completedEntries.length > 0) {
            const dates = completedEntries.map(e => parseISO(e.date));
            const firstDate = new Date(Math.min.apply(null, dates));
            const lastDate = new Date(Math.max.apply(null, dates));
            rangeText = `${format(firstDate, 'd MMM, yyyy')} - ${format(lastDate, 'd MMM, yyyy')}`;
        } else {
            rangeText = 'No entries yet';
        }
      }
      setDateRangeText(rangeText);

      // --- Streak Calculation ---
      setStreakCount(calculateStreak(completedEntries));

      // All calculations should now use the pre-filtered `filteredEntries`
      setTotalEntries(filteredEntries.length);

      if (filteredEntries.length > 0) {
        // Calculate average energy boost
        const entriesWithBoost = filteredEntries.map(e => ({
          ...e,
          energyBoost: (e.energy && e.energyLevel) ? e.energy - e.energyLevel : 0
        }));

        const totalDifference = entriesWithBoost.reduce((sum, e) => sum + e.energyBoost, 0);
        setAvgEnergyBoost(totalDifference / filteredEntries.length);

        // Find top 3 meals for energy boost
        const sortedMeals = entriesWithBoost
          .filter(e => e.energyBoost > 0)
          .sort((a, b) => b.energyBoost - a.energyBoost);
        
        setTopMeals(sortedMeals.slice(0, 3));

        // Process motivation data
        const motivationCounts = filteredEntries.reduce((acc, entry) => {
            const motivation = (entry.motivations && entry.motivations.length > 0)
                ? entry.motivations[0]
                : 'Other';
            acc[motivation] = (acc[motivation] || 0) + 1;
            return acc;
        }, {});

        const chartData = Object.keys(motivationCounts).map(key => ({
            name: key,
            population: motivationCounts[key],
            color: motivationColors[key] || motivationColors['Other'],
            legendFontColor: "#7F7F7F",
            legendFontSize: 14
        }));

        setMotivationData(chartData);

      } else {
        setAvgEnergyBoost(0);
        setTopMeals([]);
        setMotivationData([]);
        setTopMoodShifts([]);
        setHungerPlotData(null);
        setHowWeEatPlotData(null);
      }

    } catch (e) {
      console.error("Failed to load entries for analysis.", e);
    }
  }, [filterIndex]);

  useFocusEffect(useCallback(() => { loadData(); }, [loadData]));

  const medalEmojis = ['🥇', '🥈', '🥉'];

  return (
    <View style={{flex: 1, backgroundColor: '#F5F5E9'}}>
        <InsightsHeader
            title="Insights"
            dateRange={dateRangeText}
            streakCount={streakCount}
            filterIndex={filterIndex}
            onFilterChange={setFilterIndex}
        />
        <ScrollView style={styles.scrollContainer}>
            <View style={styles.statsRow}>
                <View style={[styles.statCard, styles.statCardHalf]}>
                    <Text style={styles.statValue}>{totalEntries}</Text>
                    <Text style={styles.statLabel}>Total entries</Text>
                </View>
                <View style={[styles.statCard, styles.statCardHalf]}>
                    <Text style={styles.statValue}>
                        {avgEnergyBoost > 0 ? '+' : ''}{avgEnergyBoost.toFixed(1)}
                    </Text>
                    <Text style={styles.statLabel}>Avg. Energy Boost</Text>
                </View>
            </View>

            {motivationData.length > 0 && (
                <View style={styles.chartContainer}>
                    <Text style={styles.sectionTitle}>Eating Motivations</Text>
                    <PieChart
                        data={motivationData}
                        width={screenWidth - 20} // from padding
                        height={220}
                        chartConfig={{
                            backgroundGradientFrom: '#F5F5E9',
                            backgroundGradientTo: '#F5F5E9',
                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        }}
                        accessor={"population"}
                        backgroundColor={"transparent"}
                        paddingLeft={"15"}
                        center={[10, 0]}
                        absolute
                    />
                </View>
            )}

            {topMeals.length > 0 && (
                <View style={styles.topListContainer}>
                    <Text style={styles.sectionTitle}>Top Energy Boosts</Text>
                    {topMeals.map((meal, index) => (
                        <View key={meal.id} style={styles.listItem}>
                            <Text style={styles.medal}>{medalEmojis[index]}</Text>
                            <View style={styles.listItemText}>
                                <Text style={styles.mealDescription}>{meal.foodDescription}</Text>
                            </View>
                            <Text style={styles.energyBoostValue}>+{meal.energyBoost.toFixed(1)}</Text>
                        </View>
                    ))}
                </View>
            )}

            {topMoodShifts.length > 0 && (
                <View style={styles.topListContainer}>
                    <Text style={styles.sectionTitle}>Common Mood Shifts</Text>
                    {topMoodShifts.map((item, index) => (
                        <TouchableOpacity key={index} onPress={() => handleShiftPress(item)}>
                            <View style={styles.listItem}>
                                <View style={styles.listItemText}>
                                    <Text style={styles.mealDescription}>{item.shift}</Text>
                                </View>
                                <Text style={styles.shiftCount}>{item.count}x</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            {plotData && totalEntries >= 2 && (
                <View style={styles.chartContainer}>
                    <Text style={styles.sectionTitle}>Energy</Text>
                    <LineChart
                        data={plotData}
                        width={screenWidth - 10}
                        height={220}
                        chartConfig={{
                            backgroundGradientFrom: '#F5F5E9',
                            backgroundGradientTo: '#F5F5E9',
                            fillShadowGradient: 'rgba(107, 122, 255, 1)', // Blue
                            fillShadowGradientOpacity: 0.2,
                            decimalPlaces: 1,
                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Base color, will be overridden by dataset colors
                            labelColor: (opacity = 1) => `rgba(74, 92, 77, ${opacity})`,
                            style: { borderRadius: 16 },
                            propsForDots: {
                                r: filterIndex === 2 ? "0" : "4", // Hide dots for 'All Time'
                            }
                        }}
                        bezier
                        style={styles.lineChart}
                        onDataPointClick={handleDataPointClick}
                        getDotColor={(dataPoint, dataPointIndex) => {
                            if (dataPointIndex === selectedPointIndex) {
                                return '#FF6B6B'; // Highlight color
                            }
                            return 'rgba(74, 92, 77, 0.2)'; // Default dot color for unselected points
                        }}
                        withInnerLines={false}
                        withOuterLines={false}
                        withShadow={true}
                    />
                </View>
            )}

            {hungerPlotData && totalEntries >= 2 && (
                <View style={styles.chartContainer}>
                    <Text style={styles.sectionTitle}>Hunger & Fullness</Text>
                    <LineChart
                        data={hungerPlotData}
                        width={screenWidth - 10}
                        height={220}
                        chartConfig={{
                            backgroundGradientFrom: '#F5F5E9',
                            backgroundGradientTo: '#F5F5E9',
                            fillShadowGradient: 'rgba(255, 152, 0, 1)', // Orange
                            fillShadowGradientOpacity: 0.2,
                            decimalPlaces: 1,
                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(74, 92, 77, ${opacity})`,
                            style: { borderRadius: 16 },
                            propsForDots: {
                                r: filterIndex === 2 ? "0" : "4",
                            }
                        }}
                        bezier
                        style={styles.lineChart}
                        onDataPointClick={handleHungerDataPointClick}
                        withInnerLines={false}
                        withOuterLines={false}
                        withShadow={true}
                    />
                </View>
            )}

            {howWeEatPlotData && totalEntries >= 2 && (
                <View style={styles.chartContainer}>
                    <Text style={styles.sectionTitle}>How You Eat</Text>
                    <LineChart
                        data={howWeEatPlotData}
                        width={screenWidth - 10}
                        height={220}
                        chartConfig={{
                            backgroundGradientFrom: '#F5F5E9',
                            backgroundGradientTo: '#F5F5E9',
                            fillShadowGradient: 'rgba(142, 68, 173, 1)', // Purple
                            fillShadowGradientOpacity: 0.2,
                            decimalPlaces: 1,
                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(74, 92, 77, ${opacity})`,
                            style: { borderRadius: 16 },
                            propsForDots: {
                                r: filterIndex === 2 ? "0" : "4",
                            }
                        }}
                        bezier
                        style={styles.lineChart}
                        onDataPointClick={handleHowWeEatDataPointClick}
                        withInnerLines={false}
                        withOuterLines={false}
                        withShadow={true}
                    />
                </View>
            )}

            <View style={styles.infoContainer}>
                <Text style={styles.infoText}>The more you check in, the smarter your insights will become.</Text>
            </View>
        </ScrollView>
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(!modalVisible);
            }}>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => setModalVisible(!modalVisible)}>
                        <XMarkIcon color="#AAB8C2" size={24} />
                    </TouchableOpacity>

                    {selectedShift && (
                        <>
                            <Text style={styles.modalTitle}>{selectedShift.shift}</Text>
                            <View style={styles.table}>
                                <View style={styles.tableHeaderRow}>
                                    <Text style={styles.tableHeader}>Breakfast</Text>
                                    <Text style={styles.tableHeader}>Lunch</Text>
                                    <Text style={styles.tableHeader}>Dinner</Text>
                                    <Text style={styles.tableHeader}>Snack</Text>
                                </View>
                                <ScrollView style={styles.tableScrollView}>
                                    <View style={styles.tableContentRow}>
                                        <View style={styles.tableColumn}>
                                            {selectedShift.groupedFoods.Breakfast.map((food, index) => (
                                                <Text key={index} style={styles.tableCell}>{food}</Text>
                                            ))}
                                        </View>
                                        <View style={styles.tableColumn}>
                                            {selectedShift.groupedFoods.Lunch.map((food, index) => (
                                                <Text key={index} style={styles.tableCell}>{food}</Text>
                                            ))}
                                        </View>
                                        <View style={styles.tableColumn}>
                                            {selectedShift.groupedFoods.Dinner.map((food, index) => (
                                                <Text key={index} style={styles.tableCell}>{food}</Text>
                                            ))}
                                        </View>
                                        <View style={styles.tableColumn}>
                                            {selectedShift.groupedFoods.Snack.map((food, index) => (
                                                <Text key={index} style={styles.tableCell}>{food}</Text>
                                            ))}
                                        </View>
                                    </View>
                                </ScrollView>
                            </View>
                        </>
                    )}
                </View>
            </View>
        </Modal>

        {/* Energy Plot Modal */}
        <Modal
            animationType="fade"
            transparent={true}
            visible={isPlotModalVisible}
            onRequestClose={closePlotModal}>
            <View style={styles.centeredView}>
                <View style={[styles.modalView, styles.plotModalView]}>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={closePlotModal}>
                        <XMarkIcon color="#AAB8C2" size={24} />
                    </TouchableOpacity>

                    {selectedPlotPoint && (
                        <View style={styles.plotModalContent}>
                            <View style={styles.plotModalHeader}>
                                <MealIcon mealType={selectedPlotPoint.mealType} />
                                <Text style={styles.plotModalMealType}>{selectedPlotPoint.mealType}</Text>
                            </View>
                            <Text style={styles.plotModalFood}>{selectedPlotPoint.foodDescription}</Text>
                            <View style={styles.plotModalEnergyRow}>
                                <Text style={styles.plotModalEnergyBefore}>Energy Before: {selectedPlotPoint.energyLevel}</Text>
                                <Text style={styles.plotModalEnergyAfter}>Energy After: {selectedPlotPoint.energy}</Text>
                            </View>
                        </View>
                    )}
                </View>
            </View>
        </Modal>

        {/* Hunger Plot Modal */}
        <Modal
            animationType="fade"
            transparent={true}
            visible={isHungerModalVisible}
            onRequestClose={closeHungerPlotModal}>
            <View style={styles.centeredView}>
                <View style={[styles.modalView, styles.plotModalView]}>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={closeHungerPlotModal}>
                        <XMarkIcon color="#AAB8C2" size={24} />
                    </TouchableOpacity>

                    {selectedHungerPoint && (
                        <View style={styles.plotModalContent}>
                            <View style={styles.plotModalHeader}>
                                <MealIcon mealType={selectedHungerPoint.mealType} />
                                <Text style={styles.plotModalMealType}>{selectedHungerPoint.mealType}</Text>
                            </View>
                            <Text style={styles.plotModalFood}>{selectedHungerPoint.foodDescription}</Text>
                            <View style={styles.plotModalEnergyRow}>
                                <Text style={styles.plotModalHungerBefore}>Hunger Before: {selectedHungerPoint.hungerLevel}</Text>
                                <Text style={styles.plotModalFullnessAfter}>Fullness After: {selectedHungerPoint.fullness}</Text>
                            </View>
                        </View>
                    )}
                </View>
            </View>
        </Modal>

        {/* How We Eat Plot Modal */}
        <Modal
            animationType="fade"
            transparent={true}
            visible={isHowWeEatModalVisible}
            onRequestClose={closeHowWeEatPlotModal}>
            <View style={styles.centeredView}>
                <View style={[styles.modalView, styles.plotModalView]}>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={closeHowWeEatPlotModal}>
                        <XMarkIcon color="#AAB8C2" size={24} />
                    </TouchableOpacity>

                    {selectedHowWeEatPoint && (
                        <View style={styles.plotModalContent}>
                            <View style={styles.plotModalHeader}>
                                <MealIcon mealType={selectedHowWeEatPoint.mealType} />
                                <Text style={styles.plotModalMealType}>{selectedHowWeEatPoint.mealType}</Text>
                            </View>
                            <Text style={styles.plotModalFood}>{selectedHowWeEatPoint.foodDescription}</Text>
                            <View style={styles.plotModalEnergyRow}>
                                <Text style={styles.plotModalMindfulness}>Mindfulness: {selectedHowWeEatPoint.mindfulness}</Text>
                                <Text style={styles.plotModalEatingSpeed}>Eating Speed: {selectedHowWeEatPoint.eatingSpeed}</Text>
                            </View>
                        </View>
                    )}
                </View>
            </View>
        </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  headerContainer: {
    backgroundColor: '#F5F5E9',
    paddingHorizontal: 20,
    paddingTop: 80,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: 'serif',
    fontWeight: '600',
    color: '#4A5C4D',
  },
  dateRange: {
    fontSize: 16,
    fontFamily: 'serif',
    color: '#AAB8C2',
    marginTop: 2,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  streakText: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'serif',
    color: '#4A5C4D',
    marginLeft: 6,
  },
  filterContainer: {
    marginBottom: 10,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    marginTop: 20,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  statCardHalf: {
    width: '48%',
  },
  statValue: {
    fontSize: 36, // Adjusted for better fit
    fontWeight: 'bold',
    color: '#4A5C4D',
    fontFamily: 'serif',
  },
  statLabel: {
    fontSize: 16, // Adjusted for better fit
    color: '#AAB8C2',
    marginTop: 5,
    fontFamily: 'serif',
  },
  chartContainer: {
    padding: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  topListContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: 'serif',
    fontWeight: '600',
    color: '#4A5C4D',
    marginBottom: 15,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5E9',
  },
  medal: {
    fontSize: 24,
    marginRight: 15,
  },
  listItemText: {
    flex: 1,
  },
  mealDescription: {
    fontSize: 16,
    fontFamily: 'serif',
    color: '#4A5C4D',
  },
  energyBoostValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  shiftIconContainer: {
    width: 24, // to align with medal emoji
    alignItems: 'center',
    marginRight: 15,
  },
  shiftCount: {
    fontSize: 14,
    color: '#AAB8C2',
    fontFamily: 'serif',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    paddingTop: 45, // Make room for close button
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '95%',
  },
  modalTitle: {
    fontSize: 22,
    fontFamily: 'serif',
    fontWeight: '600',
    color: '#4A5C4D',
    marginBottom: 20,
  },
  table: {
    width: '100%',
    marginTop: 10,
  },
  tableScrollView: {
    maxHeight: 250, // Set a max height for the scrollable area
    width: '100%',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 10,
    marginBottom: 10,
  },
  tableHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'serif',
    color: '#4A5C4D',
    width: '25%',
    textAlign: 'center',
  },
  tableContentRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
  },
  tableColumn: {
    width: '25%',
    paddingHorizontal: 5,
  },
  tableCell: {
    fontSize: 12,
    fontFamily: 'serif',
    color: '#4A5C4D',
    textAlign: 'center',
    marginBottom: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 1,
  },
  lineChart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  plotModalView: {
    width: '80%',
    padding: 20,
    paddingTop: 40,
  },
  plotModalContent: {
    alignItems: 'center',
    width: '100%',
  },
  plotModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  plotModalMealType: {
    fontSize: 20,
    fontFamily: 'serif',
    fontWeight: '600',
    color: '#4A5C4D',
    marginLeft: 10,
  },
  plotModalFood: {
    fontSize: 18,
    fontFamily: 'serif',
    color: '#4A5C4D',
    marginBottom: 20,
  },
  plotModalEnergyRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  plotModalEnergyBefore: {
    fontSize: 16,
    fontFamily: 'serif',
    color: '#6B7AFF', // Blue
  },
  plotModalEnergyAfter: {
    fontSize: 16,
    fontFamily: 'serif',
    color: '#4CAF50', // Green
    fontWeight: 'bold',
  },
  plotModalHungerBefore: {
    fontSize: 16,
    fontFamily: 'serif',
    color: '#FF9800', // Orange
  },
  plotModalFullnessAfter: {
    fontSize: 16,
    fontFamily: 'serif',
    color: '#795548', // Brown
    fontWeight: 'bold',
  },
  plotModalMindfulness: {
    fontSize: 16,
    fontFamily: 'serif',
    color: 'rgba(142, 68, 173, 1)', // Purple
  },
  plotModalEatingSpeed: {
    fontSize: 16,
    fontFamily: 'serif',
    color: 'rgba(0, 150, 136, 1)', // Teal
    fontWeight: 'bold',
  },
  infoContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  infoText: {
    fontFamily: 'serif',
    fontSize: 14,
    color: '#4A5C4D',
    textAlign: 'center',
    fontStyle: 'italic',
  },
}); 