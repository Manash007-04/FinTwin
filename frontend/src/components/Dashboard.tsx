"use client";

import { useEffect, useState } from "react";
import { useStore } from "../store/useStore";
import HomeScreen from "./HomeScreen";
import AnalyticsScreen from "./AnalyticsScreen";
import ChatInterface from "./ChatInterface";
import { BarChart3, Home as HomeIcon } from "lucide-react";

export default function Dashboard() {
    const { setMood } = useStore();
    const [currentView, setCurrentView] = useState<'home' | 'analytics' | 'chat'>('home');

    // Listen for custom events
    useEffect(() => {
        const handleMoodChange = (e: CustomEvent<{ mood: "happy" | "neutral" | "stressed" | "tired" }>) => {
            setMood(e.detail.mood);
        };
        window.addEventListener("avatar-mood-change", handleMoodChange as EventListener);
        return () => window.removeEventListener("avatar-mood-change", handleMoodChange as EventListener);
    }, [setMood]);

    const renderView = () => {
        switch (currentView) {
            case 'home': return <HomeScreen onNavigate={setCurrentView} />;
            case 'analytics': return <AnalyticsScreen onNavigate={setCurrentView} />;
            case 'chat': return (
                <div className="h-screen bg-ftp-canvas flex flex-col">
                    <button onClick={() => setCurrentView('home')} className="p-4 text-ftp-secondary font-bold">
                        ← Back
                    </button>
                    <div className="flex-1 p-4">
                        <ChatInterface />
                    </div>
                </div>
            );
            default: return <HomeScreen onNavigate={setCurrentView} />;
        }
    };

    return (
        <div className="min-h-screen bg-ftp-canvas font-sans">
            {renderView()}

            {/* Bottom Nav (Only visible on Home/Analytics) */}
            {currentView !== 'chat' && (
                <nav className="fixed bottom-0 w-full glass-panel border-t border-white/20 p-4 pb-6 z-40 flex justify-around items-center">
                    <button
                        onClick={() => setCurrentView('home')}
                        className={`flex flex-col items-center gap-1 ${currentView === 'home' ? 'text-ftp-primary' : 'text-ftp-secondary/50'}`}
                    >
                        <HomeIcon size={24} />
                        <span className="text-xs font-bold">Home</span>
                    </button>
                    <button
                        onClick={() => setCurrentView('analytics')}
                        className={`flex flex-col items-center gap-1 ${currentView === 'analytics' ? 'text-ftp-primary' : 'text-ftp-secondary/50'}`}
                    >
                        <BarChart3 size={24} />
                        <span className="text-xs font-bold">Analytics</span>
                    </button>
                </nav>
            )}
        </div>
    );
}
