import { useStore } from "@/store/useStore";
import { motion } from "framer-motion";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Cell, AreaChart, Area
} from 'recharts';
import { ArrowLeft, TrendingDown, TrendingUp, Wallet, PieChart as PieIcon, Activity } from "lucide-react";

export default function AnalyticsScreen({ onNavigate }: { onNavigate: (page: 'home' | 'analytics' | 'chat') => void }) {
    const { transactions, monthlyExpenditure, user } = useStore();

    // Data Transformation for Trends (Daily)
    const getDailyData = () => {
        const last30Days = [...Array(30)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toISOString().split('T')[0];
        }).reverse();

        const dailyMap: Record<string, number> = {};
        last30Days.forEach(date => dailyMap[date] = 0);

        transactions.forEach(t => {
            const date = t.date.split('T')[0];
            if (dailyMap[date] !== undefined) {
                dailyMap[date] += t.amount;
            }
        });

        return last30Days.map(date => ({
            date: date.split('-')[2], // Just the day
            amount: dailyMap[date],
            income: user?.monthlyIncome ? user.monthlyIncome / 30 : 0
        }));
    };

    const dailyData = getDailyData();

    // Category Data
    const categoryDataMap: Record<string, number> = {};
    transactions.forEach(t => {
        categoryDataMap[t.category] = (categoryDataMap[t.category] || 0) + t.amount;
    });

    const categoryData = Object.entries(categoryDataMap)
        .sort(([, a], [, b]) => b - a)
        .map(([name, value]) => ({ name, value }));

    const COLORS = ['#94A378', '#D1855C', '#E5BA41', '#2D3C59'];

    return (
        <main className="min-h-screen bg-ftp-canvas p-4 pb-24 overflow-y-auto">
            <header className="flex items-center gap-4 mb-8 pt-4">
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onNavigate('home')}
                    className="p-3 bg-white/60 backdrop-blur-md rounded-2xl shadow-sm border border-white/40"
                >
                    <ArrowLeft size={24} className="text-ftp-secondary" />
                </motion.button>
                <div>
                    <h1 className="text-2xl font-black text-ftp-secondary tracking-tight">FinAnalytics</h1>
                    <p className="text-xs text-ftp-secondary/50 font-bold uppercase tracking-widest">Aarav's Spending Story</p>
                </div>
            </header>

            {/* Total Balance Card */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-5 bg-gradient-to-br from-ftp-primary/10 to-transparent"
                >
                    <div className="flex items-center gap-2 mb-2">
                        <Wallet size={16} className="text-ftp-primary" />
                        <h2 className="text-[10px] text-ftp-secondary/60 uppercase font-black tracking-widest">Total Spent</h2>
                    </div>
                    <div className="text-2xl font-bold text-ftp-primary">₹{monthlyExpenditure.toLocaleString()}</div>
                    <div className="flex items-center gap-1 text-[10px] text-red-500 font-bold mt-1">
                        <TrendingUp size={12} /> +12.5% vs last month
                    </div>
                </motion.section>

                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card p-5"
                >
                    <div className="flex items-center gap-2 mb-2">
                        <Activity size={16} className="text-ftp-accent" />
                        <h2 className="text-[10px] text-ftp-secondary/60 uppercase font-black tracking-widest">Avg Daily</h2>
                    </div>
                    <div className="text-2xl font-bold text-ftp-secondary">₹{(monthlyExpenditure / 30).toFixed(0)}</div>
                    <div className="flex items-center gap-1 text-[10px] text-green-500 font-bold mt-1">
                        <TrendingDown size={12} /> -2.1% trend
                    </div>
                </motion.section>
            </div>

            {/* Daily Trend Chart */}
            <motion.section
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="glass-card p-6 mb-6"
            >
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-black text-ftp-secondary text-sm uppercase tracking-tighter">Daily Spending Trend</h3>
                    <div className="flex gap-2">
                        <span className="w-2 h-2 rounded-full bg-ftp-primary" />
                        <span className="w-2 h-2 rounded-full bg-ftp-primary/20" />
                    </div>
                </div>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={dailyData}>
                            <defs>
                                <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#215E61" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#215E61" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#00000010" />
                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: '#215E61' }}
                            />
                            <YAxis hide />
                            <Tooltip
                                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                                cursor={{ stroke: '#215E61', strokeWidth: 2 }}
                            />
                            <Area
                                type="monotone"
                                dataKey="amount"
                                stroke="#215E61"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorAmt)"
                                animationDuration={2000}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </motion.section>

            {/* Strategy Area Chart */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="glass-card p-6 mb-6 overflow-hidden"
            >
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="font-black text-ftp-secondary text-sm uppercase">Income vs Spending</h3>
                        <p className="text-[10px] text-ftp-secondary/50 font-bold uppercase tracking-widest">Growth Forecast</p>
                    </div>
                    <div className="flex bg-ftp-primary/5 p-1 rounded-xl">
                        <button className="px-3 py-1 text-[10px] font-black uppercase text-ftp-primary bg-white rounded-lg shadow-sm">Daily</button>
                        <button className="px-3 py-1 text-[10px] font-black uppercase text-ftp-secondary/40">Weekly</button>
                    </div>
                </div>
                <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={dailyData}>
                            <defs>
                                <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#F57C51" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#F57C51" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#00000005" />
                            <Tooltip
                                contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', background: 'rgba(255,255,255,0.9)' }}
                            />
                            <Area type="monotone" dataKey="income" stroke="#8B5CF6" fillOpacity={1} fill="url(#colorInc)" strokeWidth={2} />
                            <Area type="monotone" dataKey="amount" stroke="#F57C51" fillOpacity={1} fill="url(#colorExp)" strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-4 flex gap-4">
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-[#8B5CF6]" />
                        <span className="text-[10px] font-black text-ftp-secondary uppercase">Income</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-[#F57C51]" />
                        <span className="text-[10px] font-black text-ftp-secondary uppercase">Spent</span>
                    </div>
                </div>
            </motion.section>

            {/* Category Breakdown */}
            <div className="grid grid-cols-1 gap-6 mb-6">
                <motion.section
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="glass-card p-6"
                >
                    <div className="flex items-center gap-2 mb-6">
                        <PieIcon size={18} className="text-ftp-secondary" />
                        <h3 className="font-black text-ftp-secondary text-sm uppercase">Spending by Category</h3>
                    </div>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={categoryData} layout="vertical">
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fontWeight: 'bold', fill: '#215E61' }}
                                    width={100}
                                />
                                <Tooltip cursor={{ fill: 'transparent' }} />
                                <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={20}>
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.section>
            </div>

            {/* Transaction List */}
            <section className="mb-10">
                <h3 className="font-black text-ftp-secondary text-sm uppercase mb-4 px-2">History Highlights</h3>
                <div className="space-y-3">
                    {transactions.slice(0, 5).map((t, idx) => (
                        <motion.div
                            key={t.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 + idx * 0.05 }}
                            className="glass-card p-4 flex justify-between items-center group cursor-pointer hover:scale-[1.02] transition-transform"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-ftp-primary/10 flex items-center justify-center text-ftp-primary">
                                    {t.category[0]}
                                </div>
                                <div>
                                    <p className="font-bold text-ftp-secondary">{t.description}</p>
                                    <p className="text-[10px] text-ftp-secondary/50 font-bold uppercase">{t.category} • {new Date(t.date).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <span className="font-black text-ftp-secondary">₹{t.amount.toLocaleString()}</span>
                        </motion.div>
                    ))}
                </div>
            </section>
        </main>
    );
}
