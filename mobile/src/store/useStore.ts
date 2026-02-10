import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction, Goal, User, AvatarMood } from '../types';

interface AppState {
    token: string | null;
    user: User | null;
    mood: AvatarMood;
    healthScore: number;
    transactions: Transaction[];
    goals: Goal[];
    monthlyExpenditure: number;
    setToken: (token: string | null) => void;
    setUser: (user: User | null) => void;
    setMood: (mood: AvatarMood) => void;
    addTransaction: (t: Transaction) => void;
    logout: () => void;
}

export const useStore = create<AppState>((set, get) => ({
    token: null,
    user: null,
    mood: 'neutral',
    healthScore: 72,
    transactions: [
        { id: '1', amount: 120, category: 'Food', description: 'Dinner at café', date: new Date().toISOString() },
        { id: '2', amount: 2500, category: 'Shopping', description: 'New headphones', date: new Date().toISOString() },
        { id: '3', amount: 45, category: 'Transport', description: 'Uber ride', date: new Date().toISOString() },
        { id: '4', amount: 800, category: 'Entertainment', description: 'Concert tickets', date: new Date().toISOString() },
    ],
    goals: [
        { id: '1', name: 'Emergency Fund', target: 50000, current: 32000 },
        { id: '2', name: 'Vacation', target: 30000, current: 12000 },
        { id: '3', name: 'New Laptop', target: 80000, current: 45000 },
    ],
    monthlyExpenditure: 18500,

    setToken: async (token) => {
        if (token) {
            await AsyncStorage.setItem('fintwin_token', token);
        } else {
            await AsyncStorage.removeItem('fintwin_token');
        }
        set({ token });
    },
    setUser: (user) => set({ user }),
    setMood: (mood) => set({ mood }),
    addTransaction: (t) =>
        set((state) => ({
            transactions: [t, ...state.transactions],
            monthlyExpenditure: state.monthlyExpenditure + t.amount,
        })),
    logout: async () => {
        await AsyncStorage.removeItem('fintwin_token');
        set({ token: null, user: null });
    },
}));
