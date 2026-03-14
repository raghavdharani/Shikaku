import React, { useState, useMemo, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing, Dimensions } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { levels } from '../data/levels';
import { mapRawPuzzleToBoard } from '../data/puzzles/mapper';
import BoardView from '../components/BoardView';
import {
    Cell,
    getRectangleFromCells,
    createGameState,
    placeRectangle,
    validateSolvedBoard,
    PlacedRectangle
} from '@shikaku/engine';
import { incrementPlacements, incrementSolved } from '../data/sessionStore';
import * as progressStore from '../data/progressStore';
import { Difficulty } from '../data/progressStore';

const PRIMARY_COLOR = '#6366F1'; // Indigo 500
const SECONDARY_COLOR = '#94A3B8'; // Slate 400
const ERROR_COLOR = '#EF4444'; // Red 500
const SUCCESS_COLOR = '#10B981'; // Emerald 500
const BACKGROUND_COLOR = '#F8FAFC'; // Slate 50

export default function PuzzleScreen() {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const { levelId, puzzleId } = route.params || {};

    const level = useMemo(() => levels.find(l => l.id === levelId), [levelId]);
    const puzzle = useMemo(() => level?.puzzles.find(p => p.id === puzzleId), [level, puzzleId]);
    const board = useMemo(() => puzzle ? mapRawPuzzleToBoard(puzzle) : null, [puzzle]);

    const [gameState, setGameState] = useState<any>(() => board ? createGameState(board) : null);
    const [selectionStart, setSelectionStart] = useState<Cell | null>(null);
    const [selectionEnd, setSelectionEnd] = useState<Cell | null>(null);
    const [validationState, setValidationState] = useState<any>(null);
    const [boardWidth, setBoardWidth] = useState(0);

    // Animation for solved state
    const solvedOpacity = useRef(new Animated.Value(0)).current;
    const solvedScale = useRef(new Animated.Value(0.9)).current;

    useEffect(() => {
        if (board) {
            setGameState(createGameState(board));
            setValidationState(null);
            setSelectionStart(null);
            setSelectionEnd(null);
            solvedOpacity.setValue(0);
            solvedScale.setValue(0.9);
        }
    }, [board]);

    useEffect(() => {
        if (validationState?.isSolved) {
            Animated.parallel([
                Animated.timing(solvedOpacity, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: true,
                    easing: Easing.out(Easing.back(1.5)),
                }),
                Animated.spring(solvedScale, {
                    toValue: 1,
                    friction: 8,
                    tension: 40,
                    useNativeDriver: true,
                })
            ]).start();
        }
    }, [validationState?.isSolved]);

    const cellSize = useMemo(() => {
        if (!board || boardWidth === 0) return 0;
        return (boardWidth - 40) / board.width;
    }, [board?.width, boardWidth]);

    const handleLayout = (event: any) => {
        setBoardWidth(event.nativeEvent.layout.width);
    };

    const handleDrawStart = (x: number, y: number) => {
        if (validationState?.isSolved) return;
        setSelectionStart({ x, y });
        setSelectionEnd({ x, y });
    };

    const handleDrawMove = (x: number, y: number) => {
        if (validationState?.isSolved) return;
        setSelectionEnd({ x, y });
    };

    const handleDrawEnd = (x: number, y: number, startX: number, startY: number) => {
        if (validationState?.isSolved || !board || !gameState) {
            setSelectionStart(null);
            setSelectionEnd(null);
            return;
        }

        const startCell = { x: startX, y: startY };
        const endCell = { x, y };

        const rect = getRectangleFromCells(startCell, endCell);
        const placedRect: PlacedRectangle = {
            ...rect,
            id: Math.random().toString(36).substr(2, 9)
        };
        const nextState = placeRectangle(gameState, placedRect);
        setGameState(nextState);
        setSelectionStart(null);
        setSelectionEnd(null);
        incrementPlacements();
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
                    <Text style={styles.submitButtonText}>Return to Tracks</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const currentPuzzleIndex = level.puzzles.indexOf(puzzle);
    const hasNextPuzzle = currentPuzzleIndex < level.puzzles.length - 1;
    const nextPuzzle = hasNextPuzzle ? level.puzzles[currentPuzzleIndex + 1] : null;

    const handleNextPuzzle = async () => {
        if (nextPuzzle) {
            await progressStore.advanceProgress(level.id as Difficulty);
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
                            <Text style={styles.backButtonLabel}>← Back</Text>
                        </TouchableOpacity>
                        <Text style={styles.title}>{level.name} — {currentPuzzleIndex + 1}</Text>
                    </View>
                    {!validationState?.isSolved && (
                        <View style={styles.headerActions}>
                            <TouchableOpacity onPress={handleReset} style={styles.actionButton} activeOpacity={0.6}>
                                <Text style={styles.actionButtonText}>Reset</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                {validationState?.isSolved ? (
                    <Animated.View style={[styles.solvedBanner, { opacity: solvedOpacity, transform: [{ scale: solvedScale }] }]}>
                        <Text style={styles.solvedText}>🎉 Correct!</Text>
                        <Text style={styles.solvedSubtext}>{hasNextPuzzle ? 'Onward to the next challenge.' : 'Track completed!'}</Text>
                    </Animated.View>
                ) : (
                    <View style={styles.headerInfo}>
                        <Text style={[
                            styles.subtitle,
                            validationState?.errors && validationState.errors.length > 0 && styles.errorSubtitle
                        ]}>
                            {validationState?.errors && validationState.errors.length > 0
                                ? 'Oops, check the overlaps'
                                : 'Fill the board with rectangles'}
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
                    <Animated.View style={[styles.solvedFooterExtra, { opacity: solvedOpacity, width: '100%' }]}>
                        {hasNextPuzzle ? (
                            <TouchableOpacity style={styles.submitButton} onPress={handleNextPuzzle}>
                                <Text style={styles.submitButtonText}>Next Puzzle</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity style={styles.resetButton} onPress={() => navigation.goBack()}>
                                <Text style={styles.resetButtonText}>Return to Tracks</Text>
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
    },
    header: {
        paddingHorizontal: 24,
        marginBottom: 20,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        marginRight: 12,
        paddingVertical: 4,
    },
    backButtonLabel: {
        fontSize: 16,
        fontWeight: '700',
        color: PRIMARY_COLOR,
    },
    title: {
        fontSize: 24,
        fontWeight: '900',
        color: '#0F172A',
        letterSpacing: -0.5,
    },
    headerActions: {
        flexDirection: 'row',
    },
    actionButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        backgroundColor: '#F1F5F9',
    },
    actionButtonText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#64748B',
    },
    headerInfo: {
        height: 60,
        justifyContent: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#64748B',
        fontWeight: '500',
    },
    errorSubtitle: {
        color: ERROR_COLOR,
        fontWeight: '700',
    },
    solvedBanner: {
        height: 60,
        justifyContent: 'center',
    },
    solvedText: {
        fontSize: 22,
        fontWeight: '900',
        color: SUCCESS_COLOR,
    },
    solvedSubtext: {
        fontSize: 14,
        color: '#64748B',
        fontWeight: '500',
    },
    boardWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    footer: {
        padding: 24,
        paddingBottom: 40,
        alignItems: 'center',
    },
    submitButton: {
        backgroundColor: PRIMARY_COLOR,
        width: '100%',
        height: 60,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: PRIMARY_COLOR,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    submitButtonDisabled: {
        backgroundColor: '#CBD5E1',
        elevation: 0,
        shadowOpacity: 0,
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    solvedFooterExtra: {
        alignItems: 'center',
    },
    resetButton: {
        backgroundColor: '#FFFFFF',
        width: '100%',
        height: 60,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: PRIMARY_COLOR,
    },
    resetButtonText: {
        color: PRIMARY_COLOR,
        fontSize: 18,
        fontWeight: '800',
    }
});
