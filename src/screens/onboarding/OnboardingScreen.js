import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import PagerView from 'react-native-pager-view';
import {
    AcademicCapIcon,
    EyeIcon,
    ScaleIcon,
    ClockIcon,
    NoSymbolIcon,
    SparklesIcon,
    HeartIcon,
    DevicePhoneMobileIcon,
    ArrowRightCircleIcon,
    ArrowLeftCircleIcon,
    ChartBarIcon,
    RocketLaunchIcon,
} from 'react-native-heroicons/outline';

const iconColor = '#4A5C4D';
const iconSize = 24;

const OnboardingPage1 = () => (
    <ScrollView contentContainerStyle={styles.page}>
        <View style={styles.titleContainer}>
            <AcademicCapIcon size={32} color={iconColor} style={styles.titleIcon} />
            <Text style={styles.pageTitle}>What is Mindful Eating?</Text>
        </View>
        <Text style={styles.pageText}>
            Mindful eating is the practice of paying full attention to the experience of eating, without judgment. It's about being present with your food, your body, and your mind before, during, and after meals.
        </Text>
        <View style={styles.list}>
            <View style={styles.listItemContainer}>
                <EyeIcon size={iconSize} color={iconColor} style={styles.listIcon} />
                <Text style={styles.listItem}>Awareness of emotions and triggers</Text>
            </View>
            <View style={styles.listItemContainer}>
                <ScaleIcon size={iconSize} color={iconColor} style={styles.listIcon} />
                <Text style={styles.listItem}>Tuning into hunger and fullness</Text>
            </View>
            <View style={styles.listItemContainer}>
                <ClockIcon size={iconSize} color={iconColor} style={styles.listIcon} />
                <Text style={styles.listItem}>Slowing down</Text>
            </View>
            <View style={styles.listItemContainer}>
                <NoSymbolIcon size={iconSize} color={iconColor} style={styles.listIcon} />
                <Text style={styles.listItem}>Reducing distractions</Text>
            </View>
            <View style={styles.listItemContainer}>
                <SparklesIcon size={iconSize} color={iconColor} style={styles.listIcon} />
                <Text style={styles.listItem}>Engaging your senses</Text>
            </View>
            <View style={styles.listItemContainer}>
                <HeartIcon size={iconSize} color={iconColor} style={styles.listIcon} />
                <Text style={styles.listItem}>Non-judgmental observation</Text>
            </View>
        </View>
    </ScrollView>
);

const OnboardingPage2 = () => (
    <ScrollView contentContainerStyle={styles.page}>
        <View style={styles.titleContainer}>
            <DevicePhoneMobileIcon size={32} color={iconColor} style={styles.titleIcon} />
            <Text style={styles.pageTitle}>How the App Works</Text>
        </View>
        <View style={styles.sectionContainer}>
            <ArrowRightCircleIcon size={iconSize} color={iconColor} style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>Before Eating</Text>
        </View>
        <Text style={styles.pageText}>
            You'll reflect on what you're about to eat, how you're feeling, and why you're eating.
        </Text>
        <View style={styles.sectionContainer}>
            <ArrowLeftCircleIcon size={iconSize} color={iconColor} style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>After Eating</Text>
        </View>
        <Text style={styles.pageText}>
            You'll reflect on how the meal felt, your fullness, and any mood shifts.
        </Text>
        <View style={styles.sectionContainer}>
            <ChartBarIcon size={iconSize} color={iconColor} style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>Spot the Patterns</Text>
        </View>
        <Text style={styles.pageText}>
            Your reflections are turned into simple visual insights, helping you spot patterns between how you eat and how you feel.
        </Text>
    </ScrollView>
);

const OnboardingPage3 = () => (
    <ScrollView contentContainerStyle={styles.page}>
        <View style={styles.titleContainer}>
            <RocketLaunchIcon size={32} color={iconColor} style={styles.titleIcon} />
            <Text style={styles.pageTitle}>Set Your Intention</Text>
        </View>
        <Text style={styles.pageText}>
            This isn't about chasing perfection. It's about tuning in and making small, meaningful changes.
        </Text>
        <Text style={styles.pageText}>
            Choose a focus that feels realistic and personal.
        </Text>
    </ScrollView>
);

export default function OnboardingScreen({ navigation }) {
    const pagerRef = useRef(null);
    const [currentPage, setCurrentPage] = useState(0);

    const handleComplete = () => {
        navigation.replace('Main');
    };

    const handleNext = () => {
        if (pagerRef.current) {
            pagerRef.current.setPage(currentPage + 1);
        }
    };

    const handleBack = () => {
        if (pagerRef.current) {
            pagerRef.current.setPage(currentPage - 1);
        }
    };

    return (
        <View style={styles.container}>
            <PagerView 
                style={styles.pagerView} 
                initialPage={0}
                ref={pagerRef}
                onPageSelected={e => setCurrentPage(e.nativeEvent.position)}
                scrollEnabled={true} 
            >
                <View key="1">
                    <OnboardingPage1 />
                </View>
                <View key="2">
                    <OnboardingPage2 />
                </View>
                <View key="3">
                    <OnboardingPage3 />
                </View>
            </PagerView>
            <View style={styles.navigationContainer}>
                {currentPage > 0 ? (
                    <TouchableOpacity style={styles.navButton} onPress={handleBack}>
                        <Text style={styles.buttonText}>Back</Text>
                    </TouchableOpacity>
                ) : <View style={styles.navButtonPlaceholder} /> }

                {currentPage < 2 ? (
                    <TouchableOpacity style={styles.navButton} onPress={handleNext}>
                        <Text style={styles.buttonText}>Next</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={styles.navButton} onPress={handleComplete}>
                        <Text style={styles.buttonText}>Finish</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5E9',
    },
    pagerView: {
        flex: 1,
    },
    page: {
        padding: 20,
        paddingTop: 90,
        alignItems: 'center',
    },
    titleContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 20,
    },
    titleIcon: {
        marginBottom: 15,
    },
    pageTitle: {
        fontSize: 28,
        fontFamily: 'serif',
        fontWeight: '600',
        color: '#4A5C4D',
        textAlign: 'center',
    },
    sectionContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 10,
    },
    sectionIcon: {
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 22,
        fontFamily: 'serif',
        fontWeight: '600',
        color: '#4A5C4D',
        textAlign: 'center',
    },
    pageText: {
        fontSize: 16,
        color: '#4A5C4D',
        textAlign: 'center',
        marginBottom: 15,
        lineHeight: 24,
    },
    list: {
        alignItems: 'flex-start',
        marginVertical: 10,
        width: '100%',
    },
    listItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    listIcon: {
        marginRight: 15,
    },
    listItem: {
        fontSize: 16,
        color: '#4A5C4D',
        lineHeight: 24,
        flexShrink: 1,
    },
    navigationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 40,
        backgroundColor: '#F5F5E9',
    },
    navButton: {
        backgroundColor: '#4A5C4D',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 12,
        alignItems: 'center',
    },
    navButtonPlaceholder: {
        width: 120,
        paddingHorizontal: 40,
        paddingVertical: 15,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
}); 