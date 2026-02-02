import { useEffect, useState } from 'react';
import { useUser } from '@modules/client/context/UserContext';
import { walletService } from '@core/services/wallet/wallet.service';
import { RefreshCw, CreditCard, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { RechargeModal } from '../components/RechargeModal';
import { PaymentModal } from '../components/PaymentModal';

export function DashboardScreen() {
    const { user, logout } = useUser();
    const [balance, setBalance] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    const [showRecharge, setShowRecharge] = useState(false);
    const [showPayment, setShowPayment] = useState(false);

    const fetchBalance = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const data = await walletService.checkBalance(user.document, user.phone);
            setBalance(data.balance);
        } catch (error) {
            toast.error('Session expired or user not found');
            logout();
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!user) return;
        fetchBalance();
    }, [user]);

    return (
        <div className="space-y-8">
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 text-center shadow-sm">
                <p className="text-gray-500 text-sm font-medium">Available Balance</p>
                <div className="mt-2 flex items-center justify-center gap-2">
                    <h2 className="text-4xl font-extrabold text-indigo-900">
                        {balance !== null
                            ? new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(balance)
                            : '---'}
                    </h2>
                    <button
                        onClick={fetchBalance}
                        className={`p-2 rounded-full hover:bg-indigo-100 text-indigo-600 transition-all ${loading ? 'animate-spin' : ''}`}
                        title="Refresh Balance"
                    >
                        <RefreshCw size={20} />
                    </button>
                </div>
                <p className="mt-4 text-xs text-indigo-400">User: {user?.name}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <button
                    onClick={() => setShowRecharge(true)}
                    className="flex flex-col items-center justify-center bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group"
                >
                    <div className="p-3 bg-green-100 text-green-600 rounded-full mb-3 group-hover:scale-110 transition-transform">
                        <CreditCard size={28} />
                    </div>
                    <span className="font-semibold text-gray-700">Recharge</span>
                </button>

                <button
                    onClick={() => setShowPayment(true)}
                    className="flex flex-col items-center justify-center bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group"
                >
                    <div className="p-3 bg-orange-100 text-orange-600 rounded-full mb-3 group-hover:scale-110 transition-transform">
                        <Send size={28} />
                    </div>
                    <span className="font-semibold text-gray-700">Pay</span>
                </button>
            </div>

            {showRecharge && (
                <RechargeModal
                    onClose={() => setShowRecharge(false)}
                    onSuccess={() => { setShowRecharge(false); fetchBalance(); }}
                />
            )}

            {showPayment && (
                <PaymentModal
                    onClose={() => setShowPayment(false)}
                    onSuccess={() => { setShowPayment(false); fetchBalance(); }}
                />
            )}
        </div>
    );
}
