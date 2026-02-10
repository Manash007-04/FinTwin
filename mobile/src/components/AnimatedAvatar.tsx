import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    withSpring,
    withSequence,
    Easing,
    interpolate,
} from 'react-native-reanimated';
import { COLORS, MOOD_COLORS } from '../constants/theme';
import { AvatarMood } from '../types';

interface Props {
    mood: AvatarMood;
    size?: number;
}

export default function AnimatedAvatar({ mood, size = 180 }: Props) {
    const float = useSharedValue(0);
    const pulse = useSharedValue(1);
    const glow = useSharedValue(0);

    const moodColor = MOOD_COLORS[mood] || COLORS.accent;

    // Floating animation
    useEffect(() => {
        float.value = withRepeat(
            withTiming(1, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
            -1,
            true
        );
        pulse.value = withRepeat(
            withSequence(
                withTiming(1.06, { duration: 1500 }),
                withTiming(1, { duration: 1500 })
            ),
            -1,
            true
        );
        glow.value = withRepeat(
            withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
            -1,
            true
        );
    }, []);

    const containerStyle = useAnimatedStyle(() => ({
        transform: [
            { translateY: interpolate(float.value, [0, 1], [0, -12]) },
            { scale: pulse.value },
        ],
    }));

    const glowStyle = useAnimatedStyle(() => ({
        opacity: interpolate(glow.value, [0, 1], [0.3, 0.7]),
        transform: [{ scale: interpolate(glow.value, [0, 1], [0.9, 1.15]) }],
    }));

    const moodEmoji = { happy: '😎', stressed: '😤', tired: '😴', neutral: '🙂' };

    return (
        <View style={[styles.wrapper, { width: size, height: size }]}>
            {/* Glow Ring */}
            <Animated.View
                style={[
                    styles.glowRing,
                    {
                        width: size * 1.2,
                        height: size * 1.2,
                        borderRadius: size * 0.6,
                        borderColor: moodColor,
                        backgroundColor: `${moodColor}15`,
                    },
                    glowStyle,
                ]}
            />

            {/* Outer Ring */}
            <Animated.View
                style={[
                    styles.outerRing,
                    {
                        width: size,
                        height: size,
                        borderRadius: size / 2,
                        borderColor: moodColor,
                    },
                    containerStyle,
                ]}
            >
                {/* Inner Circle with Gradient effect */}
                <View
                    style={[
                        styles.innerCircle,
                        {
                            width: size * 0.85,
                            height: size * 0.85,
                            borderRadius: (size * 0.85) / 2,
                            backgroundColor: `${moodColor}20`,
                        },
                    ]}
                >
                    {/* Face/Emoji */}
                    <Animated.Text style={[styles.emoji, { fontSize: size * 0.4 }]}>
                        {moodEmoji[mood]}
                    </Animated.Text>
                </View>

                {/* Orbiting dots */}
                {[0, 1, 2].map((i) => (
                    <View
                        key={i}
                        style={[
                            styles.orbitDot,
                            {
                                backgroundColor: moodColor,
                                top: i === 0 ? 5 : undefined,
                                bottom: i === 1 ? 10 : undefined,
                                left: i === 2 ? 5 : undefined,
                                right: i === 0 ? 15 : i === 1 ? 5 : undefined,
                            },
                        ]}
                    />
                ))}
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
    },
    glowRing: {
        position: 'absolute',
        borderWidth: 2,
    },
    outerRing: {
        borderWidth: 3,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
        backgroundColor: 'rgba(255,255,255,0.5)',
    },
    innerCircle: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    emoji: {
        textAlign: 'center',
    },
    orbitDot: {
        position: 'absolute',
        width: 8,
        height: 8,
        borderRadius: 4,
        opacity: 0.6,
    },
});
