import { api } from '@shared/services/api/api';
import type { Wallet } from '@types';
import type { PaymentInterface, RechargeInterface } from './interfaces';
import { WalletControllerName, WalletRoutes } from '@shared/constants/wallet-routes.constants';

export const walletService = {
    checkBalance: async (document: string, phone: string) => {
        const response = await api.get<{ balance: number }>(`${WalletControllerName}${WalletRoutes.BALANCE}`, {
            params: { document, phone },
        });
        return response.data;
    },

    recharge: async (data: RechargeInterface) => {
        const response = await api.post<Wallet>(`${WalletControllerName}${WalletRoutes.RECHARGE}`, data);
        return response.data;
    },

    requestPayment: async (data: PaymentInterface) => {
        const response = await api.post<{ sessionId: string; token: string }>(`${WalletControllerName}${WalletRoutes.PAY_REQUEST}`, data);
        return response.data;
    },

    confirmPayment: async (sessionId: string, token: string) => {
        await api.post(`${WalletControllerName}${WalletRoutes.PAY_CONFIRM}`, { sessionId, token });
    }
};  
