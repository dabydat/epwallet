import { Amount } from '@shared/domain/value-objects/amount.vo';
import { Uuid } from '@shared/domain/value-objects/uuid.vo';

export type WalletPrimitives = {
    id: string;
    clientId: string;
    balance: number;
};

export class Wallet {
    private constructor(
        public readonly id: Uuid,
        public readonly clientId: Uuid,
        private _balance: Amount,
    ) { }

    public static create(
        id: Uuid,
        clientId: Uuid,
        balance: Amount,
    ): Wallet {
        return new Wallet(id, clientId, balance);
    }

    get balance(): number {
        return this._balance.getValue;
    }

    get balanceVO(): Amount {
        return this._balance;
    }

    credit(amount: Amount): void {
        this._balance = this._balance.add(amount);
    }

    debit(amount: Amount): void {
        this._balance = this._balance.subtract(amount);
    }

    public toPrimitives(): WalletPrimitives {
        return {
            id: this.id.getValue,
            clientId: this.clientId.getValue,
            balance: this._balance.getValue,
        };
    }
}
