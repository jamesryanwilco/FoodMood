import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { COLORS, SPACING, BORDERS } from '../constants/theme';

export default function StickyFooterLayout({ children, footer }) {
    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollContainer}>
                {children}
            </ScrollView>
            <View style={styles.footer}>
                {footer}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContainer: {
        flex: 1,
        paddingHorizontal: SPACING.md,
        paddingTop: SPACING.lg, // Add some space from the header
    },
    footer: {
        paddingTop: SPACING.md,
        paddingHorizontal: SPACING.md,
        paddingBottom: SPACING.xl, // Extra space for home bar
        borderTopWidth: BORDERS.width,
        borderTopColor: COLORS.lightGray,
        backgroundColor: COLORS.background,
    },
}); 