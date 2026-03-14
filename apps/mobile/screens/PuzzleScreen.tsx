import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { getSampleBoard } from '../data/samplePuzzle';
import BoardView from '../components/BoardView';
import {
    Cell,
    getRectangleFromCells,
    createGameState,
    placeRectangle,
    validateSolvedBoard,
    undo,
    redo
} from '@shikaku/engine';
import { incrementPlacements, incrementUndos, incrementSolved } from '../data/sessionStore';

const CELL_SIZE = 60;

export default function PuzzleScreen() {
    const board = useMemo(() => getSampleBoard(), []);
    const [gameState, setGameState] = useState(() => createGameState(board));

    const [selectionStart, setSelectionStart] = useState<Cell | null>(null);
    const [selectionEnd, setSelectionEnd] = useState<Cell | null>(null);

    // validationState is populated only when "Submit Puzzle" is pressed
    const [validationState, setValidationState] = useState<{ isSolved: boolean, errors: any[] } | null>(null);

    const canUndo = gameState.history.past.length > 0;
    const canRedo = gameState.history.future.length > 0;

    const handleDrawStart = (x: number, y: number) => {
        if (validationState?.isSolved) return;
        setSelectionStart({ x, y });
        setSelectionEnd({ x, y });
        setValidationState(null); // Clear errors
    };

    const handleDrawMove = (x: number, y: number) => {
        if (validationState?.isSolved) return;
        if (!selectionStart) return;
        setSelectionEnd({ x, y });
    };

    const handleDrawEnd = (x: number, y: number, startX: number, startY: number) => {
        if (validationState?.isSolved) return;

        // Handle termination or invalid start
        if (startX === -1 || startY === -1) {
            setSelectionStart(null);
            setSelectionEnd(null);
            return;
        }

        const startCell = { x: startX, y: startY };
        const endCell = { x, y };
        const rectModel = getRectangleFromCells(startCell, endCell);

        const newRectangle = {
            ...rectModel,
            id: `rect-${Date.now()}`
        };

        const newState = placeRectangle(gameState, newRectangle);
        setGameState(newState);
        incrementPlacements();

        setSelectionStart(null);
        setSelectionEnd(null);
    };

    const handleSubmit = () => {
        const result = validateSolvedBoard(board, gameState.rectangles);
        setValidationState(result);
        if (result.isSolved) {
            incrementSolved();
        }
    };

    const handleUndo = () => {
        if (!canUndo) return;
        setGameState(undo(gameState));
        incrementUndos();
        setSelectionStart(null);
        setSelectionEnd(null);
        setValidationState(null);
    };

    const handleRedo = () => {
        if (!canRedo) return;
        setGameState(redo(gameState));
        setSelectionStart(null);
        setSelectionEnd(null);
        setValidationState(null);
    };

    const handleReset = () => {
        setGameState(createGameState(board));
        setSelectionStart(null);
        setSelectionEnd(null);
        setValidationState(null);
    };

    const previewRectangle = selectionStart && selectionEnd
        ? getRectangleFromCells(selectionStart, selectionEnd)
        : null;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <Text style={styles.title}>Classic 2x2</Text>
                    <View style={styles.headerActions}>
                        <TouchableOpacity onPress={handleUndo} disabled={!canUndo} style={styles.actionButton}>
                            <Text style={[styles.actionButtonText, !canUndo && styles.disabledText]}>Undo</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleRedo} disabled={!canRedo} style={styles.actionButton}>
                            <Text style={[styles.actionButtonText, !canRedo && styles.disabledText]}>Redo</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleReset} style={styles.actionButton}>
                            <Text style={styles.actionButtonText}>Reset</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {validationState?.isSolved ? (
                    <Text style={styles.solvedText}>🎉 Puzzle Solved!</Text>
                ) : (
                    <Text style={[
                        styles.subtitle,
                        validationState?.errors && validationState.errors.length > 0 && styles.errorSubtitle
                    ]}>
                        {validationState?.errors && validationState.errors.length > 0
                            ? 'There are mistakes in your solution'
                            : 'Drag to place rectangles'}
                    </Text>
                )}
            </View>

            <View style={styles.boardWrapper}>
                <BoardView
                    board={gameState.board}
                    rectangles={gameState.rectangles}
                    cellSize={CELL_SIZE}
                    previewRectangle={previewRectangle}
                    onDrawStart={handleDrawStart}
                    onDrawMove={handleDrawMove}
                    onDrawEnd={handleDrawEnd}
                    selectionStart={selectionStart}
                    selectionEnd={selectionEnd}
                />
            </View>

            <View style={styles.footer}>
                {validationState?.isSolved ? (
                    <View style={styles.solvedFooter}>
                        <Text style={styles.solvedFooterText}>Well done!</Text>
                    </View>
                ) : (
                    <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                        <Text style={styles.submitButtonText}>Submit Puzzle</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fafafa',
        paddingVertical: 60,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
        paddingHorizontal: 20,
        width: '100%',
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 8,
    },
    headerActions: {
        flexDirection: 'row',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    actionButton: {
        marginLeft: 12,
        padding: 6,
    },
    actionButtonText: {
        color: '#007AFF',
        fontWeight: '600',
    },
    disabledText: {
        color: '#ccc',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
    },
    errorSubtitle: {
        color: '#FF3B30',
        fontWeight: '600',
    },
    solvedText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4CD964',
    },
    boardWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    footer: {
        marginTop: 'auto',
        paddingHorizontal: 20,
        alignItems: 'center',
        minHeight: 80,
        justifyContent: 'center',
    },
    submitButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 40,
        paddingVertical: 16,
        borderRadius: 12,
        elevation: 3,
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    solvedFooter: {
        alignItems: 'center',
    },
    solvedFooterText: {
        fontSize: 16,
        color: '#666',
        fontWeight: '500',
    }
});

