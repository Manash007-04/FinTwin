export interface Transaction {
    id: string;
    amount: number;
    category: string;
    description: string;
    date: string;
    isRecurring?: boolean;
}

export type AvatarMood = "happy" | "neutral" | "stressed" | "tired";

export interface Goal {
    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    deadline?: string;
    color: string;
}

export interface UserState {
    balance: number;
    healthScore: number;
    mood: AvatarMood;
    transactions: Transaction[];
    goals: Goal[];
    monthlyExpenditure: number;

    token: string | null;
    user: {
        username: string;
        email: string;
        fullName?: string;
        monthlyIncome?: number;
        spendingPersonality?: string;
    } | null;
    login: (token: string, user: { username: string; email: string }) => void;
    logout: () => void;

    addTransaction: (t: Transaction) => void;
    addGoal: (g: Goal) => void;
    updateGoal: (id: string, amount: number) => void; // Add to currentAmount
    setMood: (m: AvatarMood) => void;
    updateHealth: (score: number) => void;
    loadMockData: () => void;
}
