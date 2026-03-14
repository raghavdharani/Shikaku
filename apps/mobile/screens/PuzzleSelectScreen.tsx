import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { levels } from '../data/levels';

const PRIMARY_COLOR = '#6366F1'; // Indigo 500
const BACKGROUND_COLOR = '#F8FAFC'; // Slate 50

export default function PuzzleSelectScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { levelId } = route.params;

    const level = levels.find(l => l.id === levelId);

    if (!level) {
        return (
            <View style={styles.container}>
                <Text>Level not found</Text>
            </View>
        );
    }

    const handlePuzzleSelect = (puzzleId: string) => {
        navigation.navigate('Puzzle', { levelId, puzzleId });
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <Text style={styles.backButtonText}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.title}>{level.name}</Text>
                <Text style={styles.subtitle}>Select a puzzle to start</Text>
            </View>

            <FlatList
                data={level.puzzles}
                keyExtractor={(item) => item.id}
                numColumns={3}
                contentContainerStyle={styles.listContent}
                renderItem={({ item, index }) => (
                    <TouchableOpacity
                        style={styles.puzzleCard}
                        activeOpacity={0.7}
                        onPress={() => handlePuzzleSelect(item.id)}
                    >
                        <Text style={styles.puzzleNumber}>{index + 1}</Text>
                        <Text style={styles.puzzleSize}>{item.size[0]}x{item.size[1]}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BACKGROUND_COLOR,
        paddingTop: 60,
    },
    header: {
        paddingHorizontal: 24,
        marginBottom: 32,
    },
    backButton: {
        marginBottom: 12,
    },
    backButtonText: {
        color: PRIMARY_COLOR,
        fontWeight: '700',
        fontSize: 16,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        color: '#0F172A',
        letterSpacing: -1,
    },
    subtitle: {
        fontSize: 16,
        color: '#64748B',
        fontWeight: '500',
        marginTop: 4,
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 40,
    },
    puzzleCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        margin: 8,
        flex: 1,
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    puzzleNumber: {
        fontSize: 24,
        fontWeight: '900',
        color: '#1E293B',
    },
    puzzleSize: {
        fontSize: 12,
        color: '#94A3B8',
        fontWeight: '600',
        marginTop: 2,
    }
});
