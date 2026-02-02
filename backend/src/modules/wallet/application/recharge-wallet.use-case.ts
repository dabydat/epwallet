import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Wallet } from '../domain/models/wallet';
import { Transaction, TransactionType, TransactionStatus } from '../domain/models/transaction';
import { UNIT_OF_WORK, type UnitOfWork } from '../domain/repositories/unit-of-work.interface';
import { type ClientRepository, CLIENT_REPOSITORY } from '@modules/client/domain/repositories/client.repository';
import { RechargeWalletDto } from './dto/recharge-wallet.dto';
import { WalletEntity } from '../infrastructure/persistence/wallet.entity';
import { TransactionEntity } from '../infrastructure/persistence/transaction.entity';
import { ClientNotFoundException } from '@shared/domain/exceptions/client-not-found.exception';
import { PhoneDoesNotMatchException } from '@shared/domain/exceptions/phone-does-not-match.exception';
import { Amount } from '@shared/domain/value-objects/amount.vo';
import { WalletMapper } from '../infrastructure/mappers/wallet.mapper';
import { Uuid } from '@shared/domain/value-objects/uuid.vo';
import { DocumentVO } from '@shared/domain/value-objects/document.vo';
import { UtcDate } from '@shared/domain/value-objects/utc-date';
import { PhoneNumber } from '@shared/domain/value-objects/phone-number.vo';
import { WalletNotFoundException } from '../domain/exceptions/wallet-not-found.exception';

@Injectable()
export class RechargeWalletUseCase {
    constructor(
        @Inject(UNIT_OF_WORK)
        private readonly uow: UnitOfWork,
        @Inject(CLIENT_REPOSITORY)
        private readonly clientRepo: ClientRepository,
    ) { }

    async execute(dto: RechargeWalletDto): Promise<Wallet> {
        return this.uow.execute(async (manager) => {
            const client = await this.clientRepo.findByDocument(DocumentVO.create(dto.document));
            if (!client) throw new ClientNotFoundException();

            const dtoPhone = PhoneNumber.create(dto.phone);
            if (!client.phone.equals(dtoPhone)) throw new PhoneDoesNotMatchException();

            const walletEntityRepo = manager.getRepository(WalletEntity);
            const transactionEntityRepo = manager.getRepository(TransactionEntity);

            let walletEntity = await walletEntityRepo.findOne({
                where: { clientId: client.id.getValue }
            });

            if (!walletEntity) {
                walletEntity = walletEntityRepo.create({
                    id: Uuid.create().getValue,
                    clientId: client.id.getValue,
                    balance: 0
                });
                await walletEntityRepo.save(walletEntity);
            }

            const lockedWallet = await walletEntityRepo.findOne({
                where: { id: walletEntity.id },
                lock: { mode: 'pessimistic_write' }
            });

            if (!lockedWallet) throw new WalletNotFoundException();

            const wallet = WalletMapper.toDomain(lockedWallet);
            wallet.credit(Amount.create(dto.amount));

            await walletEntityRepo.save(WalletMapper.toEntity(wallet));

            const transaction = Transaction.create(
                Uuid.create(),
                wallet.id,
                TransactionType.RECHARGE,
                Amount.create(dto.amount),
                TransactionStatus.CONFIRMED,
                undefined,
                UtcDate.now()
            );

            await transactionEntityRepo.save(WalletMapper.toTransactionEntity(transaction));

            return wallet;
        });
    }
}
