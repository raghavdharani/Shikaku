import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as progressStore from '../data/progressStore';
import { levels } from '../data/levels';

export default function HomeScreen() {
    const navigation = useNavigation<any>();
    const [isLoading, setIsLoading] = React.useState(true);
    const [progress, setProgress] = React.useState(progressStore.getProgressSync());

    React.useEffect(() => {
        progressStore.loadProgress().then((p) => {
            setProgress(p);
            setIsLoading(false);
        });
    }, []);

    if (isLoading) return null;

    const currentDifficulty = progress.currentDifficulty;
    const currentPuzzleIdx = progress.puzzleIndex[currentDifficulty];
    const levelData = levels.find(l => l.id === currentDifficulty);
    const puzzles = levelData?.puzzles || [];
    const puzzleId = puzzles[currentPuzzleIdx]?.id || puzzles[0]?.id;

    const handleResume = () => {
        navigation.navigate('Puzzle', { levelId: currentDifficulty, puzzleId });
    };

    return (
        <View style={styles.container}>
            <View style={styles.hero}>
                <Text style={styles.title}>Shikaku</Text>
                <Text style={styles.subtitle}>The Rectangle Journey</Text>
            </View>

            <View style={styles.mainActions}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('LevelSelect')}
                >
                    <Text style={styles.buttonText}>Choose Difficulty</Text>
                </TouchableOpacity>

                {progress.totalStats.puzzlesSolved > 0 && (
                    <TouchableOpacity
                        style={styles.resumeButton}
                        onPress={handleResume}
                    >
                        <Text style={styles.resumeButtonLabel}>Resume Journey</Text>
                        <Text style={styles.resumeButtonSublabel}>
                            {levelData?.name} — Puzzle {currentPuzzleIdx + 1}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.howToPlay}>
                <Text style={styles.sectionTitle}>Rules of the Path</Text>
                <View style={styles.instructionRow}>
                    <Text style={styles.bullet}>1</Text>
                    <Text style={styles.instructionText}>Each number defines the area of its rectangle.</Text>
                </View>
                <View style={styles.instructionRow}>
                    <Text style={styles.bullet}>2</Text>
                    <Text style={styles.instructionText}>One rectangle per number. No overlaps allowed.</Text>
                </View>
                <View style={styles.instructionRow}>
                    <Text style={styles.bullet}>3</Text>
                    <Text style={styles.instructionText}>The entire grid must be covered by rectangles.</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        padding: 40,
    },
    hero: {
        alignItems: 'center',
        marginBottom: 60,
    },
    title: {
        fontSize: 64,
        fontWeight: '900',
        color: '#0F172A',
        letterSpacing: -2,
    },
    subtitle: {
        fontSize: 20,
        color: '#64748B',
        fontWeight: '600',
        marginTop: -8,
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    mainActions: {
        width: '100%',
        marginBottom: 60,
    },
    button: {
        backgroundColor: '#6366F1',
        paddingHorizontal: 48,
        paddingVertical: 20,
        borderRadius: 24,
        elevation: 8,
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        width: '100%',
        alignItems: 'center',
        marginBottom: 16,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    resumeButton: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 48,
        paddingVertical: 16,
        borderRadius: 24,
        borderWidth: 2,
        borderColor: '#6366F1',
        width: '100%',
        alignItems: 'center',
    },
    resumeButtonLabel: {
        color: '#6366F1',
        fontSize: 16,
        fontWeight: '800',
    },
    resumeButtonSublabel: {
        color: '#64748B',
        fontSize: 13,
        fontWeight: '600',
        marginTop: 2,
    },
    howToPlay: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        padding: 28,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1E293B',
        marginBottom: 20,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    instructionRow: {
        flexDirection: 'row',
        marginBottom: 14,
        alignItems: 'center',
    },
    bullet: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#EEF2FF',
        color: '#6366F1',
        textAlign: 'center',
        lineHeight: 24,
        fontSize: 12,
        fontWeight: '900',
        marginRight: 12,
    },
    instructionText: {
        fontSize: 15,
        color: '#475569',
        lineHeight: 20,
        flex: 1,
        fontWeight: '500',
    }
});
