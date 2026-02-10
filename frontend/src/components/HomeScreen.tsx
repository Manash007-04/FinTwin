"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import ThreeDAvatar from "./ThreeDAvatar";
import { motion } from "framer-motion";
import { Plus, MessageCircle, TrendingUp, Activity } from "lucide-react";
import WelcomePopup from "./WelcomePopup";

export default function HomeScreen({ onNavigate }: { onNavigate: (page: 'home' | 'analytics' | 'chat') => void }) {
    const {
        balance,
        healthScore,
        mood,
        monthlyExpenditure,
        goals,
        addGoal,
        user,
        loadMockData
    } = useStore();

    const [showGoalModal, setShowGoalModal] = useState(false);
    const [newGoalName, setNewGoalName] = useState("");
    const [newGoalAmount, setNewGoalAmount] = useState("");

    const handleCreateGoal = () => {
        if (!newGoalName || !newGoalAmount) return;
        addGoal({
            id: Date.now().toString(),
            name: newGoalName,
            targetAmount: parseFloat(newGoalAmount),
            currentAmount: 0,
            color: "bg-blue-500" // Default for now
        });
        setShowGoalModal(false);
        setNewGoalName("");
        setNewGoalAmount("");
    };

    return (
        <main className="flex min-h-screen flex-col items-center bg-ftp-canvas relative overflow-hidden pb-20">
            <WelcomePopup />

            {/* Background Aesthetics */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-ftp-primary/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-ftp-accent/20 rounded-full blur-[100px]" />

            {/* Header / Summary Card */}
            <header className="w-full max-w-md p-6 z-10">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-ftp-secondary text-lg">Good evening, {user?.fullName || "Aarav"} 👋</h2>
                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl font-bold text-ftp-primary"
                        >
                            ₹{balance.toLocaleString('en-IN')}
                        </motion.h1>
                    </div>
                    <div className="relative group">
                        <div className="absolute inset-0 bg-ftp-primary/20 rounded-full blur-md group-hover:blur-lg transition-all" />
                        <div className="relative bg-white/40 backdrop-blur-md rounded-full px-4 py-2 text-sm font-bold text-ftp-secondary border border-white/30 flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full animate-pulse ${healthScore > 50 ? "bg-green-500" : "bg-red-500"}`} />
                            Health: <span>{healthScore}%</span>
                        </div>
                    </div>
                </div>

                {/* Monthly Summary */}
                <div className="glass-card p-6 flex justify-between items-center mb-4 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div>
                        <p className="text-xs text-ftp-secondary/60 uppercase tracking-widest font-bold">Spent this Month</p>
                        <p className="text-2xl font-bold text-ftp-secondary">₹{monthlyExpenditure.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="h-10 w-[1px] bg-ftp-secondary/10" />
                    <div>
                        <p className="text-xs text-ftp-secondary/60 uppercase tracking-widest font-bold">Active Goals</p>
                        <p className="text-2xl font-bold text-ftp-secondary">{goals.length}</p>
                    </div>
                </div>

                {!user?.monthlyIncome && (
                    <button
                        onClick={() => loadMockData()}
                        className="w-full py-2 bg-ftp-primary/10 border border-ftp-primary/20 rounded-xl text-ftp-primary text-xs font-bold hover:bg-ftp-primary hover:text-white transition-all uppercase tracking-widest"
                    >
                        ⚡ Load Aarav's Demo Profile
                    </button>
                )}
            </header>

            {/* Daily Comparison Header */}
            <section className="w-full max-w-md px-6 z-10 mb-4">
                <div className="glass-panel p-4 rounded-3xl flex items-center justify-between border border-white/50 bg-white/30 backdrop-blur-2xl">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-ftp-accent/20 rounded-xl text-ftp-accent">
                            <TrendingUp size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-black text-ftp-secondary/50 tracking-tighter">Today's Spend</p>
                            <p className="font-bold text-ftp-secondary">₹1,240</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] uppercase font-black text-ftp-secondary/50 tracking-tighter">vs Daily Avg</p>
                        <p className="text-sm font-bold text-red-500">+₹420</p>
                    </div>
                </div>
            </section>

            {/* Avatar Centerpiece */}
            <section className="flex-1 flex flex-col items-center justify-center w-full z-10 -mt-6 mb-6">
                <ThreeDAvatar mood={mood} />
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ y: -2 }}
                    onClick={() => onNavigate('chat')}
                    className="mt-8 bg-ftp-primary text-white px-10 py-4 rounded-full font-black shadow-2xl flex items-center gap-3 hover:bg-ftp-primary/90 transition-all group"
                >
                    <MessageCircle size={22} className="group-hover:rotate-12 transition-transform" />
                    Talk to FinTwin
                </motion.button>
            </section>

            {/* Goals / Quick Actions */}
            <section className="w-full max-w-md px-6 z-10 mb-8">
                <div className="flex justify-between items-end mb-4">
                    <h3 className="text-ftp-secondary font-black text-lg uppercase tracking-tighter">Financial Goals</h3>
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setShowGoalModal(true)}
                        className="text-ftp-primary text-xs font-black flex items-center gap-1 uppercase tracking-widest bg-ftp-primary/10 px-3 py-1.5 rounded-full"
                    >
                        <Plus size={14} /> New
                    </motion.button>
                </div>

                <div className="space-y-4">
                    {goals.length === 0 ? (
                        <div className="glass-panel p-6 rounded-2xl text-center text-ftp-secondary/60 text-sm font-bold border-dashed border-2 border-white/20">
                            No active goals. Let's dream big!
                        </div>
                    ) : (
                        goals.map((goal, idx) => (
                            <motion.div
                                key={goal.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="glass-card p-5 rounded-3xl relative overflow-hidden group border border-white/40 shadow-sm"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Activity size={40} />
                                </div>
                                <div className="flex justify-between items-center mb-3 relative z-10">
                                    <div>
                                        <span className="font-black text-ftp-secondary text-base">{goal.name}</span>
                                        <p className="text-[10px] font-bold text-ftp-secondary/40 uppercase tracking-widest">
                                            {Math.round((goal.currentAmount / goal.targetAmount) * 100)}% Complete
                                        </p>
                                    </div>
                                    <span className="text-xs font-black text-ftp-primary bg-ftp-primary/5 px-2 py-1 rounded-md">
                                        ₹{goal.currentAmount.toLocaleString()} / ₹{goal.targetAmount.toLocaleString()}
                                    </span>
                                </div>
                                {/* Progress Bar */}
                                <div className="w-full h-3 bg-white/40 rounded-full overflow-hidden relative z-10 border border-white/20">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min(100, (goal.currentAmount / goal.targetAmount) * 100)}%` }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                        className={`h-full ${goal.color || "bg-ftp-accent"} shadow-[0_0_10px_rgba(254,127,45,0.3)]`}
                                    />
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </section>

            {/* Quick Goal Modal */}
            {showGoalModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="glass-card p-6 w-full max-w-sm"
                    >
                        <h3 className="text-lg font-bold text-ftp-secondary mb-4">Create New Goal</h3>
                        <input
                            className="w-full p-3 mb-3 rounded-xl bg-white/50 border border-white/40 focus:outline-none"
                            placeholder="Goal Name (e.g. Vacation)"
                            value={newGoalName}
                            onChange={e => setNewGoalName(e.target.value)}
                        />
                        <input
                            className="w-full p-3 mb-4 rounded-xl bg-white/50 border border-white/40 focus:outline-none"
                            placeholder="Target Amount ($)"
                            type="number"
                            value={newGoalAmount}
                            onChange={e => setNewGoalAmount(e.target.value)}
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowGoalModal(false)}
                                className="flex-1 py-3 rounded-xl font-bold text-ftp-secondary hover:bg-black/5"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateGoal}
                                className="flex-1 bg-ftp-primary text-white py-3 rounded-xl font-bold shadow-lg"
                            >
                                Create
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </main>
    );
}
