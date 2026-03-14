import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getSampleGameState } from '../data/samplePuzzle';
import BoardView from '../components/BoardView';

const CELL_SIZE = 60;

export default function PuzzleScreen() {
    const gameState = getSampleGameState();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Classic 2x2</Text>
                <Text style={styles.subtitle}>Fill the grid</Text>
            </View>

            <View style={styles.boardWrapper}>
                <BoardView
                    board={gameState.board}
                    rectangles={gameState.rectangles}
                    cellSize={CELL_SIZE}
                />
            </View>

            <View style={styles.footer}>
                <Text style={styles.instruction}>Tap and drag to draw a rectangle</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fafafa',
        paddingVertical: 40,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginTop: 4,
    },
    boardWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    footer: {
        marginTop: 'auto',
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    instruction: {
        fontSize: 14,
        color: '#888',
        fontStyle: 'italic',
        textAlign: 'center',
    }
});
