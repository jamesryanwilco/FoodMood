import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BookOpenIcon } from 'react-native-heroicons/outline';

export default function GuideScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <BookOpenIcon size={48} color="#4A5C4D" style={styles.icon} />
      <Text style={styles.title}>Mindful Eating Guide</Text>
      <Text style={styles.subtitle}>
        Revisit the core principles and learn how this app supports your journey.
      </Text>
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('Onboarding')}
      >
        <Text style={styles.buttonText}>Review the Onboarding Guide</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5E9',
    paddingHorizontal: 30,
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: 'serif',
    fontWeight: '600',
    color: '#4A5C4D',
    textAlign: 'center',
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 18,
    color: '#4A5C4D',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 26,
  },
  button: {
    backgroundColor: '#4A5C4D',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 