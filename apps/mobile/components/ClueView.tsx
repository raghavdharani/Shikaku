import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Clue } from '@shikaku/engine';

interface ClueViewProps {
    clue: Clue;
}

export default function ClueView({ clue }: ClueViewProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>{clue.value}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 22,
        fontWeight: '700',
        color: '#334155', // Sophisticated dark slate
    },
});
