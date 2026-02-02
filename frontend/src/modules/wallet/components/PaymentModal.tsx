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

export enum StepEnum {
    REQUEST = 'REQUEST',
    CONFIRM = 'CONFIRM',
}

export function PaymentModal({ onClose, onSuccess }: Props) {
    const { user } = useUser();
    const [step, setStep] = useState<StepEnum>(StepEnum.REQUEST);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const requestFormik = useFormik({
        initialValues: { amount: '' },
        validationSchema: Yup.object({
            amount: Yup.number().required('Amount is required').positive().min(100, 'Minimum payment is 100'),
        }),
        onSubmit: async (values) => {
            if (!user) return;
            setLoading(true);
            try {
                const data = await walletService.requestPayment({
                    document: user.document,
                    phone: user.phone,
                    amount: Number(values.amount),
                });
                setSessionId(data.sessionId);
                setStep(StepEnum.CONFIRM);
            } catch (error: any) {
                toast.error(error.message || 'Request failed');
            } finally {
                setLoading(false);
            }
        },
    });

    const confirmFormik = useFormik({
        initialValues: { token: '' },
        validationSchema: Yup.object({
            token: Yup.string().required().length(6, 'Must be 6 digits'),
        }),
        onSubmit: async (values) => {
            if (!sessionId) return;
            setLoading(true);
            try {
                await walletService.confirmPayment(sessionId, values.token);
                toast.success('Payment confirmed successfully!');
                onSuccess();
            } catch (error: any) {
                toast.error(error.message || 'Confirmation failed');
            } finally {
                setLoading(false);
            }
        },
    });

    return (
        <Modal title={step === StepEnum.REQUEST ? 'Make Payment' : 'Confirm Payment'} onClose={onClose}>
            {step === StepEnum.REQUEST ? (
                <form onSubmit={requestFormik.handleSubmit} className="space-y-4">
                    <p className="text-sm text-gray-500">Enter amount to pay. We will send a confirmation token to your email.</p>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Amount</label>
                        <div className="relative mt-1">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
                            <input
                                type="number"
                                min="0"
                                {...requestFormik.getFieldProps('amount')}
                                className="block w-full rounded-md border-gray-300 pl-7 shadow-sm focus:border-orange-500 focus:ring-orange-500 p-2 border no-spinner"
                            />
                        </div>
                        {requestFormik.touched.amount && requestFormik.errors.amount && (
                            <div className="text-red-500 text-xs mt-1">{requestFormik.errors.amount}</div>
                        )}
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-orange-600 text-white py-2 rounded-lg font-semibold hover:bg-orange-700 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Sending Request...' : 'Request Token'}
                    </button>
                </form>
            ) : (
                <form onSubmit={confirmFormik.handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Enter 6-digit Token</label>
                        <input
                            type="text"
                            maxLength={6}
                            {...confirmFormik.getFieldProps('token')}
                            className="mt-1 block w-full text-center tracking-[0.5em] text-2xl font-mono rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 p-2 border"
                            placeholder="000000"
                        />
                        {confirmFormik.touched.token && confirmFormik.errors.token && (
                            <div className="text-red-500 text-xs mt-1">{confirmFormik.errors.token}</div>
                        )}
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-orange-600 text-white py-2 rounded-lg font-semibold hover:bg-orange-700 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Verifying...' : 'Confirm Payment'}
                    </button>
                </form>
            )}
        </Modal>
    );
}
