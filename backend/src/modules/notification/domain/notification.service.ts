export const NOTIFICATION_SERVICE = Symbol('NOTIFICATION_SERVICE');

export interface NotificationService {
    sendTokenEmail(email: string, token: string): Promise<void>;
}

