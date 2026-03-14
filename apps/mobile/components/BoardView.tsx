import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, PanResponder, GestureResponderEvent, Animated } from 'react-native';
import { Board, PlacedRectangle, Rectangle, Cell } from '@shikaku/engine';
import GridCell from './GridCell';

interface BoardViewProps {
    board: Board;
    rectangles: PlacedRectangle[];
    cellSize: number;
    previewRectangle?: Rectangle | null;
    onDrawStart: (x: number, y: number) => void;
    onDrawMove: (x: number, y: number) => void;
    onDrawEnd: (x: number, y: number, startX: number, startY: number) => void;
    selectionStart?: Cell | null;
    selectionEnd?: Cell | null;
}

export default function BoardView({
    board,
    rectangles,
    cellSize,
    previewRectangle,
    onDrawStart,
    onDrawMove,
    onDrawEnd,
    selectionStart,
    selectionEnd
}: BoardViewProps) {
    const callbacks = useRef({ onDrawStart, onDrawMove, onDrawEnd });
    const localStartCell = useRef<Cell | null>(null);

    useEffect(() => {
        callbacks.current = { onDrawStart, onDrawMove, onDrawEnd };
    }, [onDrawStart, onDrawMove, onDrawEnd]);

    const getCellFromEvent = (evt: GestureResponderEvent) => {
        const { locationX, locationY } = evt.nativeEvent;
        const x = Math.max(0, Math.min(board.width - 1, Math.floor(locationX / cellSize)));
        const y = Math.max(0, Math.min(board.height - 1, Math.floor(locationY / cellSize)));
        return { x, y };
    };

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: (evt) => {
                const cell = getCellFromEvent(evt);
                localStartCell.current = cell;
                callbacks.current.onDrawStart(cell.x, cell.y);
            },
            onPanResponderMove: (evt) => {
                const cell = getCellFromEvent(evt);
                callbacks.current.onDrawMove(cell.x, cell.y);
            },
            onPanResponderRelease: (evt) => {
                const cell = getCellFromEvent(evt);
                if (localStartCell.current) {
                    callbacks.current.onDrawEnd(cell.x, cell.y, localStartCell.current.x, localStartCell.current.y);
                }
                localStartCell.current = null;
            },
            onPanResponderTerminate: () => {
                localStartCell.current = null;
                callbacks.current.onDrawEnd(-1, -1, -1, -1);
            }
        })
    ).current;

    const boardWidth = board.width * cellSize;
    const boardHeight = board.height * cellSize;

    // Increased inset for a "contained" floating look inside the cells
    const RECT_INSET = 6;

    return (
        <View style={styles.shadowWrapper}>
            <View style={styles.boardFrame}>
                <View
                    style={[styles.boardSurface, { width: boardWidth, height: boardHeight }]}
                    {...panResponder.panHandlers}
                >
                    {/* Background Grid - Non-interactive */}
                    <View style={styles.grid} pointerEvents="none">
                        {Array.from({ length: board.height }).map((_, y) => (
                            <View key={`row-${y}`} style={styles.row}>
                                {Array.from({ length: board.width }).map((_, x) => {
                                    const clue = board.clues.find(c => c.x === x && c.y === y);
                                    const isStart = selectionStart?.x === x && selectionStart?.y === y;
                                    const isEnd = selectionEnd?.x === x && selectionEnd?.y === y;
                                    return (
                                        <GridCell
                                            key={`cell-${x}-${y}`}
                                            size={cellSize}
                                            clue={clue}
                                            isStart={isStart}
                                            isEnd={isEnd}
                                        />
                                    );
                                })}
                            </View>
                        ))}
                    </View>

                    {/* Placed Rectangles Overlay - Non-interactive */}
                    <View style={StyleSheet.absoluteFill} pointerEvents="none">
                        {rectangles.map(rect => (
                            <View
                                key={rect.id}
                                style={[
                                    styles.rectangle,
                                    {
                                        left: rect.x * cellSize + RECT_INSET,
                                        top: rect.y * cellSize + RECT_INSET,
                                        width: rect.width * cellSize - (RECT_INSET * 2),
                                        height: rect.height * cellSize - (RECT_INSET * 2),
                                    },
                                ]}
                            />
                        ))}
                    </View>

                    {/* Preview Rectangle Overlay - Non-interactive */}
                    <PreviewLayer previewRectangle={previewRectangle} cellSize={cellSize} RECT_INSET={RECT_INSET} />
                </View>
            </View>
        </View>
    );
}

function PreviewLayer({ previewRectangle, cellSize, RECT_INSET }: { previewRectangle?: Rectangle | null, cellSize: number, RECT_INSET: number }) {
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: previewRectangle ? 1 : 0,
            duration: 150,
            useNativeDriver: true,
        }).start();
    }, [!!previewRectangle]);

    // Using an internal local variable for the last known rectangle to avoid jumpiness during fade-out
    const [lastKnownRect, setLastKnownRect] = React.useState<Rectangle | null>(null);

    useEffect(() => {
        if (previewRectangle) {
            setLastKnownRect(previewRectangle);
        }
    }, [previewRectangle]);

    if (!previewRectangle && !lastKnownRect) return null;

    const rect = previewRectangle || lastKnownRect;

    return (
        <Animated.View
            pointerEvents="none"
            style={[
                styles.previewRectangle,
                {
                    opacity: fadeAnim,
                    left: (rect?.x || 0) * cellSize + RECT_INSET,
                    top: (rect?.y || 0) * cellSize + RECT_INSET,
                    width: (rect?.width || 1) * cellSize - (RECT_INSET * 2),
                    height: (rect?.height || 1) * cellSize - (RECT_INSET * 2),
                },
            ]}
        />
    );
}

const styles = StyleSheet.create({
    shadowWrapper: {
        borderRadius: 24,
        elevation: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
    },
    boardFrame: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E2E8F0', // Softest slate
        borderRadius: 24,
        padding: 20, // Maximum breathing room
    },
    boardSurface: {
        backgroundColor: 'transparent',
        overflow: 'hidden',
        position: 'relative',
        borderRadius: 10, // Smoother clipping
    },
    grid: {
        // Controlled by surface
    },
    row: {
        flexDirection: 'row',
    },
    rectangle: {
        position: 'absolute',
        borderWidth: 3, // Stronger border
        borderColor: '#6366F1', // Indigo 500
        backgroundColor: 'rgba(99, 102, 241, 0.12)', // Subtle Indigo fill
        borderRadius: 8,
    },
    previewRectangle: {
        position: 'absolute',
        borderWidth: 2,
        borderColor: '#94A3B8', // Slate 400
        backgroundColor: 'rgba(148, 163, 184, 0.06)',
        borderStyle: 'dashed',
        borderRadius: 8,
    },
});
