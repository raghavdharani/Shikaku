import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, PanResponder, GestureResponderEvent } from 'react-native';
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

    return (
        <View style={[styles.container, { width: board.width * cellSize, height: board.height * cellSize }]}>
            {/* Background Grid */}
            <View style={styles.grid}>
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

            {/* Placed Rectangles Overlay */}
            {rectangles.map(rect => (
                <View
                    key={rect.id}
                    style={[
                        styles.rectangle,
                        {
                            left: rect.x * cellSize,
                            top: rect.y * cellSize,
                            width: rect.width * cellSize,
                            height: rect.height * cellSize,
                        },
                    ]}
                />
            ))}

            {/* Preview Rectangle Overlay */}
            {previewRectangle && (
                <View
                    style={[
                        styles.previewRectangle,
                        {
                            left: previewRectangle.x * cellSize,
                            top: previewRectangle.y * cellSize,
                            width: previewRectangle.width * cellSize,
                            height: previewRectangle.height * cellSize,
                        },
                    ]}
                />
            )}

            {/* Touch Layer Overlay */}
            <View
                style={StyleSheet.absoluteFill}
                {...panResponder.panHandlers}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 2,
        borderColor: '#333',
        backgroundColor: '#fff',
        position: 'relative',
        // Shadow for board depth
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    grid: {
        flex: 1,
    },
    row: {
        flexDirection: 'row',
    },
    rectangle: {
        position: 'absolute',
        borderWidth: 2,
        borderColor: '#007AFF',
        backgroundColor: 'rgba(0, 122, 255, 0.2)',
        borderRadius: 4,
    },
    previewRectangle: {
        position: 'absolute',
        borderWidth: 2,
        borderColor: '#FF9500',
        backgroundColor: 'rgba(255, 149, 0, 0.3)',
        borderStyle: 'dashed',
        borderRadius: 4,
    },
});
