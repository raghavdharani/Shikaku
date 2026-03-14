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
        borderColor: '#eee',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    startCell: {
        backgroundColor: '#E6F4FE',
        borderColor: '#007AFF',
        borderWidth: 1.5,
    },
    endCell: {
        backgroundColor: '#FFF4E6',
        borderColor: '#FF9500',
        borderWidth: 1.5,
    }
});
