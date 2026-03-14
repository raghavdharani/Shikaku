import React, { useState, useMemo, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { levels } from '../data/levels';
import { mapRawPuzzleToBoard } from '../data/puzzles/mapper';
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
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const { levelId, puzzleId } = route.params || {};

    // Find the level and puzzle based on params
    const level = useMemo(() => levels.find(l => l.id === levelId), [levelId]);
    const puzzle = useMemo(() => level?.puzzles.find(p => p.id === puzzleId), [level, puzzleId]);
    const board = useMemo(() => puzzle ? mapRawPuzzleToBoard(puzzle) : null, [puzzle]);

    const [boardLayout, setBoardLayout] = useState<{ width: number, height: number } | null>(null);

    // Compute cell size dynamically based on actually measured space
    const cellSize = useMemo(() => {
        if (!boardLayout || !board) return 0;

        // Apply a little internal padding to the measured area for breathing room
        const padding = 20;
        const availableWidth = boardLayout.width - padding;
        const availableHeight = boardLayout.height - padding;

        const sizeByWidth = Math.floor(availableWidth / (board?.width || 1));
        const sizeByHeight = Math.floor(availableHeight / (board?.height || 1));

        // Return smaller of the two dimensions to ensure it fits, 
        // with a sane minimum (30) and a maximum cap (60) for visual comfort.
        return Math.max(30, Math.min(sizeByWidth, sizeByHeight, 60));
    }, [boardLayout, board]);

    const handleLayout = (event: any) => {
        const { width, height } = event.nativeEvent.layout;
        if (width !== boardLayout?.width || height !== boardLayout?.height) {
            setBoardLayout({ width, height });
        }
    };

    const [gameState, setGameState] = useState(() => board ? createGameState(board) : null);

    const [selectionStart, setSelectionStart] = useState<Cell | null>(null);
    const [selectionEnd, setSelectionEnd] = useState<Cell | null>(null);

    const [validationState, setValidationState] = useState<{ isSolved: boolean, errors: any[] } | null>(null);

    // Reset game state when board (puzzle) changes
    useEffect(() => {
        if (board) {
            setGameState(createGameState(board));
            setValidationState(null);
            setSelectionStart(null);
            setSelectionEnd(null);
        }
    }, [board]);

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

        if (!gameState) return;
        const newState = placeRectangle(gameState, newRectangle);
        setGameState(newState);
        incrementPlacements();

        setSelectionStart(null);
        setSelectionEnd(null);
    };

    const handleSubmit = () => {
        if (!board || !gameState) return;
        const result = validateSolvedBoard(board, gameState.rectangles);
        setValidationState(result);
        if (result.isSolved) {
            incrementSolved();
        }
    };

    const handleReset = () => {
        if (!board) return;
        setGameState(createGameState(board));
        setSelectionStart(null);
        setSelectionEnd(null);
        setValidationState(null);
    };

    if (!level || !puzzle || !board || !gameState) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={styles.title}>Puzzle Not Found</Text>
                <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.submitButton, { marginTop: 20, width: 'auto', paddingHorizontal: 30 }]}>
                    <Text style={styles.submitButtonText}>Return to Selection</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const currentPuzzleIndex = level.puzzles.indexOf(puzzle);
    const hasNextPuzzle = currentPuzzleIndex < level.puzzles.length - 1;
    const nextPuzzle = hasNextPuzzle ? level.puzzles[currentPuzzleIndex + 1] : null;

    const handleNextPuzzle = () => {
        if (nextPuzzle) {
            navigation.replace('Puzzle', { levelId: level.id, puzzleId: nextPuzzle.id });
        }
    };

    const previewRectangle = selectionStart && selectionEnd
        ? getRectangleFromCells(selectionStart, selectionEnd)
        : null;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <View style={styles.titleContainer}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                            <Text style={styles.backButtonLabel}>← Levels</Text>
                        </TouchableOpacity>
                        <Text style={styles.title}>{level.name} {currentPuzzleIndex + 1}</Text>
                    </View>
                    <View style={styles.headerActions}>
                        <TouchableOpacity onPress={handleReset} style={styles.actionButton} activeOpacity={0.6}>
                            <Text style={styles.actionButtonText}>Reset Board</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {validationState?.isSolved ? (
                    <Animated.View style={[styles.solvedBanner, { opacity: solvedOpacity, transform: [{ scale: solvedScale }] }]}>
                        <Text style={styles.solvedText}>🎉 Puzzle Solved!</Text>
                        <Text style={styles.solvedSubtext}>{hasNextPuzzle ? 'Ready for the next one?' : 'Level complete!'}</Text>
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
                        {hasNextPuzzle ? (
                            <TouchableOpacity style={styles.submitButton} onPress={handleNextPuzzle}>
                                <Text style={styles.submitButtonText}>Next Puzzle</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity style={styles.resetButton} onPress={() => navigation.goBack()}>
                                <Text style={styles.resetButtonText}>Back to Levels</Text>
                            </TouchableOpacity>
                        )}
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
        alignItems: 'flex-start',
        width: '100%',
        marginBottom: 16,
    },
    titleContainer: {
        flex: 1,
    },
    backButton: {
        marginBottom: 4,
    },
    backButtonLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: PRIMARY_COLOR,
    },
    headerActions: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 18,
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
