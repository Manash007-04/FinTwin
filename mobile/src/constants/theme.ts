export const COLORS = {
    primary: '#2D3C59',     // Deep Navy
    secondary: '#94A378',   // Sage Green
    accent: '#E5BA41',      // Golden Yellow
    alert: '#D1855C',       // Terracotta
    canvas: '#F8FAF5',      // Pale Sage Background
    white: '#FFFFFF',
    glass: 'rgba(255,255,255,0.45)',
    glassBorder: 'rgba(255,255,255,0.3)',
    textMuted: 'rgba(45, 60, 89, 0.5)',
};

export const MOOD_COLORS = {
    happy: COLORS.secondary,
    stressed: COLORS.alert,
    tired: COLORS.primary,
    neutral: COLORS.accent,
};

// Backend URL - Your PC's local IP for physical device testing
export const API_BASE_URL = 'http://10.10.13.228:8001';
