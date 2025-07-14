import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS, SPACING } from '../constants/theme';

export default function PageContainer({ children }) {
    return (
        <View style={styles.container}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        padding: SPACING.md,
    },
}); 