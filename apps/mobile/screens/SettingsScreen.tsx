import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch } from 'react-native';

export default function SettingsScreen() {
    const [darkMode, setDarkMode] = React.useState(false);
    const [showTimer, setShowTimer] = React.useState(true);
    const [vibration, setVibration] = React.useState(true);

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.title}>Settings</Text>

            <View style={styles.section}>
                <View style={styles.row}>
                    <Text style={styles.rowLabel}>Dark Mode</Text>
                    <Switch value={darkMode} onValueChange={setDarkMode} />
                </View>

                <View style={styles.row}>
                    <Text style={styles.rowLabel}>Show Timer</Text>
                    <Switch value={showTimer} onValueChange={setShowTimer} />
                </View>

                <View style={styles.row}>
                    <Text style={styles.rowLabel}>Vibration</Text>
                    <Switch value={vibration} onValueChange={setVibration} />
                </View>
            </View>

            <Text style={styles.version}>Version 0.1.0</Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    content: {
        padding: 24,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        color: '#0F172A',
        letterSpacing: -1,
        marginBottom: 32,
        marginTop: 40,
    },
    section: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        overflow: 'hidden',
        marginBottom: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    rowLabel: {
        fontSize: 16,
        color: '#1E293B',
        fontWeight: '600',
    },
    version: {
        textAlign: 'center',
        color: '#94A3B8',
        fontSize: 12,
        marginTop: 40,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 1,
    }
});
