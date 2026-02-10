import React, { useState, useRef, useEffect } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet,
    FlatList, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, SlideInRight } from 'react-native-reanimated';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useStore } from '../../src/store/useStore';
import { COLORS, API_BASE_URL } from '../../src/constants/theme';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

export default function ChatScreen() {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', role: 'assistant', content: "Hey! I'm your AI financial twin. Ask me anything about your money 💰" },
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const flatListRef = useRef<FlatList>(null);
    const { healthScore, addTransaction, setMood } = useStore();

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;
        const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
        setMessages((prev) => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const res = await fetch(`${API_BASE_URL}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMsg.content, healthScore }),
            });
            if (!res.ok) throw new Error('API Error');
            const data = await res.json();

            const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: data.text };
            setMessages((prev) => [...prev, aiMsg]);

            // Update mood
            if (data.mood) setMood(data.mood);

            // Handle auto-logged expenses
            if (data.action && data.action.type === 'log_expense' && data.action.amount > 0) {
                addTransaction({
                    id: Date.now().toString(),
                    amount: data.action.amount,
                    category: data.action.category || 'General',
                    description: data.action.description || 'Expense from chat',
                    date: new Date().toISOString(),
                });
            }
        } catch (err) {
            setMessages((prev) => [
                ...prev,
                { id: (Date.now() + 1).toString(), role: 'assistant', content: "Sorry, I can't connect to my brain right now. Check your network." },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }, [messages]);

    const renderMessage = ({ item }: { item: Message }) => (
        <Animated.View
            entering={FadeIn.duration(300)}
            style={[styles.msgRow, item.role === 'user' ? styles.msgRowUser : styles.msgRowAi]}
        >
            <View style={[styles.bubble, item.role === 'user' ? styles.bubbleUser : styles.bubbleAi]}>
                <Text style={[styles.bubbleText, item.role === 'user' && { color: '#fff' }]}>{item.content}</Text>
            </View>
        </Animated.View>
    );

    return (
        <LinearGradient colors={[COLORS.canvas, '#E8EDE0']} style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>FinTalk</Text>
                <Text style={styles.headerSub}>Powered by Llama 3.1 ⚡</Text>
            </View>

            {/* Messages */}
            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
                showsVerticalScrollIndicator={false}
            />

            {/* Typing indicator */}
            {isLoading && (
                <View style={styles.typingRow}>
                    <ActivityIndicator size="small" color={COLORS.accent} />
                    <Text style={styles.typingText}>Thinking...</Text>
                </View>
            )}

            {/* Input */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={90}
            >
                <View style={styles.inputArea}>
                    <View style={styles.inputRow}>
                        <TextInput
                            style={styles.input}
                            value={input}
                            onChangeText={setInput}
                            placeholder="Ask about your finances..."
                            placeholderTextColor={COLORS.textMuted}
                            onSubmitEditing={handleSend}
                            returnKeyType="send"
                        />
                        <TouchableOpacity style={styles.sendBtn} onPress={handleSend} activeOpacity={0.7}>
                            <FontAwesome name="send" size={16} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: 56 },
    header: { paddingHorizontal: 24, paddingBottom: 12 },
    headerTitle: { fontSize: 24, fontWeight: '900', color: COLORS.primary, letterSpacing: -1 },
    headerSub: { fontSize: 11, color: COLORS.textMuted, fontWeight: '600' },

    msgRow: { marginBottom: 10 },
    msgRowUser: { alignItems: 'flex-end' },
    msgRowAi: { alignItems: 'flex-start' },
    bubble: { maxWidth: '80%', padding: 14, borderRadius: 20 },
    bubbleUser: { backgroundColor: COLORS.primary, borderBottomRightRadius: 4 },
    bubbleAi: { backgroundColor: COLORS.glass, borderBottomLeftRadius: 4, borderWidth: 1, borderColor: COLORS.glassBorder },
    bubbleText: { fontSize: 14, lineHeight: 20, color: COLORS.primary },

    typingRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingBottom: 8, gap: 8 },
    typingText: { fontSize: 12, color: COLORS.textMuted, fontWeight: '600' },

    inputArea: { paddingHorizontal: 16, paddingBottom: Platform.OS === 'ios' ? 30 : 16, paddingTop: 8 },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.glass,
        borderRadius: 28,
        paddingHorizontal: 4,
        borderWidth: 1,
        borderColor: COLORS.glassBorder,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
    },
    input: { flex: 1, paddingHorizontal: 18, paddingVertical: 14, fontSize: 14, color: COLORS.primary },
    sendBtn: {
        width: 42, height: 42, borderRadius: 21,
        backgroundColor: COLORS.primary,
        alignItems: 'center', justifyContent: 'center',
        marginRight: 4,
    },
});
