import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Cell, Clue } from '@shikaku/engine';
import ClueView from './ClueView';

interface GridCellProps {
    x: number;
    y: number;
    size: number;
    clue?: Clue;
    onPress: (x: number, y: number) => void;
    isSelected?: boolean;
}

export default function GridCell({ clue, size, x, y, onPress, isSelected }: GridCellProps) {
    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onPress(x, y)}
            style={[
                styles.container,
                { width: size, height: size },
                isSelected && styles.selected
            ]}
        >
            {clue && <ClueView clue={clue} />}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 0.5,
        borderColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center',
    },
    selected: {
        backgroundColor: '#E6F4FE',
    }
});
