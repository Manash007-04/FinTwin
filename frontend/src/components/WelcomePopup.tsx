"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useStore } from "@/store/useStore";

export default function WelcomePopup() {
    const [isVisible, setIsVisible] = useState(false);
    const { user, mood } = useStore();

    useEffect(() => {
        // Show popup on mount if user is logged in
        if (user) {
            setIsVisible(true);
            // Auto hide after 5 seconds
            const timer = setTimeout(() => setIsVisible(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [user]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: -50, x: "-50%" }}
                    animate={{ opacity: 1, y: 0, x: "-50%" }}
                    exit={{ opacity: 0, y: -20, x: "-50%" }}
                    className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 glass-panel px-6 py-3 rounded-full flex items-center gap-3 backdrop-blur-xl border border-white/40 shadow-2xl"
                >
                    <span className="text-2xl">
                        {mood === "happy" ? "🌟" : mood === "stressed" ? "⚠️" : "👋"}
                    </span>
                    <div>
                        <p className="text-ftp-secondary font-bold text-sm">
                            Welcome back, {user?.username || "Friend"}!
                        </p>
                        <p className="text-ftp-secondary/80 text-xs">
                            {mood === "stressed" ? "Let's get back on track." : "Ready to track some goals?"}
                        </p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
