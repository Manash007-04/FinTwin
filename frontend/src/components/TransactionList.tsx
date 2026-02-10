"use client";

import { useStore } from "../store/useStore";
import { motion } from "framer-motion";

export default function TransactionList() {
    const transactions = useStore((state) => state.transactions);

    if (transactions.length === 0) {
        return (
            <div className="text-center text-ftp-secondary/50 py-4 text-sm">
                No transactions yet. Tell FinTwin what you spent!
            </div>
        );
    }

    return (
        <div className="w-full max-w-md mt-4 space-y-2 px-4">
            <h3 className="text-ftp-secondary font-bold text-sm uppercase tracking-wider mb-2">Recent Activity</h3>
            {transactions.slice(0, 5).map((t, index) => ( // Show last 5
                <motion.div
                    key={t.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex justify-between items-center p-3 bg-white/40 backdrop-blur-sm rounded-xl border border-white/30 shadow-sm"
                >
                    <div className="flex flex-col">
                        <span className="text-ftp-secondary font-medium">{t.description}</span>
                        <span className="text-xs text-ftp-secondary/60">{t.category} • {new Date(t.date).toLocaleDateString()}</span>
                    </div>
                    <span className="font-bold text-ftp-primary">-${t.amount.toFixed(2)}</span>
                </motion.div>
            ))}
        </div>
    );
}
