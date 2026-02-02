import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useUser } from '../context/UserContext';
import { clientService } from '@core/services/client/client.service';
import { walletService } from '@core/services/wallet/wallet.service';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export function IdentificationScreen() {
    const { setUser } = useUser();
    const navigate = useNavigate();
    const [isRegistering, setIsRegistering] = useState(false);

    const formik = useFormik({
        initialValues: {
            document: '',
            phone: '',
            name: '',
            email: '',
        },
        validationSchema: Yup.object({
            document: Yup.string().required('Document is required'),
            phone: Yup.string().required('Phone is required'),
            name: isRegistering ? Yup.string().required('Name is required') : Yup.string(),
            email: isRegistering ? Yup.string().email('Invalid email').required('Email required') : Yup.string(),
        }),
        onSubmit: async (values) => {
            try {
                if (isRegistering) {
                    const newUser = await clientService.register(values);
                    setUser(newUser);
                    toast.success('Registration successful!');
                    navigate('/dashboard');
                } else {
                    try {
                        await walletService.checkBalance(values.document, values.phone);
                        setUser({
                            id: 'session-id',
                            document: values.document,
                            phone: values.phone,
                            name: 'Customer',
                            email: ''
                        });
                        toast.success('Welcome back!');
                        navigate('/dashboard');
                    } catch (error: any) {
                        if (error.message?.includes('Client not found')) {
                            toast.error('Client not found. Please register.');
                            setIsRegistering(true);
                        } else {
                            throw error;
                        }
                    }
                }
            } catch (error: any) {
                toast.error(error.message || 'Operation failed');
            }
        },
    });

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800">{isRegistering ? 'Create Account' : 'Welcome'}</h2>
                <p className="text-gray-500 text-sm">Enter your details to access your wallet</p>
            </div>

            <form onSubmit={formik.handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Document ID</label>
                    <input
                        type="text"
                        {...formik.getFieldProps('document')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                    />
                    {formik.touched.document && formik.errors.document && (
                        <div className="text-red-500 text-xs mt-1">{formik.errors.document}</div>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input
                        type="text"
                        {...formik.getFieldProps('phone')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                    />
                    {formik.touched.phone && formik.errors.phone && (
                        <div className="text-red-500 text-xs mt-1">{formik.errors.phone}</div>
                    )}
                </div>

                {isRegistering && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input
                                type="text"
                                {...formik.getFieldProps('name')}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                            />
                            {formik.touched.name && formik.errors.name && (
                                <div className="text-red-500 text-xs mt-1">{formik.errors.name}</div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                {...formik.getFieldProps('email')}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                            />
                            {formik.touched.email && formik.errors.email && (
                                <div className="text-red-500 text-xs mt-1">{formik.errors.email}</div>
                            )}
                        </div>
                    </>
                )}

                <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                    {isRegistering ? 'Register' : 'Continue'}
                </button>

                {!isRegistering && (
                    <button
                        type="button"
                        onClick={() => setIsRegistering(true)}
                        className="w-full text-sm text-indigo-600 hover:text-indigo-500 text-center"
                    >
                        New here? Create an account
                    </button>
                )}

                {isRegistering && (
                    <button
                        type="button"
                        onClick={() => setIsRegistering(false)}
                        className="w-full text-sm text-gray-500 hover:text-gray-700 text-center"
                    >
                        Already have an account? Log in
                    </button>
                )}
            </form>
        </div>
    );
}
