import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BookOpenIcon } from 'react-native-heroicons/outline';
import PageContainer from '../components/PageContainer';
import { COLORS, FONTS, BORDERS, SPACING } from '../constants/theme';

export default function GuideScreen({ navigation }) {
  return (
    <PageContainer>
      <View style={styles.content}>
        <BookOpenIcon size={48} color={COLORS.primary} style={styles.icon} />
        <Text style={styles.title}>Mindful Eating Guide</Text>
        <Text style={styles.subtitle}>
          Revisit the core principles and learn how this app supports your journey.
        </Text>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('Onboarding')}
        >
          <Text style={styles.buttonText}>Review</Text>
        </TouchableOpacity>
      </View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  icon: {
    marginBottom: SPACING.md,
  },
  title: {
    ...FONTS.h2,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    ...FONTS.body,
    fontSize: 18,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDERS.radius,
    alignItems: 'center',
  },
  buttonText: {
    ...FONTS.button,
  },
}); 