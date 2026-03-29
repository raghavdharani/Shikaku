import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { getSessionStats } from '../data/sessionStore';
import { useIsFocused } from '@react-navigation/native';

export default function StatsScreen() {
    const stats = getSessionStats();
    const isFocused = useIsFocused(); // Re-render when navigating to this screen

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.title}>Session Stats</Text>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Puzzles Solved</Text>
                <Text style={styles.cardValue}>{stats.puzzlesSolved}</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Placements Made</Text>
                <Text style={styles.cardValue}>{stats.placementsMade}</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Undos Used</Text>
                <Text style={styles.cardValue}>{stats.undosMade}</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    content: {
        padding: 24,
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        color: '#0F172A',
        letterSpacing: -1,
        marginBottom: 32,
        marginTop: 40,
    },
    card: {
        backgroundColor: '#FFFFFF',
        width: '100%',
        padding: 24,
        borderRadius: 24,
        marginBottom: 16,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    cardTitle: {
        fontSize: 16,
        color: '#64748B',
        fontWeight: '600',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    cardValue: {
        fontSize: 36,
        fontWeight: '900',
        color: '#6366F1',
    }
});
