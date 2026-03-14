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
                onPress={() => navigation.navigate('LevelSelect')}
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
        backgroundColor: '#F8FAFC',
        padding: 40,
    },
    hero: {
        alignItems: 'center',
        marginBottom: 60,
    },
    title: {
        fontSize: 64,
        fontWeight: '900',
        color: '#0F172A',
        letterSpacing: -2,
    },
    subtitle: {
        fontSize: 20,
        color: '#64748B',
        fontWeight: '600',
        marginTop: -8,
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    button: {
        backgroundColor: '#6366F1',
        paddingHorizontal: 48,
        paddingVertical: 20,
        borderRadius: 24,
        elevation: 8,
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        marginBottom: 60,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    howToPlay: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        padding: 28,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1E293B',
        marginBottom: 20,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    instructionRow: {
        flexDirection: 'row',
        marginBottom: 14,
        alignItems: 'flex-start',
    },
    bullet: {
        fontSize: 16,
        color: '#6366F1',
        marginRight: 12,
        fontWeight: '900',
        marginTop: -2,
    },
    instructionText: {
        fontSize: 15,
        color: '#475569',
        lineHeight: 22,
        flex: 1,
        fontWeight: '500',
    }
});
