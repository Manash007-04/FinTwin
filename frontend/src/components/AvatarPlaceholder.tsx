"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AvatarMood } from "../types";

export default function AvatarPlaceholder({ mood }: { mood: AvatarMood }) {
    const getMoodColor = () => {
        switch (mood) {
            case 'happy': return 'from-yellow-200 to-green-200';
            case 'stressed': return 'from-red-300 to-orange-200';
            case 'tired': return 'from-blue-300 to-gray-300';
            default: return 'from-ftp-primary/20 to-ftp-accent/20';
        }
    };

    return (
        <motion.div
            animate={{
                y: [0, -10, 0],
                rotate: mood === 'stressed' ? [-1, 1, -1] : [0, 0, 0]
            }}
            transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
            }}
            className={`w-64 h-64 rounded-full bg-gradient-to-br ${getMoodColor()} flex items-center justify-center relative shadow-2xl border-4 border-white/30`}
        >
            <div className="absolute inset-0 bg-white/10 rounded-full animate-pulse-soft" />

            <AnimatePresence mode="wait">
                <motion.div
                    key={mood}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    className="text-8xl select-none"
                >
                    {mood === 'happy' ? '😊' : mood === 'stressed' ? '😰' : mood === 'tired' ? '😴' : '🤖'}
                </motion.div>
            </AnimatePresence>

            {/* Status Indicator */}
            <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-ftp-secondary border border-white/50 shadow-sm uppercase tracking-tighter">
                {mood} mode
            </div>
        </motion.div>
    );
}
