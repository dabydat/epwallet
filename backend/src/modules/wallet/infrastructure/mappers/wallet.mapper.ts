import { WalletEntity } from '../persistence/wallet.entity';
import { TransactionEntity } from '../persistence/transaction.entity';
import { Wallet, WalletPrimitives } from '../../domain/models/wallet';
import { Transaction, TransactionPrimitives, TransactionType, TransactionStatus } from '../../domain/models/transaction';
import { Amount } from '@shared/domain/value-objects/amount.vo';
import { BooleanVO } from '@shared/domain/value-objects/boolean-vo';
import { Uuid } from '@shared/domain/value-objects/uuid.vo';
import { UtcDate } from '@shared/domain/value-objects/utc-date';

export class WalletMapper {
    static toDomain(entity: WalletEntity): Wallet {
        return Wallet.create(
            Uuid.create(entity.id),
            Uuid.create(entity.clientId),
            Amount.fromDecimal(entity.balance),
        );
    }

    static toEntity(domain: Wallet): WalletEntity {
        const primitives: WalletPrimitives = domain.toPrimitives();
        const entity = new WalletEntity();
        entity.id = primitives.id;
        entity.clientId = primitives.clientId;
        entity.balance = domain.balanceVO.toDecimal();
        return entity;
    }

    static toTransactionDomain(entity: TransactionEntity): Transaction {
        return Transaction.create(
            Uuid.create(entity.id),
            Uuid.create(entity.walletId),
            entity.type as TransactionType,
            Amount.fromDecimal(entity.amount),
            entity.status as TransactionStatus,
            entity.sessionId,
            entity.createdAt ? UtcDate.create(entity.createdAt) : undefined,
        );
    }

    static toTransactionEntity(domain: Transaction): TransactionEntity {
        const primitives: TransactionPrimitives = domain.toPrimitives();
        const entity = new TransactionEntity();
        entity.id = primitives.id;
        entity.walletId = primitives.walletId;
        entity.type = primitives.type;
        entity.amount = domain.amount.toDecimal();
        entity.status = primitives.status;
        entity.sessionId = primitives.sessionId || '';
        entity.createdAt = domain.createdAt ? domain.createdAt.getValue : new Date();
        return entity;
    }

    static toResponse(domain: Wallet) {
        const primitives: WalletPrimitives = domain.toPrimitives();
        return {
            id: primitives.id,
            clientId: primitives.clientId,
            balance: domain.balanceVO.toDecimal(),
        };
    }
}
