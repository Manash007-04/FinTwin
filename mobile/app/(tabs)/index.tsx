import React from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useStore } from '../../src/store/useStore';
import { COLORS, MOOD_COLORS } from '../../src/constants/theme';
import AnimatedAvatar from '../../src/components/AnimatedAvatar';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { user, healthScore, mood, transactions, goals, monthlyExpenditure } = useStore();

  const moodEmoji = { happy: '😎', stressed: '😤', tired: '😴', neutral: '🙂' };
  const moodLabel = { happy: 'Boss Mode', stressed: 'Survival Mode', tired: 'Low Power', neutral: 'Stable' };

  return (
    <LinearGradient colors={[COLORS.canvas, '#E8EDE0']} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

        {/* Header */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.header}>
          <Text style={styles.greeting}>Good {new Date().getHours() < 12 ? 'Morning' : 'Evening'},</Text>
          <Text style={styles.name}>{user?.name || 'Aarav'} 👋</Text>
        </Animated.View>

        {/* Animated Avatar */}
        <Animated.View entering={FadeInDown.delay(150)} style={styles.avatarContainer}>
          <AnimatedAvatar mood={mood} size={160} />
        </Animated.View>

        {/* Health Score Card */}
        <Animated.View entering={FadeInDown.delay(200)} style={styles.healthCard}>
          <LinearGradient
            colors={[COLORS.primary, '#3D5080']}
            style={styles.healthGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.healthRow}>
              <View>
                <Text style={styles.healthLabel}>Financial Health</Text>
                <Text style={styles.healthScore}>{healthScore}</Text>
                <Text style={styles.healthSub}>/100</Text>
              </View>
              <View style={styles.moodBadge}>
                <Text style={{ fontSize: 40 }}>{moodEmoji[mood]}</Text>
                <Text style={styles.moodText}>{moodLabel[mood]}</Text>
              </View>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressBg}>
              <View
                style={[styles.progressFill, {
                  width: `${healthScore}%`,
                  backgroundColor: healthScore > 70 ? COLORS.secondary : healthScore > 40 ? COLORS.accent : COLORS.alert,
                }]}
              />
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Quick Stats */}
        <Animated.View entering={FadeInDown.delay(300)} style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Monthly Spend</Text>
            <Text style={styles.statValue}>₹{monthlyExpenditure.toLocaleString()}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Transactions</Text>
            <Text style={styles.statValue}>{transactions.length}</Text>
          </View>
        </Animated.View>

        {/* Goals Section */}
        <Animated.View entering={FadeInUp.delay(400)}>
          <Text style={styles.sectionTitle}>Financial Goals 🎯</Text>
          {goals.map((goal, i) => {
            const progress = Math.round((goal.current / goal.target) * 100);
            return (
              <View key={goal.id} style={styles.goalCard}>
                <View style={styles.goalHeader}>
                  <Text style={styles.goalName}>{goal.name}</Text>
                  <Text style={styles.goalPercent}>{progress}%</Text>
                </View>
                <View style={styles.goalBarBg}>
                  <View style={[styles.goalBarFill, { width: `${progress}%` }]} />
                </View>
                <Text style={styles.goalSub}>
                  ₹{goal.current.toLocaleString()} / ₹{goal.target.toLocaleString()}
                </Text>
              </View>
            );
          })}
        </Animated.View>

        {/* Recent Transactions */}
        <Animated.View entering={FadeInUp.delay(500)}>
          <Text style={styles.sectionTitle}>Recent Activity 📊</Text>
          {transactions.slice(0, 5).map((t) => (
            <View key={t.id} style={styles.txCard}>
              <View style={styles.txIcon}>
                <Text style={{ fontSize: 18 }}>
                  {t.category === 'Food' ? '🍔' : t.category === 'Shopping' ? '🛍️' : t.category === 'Transport' ? '🚗' : '🎬'}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.txDesc}>{t.description}</Text>
                <Text style={styles.txCat}>{t.category}</Text>
              </View>
              <Text style={styles.txAmount}>-₹{t.amount}</Text>
            </View>
          ))}
        </Animated.View>

      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60 },
  header: { paddingHorizontal: 24, marginBottom: 20 },
  greeting: { fontSize: 14, color: COLORS.textMuted, fontWeight: '600' },
  name: { fontSize: 28, fontWeight: '900', color: COLORS.primary, letterSpacing: -1 },

  avatarContainer: { alignItems: 'center', marginBottom: 20 },

  healthCard: { marginHorizontal: 16, marginBottom: 20, borderRadius: 24, overflow: 'hidden', elevation: 8, shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.25, shadowRadius: 16 },
  healthGradient: { padding: 24, borderRadius: 24 },
  healthRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  healthLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
  healthScore: { color: '#fff', fontSize: 48, fontWeight: '900', letterSpacing: -2 },
  healthSub: { color: 'rgba(255,255,255,0.5)', fontSize: 14, fontWeight: '600', marginTop: -8 },
  moodBadge: { alignItems: 'center' },
  moodText: { color: 'rgba(255,255,255,0.8)', fontSize: 10, fontWeight: '700', marginTop: 4, textTransform: 'uppercase' },
  progressBg: { height: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 3, marginTop: 16 },
  progressFill: { height: 6, borderRadius: 3 },

  statsRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 12, marginBottom: 24 },
  statCard: { flex: 1, backgroundColor: COLORS.glass, borderRadius: 20, padding: 18, borderWidth: 1, borderColor: COLORS.glassBorder },
  statLabel: { fontSize: 11, color: COLORS.textMuted, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  statValue: { fontSize: 22, fontWeight: '900', color: COLORS.primary, marginTop: 4 },

  sectionTitle: { fontSize: 18, fontWeight: '800', color: COLORS.primary, paddingHorizontal: 24, marginBottom: 12 },

  goalCard: { marginHorizontal: 16, marginBottom: 12, backgroundColor: COLORS.glass, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: COLORS.glassBorder },
  goalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  goalName: { fontSize: 14, fontWeight: '700', color: COLORS.primary },
  goalPercent: { fontSize: 14, fontWeight: '800', color: COLORS.accent },
  goalBarBg: { height: 6, backgroundColor: 'rgba(45,60,89,0.1)', borderRadius: 3 },
  goalBarFill: { height: 6, borderRadius: 3, backgroundColor: COLORS.accent },
  goalSub: { fontSize: 11, color: COLORS.textMuted, marginTop: 6 },

  txCard: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginBottom: 10, backgroundColor: COLORS.glass, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: COLORS.glassBorder },
  txIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(45,60,89,0.08)', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  txDesc: { fontSize: 13, fontWeight: '600', color: COLORS.primary },
  txCat: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  txAmount: { fontSize: 14, fontWeight: '800', color: COLORS.alert },
});
