import { Injectable, Logger } from '@nestjs/common';
import { NotificationService } from '../domain/notification.service';

@Injectable()
export class ConsoleNotificationService implements NotificationService {
    private readonly logger = new Logger(ConsoleNotificationService.name);

    async sendTokenEmail(email: string, token: string): Promise<void> {
        this.logger.log(`[EMAIL SENT] To: ${email} | Token: ${token}`);
    }
}
