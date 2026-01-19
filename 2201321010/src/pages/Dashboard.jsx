import React from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { Pill, UserRound, ArrowRight, AlertTriangle } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

const Dashboard = () => {
    const [medications] = useLocalStorage('medications', []);
    const [visits] = useLocalStorage('doctorVisits', []);

    const upcomingVisits = visits
        .filter(v => {
            if (!v.date) return false;
            // Create a date object for the visit at midnight local time
            // We split the YYYY-MM-DD string to ensure we construct it locally, avoiding UTC shifts
            const [year, month, day] = v.date.split('-').map(Number);
            const visitDate = new Date(year, month - 1, day);

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            return visitDate >= today;
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 3);

    const lowStockMeds = medications.filter(m => m.stock < 5);

    const stats = [
        { label: 'Total Medications', value: medications.length, icon: Pill, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
        { label: 'Upcoming Visits', value: upcomingVisits.length, icon: UserRound, color: 'text-pink-400', bg: 'bg-pink-400/10' },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h2 className="heading-lg mb-2">Welcome Back, User</h2>
                <p className="text-[var(--text-muted)]">Here's your health overview for today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="card flex items-center gap-4"
                    >
                        <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <p className="text-[var(--text-muted)] text-sm">{stat.label}</p>
                            <h4 className="text-3xl font-bold">{stat.value}</h4>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Quick Actions / Alerts */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold">Needs Attention</h3>
                    </div>

                    {lowStockMeds.length > 0 ? (
                        lowStockMeds.map(med => (
                            <div key={med.id} className="p-4 rounded-xl border border-[var(--danger)] bg-[var(--danger)]/10 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <AlertTriangle className="text-[var(--danger)]" size={20} />
                                    <div>
                                        <h4 className="font-bold text-[var(--danger)]">Low Stock: {med.name}</h4>
                                        <p className="text-sm opacity-80">Only {med.stock} pills remaining</p>
                                    </div>
                                </div>
                                <NavLink to="/medications" className="btn-sm px-3 py-1.5 rounded-lg bg-[var(--bg-card)] text-xs hover:bg-white/10">Refill</NavLink>
                            </div>
                        ))
                    ) : (
                        <div className="p-6 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] text-center text-[var(--text-muted)]">
                            <CheckCircleIcon size={32} className="mx-auto mb-2 opacity-50 text-[var(--success)]" />
                            <p>Everything looks good!</p>
                        </div>
                    )}
                </div>

                {/* Upcoming Visits */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold">Upcoming Visits</h3>
                        <NavLink to="/visits" className="text-sm text-[var(--primary)] hover:underline flex items-center gap-1">
                            View All <ArrowRight size={14} />
                        </NavLink>
                    </div>

                    <div className="space-y-3">
                        {upcomingVisits.length > 0 ? (
                            upcomingVisits.map(visit => (
                                <div key={visit.id} className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] flex items-center gap-4">
                                    <div className="text-center bg-[var(--bg-card-hover)] p-2 rounded-lg min-w-[60px]">
                                        <span className="block text-xs uppercase font-bold text-[var(--primary)]">
                                            {new Date(visit.date).toLocaleString('default', { month: 'short' })}
                                        </span>
                                        <span className="block text-xl font-bold font-mono">
                                            {new Date(visit.date).getDate()}
                                        </span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold">{visit.doctorName}</h4>
                                        <p className="text-sm text-[var(--text-muted)]">{visit.specialty} • {visit.time}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-6 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] text-center text-[var(--text-muted)]">
                                <p>No upcoming visits scheduled.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

function CheckCircleIcon({ className, size }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="m9 11 3 3L22 4" /></svg>
}

export default Dashboard;
