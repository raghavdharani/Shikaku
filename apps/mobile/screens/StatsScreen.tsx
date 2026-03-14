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
        backgroundColor: '#f8f8f8',
    },
    content: {
        padding: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 30,
        marginTop: 20,
    },
    card: {
        backgroundColor: '#fff',
        width: '100%',
        padding: 20,
        borderRadius: 12,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
    },
    cardTitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 4,
    },
    cardValue: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#007AFF',
    }
});
