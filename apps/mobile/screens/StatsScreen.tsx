import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function StatsScreen() {
    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.title}>Your Progress</Text>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Puzzles Solved</Text>
                <Text style={styles.cardValue}>0</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Perfect Games</Text>
                <Text style={styles.cardValue}>0</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Time Spent</Text>
                <Text style={styles.cardValue}>0m</Text>
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
