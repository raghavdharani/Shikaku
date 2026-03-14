import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Cell, Clue } from '@shikaku/engine';
import ClueView from './ClueView';

interface GridCellProps {
    x: number;
    y: number;
    size: number;
    clue?: Clue;
}

export default function GridCell({ clue, size }: GridCellProps) {
    return (
        <View style={[styles.container, { width: size, height: size }]}>
            {clue && <ClueView clue={clue} />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 0.5,
        borderColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
