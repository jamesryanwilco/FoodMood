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

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator 
      initialRouteName="Welcome" 
      screenOptions={{ 
        headerShown: false,
        cardStyle: { backgroundColor: '#F5F5E9' },
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Main" component={MainTabNavigator} />
      <Stack.Screen 
        name="CheckInStep1" 
        component={Step1_BasicInfoScreen} 
        options={{ 
          headerShown: true, 
          headerTransparent: true, 
          headerTitle: '', 
          headerBackTitle: 'Back' 
        }} 
      />
      <Stack.Screen 
        name="CheckInStep2" 
        component={Step2_EmotionScreen} 
        options={{ 
          headerShown: true, 
          headerTransparent: true, 
          headerTitle: '', 
          headerBackTitle: 'Back' 
        }} 
      />
      <Stack.Screen 
        name="CheckInStep3" 
        component={Step3_PhysicalStateScreen} 
        options={{ 
          headerShown: true, 
          headerTransparent: true, 
          headerTitle: '', 
          headerBackTitle: 'Back' 
        }} 
      />
      <Stack.Screen 
        name="CheckInStep4" 
        component={Step4_MotivationsScreen} 
        options={{ 
          headerShown: true, 
          headerTransparent: true, 
          headerTitle: '', 
          headerBackTitle: 'Back' 
        }} 
      />
      <Stack.Screen 
        name="Step5_Reminder" 
        component={Step5_ReminderScreen} 
        options={{ 
          headerShown: true, 
          headerTransparent: true, 
          headerTitle: '', 
          headerBackTitle: 'Back' 
        }} 
      />
      <Stack.Screen 
        name="CompleteStep1" 
        component={Phase2_Step1_ExperienceScreen} 
        options={{ 
          headerShown: true, 
          headerTransparent: true, 
          headerTitle: '', 
          headerBackTitle: 'Back' 
        }} 
      />
      <Stack.Screen 
        name="CompleteStep1a" 
        component={Phase2_Step1a_EmotionScreen} 
        options={{ 
          headerShown: true, 
          headerTransparent: true, 
          headerTitle: '', 
          headerBackTitle: 'Back' 
        }} 
      />
      <Stack.Screen 
        name="CompleteStep2" 
        component={Phase2_Step2_GoalScreen} 
        options={{ 
          headerShown: true, 
          headerTransparent: true, 
          headerTitle: '', 
          headerBackTitle: 'Back' 
        }} 
      />
      <Stack.Screen 
        name="SelectGoals" 
        component={SelectGoalsScreen} 
        options={{ 
          headerShown: true, 
          headerTransparent: true, 
          headerTitle: '', 
          headerBackTitle: 'Back' 
        }} 
      />
    </Stack.Navigator>
  );
} 