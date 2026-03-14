import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { getSampleBoard } from '../data/samplePuzzle';
import BoardView from '../components/BoardView';
import { Cell, getRectangleFromCells, createGameState, placeRectangle } from '@shikaku/engine';

const CELL_SIZE = 60;

export default function PuzzleScreen() {
    const board = useMemo(() => getSampleBoard(), []);
    const [gameState, setGameState] = useState(() => createGameState(board));

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

    const handlePlaceRectangle = () => {
        if (!previewRectangle) return;

        const newRectangle = {
            ...previewRectangle,
            id: `rect-${Date.now()}`
        };

        const newState = placeRectangle(gameState, newRectangle);
        setGameState(newState);

        // Reset selection
        setSelectionStart(null);
        setSelectionEnd(null);
    };

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
                {previewRectangle ? (
                    <TouchableOpacity
                        style={styles.placeButton}
                        onPress={handlePlaceRectangle}
                    >
                        <Text style={styles.placeButtonText}>Place Rectangle</Text>
                    </TouchableOpacity>
                ) : (
                    <Text style={styles.instruction}>Tap two cells to define a rectangle</Text>
                )}
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
    },
    placeButton: {
        backgroundColor: '#FF9500',
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 8,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    placeButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    }
});
