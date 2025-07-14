import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import PagerView from 'react-native-pager-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';
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
    ArrowLeftIcon,
    ArrowRightIcon,
} from 'react-native-heroicons/outline';
import { COLORS, FONTS, SPACING, BORDERS } from '../constants/theme';

const iconSize = 24;

const OnboardingPage1 = () => (
    <ScrollView contentContainerStyle={styles.page}>
        <View style={styles.titleContainer}>
            <AcademicCapIcon size={32} color={COLORS.primary} style={styles.titleIcon} />
            <Text style={styles.pageTitle}>What is Mindful Eating?</Text>
        </View>
        <Text style={styles.pageText}>
            Mindful eating is the practice of paying full attention to the experience of eating, without judgment. It's about being present with your food, your body, and your mind before, during, and after meals.
        </Text>
        <View style={styles.list}>
            <View style={styles.listItemContainer}>
                <EyeIcon size={iconSize} color={COLORS.primary} style={styles.listIcon} />
                <Text style={styles.listItem}>Awareness of emotions and triggers</Text>
            </View>
            <View style={styles.listItemContainer}>
                <ScaleIcon size={iconSize} color={COLORS.primary} style={styles.listIcon} />
                <Text style={styles.listItem}>Tuning into hunger and fullness</Text>
            </View>
            <View style={styles.listItemContainer}>
                <ClockIcon size={iconSize} color={COLORS.primary} style={styles.listIcon} />
                <Text style={styles.listItem}>Slowing down</Text>
            </View>
            <View style={styles.listItemContainer}>
                <NoSymbolIcon size={iconSize} color={COLORS.primary} style={styles.listIcon} />
                <Text style={styles.listItem}>Reducing distractions</Text>
            </View>
            <View style={styles.listItemContainer}>
                <SparklesIcon size={iconSize} color={COLORS.primary} style={styles.listIcon} />
                <Text style={styles.listItem}>Engaging your senses</Text>
            </View>
            <View style={styles.listItemContainer}>
                <HeartIcon size={iconSize} color={COLORS.primary} style={styles.listIcon} />
                <Text style={styles.listItem}>Non-judgmental observation</Text>
            </View>
        </View>
    </ScrollView>
);

const OnboardingPage2 = () => (
    <ScrollView contentContainerStyle={styles.page}>
        <View style={styles.titleContainer}>
            <DevicePhoneMobileIcon size={32} color={COLORS.primary} style={styles.titleIcon} />
            <Text style={styles.pageTitle}>How the App Works</Text>
        </View>
        <View style={styles.sectionContainer}>
            <ArrowRightCircleIcon size={iconSize} color={COLORS.primary} style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>Before Eating</Text>
        </View>
        <Text style={styles.pageText}>
            You'll reflect on what you're about to eat, how you're feeling, and why you're eating.
        </Text>
        <View style={styles.sectionContainer}>
            <ArrowLeftCircleIcon size={iconSize} color={COLORS.primary} style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>After Eating</Text>
        </View>
        <Text style={styles.pageText}>
            You'll reflect on how the meal felt, your fullness, and any mood shifts.
        </Text>
        <View style={styles.sectionContainer}>
            <ChartBarIcon size={iconSize} color={COLORS.primary} style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>Spot the Patterns</Text>
        </View>
        <Text style={styles.pageText}>
            Your reflections are turned into simple visual insights, helping you spot patterns between how you eat and how you feel.
        </Text>
    </ScrollView>
);

const OnboardingPage3 = ({ onComplete }) => (
    <ScrollView contentContainerStyle={styles.page}>
        <View style={styles.titleContainer}>
            <RocketLaunchIcon size={32} color={COLORS.primary} style={styles.titleIcon} />
            <Text style={styles.pageTitle}>Set Your Intention</Text>
        </View>
        <Text style={styles.pageText}>
            This isn't about chasing perfection. It's about tuning in and making small, meaningful changes.
        </Text>
        <Text style={styles.pageText}>
            Choose a focus that feels realistic and personal.
        </Text>
        <TouchableOpacity style={[styles.navButton, { marginTop: SPACING.xl }]} onPress={onComplete}>
            <Text style={styles.buttonText}>Set My Intentions</Text>
        </TouchableOpacity>
    </ScrollView>
);

export default function OnboardingScreen({ navigation }) {
    const pagerRef = useRef(null);
    const [currentPage, setCurrentPage] = useState(0);

    const handleComplete = async () => {
        try {
            await AsyncStorage.setItem('onboarding_completed', 'true');
            navigation.dispatch(
                CommonActions.reset({
                    index: 1,
                    routes: [
                        { name: 'Main' },
                        { name: 'SelectGoals' },
                    ],
                })
            );
        } catch (e) {
            console.error('Failed to save onboarding status or navigate.', e);
            // Fallback navigation
            navigation.replace('Main');
        }
    };

    const handleSkip = async () => {
        try {
            await AsyncStorage.setItem('onboarding_completed', 'true');
            navigation.replace('Main');
        } catch (e) {
            console.error('Failed to save onboarding status on skip.', e);
            // Still navigate, but log the error
            navigation.replace('Main');
        }
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
                    <OnboardingPage3 onComplete={handleComplete} />
                </View>
            </PagerView>

            <View style={styles.navigationContainer}>
                {currentPage > 0 ? (
                    <TouchableOpacity style={styles.arrowButton} onPress={handleBack}>
                        <ArrowLeftIcon size={30} color={COLORS.primary} />
                    </TouchableOpacity>
                ) : <View style={styles.navButtonPlaceholder} /> }

                <TouchableOpacity onPress={handleSkip}>
                    <Text style={styles.skipButtonText}>Skip</Text>
                </TouchableOpacity>

                {currentPage < 2 ? (
                    <TouchableOpacity style={styles.arrowButton} onPress={handleNext}>
                        <ArrowRightIcon size={30} color={COLORS.primary} />
                    </TouchableOpacity>
                ) : <View style={styles.navButtonPlaceholder} />}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    pagerView: {
        flex: 1,
    },
    page: {
        padding: SPACING.md,
        paddingTop: SPACING.xxl,
        alignItems: 'center',
    },
    titleContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    titleIcon: {
        marginBottom: SPACING.sm,
    },
    pageTitle: {
        ...FONTS.h2,
        textAlign: 'center',
    },
    sectionContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: SPACING.md,
        marginBottom: SPACING.sm,
    },
    sectionIcon: {
        marginBottom: SPACING.sm,
    },
    sectionTitle: {
        ...FONTS.h3,
        textAlign: 'center',
    },
    pageText: {
        ...FONTS.body,
        textAlign: 'center',
        marginBottom: SPACING.sm,
    },
    list: {
        alignItems: 'flex-start',
        marginVertical: SPACING.sm,
        width: '100%',
    },
    listItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    listIcon: {
        marginRight: SPACING.sm,
    },
    listItem: {
        ...FONTS.body,
        flexShrink: 1,
    },
    navigationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.xl,
        backgroundColor: COLORS.background,
    },
    navButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: SPACING.sm,
        paddingHorizontal: SPACING.xl,
        borderRadius: BORDERS.radius,
        alignItems: 'center',
        minWidth: 120,
    },
    arrowButton: {
        padding: SPACING.sm,
    },
    navButtonPlaceholder: {
        width: 50, // width of arrowButton
        padding: SPACING.sm,
    },
    buttonText: {
        ...FONTS.button,
    },
    skipButtonText: {
        color: COLORS.accent,
        fontSize: 16,
        fontFamily: 'serif',
        fontWeight: 'bold',
    },
}); 