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
        backgroundColor: '#f8f8f8',
    },
    content: {
        padding: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 30,
        marginTop: 20,
    },
    section: {
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#eee',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    rowLabel: {
        fontSize: 16,
        color: '#333',
    },
    version: {
        textAlign: 'center',
        color: '#999',
        fontSize: 12,
        marginTop: 40,
    }
});
