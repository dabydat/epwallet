import { Inject, Injectable } from '@nestjs/common';
import { type WalletRepository, WALLET_REPOSITORY } from '../domain/repositories/wallet.repository';
import { type ClientRepository, CLIENT_REPOSITORY } from '@modules/client/domain/repositories/client.repository';
import { type NotificationService, NOTIFICATION_SERVICE } from '@modules/notification/domain/notification.service';
import { type TokenRepository, TOKEN_REPOSITORY } from '../domain/repositories/token.repository';
import { RequestPaymentDto } from './dto/request-payment.dto';
import { Transaction, TransactionStatus, TransactionType } from '../domain/models/transaction';
import { ClientNotFoundException } from '@shared/domain/exceptions/client-not-found.exception';
import { PhoneDoesNotMatchException } from '@shared/domain/exceptions/phone-does-not-match.exception';
import { InsufficientFundsException } from '../domain/exceptions/insufficient-funds.exception';
import { WalletNotFoundException } from '../domain/exceptions/wallet-not-found.exception';
import { Amount } from '@shared/domain/value-objects/amount.vo';
import { Uuid } from '@shared/domain/value-objects/uuid.vo';
import { DocumentVO } from '@shared/domain/value-objects/document.vo';
import { PhoneNumber } from '@shared/domain/value-objects/phone-number.vo';
import { randomInt } from 'crypto';

@Injectable()
export class RequestPaymentUseCase {
    constructor(
        @Inject(WALLET_REPOSITORY)
        private readonly walletRepo: WalletRepository,
        @Inject(CLIENT_REPOSITORY)
        private readonly clientRepo: ClientRepository,
        @Inject(NOTIFICATION_SERVICE)
        private readonly notificationService: NotificationService,
        @Inject(TOKEN_REPOSITORY)
        private readonly tokenRepo: TokenRepository,
    ) { }

    async execute(dto: RequestPaymentDto): Promise<{ sessionId: string }> {
        const client = await this.clientRepo.findByDocument(DocumentVO.create(dto.document));
        if (!client) throw new ClientNotFoundException();

        const dtoPhone = PhoneNumber.create(dto.phone);
        if (!client.phone.equals(dtoPhone)) throw new PhoneDoesNotMatchException();

        const wallet = await this.walletRepo.findByClientId(client.id.getValue);
        if (!wallet) throw new WalletNotFoundException();

        const amount = Amount.create(dto.amount);

        if (wallet.balanceVO.isLessThan(amount)) {
            throw new InsufficientFundsException();
        }

        const sessionId = Uuid.create().getValue;
        const token = this.generateToken();

        const transaction = Transaction.create(
            Uuid.create(),
            wallet.id,
            TransactionType.PURCHASE,
            amount,
            TransactionStatus.PENDING,
            sessionId
        );
        await this.walletRepo.saveTransaction(transaction);

        const TOKEN_EXPIRATION_SECONDS = 120;
        await this.tokenRepo.saveToken(sessionId, token, TOKEN_EXPIRATION_SECONDS);

        await this.notificationService.sendTokenEmail(client.email.getValue, token);

        return { sessionId };
    }

    private generateToken(): string {
        return randomInt(100000, 1000000).toString();
    }
}
