import axios from 'axios';
import { handleResponse, handleError } from './interceptors';
import { environment } from '@environments';
import { v4 as uuidv4 } from 'uuid';
import { WalletControllerName, WalletRoutes } from '@shared/constants/wallet-routes.constants';

export const api = axios.create({
    baseURL: environment.BASE_URL,
    timeout: environment.TIMEOUT,
    headers: environment.HEADERS,
});

api.interceptors.response.use(handleResponse, handleError);

api.interceptors.request.use(
    (config) => {
        const idempotentEndpoints = [
            `${WalletControllerName}${WalletRoutes.RECHARGE}`,
            `${WalletControllerName}${WalletRoutes.PAY_CONFIRM}`
        ];
        const isIdempotentEndpoint = idempotentEndpoints.some(url => config.url?.endsWith(url));

        if (isIdempotentEndpoint && ['post', 'put', 'patch'].includes(config.method?.toLowerCase() || '')) {
            if (!config.headers['X-Idempotency-Key']) {
                const key = uuidv4();
                config.headers['X-Idempotency-Key'] = key;
                console.log(`[Idempotency] Request to ${config.url} with key: ${key}`);
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);
