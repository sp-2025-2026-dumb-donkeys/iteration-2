import React, { useState } from 'react';
import { useSubscription } from '../components/SubscriptionGuard';
import { Crown, AlertTriangle, Check, Shield, Star, Zap } from 'lucide-react';
import { toast } from 'sonner';

const Settings = () => {
    const { isPremium, status, upgradeToPremium, cancelSubscription } = useSubscription();
    const [isLoading, setIsLoading] = useState(false);

    const handleCancelPlan = () => {
        if (confirm('Are you sure you want to cancel your Premium plan?')) {
            cancelSubscription();
        }
    };

    const handleUpgrade = () => {
        setIsLoading(true);
        // Simulate payment processing
        setTimeout(() => {
            upgradeToPremium();
            setIsLoading(false);
        }, 1500);
    };

    const handleResetData = () => {
        if (confirm('WARNING: This will delete ALL your medications and visits history. This action cannot be undone.')) {
            window.localStorage.removeItem('medications');
            window.localStorage.removeItem('doctorVisits');
            window.location.reload();
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div>
                <h2 className="heading-lg mb-2">Settings</h2>
                <p className="text-[var(--text-muted)]">Manage your account and subscription preferences.</p>
            </div>

            {/* Subscription Card */}
            <div className="card space-y-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <Crown className={isPremium ? "text-yellow-500" : "text-[var(--text-muted)]"} />
                    Subscription Plan
                </h3>

                <div className={`p-6 rounded-xl border ${isPremium ? 'border-yellow-500/20 bg-yellow-500/5' : 'border-[var(--border)] bg-[var(--bg-card-hover)]'}`}>
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h4 className="text-lg font-bold mb-1">{isPremium ? 'Premium Plan' : 'Free Plan'}</h4>
                            <p className="text-[var(--text-muted)] text-sm">
                                {isPremium ? 'You have full access to all premium features.' : 'You are currently on the basic free tier.'}
                            </p>
                            {isPremium && (
                                <div className="flex items-center gap-2 text-sm text-[var(--success)] mt-2">
                                    <Shield size={16} />
                                    <span>Active & Secure</span>
                                </div>
                            )}
                        </div>
                        {isPremium && (
                            <button onClick={handleCancelPlan} className="btn bg-[var(--danger)]/10 text-[var(--danger)] hover:bg-[var(--danger)]/20 border-transparent">
                                Cancel Subscription
                            </button>
                        )}
                    </div>

                    {!isPremium && (
                        <div className="mt-6 pt-6 border-t border-[var(--border)]">
                            <h4 className="font-bold mb-4 flex items-center gap-2 text-[var(--text-main)]">
                                <Star size={18} className="text-yellow-500" fill="currentColor" />
                                Upgrade to Premium
                            </h4>
                            <div className="grid md:grid-cols-2 gap-4 mb-8">
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-3 text-sm text-[var(--text-muted)]">
                                        <div className="p-1 rounded-full bg-[var(--primary)]/20 text-[var(--primary)] shrink-0"><Check size={12} /></div>
                                        <span>Unlimited Medication History</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-sm text-[var(--text-muted)]">
                                        <div className="p-1 rounded-full bg-[var(--primary)]/20 text-[var(--primary)] shrink-0"><Check size={12} /></div>
                                        <span>Advanced Adherence Analytics</span>
                                    </li>
                                </ul>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-3 text-sm text-[var(--text-muted)]">
                                        <div className="p-1 rounded-full bg-[var(--primary)]/20 text-[var(--primary)] shrink-0"><Check size={12} /></div>
                                        <span>Priority Doctor Visit Scheduling</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-sm text-[var(--text-muted)]">
                                        <div className="p-1 rounded-full bg-[var(--primary)]/20 text-[var(--primary)] shrink-0"><Check size={12} /></div>
                                        <span>Cloud Data Backup & Sync</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[var(--bg-dark)]/50 p-4 rounded-xl border border-[var(--border)]">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-2xl font-bold text-white">€2.50</span>
                                    <span className="text-sm text-[var(--text-muted)]">/ month</span>
                                </div>
                                <button
                                    onClick={handleUpgrade}
                                    disabled={isLoading}
                                    className="w-full sm:w-auto btn btn-primary px-8 group relative overflow-hidden"
                                >
                                    {isLoading ? (
                                        <span className="flex items-center gap-2">Processing...</span>
                                    ) : (
                                        <>
                                            <span className="relative z-10 flex items-center gap-2 font-bold">
                                                Upgrade Now <Zap size={16} fill="currentColor" />
                                            </span>
                                            <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300"></div>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Danger Zone */}
            <div className="card border-[var(--danger)]/30">
                <h3 className="text-xl font-bold text-[var(--danger)] flex items-center gap-2 mb-4">
                    <AlertTriangle size={24} />
                    Danger Zone
                </h3>
                <p className="text-[var(--text-muted)] mb-6 text-sm">
                    Irreversible actions related to your data.
                </p>

                <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-dark)] border border-[var(--border)]">
                    <div>
                        <h4 className="font-bold">Reset All Data</h4>
                        <p className="text-xs text-[var(--text-muted)]">Delete all medications and visits.</p>
                    </div>
                    <button onClick={handleResetData} className="btn btn-danger text-sm">
                        Reset Data
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Settings;
