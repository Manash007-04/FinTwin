export type AvatarMood = 'happy' | 'stressed' | 'tired' | 'neutral';

export interface Transaction {
    id: string;
    amount: number;
    category: string;
    description: string;
    date: string;
}

export interface Goal {
    id: string;
    name: string;
    target: number;
    current: number;
}

export interface User {
    name: string;
    email: string;
}
