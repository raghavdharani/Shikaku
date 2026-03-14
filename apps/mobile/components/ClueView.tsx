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
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
    },
});
