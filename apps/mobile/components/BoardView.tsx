import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Board, PlacedRectangle, Rectangle, Cell } from '@shikaku/engine';
import GridCell from './GridCell';

interface BoardViewProps {
    board: Board;
    rectangles: PlacedRectangle[];
    cellSize: number;
    previewRectangle?: Rectangle | null;
    onCellPress: (x: number, y: number) => void;
    selectionStart?: Cell | null;
    selectionEnd?: Cell | null;
}

export default function BoardView({
    board,
    rectangles,
    cellSize,
    previewRectangle,
    onCellPress,
    selectionStart,
    selectionEnd
}: BoardViewProps) {
    return (
        <View style={[styles.container, { width: board.width * cellSize, height: board.height * cellSize }]}>
            {/* Background Grid */}
            <View style={styles.grid}>
                {Array.from({ length: board.height }).map((_, y) => (
                    <View key={`row-${y}`} style={styles.row}>
                        {Array.from({ length: board.width }).map((_, x) => {
                            const clue = board.clues.find(c => c.x === x && c.y === y);
                            const isSelected = (selectionStart?.x === x && selectionStart?.y === y) ||
                                (selectionEnd?.x === x && selectionEnd?.y === y);
                            return (
                                <GridCell
                                    key={`cell-${x}-${y}`}
                                    x={x}
                                    y={y}
                                    size={cellSize}
                                    clue={clue}
                                    onPress={onCellPress}
                                    isSelected={isSelected}
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
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 2,
        borderColor: '#333',
        backgroundColor: '#fff',
        position: 'relative',
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
        backgroundColor: 'rgba(0, 122, 255, 0.1)',
    },
    previewRectangle: {
        position: 'absolute',
        borderWidth: 2,
        borderColor: '#FF9500',
        backgroundColor: 'rgba(255, 149, 0, 0.2)',
        borderStyle: 'dashed',
    },
});
