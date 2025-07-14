import React, { useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function WelcomeScreen({ navigation }) {
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const value = await AsyncStorage.getItem('onboarding_completed');
        if (value !== null) {
          navigation.replace('Main');
        }
      } catch (e) {
        console.error('Failed to check onboarding status.', e);
      }
    };

    checkOnboardingStatus();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Image
          source={require('../../assets/splash-icon.png')}
          style={styles.logo}
        />
        <Text style={styles.title}>The Check-In</Text>
        <Text style={styles.subtitle}>A Mindful Eating App</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Onboarding')}>
          <Text style={styles.buttonText}>Begin Your Journey</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5E9',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 20,
  },
  headerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 42,
    fontFamily: 'serif',
    fontWeight: '600',
    color: '#4A5C4D',
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 10,
    fontSize: 18,
    fontFamily: 'serif',
    color: '#4A5C4D',
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#4A5C4D',
    paddingVertical: 18,
    paddingHorizontal: 25,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 