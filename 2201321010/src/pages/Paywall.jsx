import React, { useState, useEffect } from 'react';
import { Lock, CheckCircle, Star, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const Paywall = ({ onSubscribe }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubscribe = () => {
        setIsLoading(true);
        // Simulate API call/Payment processing
        setTimeout(() => {
            setIsLoading(false);
            onSubscribe();
            toast.success('Welcome to Premium! Thank you for your support.');
        }, 1500);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-dark)] text-[var(--text-main)] p-4 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-[var(--primary)] rounded-full blur-[150px] opacity-20"></div>
            <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-[var(--secondary)] rounded-full blur-[150px] opacity-20"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-3xl p-8 shadow-2xl relative z-10"
            >
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-tr from-[var(--primary)] to-[var(--secondary)] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[var(--primary)]/20">
                        <Lock className="text-white" size={32} />
                    </div>
                    <h1 className="text-3xl font-bold mb-2">Unlock Full Access</h1>
                    <p className="text-[var(--text-muted)]">Your free trial has ended. Upgrade to continue tracking your health journey.</p>
                </div>

                <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-card-hover)]">
                        <CheckCircle className="text-[var(--success)] shrink-0" size={20} />
                        <span className="font-medium">Unlimited Medication Tracking</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-card-hover)]">
                        <CheckCircle className="text-[var(--success)] shrink-0" size={20} />
                        <span className="font-medium">Doctor Visit Scheduling</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-card-hover)]">
                        <CheckCircle className="text-[var(--success)] shrink-0" size={20} />
                        <span className="font-medium">Data Persistence & Security</span>
                    </div>
                </div>

                <div className="text-center mb-8">
                    <span className="text-4xl font-bold">€2.50</span>
                    <span className="text-[var(--text-muted)]"> / month</span>
                    <p className="text-xs text-[var(--text-muted)] mt-2">Cancel anytime. Secure payment.</p>
                </div>

                <button
                    onClick={handleSubscribe}
                    disabled={isLoading}
                    className="w-full btn btn-primary py-4 text-lg group relative overflow-hidden"
                >
                    {isLoading ? (
                        <span className="animate-pulse">Processing...</span>
                    ) : (
                        <>
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                Upgrade Now <Star size={18} fill="currentColor" />
                            </span>
                            <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300"></div>
                        </>
                    )}
                </button>
            </motion.div>
        </div>
    );
};

export default Paywall;
