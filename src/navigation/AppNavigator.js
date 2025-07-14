import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import MainTabNavigator from './MainTabNavigator';
import Step1_BasicInfoScreen from '../screens/checkin/Step1_BasicInfoScreen';
import Step2_EmotionScreen from '../screens/checkin/Step2_EmotionScreen';
import Step3_PhysicalStateScreen from '../screens/checkin/Step3_PhysicalStateScreen';
import Step4_MotivationsScreen from '../screens/checkin/Step4_MotivationsScreen';
import Step5_ReminderScreen from '../screens/checkin/Step5_ReminderScreen';
import Phase2_Step1_ExperienceScreen from '../screens/checkin/Phase2_Step1_ExperienceScreen';
import Phase2_Step1a_EmotionScreen from '../screens/checkin/Phase2_Step1a_EmotionScreen';
import Phase2_Step2_GoalScreen from '../screens/checkin/Phase2_Step2_GoalScreen';
import SelectGoalsScreen from '../screens/SelectGoalsScreen';
import ViewGoalsScreen from '../screens/ViewGoalsScreen';
import { COLORS } from '../constants/theme';

const Stack = createStackNavigator();

const commonHeaderOptions = {
    headerShown: true,
    headerStyle: {
        backgroundColor: COLORS.background,
    },
    headerShadowVisible: false,
    headerTitle: '',
    headerBackTitleVisible: false,
    headerTintColor: COLORS.primary,
};

export default function AppNavigator() {
  return (
    <Stack.Navigator 
      initialRouteName="Welcome" 
      screenOptions={{ 
        headerShown: false,
        cardStyle: { backgroundColor: COLORS.background },
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Main" component={MainTabNavigator} />
      <Stack.Screen 
        name="CheckInStep1" 
        component={Step1_BasicInfoScreen} 
        options={commonHeaderOptions}
      />
      <Stack.Screen 
        name="CheckInStep2" 
        component={Step2_EmotionScreen} 
        options={commonHeaderOptions}
      />
      <Stack.Screen 
        name="CheckInStep3" 
        component={Step3_PhysicalStateScreen} 
        options={commonHeaderOptions}
      />
      <Stack.Screen 
        name="CheckInStep4" 
        component={Step4_MotivationsScreen} 
        options={commonHeaderOptions}
      />
      <Stack.Screen 
        name="Step5_Reminder" 
        component={Step5_ReminderScreen} 
        options={commonHeaderOptions}
      />
      <Stack.Screen 
        name="CompleteStep1" 
        component={Phase2_Step1_ExperienceScreen} 
        options={commonHeaderOptions}
      />
      <Stack.Screen 
        name="CompleteStep1a" 
        component={Phase2_Step1a_EmotionScreen} 
        options={commonHeaderOptions}
      />
      <Stack.Screen 
        name="CompleteStep2" 
        component={Phase2_Step2_GoalScreen} 
        options={commonHeaderOptions}
      />
      <Stack.Screen 
        name="SelectGoals" 
        component={SelectGoalsScreen} 
        options={{ 
          ...commonHeaderOptions,
          headerBackVisible: false, 
        }} 
      />
      <Stack.Screen 
        name="ViewGoals" 
        component={ViewGoalsScreen} 
        options={commonHeaderOptions}
      />
    </Stack.Navigator>
  );
} 