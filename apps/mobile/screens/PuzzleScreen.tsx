import React, { useState, useMemo, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { getSampleBoard } from '../data/samplePuzzle';
import BoardView from '../components/BoardView';
import {
    Cell,
    getRectangleFromCells,
    createGameState,
    placeRectangle,
    validateSolvedBoard
} from '@shikaku/engine';
import { incrementPlacements, incrementUndos, incrementSolved } from '../data/sessionStore';

const PRIMARY_COLOR = '#6366F1'; // Indigo 500
const SECONDARY_COLOR = '#94A3B8'; // Slate 400
const ERROR_COLOR = '#EF4444'; // Red 500
const SUCCESS_COLOR = '#10B981'; // Emerald 500
const BACKGROUND_COLOR = '#F8FAFC'; // Slate 50

export default function PuzzleScreen() {
    const board = useMemo(() => getSampleBoard(), []);
    const [boardLayout, setBoardLayout] = useState<{ width: number, height: number } | null>(null);

    // Compute cell size dynamically based on actually measured space
    const cellSize = useMemo(() => {
        if (!boardLayout) return 0;

        // Apply a little internal padding to the measured area for breathing room
        const padding = 20;
        const availableWidth = boardLayout.width - padding;
        const availableHeight = boardLayout.height - padding;

        const sizeByWidth = Math.floor(availableWidth / board.width);
        const sizeByHeight = Math.floor(availableHeight / board.height);

        // Return smaller of the two dimensions to ensure it fits, 
        // with a sane minimum (30) and a maximum cap (60) for visual comfort.
        return Math.max(30, Math.min(sizeByWidth, sizeByHeight, 60));
    }, [boardLayout, board.width, board.height]);

    const handleLayout = (event: any) => {
        const { width, height } = event.nativeEvent.layout;
        if (width !== boardLayout?.width || height !== boardLayout?.height) {
            setBoardLayout({ width, height });
        }
    };

    const [gameState, setGameState] = useState(() => createGameState(board));

    const [selectionStart, setSelectionStart] = useState<Cell | null>(null);
    const [selectionEnd, setSelectionEnd] = useState<Cell | null>(null);

    const [validationState, setValidationState] = useState<{ isSolved: boolean, errors: any[] } | null>(null);

    // Animations
    const solvedScale = useRef(new Animated.Value(0.8)).current;
    const solvedOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (validationState?.isSolved) {
            Animated.parallel([
                Animated.spring(solvedScale, {
                    toValue: 1,
                    friction: 6,
                    tension: 4,
                    useNativeDriver: true,
                }),
                Animated.timing(solvedOpacity, {
                    toValue: 1,
                    duration: 300,
                    easing: Easing.out(Easing.ease),
                    useNativeDriver: true,
                })
            ]).start();
        } else {
            solvedScale.setValue(0.8);
            solvedOpacity.setValue(0);
        }
    }, [validationState?.isSolved]);

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
                        <TouchableOpacity onPress={handleReset} style={styles.actionButton} activeOpacity={0.6}>
                            <Text style={styles.actionButtonText}>Reset Board</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {validationState?.isSolved ? (
                    <Animated.View style={[styles.solvedBanner, { opacity: solvedOpacity, transform: [{ scale: solvedScale }] }]}>
                        <Text style={styles.solvedText}>🎉 Puzzle Solved!</Text>
                        <Text style={styles.solvedSubtext}>You matched all clues perfectly.</Text>
                    </Animated.View>
                ) : (
                    <View style={styles.headerInfo}>
                        <Text style={[
                            styles.subtitle,
                            validationState?.errors && validationState.errors.length > 0 && styles.errorSubtitle
                        ]}>
                            {validationState?.errors && validationState.errors.length > 0
                                ? 'Some areas need correction'
                                : 'Drag to form the rectangles'}
                        </Text>
                    </View>
                )}
            </View>

            <View style={styles.boardWrapper} onLayout={handleLayout}>
                {cellSize > 0 && (
                    <BoardView
                        board={gameState.board}
                        rectangles={gameState.rectangles}
                        cellSize={cellSize}
                        previewRectangle={previewRectangle}
                        onDrawStart={handleDrawStart}
                        onDrawMove={handleDrawMove}
                        onDrawEnd={handleDrawEnd}
                        selectionStart={selectionStart}
                        selectionEnd={selectionEnd}
                    />
                )}
            </View>

            <View style={styles.footer}>
                {validationState?.isSolved ? (
                    <Animated.View style={[styles.solvedFooterExtra, { opacity: solvedOpacity }]}>
                        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
                            <Text style={styles.resetButtonText}>Play Again</Text>
                        </TouchableOpacity>
                    </Animated.View>
                ) : (
                    <TouchableOpacity
                        style={[styles.submitButton, gameState.rectangles.length === 0 && styles.submitButtonDisabled]}
                        activeOpacity={0.7}
                        onPress={handleSubmit}
                        disabled={gameState.rectangles.length === 0}
                    >
                        <Text style={styles.submitButtonText}>Check Solution</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BACKGROUND_COLOR,
        paddingTop: 60,
        paddingBottom: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 24,
        paddingHorizontal: 24,
        width: '100%',
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 16,
    },
    headerActions: {
        flexDirection: 'row',
        gap: 8,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        color: '#0F172A', // Slate 900
        letterSpacing: -1,
    },
    actionButton: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    actionButtonText: {
        color: PRIMARY_COLOR,
        fontWeight: '600',
        fontSize: 13,
    },
    disabledText: {
        color: '#CBD5E1',
    },
    headerInfo: {
        height: 24,
        justifyContent: 'center',
    },
    subtitle: {
        fontSize: 15,
        color: '#64748B',
        fontWeight: '500',
    },
    errorSubtitle: {
        color: ERROR_COLOR,
        fontWeight: '700',
    },
    solvedBanner: {
        alignItems: 'center',
        backgroundColor: '#ECFDF5',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#A7F3D0',
    },
    solvedText: {
        fontSize: 16,
        fontWeight: '800',
        color: SUCCESS_COLOR,
    },
    solvedSubtext: {
        fontSize: 12,
        color: '#059669',
        fontWeight: '500',
        marginTop: 2,
    },
    boardWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    footer: {
        paddingHorizontal: 24,
        alignItems: 'center',
        minHeight: 100,
        justifyContent: 'center',
    },
    submitButton: {
        backgroundColor: PRIMARY_COLOR,
        paddingVertical: 18,
        borderRadius: 20,
        elevation: 4,
        shadowColor: PRIMARY_COLOR,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        width: '100%',
        alignItems: 'center',
    },
    submitButtonDisabled: {
        backgroundColor: '#CBD5E1',
        shadowOpacity: 0,
        elevation: 0,
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 17,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    solvedFooterExtra: {
        width: '100%',
        alignItems: 'center',
    },
    resetButton: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 20,
        borderWidth: 1.5,
        borderColor: PRIMARY_COLOR,
        width: '100%',
        alignItems: 'center',
    },
    resetButtonText: {
        color: PRIMARY_COLOR,
        fontSize: 16,
        fontWeight: '800',
    }
});
