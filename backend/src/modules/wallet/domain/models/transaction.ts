import { Amount } from '@shared/domain/value-objects/amount.vo';
import { Uuid } from '@shared/domain/value-objects/uuid.vo';
import { UtcDate } from '@shared/domain/value-objects/utc-date';

export enum TransactionType {
    RECHARGE = 'RECHARGE',
    PURCHASE = 'PURCHASE',
}

export enum TransactionStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    FAILED = 'FAILED',
}

export type TransactionPrimitives = {
    id: string;
    walletId: string;
    type: TransactionType;
    amount: number;
    status: TransactionStatus;
    sessionId?: string;
    createdAt?: string;
};

export class Transaction {
    constructor(
        public readonly id: Uuid,
        public readonly walletId: Uuid,
        public readonly type: TransactionType,
        public readonly amount: Amount,
        public readonly status: TransactionStatus,
        public readonly sessionId?: string,
        public readonly createdAt?: UtcDate,
    ) { }

    public static create(
        id: Uuid,
        walletId: Uuid,
        type: TransactionType,
        amount: Amount,
        status: TransactionStatus,
        sessionId?: string,
        createdAt?: UtcDate,
    ): Transaction {
        return new Transaction(
            id,
            walletId,
            type,
            amount,
            status,
            sessionId,
            createdAt,
        );
    }

    public toPrimitives(): TransactionPrimitives {
        return {
            id: this.id.getValue,
            walletId: this.walletId.getValue,
            type: this.type,
            amount: this.amount.getValue,
            status: this.status,
            sessionId: this.sessionId,
            createdAt: this.createdAt?.toISOString,
        };
    }
}
