import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserState, Transaction, AvatarMood, Goal } from '../types';

export const useStore = create<UserState>()(
    persist(
        (set) => ({
            balance: 1250.00, // Starting demo balance
            healthScore: 85,
            mood: 'neutral',
            transactions: [],
            goals: [],
            monthlyExpenditure: 0,
            token: null,
            user: null,

            login: (token: string, user: { username: string; email: string }) => set({ token, user }),
            logout: () => set({ token: null, user: null }),

            addGoal: (goal: Goal) => set((state) => ({ goals: [...state.goals, goal] })),

            updateGoal: (id: string, amount: number) => set((state) => ({
                goals: state.goals.map(g => g.id === id ? { ...g, currentAmount: g.currentAmount + amount } : g)
            })),

            addTransaction: (transaction: Transaction) => set((state) => {
                const newBalance = state.balance - transaction.amount;
                // Update Monthly Expenditure
                const currentMonth = new Date().getMonth();
                const transDate = new Date(transaction.date);
                let newMonthlyExpenditure = state.monthlyExpenditure;

                if (transDate.getMonth() === currentMonth) {
                    newMonthlyExpenditure += transaction.amount;
                }

                // Simple health calculation: start 100, -1 for every $10 spent (just for demo logic)
                // Real logic would be more complex
                const newHealth = Math.max(0, Math.min(100, state.healthScore - (transaction.amount > 50 ? 5 : 1)));

                // Mood Logic
                let newMood = state.mood;
                if (newHealth < 40) newMood = 'stressed';
                else if (newHealth > 80) newMood = 'happy';
                else newMood = 'neutral';

                return {
                    transactions: [transaction, ...state.transactions],
                    balance: newBalance,
                    monthlyExpenditure: newMonthlyExpenditure,
                    healthScore: newHealth,
                    mood: newMood
                };
            }),

            setMood: (mood: AvatarMood) => set({ mood }),
            updateHealth: (score: number) => set((state) => {
                let newMood = state.mood;
                if (score < 40) newMood = 'stressed';
                else if (score > 80) newMood = 'happy';
                else newMood = 'neutral';
                return { healthScore: score, mood: newMood };
            }),

            loadMockData: () => {
                const now = new Date();
                const mockTransactions: Transaction[] = [];
                const categories = [
                    { name: 'Food', total: 6200, count: 12 },
                    { name: 'Transport', total: 2100, count: 8 },
                    { name: 'Rent/PG', total: 7000, count: 1 },
                    { name: 'Entertainment', total: 1800, count: 4 },
                    { name: 'Misc', total: 1350, count: 5 }
                ];

                let idCounter = 1;
                categories.forEach(cat => {
                    let remaining = cat.total;
                    for (let i = 0; i < cat.count; i++) {
                        const amount = i === cat.count - 1 ? remaining : Math.floor(remaining / (cat.count - i + 1) * (0.8 + Math.random() * 0.4));
                        remaining -= amount;

                        // Spread over last 30 days
                        const date = new Date();
                        date.setDate(now.getDate() - Math.floor(Math.random() * 30));

                        mockTransactions.push({
                            id: `mock-${idCounter++}`,
                            amount,
                            category: cat.name,
                            description: `${cat.name} Expense`,
                            date: date.toISOString()
                        });
                    }
                });

                // Add 2-3 impulse spikes
                for (let i = 0; i < 3; i++) {
                    const date = new Date();
                    date.setDate(now.getDate() - Math.floor(Math.random() * 30));
                    mockTransactions.push({
                        id: `spike-${i}`,
                        amount: Math.floor(500 + Math.random() * 1000),
                        category: 'Entertainment',
                        description: 'Impulse Buy',
                        date: date.toISOString()
                    });
                }

                set({
                    user: {
                        username: 'aarav',
                        email: 'aarav@fintwin.com',
                        fullName: 'Aarav',
                        monthlyIncome: 35000,
                        spendingPersonality: 'Tries to control but slips sometimes'
                    },
                    balance: 35000 - 18450,
                    monthlyExpenditure: 18450,
                    healthScore: 62,
                    mood: 'neutral',
                    transactions: mockTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
                    goals: [
                        { id: 'g1', name: 'New iPhone', targetAmount: 70000, currentAmount: 12000, color: 'bg-blue-500' },
                        { id: 'g2', name: 'Goa Trip', targetAmount: 25000, currentAmount: 18000, color: 'bg-green-500' }
                    ]
                });
            }
        }),
        {
            name: 'fintwin-storage', // unique name
            partialize: (state) => ({
                balance: state.balance,
                healthScore: state.healthScore,
                mood: state.mood,
                transactions: state.transactions,
                goals: state.goals,
                monthlyExpenditure: state.monthlyExpenditure,
                token: state.token,
                user: state.user
            }),
        }
    )
);
