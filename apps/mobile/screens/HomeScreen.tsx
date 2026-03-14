import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
    const navigation = useNavigation<any>();

    return (
        <View style={styles.container}>
            <View style={styles.hero}>
                <Text style={styles.title}>Shikaku</Text>
                <Text style={styles.subtitle}>The Rectangle Puzzle</Text>
            </View>

            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('Puzzle')}
            >
                <Text style={styles.buttonText}>Start Puzzle</Text>
            </TouchableOpacity>

            <View style={styles.howToPlay}>
                <Text style={styles.sectionTitle}>How to Play</Text>
                <View style={styles.instructionRow}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.instructionText}>Each number must be in a rectangle of that same area.</Text>
                </View>
                <View style={styles.instructionRow}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.instructionText}>Each rectangle must contain exactly one number.</Text>
                </View>
                <View style={styles.instructionRow}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.instructionText}>Rectangles cannot overlap.</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 40,
    },
    hero: {
        alignItems: 'center',
        marginBottom: 60,
    },
    title: {
        fontSize: 56,
        fontWeight: '900',
        color: '#333',
        letterSpacing: -1,
    },
    subtitle: {
        fontSize: 20,
        color: '#888',
        fontWeight: '500',
        marginTop: -4,
    },
    button: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 48,
        paddingVertical: 18,
        borderRadius: 16,
        elevation: 4,
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        marginBottom: 60,
    },
    buttonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '700',
    },
    howToPlay: {
        width: '100%',
        backgroundColor: '#f9f9f9',
        padding: 24,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#444',
        marginBottom: 16,
    },
    instructionRow: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    bullet: {
        fontSize: 16,
        color: '#007AFF',
        marginRight: 10,
        fontWeight: 'bold',
    },
    instructionText: {
        fontSize: 15,
        color: '#666',
        lineHeight: 20,
        flex: 1,
    }
});
