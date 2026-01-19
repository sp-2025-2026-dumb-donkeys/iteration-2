import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Pill, Stethoscope, Menu, X, Settings, Crown, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSubscription } from '../components/SubscriptionGuard';

const Layout = ({ children }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
    const { isPremium, daysLeft } = useSubscription();

    const navItems = [
        { path: '/', label: 'Overview', icon: LayoutDashboard },
        { path: '/medications', label: 'Medications', icon: Pill },
        { path: '/visits', label: 'Doctor Visits', icon: Stethoscope },
    ];

    return (
        <div className="flex h-screen bg-[var(--bg-dark)] text-[var(--text-main)] overflow-hidden">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-72 bg-[var(--bg-card)] border-r border-[var(--border)] relative z-30 shadow-2xl">
                <div className="p-8 pb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-white font-bold text-lg">
                            M
                        </div>
                        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-[var(--text-muted)]">
                            MediTrack
                        </h1>
                    </div>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    <p className="px-4 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">Menu</p>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden ${isActive
                                    ? 'bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/25'
                                    : 'text-[var(--text-muted)] hover:bg-[var(--bg-card-hover)] hover:text-white'
                                }`
                            }
                        >
                            <item.icon size={22} className="relative z-10 transition-transform group-hover:scale-110 duration-300" strokeWidth={1.5} />
                            <span className="font-medium relative z-10 text-[0.95rem]">{item.label}</span>
                            {/* Hover Glow Effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                        </NavLink>
                    ))}
                </nav>

                {/* Subscription Status Widget */}
                <div className="px-4 mb-4">
                    <div className={`p-4 rounded-2xl border ${isPremium ? 'bg-gradient-to-br from-yellow-500/10 to-transparent border-yellow-500/20' : 'bg-[var(--bg-card-hover)] border-[var(--border)]'}`}>
                        <div className="flex items-center gap-3 mb-2">
                            <div className={`p-2 rounded-lg ${isPremium ? 'bg-yellow-500/20 text-yellow-500' : 'bg-[var(--primary)]/20 text-[var(--primary)]'}`}>
                                {isPremium ? <Crown size={18} /> : <Clock size={18} />}
                            </div>
                            <div>
                                <h4 className="font-bold text-sm leading-tight">{isPremium ? 'Premium Plan' : 'Free Trial'}</h4>
                                <p className="text-xs text-[var(--text-muted)]">{isPremium ? 'Active' : `${daysLeft} days left`}</p>
                            </div>
                        </div>
                        {!isPremium && (
                            <div className="w-full h-1.5 bg-[var(--bg-dark)] rounded-full overflow-hidden mt-2">
                                <div className="h-full bg-[var(--primary)] rounded-full" style={{ width: `${(daysLeft / 7) * 100}%` }}></div>
                            </div>
                        )}
                    </div>
                </div>



                <NavLink to="/settings" className={({ isActive }) => `p-4 border-t border-[var(--border)] flex items-center gap-3 cursor-pointer transition-colors ${isActive ? 'bg-[var(--bg-card-hover)] text-white' : 'text-[var(--text-muted)] hover:text-white'}`}>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center border border-[var(--border)]">
                        <Settings size={14} />
                    </div>
                    <span className="text-sm font-medium">Settings</span>
                </NavLink>
            </aside>

            {/* Main Content Wrapper */}
            <div className="flex-1 flex flex-col h-full w-full relative">

                {/* Mobile Header */}
                <header className="md:hidden h-16 bg-[var(--bg-card)]/80 backdrop-blur-md border-b border-[var(--border)] flex items-center justify-between px-4 z-40 sticky top-0">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-white font-bold">M</div>
                        <span className="font-bold text-lg">MediTrack</span>
                    </div>
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2 rounded-xl bg-[var(--bg-card-hover)] text-[var(--text-main)] border border-[var(--border)]"
                    >
                        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </header>

                {/* Mobile Menu Overlay */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden bg-[var(--bg-card)] border-b border-[var(--border)] shadow-2xl overflow-hidden z-30 sticky top-16"
                        >
                            <nav className="p-4 space-y-2">
                                {navItems.map((item) => (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={({ isActive }) =>
                                            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                                ? 'bg-[var(--primary)] text-white'
                                                : 'text-[var(--text-muted)] hover:bg-[var(--bg-card-hover)]'
                                            }`
                                        }
                                    >
                                        <item.icon size={20} />
                                        <span className="font-medium">{item.label}</span>
                                    </NavLink>
                                ))}
                            </nav>

                            {/* Mobile Subscription Status Widget */}
                            <div className="px-4 pb-4">
                                <div className={`p-3 rounded-xl border ${isPremium ? 'bg-yellow-500/10 border-yellow-500/20' : 'bg-[var(--bg-card-hover)] border-[var(--border)]'}`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`p-1.5 rounded-lg ${isPremium ? 'bg-yellow-500/20 text-yellow-500' : 'bg-[var(--primary)]/20 text-[var(--primary)]'}`}>
                                            {isPremium ? <Crown size={16} /> : <Clock size={16} />}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-sm">{isPremium ? 'Premium Plan' : 'Free Trial'}</h4>
                                        </div>
                                        {!isPremium && <span className="text-xs font-bold text-[var(--primary)]">{daysLeft}d left</span>}
                                    </div>
                                </div>
                            </div>

                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Scrollable Main Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-10 scroll-smooth">
                    <div className="max-w-7xl mx-auto space-y-8 pb-20">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
