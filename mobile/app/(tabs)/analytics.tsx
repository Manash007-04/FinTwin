import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useStore } from '../../src/store/useStore';
import { COLORS } from '../../src/constants/theme';

const { width } = Dimensions.get('window');
const CHART_COLORS = [COLORS.secondary, COLORS.alert, COLORS.accent, COLORS.primary];

export default function AnalyticsScreen() {
    const { transactions, monthlyExpenditure, healthScore } = useStore();

    // Build category breakdown
    const categoryData = useMemo(() => {
        const map: Record<string, number> = {};
        transactions.forEach((t) => {
            map[t.category] = (map[t.category] || 0) + t.amount;
        });
        return Object.entries(map)
            .sort(([, a], [, b]) => b - a)
            .map(([name, value], i) => ({ name, value, color: CHART_COLORS[i % CHART_COLORS.length] }));
    }, [transactions]);

    const totalSpend = categoryData.reduce((sum, c) => sum + c.value, 0);

    return (
        <LinearGradient colors={[COLORS.canvas, '#E8EDE0']} style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

                {/* Header */}
                <Animated.View entering={FadeInDown.delay(100)} style={styles.header}>
                    <Text style={styles.title}>Analytics</Text>
                    <Text style={styles.subtitle}>Your spending breakdown</Text>
                </Animated.View>

                {/* Overview Card */}
                <Animated.View entering={FadeInDown.delay(200)} style={styles.overviewCard}>
                    <LinearGradient colors={[COLORS.primary, '#3D5080']} style={styles.overviewGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                        <View style={styles.overviewRow}>
                            <View>
                                <Text style={styles.overviewLabel}>Total Spending</Text>
                                <Text style={styles.overviewValue}>₹{totalSpend.toLocaleString()}</Text>
                            </View>
                            <View style={styles.scoreBadge}>
                                <Text style={styles.scoreValue}>{healthScore}</Text>
                                <Text style={styles.scoreLabel}>Health</Text>
                            </View>
                        </View>
                    </LinearGradient>
                </Animated.View>

                {/* Category Breakdown */}
                <Animated.View entering={FadeInDown.delay(300)}>
                    <Text style={styles.sectionTitle}>Category Breakdown</Text>
                    {categoryData.map((cat, i) => {
                        const percent = totalSpend > 0 ? Math.round((cat.value / totalSpend) * 100) : 0;
                        return (
                            <View key={cat.name} style={styles.catCard}>
                                <View style={styles.catHeader}>
                                    <View style={[styles.catDot, { backgroundColor: cat.color }]} />
                                    <Text style={styles.catName}>{cat.name}</Text>
                                    <Text style={styles.catPercent}>{percent}%</Text>
                                </View>
                                <View style={styles.catBarBg}>
                                    <Animated.View
                                        entering={FadeInDown.delay(400 + i * 100)}
                                        style={[styles.catBarFill, { width: `${percent}%`, backgroundColor: cat.color }]}
                                    />
                                </View>
                                <Text style={styles.catAmount}>₹{cat.value.toLocaleString()}</Text>
                            </View>
                        );
                    })}
                </Animated.View>

                {/* Financial Strategy Tips */}
                <Animated.View entering={FadeInDown.delay(600)}>
                    <Text style={styles.sectionTitle}>Financial Strategy 🧠</Text>
                    <View style={styles.tipCard}>
                        <Text style={styles.tipEmoji}>💡</Text>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.tipTitle}>Spending Insight</Text>
                            <Text style={styles.tipDesc}>
                                {healthScore > 70
                                    ? "You're doing great! Consider investing surplus into your goals."
                                    : healthScore > 40
                                        ? "Watch your discretionary spending. Small cuts can add up."
                                        : "Critical zone! Prioritize essentials and defer all non-essential purchases."}
                            </Text>
                        </View>
                    </View>
                </Animated.View>

            </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: 60 },
    header: { paddingHorizontal: 24, marginBottom: 20 },
    title: { fontSize: 28, fontWeight: '900', color: COLORS.primary, letterSpacing: -1 },
    subtitle: { fontSize: 13, color: COLORS.textMuted, fontWeight: '600' },

    overviewCard: { marginHorizontal: 16, marginBottom: 24, borderRadius: 24, overflow: 'hidden', elevation: 8, shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.25, shadowRadius: 16 },
    overviewGradient: { padding: 24, borderRadius: 24 },
    overviewRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    overviewLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
    overviewValue: { color: '#fff', fontSize: 36, fontWeight: '900', letterSpacing: -1, marginTop: 4 },
    scoreBadge: { alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 10 },
    scoreValue: { color: '#fff', fontSize: 28, fontWeight: '900' },
    scoreLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },

    sectionTitle: { fontSize: 18, fontWeight: '800', color: COLORS.primary, paddingHorizontal: 24, marginBottom: 12 },

    catCard: { marginHorizontal: 16, marginBottom: 10, backgroundColor: COLORS.glass, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: COLORS.glassBorder },
    catHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 },
    catDot: { width: 10, height: 10, borderRadius: 5 },
    catName: { flex: 1, fontSize: 13, fontWeight: '700', color: COLORS.primary },
    catPercent: { fontSize: 13, fontWeight: '800', color: COLORS.accent },
    catBarBg: { height: 6, backgroundColor: 'rgba(45,60,89,0.08)', borderRadius: 3, marginBottom: 6 },
    catBarFill: { height: 6, borderRadius: 3 },
    catAmount: { fontSize: 11, color: COLORS.textMuted, fontWeight: '600' },

    tipCard: { flexDirection: 'row', marginHorizontal: 16, marginBottom: 12, backgroundColor: COLORS.glass, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: COLORS.glassBorder, gap: 12 },
    tipEmoji: { fontSize: 28 },
    tipTitle: { fontSize: 14, fontWeight: '700', color: COLORS.primary, marginBottom: 4 },
    tipDesc: { fontSize: 12, lineHeight: 18, color: COLORS.textMuted },
});
