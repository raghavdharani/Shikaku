import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getSampleGameState } from '../data/samplePuzzle';
import BoardView from '../components/BoardView';
import { Cell, getRectangleFromCells } from '@shikaku/engine';

const CELL_SIZE = 60;

export default function PuzzleScreen() {
    const gameState = useMemo(() => getSampleGameState(), []);
    const [selectionStart, setSelectionStart] = useState<Cell | null>(null);
    const [selectionEnd, setSelectionEnd] = useState<Cell | null>(null);

    const handleCellPress = (x: number, y: number) => {
        if (!selectionStart) {
            setSelectionStart({ x, y });
            setSelectionEnd(null);
        } else if (!selectionEnd) {
            setSelectionEnd({ x, y });
        } else {
            setSelectionStart({ x, y });
            setSelectionEnd(null);
        }
    };

    const previewRectangle = selectionStart && selectionEnd
        ? getRectangleFromCells(selectionStart, selectionEnd)
        : null;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Classic 2x2</Text>
                <Text style={styles.subtitle}>
                    {!selectionStart ? 'Tap start cell' : !selectionEnd ? 'Tap end cell' : 'Rectangle preview'}
                </Text>
            </View>

            <View style={styles.boardWrapper}>
                <BoardView
                    board={gameState.board}
                    rectangles={gameState.rectangles}
                    cellSize={CELL_SIZE}
                    previewRectangle={previewRectangle}
                    onCellPress={handleCellPress}
                    selectionStart={selectionStart}
                    selectionEnd={selectionEnd}
                />
            </View>

            <View style={styles.footer}>
                <Text style={styles.instruction}>Tap two cells to define a rectangle</Text>
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
