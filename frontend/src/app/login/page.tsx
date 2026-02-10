"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LoginPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [email, setEmail] = useState(searchParams.get("email") || "");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const login = useStore((state) => state.login);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            // In a real app, this would be a proper form-data request for OAuth2
            const formData = new FormData();
            formData.append("username", email); // OAuth2 expects 'username' field
            formData.append("password", password);

            const res = await fetch("/api/auth/login", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Invalid credentials");

            const data = await res.json();
            login(data.access_token, { username: email, email: email }); // Simple user mock for now
            router.push("/");
        } catch (err) {
            setError("Login failed. Check your email/password.");
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
                <h1 className="text-2xl font-bold text-center mb-6 text-ftp-secondary">Welcome Back</h1>

                {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm text-ftp-secondary/70 mb-1">Email</label>
                        <input
                            type="text"
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
                        Login
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-ftp-secondary/60">
                    New to FinTwin?{" "}
                    <Link href="/register" className="text-ftp-primary font-bold hover:underline">
                        Create Account
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
