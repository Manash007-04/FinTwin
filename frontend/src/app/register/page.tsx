"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useStore } from "@/store/useStore";

export default function RegisterPage() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.detail || "Registration failed");
            }

            // Success! Attempt Auto-Login
            const loginRes = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({ username: email, password }), // OAuth2 expects username field to be email often
            });

            if (loginRes.ok) {
                const data = await loginRes.json();
                useStore.getState().login(data.access_token, { username, email }); // Update store with user object
                router.push("/"); // Go straight to dashboard
            } else {
                // improved feedback if auto-login fails
                router.push(`/login?email=${encodeURIComponent(email)}`);
            }

        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-ftp-canvas p-4">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-ftp-primary/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-ftp-accent/20 rounded-full blur-[100px]" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-8 w-full max-w-sm relative z-10"
            >
                <h1 className="text-2xl font-bold text-center mb-6 text-ftp-secondary">Join FinTwin</h1>

                {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label className="block text-sm text-ftp-secondary/70 mb-1">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/50 border border-white/40 focus:outline-none focus:ring-2 focus:ring-ftp-primary/50 text-ftp-secondary"
                            placeholder="Username"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-ftp-secondary/70 mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/50 border border-white/40 focus:outline-none focus:ring-2 focus:ring-ftp-primary/50 text-ftp-secondary"
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-ftp-secondary/70 mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/50 border border-white/40 focus:outline-none focus:ring-2 focus:ring-ftp-primary/50 text-ftp-secondary"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-ftp-primary text-white font-bold py-3 rounded-xl hover:bg-ftp-primary/90 transition-transform active:scale-95 shadow-lg"
                    >
                        Sign Up
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-ftp-secondary/60">
                    Already have an account?{" "}
                    <Link href="/login" className="text-ftp-primary font-bold hover:underline">
                        Login
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
