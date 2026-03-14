import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { getSampleBoard } from '../data/samplePuzzle';

const CELL_SIZE = 80;

export default function PuzzleScreen() {
    const board = getSampleBoard();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Puzzle UI (Read-Only)</Text>
            <View style={[styles.boardContainer, {
                width: board.width * CELL_SIZE,
                height: board.height * CELL_SIZE
            }]}>
                {/* Draw Grid Cells */}
                {Array.from({ length: board.height }).map((_, y) => (
                    <View key={`row-${y}`} style={styles.row}>
                        {Array.from({ length: board.width }).map((_, x) => {
                            const clue = board.clues.find(c => c.x === x && c.y === y);
                            return (
                                <View key={`cell-${x}-${y}`} style={styles.cell}>
                                    {clue ? (
                                        <Text style={styles.clueText}>{clue.value}</Text>
                                    ) : null}
                                </View>
                            );
                        })}
                    </View>
                ))}

                {/* Draw initial overlapping Rectangles if needed but empty initially */}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fafafa',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20
    },
    boardContainer: {
        borderWidth: 2,
        borderColor: '#333',
        backgroundColor: '#fff',
        flexDirection: 'column'
    },
    row: {
        flexDirection: 'row',
        height: CELL_SIZE
    },
    cell: {
        width: CELL_SIZE,
        height: CELL_SIZE,
        borderWidth: 1,
        borderColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center'
    },
    clueText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000'
    }
});
