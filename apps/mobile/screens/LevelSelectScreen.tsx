import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { levels } from '../data/levels';

const PRIMARY_COLOR = '#6366F1'; // Indigo 500
const BACKGROUND_COLOR = '#F8FAFC'; // Slate 50

import * as progressStore from '../data/progressStore';
import { Difficulty } from '../data/progressStore';

export default function LevelSelectScreen() {
    const navigation = useNavigation<any>();
    const progress = progressStore.getProgressSync();

    const handleLevelSelect = async (levelId: Difficulty) => {
        await progressStore.setDifficulty(levelId);
        const levelData = levels.find(l => l.id === levelId);
        const currentIdx = progress.puzzleIndex[levelId];
        const puzzleId = levelData?.puzzles[currentIdx]?.id || levelData?.puzzles[0].id;
        navigation.navigate('Puzzle', { levelId, puzzleId });
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Select Level</Text>
                <Text style={styles.subtitle}>Choose your challenge</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {levels.map((level) => (
                    <TouchableOpacity
                        key={level.id}
                        style={styles.levelCard}
                        activeOpacity={0.7}
                        onPress={() => handleLevelSelect(level.id as Difficulty)}
                    >
                        <View style={styles.levelInfo}>
                            <Text style={styles.levelName}>{level.name}</Text>
                            <Text style={styles.levelDescription}>{level.description}</Text>
                        </View>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>
                                {progress.solvedCount[level.id as Difficulty]} / {level.puzzles.length} Solved
                            </Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
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
    title: {
        fontSize: 32,
        fontWeight: '900',
        color: '#0F172A', // Slate 900
        letterSpacing: -1,
    },
    subtitle: {
        fontSize: 16,
        color: '#64748B', // Slate 500
        fontWeight: '500',
        marginTop: 4,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    levelCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 24,
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    levelInfo: {
        flex: 1,
        marginRight: 16,
    },
    levelName: {
        fontSize: 20,
        fontWeight: '800',
        color: '#1E293B',
        marginBottom: 4,
    },
    levelDescription: {
        fontSize: 14,
        color: '#64748B',
        lineHeight: 20,
    },
    badge: {
        backgroundColor: '#EEF2FF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E0E7FF',
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '700',
        color: PRIMARY_COLOR,
    }
});
