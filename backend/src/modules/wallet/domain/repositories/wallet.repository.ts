import { Wallet } from '../models/wallet';
import { Transaction } from '../models/transaction';

export const WALLET_REPOSITORY = Symbol('WALLET_REPOSITORY');

export interface WalletRepository {
    save(wallet: Wallet): Promise<void>;
    findByClientId(clientId: string): Promise<Wallet | null>;
    findById(id: string): Promise<Wallet | null>;
    saveTransaction(transaction: Transaction): Promise<void>;
    findTransactionBySessionId(sessionId: string): Promise<Transaction | null>;
    findTransactionById(id: string): Promise<Transaction | null>;
}

