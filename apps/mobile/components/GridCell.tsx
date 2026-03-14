import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Clue } from '@shikaku/engine';
import ClueView from './ClueView';

interface GridCellProps {
    size: number;
    clue?: Clue;
    isStart?: boolean;
    isEnd?: boolean;
}

export default function GridCell({ clue, size, isStart, isEnd }: GridCellProps) {
    return (
        <View
            style={[
                styles.container,
                { width: size, height: size },
                isStart && styles.startCell,
                isEnd && styles.endCell
            ]}
        >
            {clue && <ClueView clue={clue} />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 0.5,
        borderColor: '#F1F5F9', // Very light slate
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    startCell: {
        backgroundColor: 'rgba(99, 102, 241, 0.08)',
        borderColor: '#6366F1',
        borderWidth: 1.5,
    },
    endCell: {
        backgroundColor: 'rgba(99, 102, 241, 0.08)',
        borderColor: '#6366F1',
        borderWidth: 1.5,
    }
});
