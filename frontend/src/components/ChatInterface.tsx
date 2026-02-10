"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Mic } from "lucide-react";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
}

import { useStore } from "../store/useStore";

export default function ChatInterface() {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([
        { id: "1", role: "assistant", content: "Good morning! Spending looks consistent. Any coffee today?" },
    ]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const addTransaction = useStore((state) => state.addTransaction);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: "user",
            content: input,
        };

        setMessages((prev) => [...prev, userMsg]);
        setInput("");

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: userMsg.content,
                    healthScore: useStore.getState().healthScore
                }),
            });

            if (!res.ok) throw new Error("API Error");

            const data = await res.json();

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: data.text,
            };

            setMessages((prev) => [...prev, aiMsg]);

            // Update Mood
            window.dispatchEvent(new CustomEvent("avatar-mood-change", { detail: { mood: data.mood } }));

            // Handle Actions (e.g., logging expense)
            if (data.action && data.action.type === "log_expense") {
                // Open a modal or auto-log if amount is present (mocking auto-log for now)
                if (data.action.amount > 0) {
                    addTransaction({
                        id: Date.now().toString(),
                        amount: data.action.amount,
                        category: "General",
                        description: "Expense from chat",
                        date: new Date().toISOString(),
                    });
                }
            }

        } catch (error) {
            console.error(error);
            setMessages((prev) => [
                ...prev,
                { id: (Date.now() + 1).toString(), role: "assistant", content: "Sorry, I'm having trouble connecting to my brain right now." },
            ]);
        }
    };

    return (
        <div className="flex flex-col h-full w-full max-w-md mx-auto relative">
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
                <AnimatePresence initial={false}>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${msg.role === "user"
                                    ? "bg-ftp-primary text-white rounded-br-none"
                                    : "bg-white/60 backdrop-blur-md text-ftp-secondary rounded-bl-none border border-white/40"
                                    }`}
                            >
                                {msg.content}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-gradient-to-t from-ftp-canvas to-transparent">
                <div className="relative flex items-center bg-white/50 backdrop-blur-lg rounded-full border border-white/40 shadow-lg px-2 py-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        placeholder="Type a message..."
                        className="flex-1 bg-transparent border-none outline-none px-4 text-ftp-secondary placeholder-ftp-secondary/50"
                    />
                    <button className="p-2 text-ftp-secondary/70 hover:text-ftp-primary transition-colors">
                        <Mic size={20} />
                    </button>
                    <button
                        onClick={handleSend}
                        className="p-2 bg-ftp-primary text-white rounded-full hover:bg-ftp-primary/90 transition-transform active:scale-95 ml-1"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}
