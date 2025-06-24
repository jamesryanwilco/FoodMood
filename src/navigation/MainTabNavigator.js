import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CheckInScreen from '../screens/CheckInScreen';
import EntriesScreen from '../screens/EntriesScreen';
import InsightsScreen from '../screens/InsightsScreen';
import GuideScreen from '../screens/GuideScreen';
import GoalsScreen from '../screens/GoalsScreen';
import { PlusCircleIcon, ClipboardDocumentListIcon, ChartPieIcon, BookOpenIcon, FlagIcon } from 'react-native-heroicons/solid';

const Tab = createBottomTabNavigator();
const iconColor = '#4A5C4D';
const activeIconColor = '#FF6B6B';

export default function MainTabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused, color, size }) => {
                    let IconComponent;
                    const currentIconColor = focused ? activeIconColor : iconColor;

                    if (route.name === 'Check In') {
                        IconComponent = PlusCircleIcon;
                    } else if (route.name === 'Entries') {
                        IconComponent = ClipboardDocumentListIcon;
                    } else if (route.name === 'Insights') {
                        IconComponent = ChartPieIcon;
                    } else if (route.name === 'Guide') {
                        IconComponent = BookOpenIcon;
                    } else if (route.name === 'Goals') {
                        IconComponent = FlagIcon;
                    }

                    return <IconComponent size={size} color={currentIconColor} />;
                },
                tabBarActiveTintColor: activeIconColor,
                tabBarInactiveTintColor: iconColor,
                tabBarStyle: {
                    backgroundColor: '#F5F5E9',
                    borderTopWidth: 0,
                    height: 90,
                    paddingBottom: 30,
                },
                tabBarLabelStyle: {
                    fontFamily: 'serif',
                },
            })}
        >
            <Tab.Screen name="Check In" component={CheckInScreen} />
            <Tab.Screen name="Entries" component={EntriesScreen} />
            <Tab.Screen name="Insights" component={InsightsScreen} />
            <Tab.Screen name="Guide" component={GuideScreen} />
            <Tab.Screen name="Goals" component={GoalsScreen} />
        </Tab.Navigator>
    );
} 