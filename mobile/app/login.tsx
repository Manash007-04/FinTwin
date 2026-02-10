import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet,
    KeyboardAvoidingView, Platform, ActivityIndicator, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useStore } from '../src/store/useStore';
import { COLORS, API_BASE_URL } from '../src/constants/theme';

export default function LoginScreen() {
    const [email, setEmail] = useState('test@example.com');
    const [password, setPassword] = useState('Test1234');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const setToken = useStore((s) => s.setToken);
    const setUser = useStore((s) => s.setUser);

    const handleLogin = async () => {
        if (!email || !password) return Alert.alert('Error', 'Please fill all fields.');
        setIsLoading(true);
        setErrorMsg('');
        try {
            console.log(`Connecting to: ${API_BASE_URL}/api/auth/login`);
            // Backend expects OAuth2 form-data, NOT JSON
            const formBody = `username=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;
            const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formBody,
            });
            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.detail || `Login failed (${res.status})`);
            }
            const data = await res.json();
            setToken(data.access_token);
            setUser({ name: email.split('@')[0], email });
        } catch (err: any) {
            const msg = err.message || 'Could not connect to server.';
            setErrorMsg(msg);
            console.error('Login Error:', msg);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSkipLogin = () => {
        // Demo mode - bypass auth for testing
        setToken('demo_token_skip');
        setUser({ name: 'Aarav', email: 'demo@fintwin.app' });
    };

    return (
        <LinearGradient colors={[COLORS.canvas, '#E8EDE0']} style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.inner}
            >
                {/* Logo Area */}
                <View style={styles.logoArea}>
                    <Text style={styles.logoText}>Fin</Text>
                    <Text style={[styles.logoText, { color: COLORS.accent }]}>Twin</Text>
                </View>
                <Text style={styles.subtitle}>Your AI Financial Twin</Text>

                {/* Input Card */}
                <View style={styles.card}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        placeholderTextColor={COLORS.textMuted}
                    />
                    <Text style={styles.label}>Password</Text>
                    <TextInput
                        style={styles.input}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        placeholderTextColor={COLORS.textMuted}
                    />

                    {/* Error Message */}
                    {errorMsg ? (
                        <View style={styles.errorBox}>
                            <Text style={styles.errorText}>⚠️ {errorMsg}</Text>
                        </View>
                    ) : null}

                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleLogin}
                        disabled={isLoading}
                        activeOpacity={0.8}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Sign In</Text>
                        )}
                    </TouchableOpacity>

                    {/* Skip Login for Demo */}
                    <TouchableOpacity
                        style={styles.skipButton}
                        onPress={handleSkipLogin}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.skipText}>Skip Login (Demo Mode) →</Text>
                    </TouchableOpacity>
                </View>

                {/* Server Info */}
                <Text style={styles.serverInfo}>Backend: {API_BASE_URL}</Text>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    inner: { flex: 1, justifyContent: 'center', paddingHorizontal: 28 },
    logoArea: { flexDirection: 'row', justifyContent: 'center', marginBottom: 4 },
    logoText: { fontSize: 42, fontWeight: '900', color: COLORS.primary, letterSpacing: -2 },
    subtitle: { textAlign: 'center', fontSize: 14, color: COLORS.textMuted, marginBottom: 40 },
    card: {
        backgroundColor: COLORS.glass,
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: COLORS.glassBorder,
    },
    label: { fontSize: 12, fontWeight: '700', color: COLORS.primary, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 },
    input: {
        backgroundColor: 'rgba(255,255,255,0.6)',
        borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 15,
        color: COLORS.primary,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: COLORS.glassBorder,
    },
    errorBox: {
        backgroundColor: 'rgba(209,133,92,0.15)',
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(209,133,92,0.3)',
    },
    errorText: { fontSize: 12, color: COLORS.alert, fontWeight: '600' },
    button: {
        backgroundColor: COLORS.primary,
        borderRadius: 16,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 8,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: '800', letterSpacing: 1 },
    skipButton: {
        marginTop: 16,
        alignItems: 'center',
        paddingVertical: 10,
    },
    skipText: { fontSize: 13, color: COLORS.accent, fontWeight: '700' },
    serverInfo: { textAlign: 'center', fontSize: 10, color: COLORS.textMuted, marginTop: 20 },
});
