import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useUser } from '@modules/client/context/UserContext';
import { walletService } from '@core/services/wallet/wallet.service';
import toast from 'react-hot-toast';
import { Modal } from '@shared/components/Modal';

interface Props {
    onClose: () => void;
    onSuccess: () => void;
}

export function RechargeModal({ onClose, onSuccess }: Props) {
    const { user } = useUser();
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            amount: '',
        },
        validationSchema: Yup.object({
            amount: Yup.number()
                .required('Amount is required')
                .positive('Must be positive')
                .min(1000, 'Minimum recharge is 1,000')
                .max(1000000, 'Maximum is 1,000,000'),
        }),
        onSubmit: async (values) => {
            if (!user) return;
            setLoading(true);
            try {
                await walletService.recharge({
                    document: user.document,
                    phone: user.phone,
                    amount: Number(values.amount),
                });
                toast.success('Recharge successful!');
                onSuccess();
            } catch (error: any) {
                toast.error(error.message || 'Recharge failed');
            } finally {
                setLoading(false);
            }
        },
    });

    return (
        <Modal title="Recharge Wallet" onClose={onClose}>
            <form onSubmit={formik.handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Amount to Recharge</label>
                    <div className="relative mt-1">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
                        <input
                            type="number"
                            min="0"
                            {...formik.getFieldProps('amount')}
                            className="block w-full rounded-md border-gray-300 pl-7 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border no-spinner"
                            placeholder="0.00"
                        />
                    </div>
                    {formik.touched.amount && formik.errors.amount && (
                        <div className="text-red-500 text-xs mt-1">{formik.errors.amount}</div>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                    {loading ? 'Processing...' : 'Confirm Recharge'}
                </button>
            </form>
        </Modal>
    );
}
