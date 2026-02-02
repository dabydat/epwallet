import { Inject, Injectable } from '@nestjs/common';
import { ConfirmPaymentDto } from './dto/confirm-payment.dto';
import { UNIT_OF_WORK, type UnitOfWork } from '../domain/repositories/unit-of-work.interface';
import { TOKEN_REPOSITORY, type TokenRepository } from '../domain/repositories/token.repository';
import { WalletEntity } from '../infrastructure/persistence/wallet.entity';
import { TransactionEntity } from '../infrastructure/persistence/transaction.entity';
import { Wallet } from '../domain/models/wallet';
import { Transaction, TransactionStatus, TransactionType } from '../domain/models/transaction';
import { WalletMapper } from '../infrastructure/mappers/wallet.mapper';
import { Uuid } from '@shared/domain/value-objects/uuid.vo';
import { Amount } from '@shared/domain/value-objects/amount.vo';
import { WalletNotFoundException } from '../domain/exceptions/wallet-not-found.exception';
import { UtcDate } from '@shared/domain/value-objects/utc-date';
import { ExpiredTokenException } from '../domain/exceptions/expired-token.exception';
import { TransactionNotFoundException } from '../domain/exceptions/transaction-not-found.exception';

@Injectable()
export class ConfirmPaymentUseCase {
    constructor(
        @Inject(UNIT_OF_WORK)
        private readonly uow: UnitOfWork,
        @Inject(TOKEN_REPOSITORY)
        private readonly tokenRepo: TokenRepository,
    ) { }

    async execute(dto: ConfirmPaymentDto): Promise<Wallet> {
        const storedData = await this.tokenRepo.getToken(dto.sessionId);
        if (!storedData || storedData.token !== dto.token) throw new ExpiredTokenException();

        return this.uow.execute(async (manager) => {
            const walletEntityRepo = manager.getRepository(WalletEntity);
            const transactionEntityRepo = manager.getRepository(TransactionEntity);

            const transactionEntity = await transactionEntityRepo.findOne({
                where: { sessionId: dto.sessionId }
            });

            if (!transactionEntity) throw new TransactionNotFoundException();

            const lockedWalletEntity = await walletEntityRepo.findOne({
                where: { id: transactionEntity.walletId },
                lock: { mode: 'pessimistic_write' }
            });

            if (!lockedWalletEntity) throw new WalletNotFoundException();

            const wallet = WalletMapper.toDomain(lockedWalletEntity);
            const amount = Amount.fromDecimal(transactionEntity.amount);
            wallet.debit(amount);

            await walletEntityRepo.save(WalletMapper.toEntity(wallet));

            const confirmedTransaction = Transaction.create(
                Uuid.create(transactionEntity.id),
                Uuid.create(transactionEntity.walletId),
                transactionEntity.type as TransactionType,
                amount,
                TransactionStatus.CONFIRMED,
                transactionEntity.sessionId,
                UtcDate.create(transactionEntity.createdAt)
            );

            await transactionEntityRepo.save(WalletMapper.toTransactionEntity(confirmedTransaction));

            await this.tokenRepo.deleteToken(dto.sessionId);

            return wallet;
        });
    }
}
