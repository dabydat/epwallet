import type { AxiosResponse, AxiosError } from 'axios';

export const handleResponse = (response: AxiosResponse) => {
    return response.data;
};

export const handleError = (error: AxiosError) => {
    console.error('API Error:', error);

    let message = 'An unexpected error occurred';

    if (error.response?.data) {
        const errorData = error.response.data as any;

        if (errorData.error && typeof errorData.error === 'string') {
            message = errorData.error;
        } else if (Array.isArray(errorData.message)) {
            message = errorData.message.join(', ');
        } else if (typeof errorData.message === 'string') {
            message = errorData.message;
        }
    } else if (error.message) {
        message = error.message;
    }

    return Promise.reject(new Error(message));
};
