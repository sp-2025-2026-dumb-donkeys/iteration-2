import React, { createContext, useContext, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { toast } from 'sonner';

// Create Context to share subscription state
const SubscriptionContext = createContext(null);

export const useSubscription = () => useContext(SubscriptionContext);

const SubscriptionGuard = ({ children }) => {
    const [subscription, setSubscription] = useLocalStorage('subscription', {
        startDate: null,
        status: 'trial', // 'trial', 'premium', 'cancelled'
    });

    useEffect(() => {
        // Initialize if new
        if (!subscription.startDate) {
            setSubscription({
                ...subscription,
                startDate: Date.now(),
                status: 'trial'
            });
        }
    }, [subscription, setSubscription]);

    const upgradeToPremium = () => {
        setSubscription({
            ...subscription,
            status: 'premium',
            startDate: Date.now()
        });
        toast.success('Upgraded to Premium!');
    };

    const cancelSubscription = () => {
        setSubscription({
            ...subscription,
            status: 'cancelled'
        });
        toast.success('Subscription cancelled.');
    };

    const daysLeft = Math.max(0, Math.ceil((7 * 24 * 60 * 60 * 1000 - (Date.now() - subscription.startDate)) / (1000 * 60 * 60 * 24)));
    const isPremium = subscription.status === 'premium';
    // Logic: Always allow access, just track status

    const value = {
        isPremium,
        daysLeft,
        status: subscription.status,
        upgradeToPremium,
        cancelSubscription
    };

    return (
        <SubscriptionContext.Provider value={value}>
            {children}
        </SubscriptionContext.Provider>
    );
};

export default SubscriptionGuard;
