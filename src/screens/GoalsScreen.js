import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FlagIcon } from 'react-native-heroicons/outline';

export default function GoalsScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <FlagIcon size={48} color="#4A5C4D" style={styles.icon} />
      <Text style={styles.title}>Your Intentions</Text>
      <Text style={styles.subtitle}>
        Set or review your intentions to guide your journey.
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('SelectGoals')}
      >
        <Text style={styles.buttonText}>Set My Intentions</Text>
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