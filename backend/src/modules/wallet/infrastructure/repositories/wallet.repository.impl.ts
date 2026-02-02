import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from '../../domain/models/wallet';
import { Transaction } from '../../domain/models/transaction';
import { WalletRepository } from '../../domain/repositories/wallet.repository';
import { WalletEntity } from '../persistence/wallet.entity';
import { TransactionEntity } from '../persistence/transaction.entity';
import { WalletMapper } from '../mappers/wallet.mapper';

@Injectable()
export class WalletRepositoryImpl implements WalletRepository {
    constructor(
        @InjectRepository(WalletEntity)
        private readonly walletRepo: Repository<WalletEntity>,
        @InjectRepository(TransactionEntity)
        private readonly transactionRepo: Repository<TransactionEntity>,
    ) { }

    async create(wallet: Wallet): Promise<void> {
        const entity = WalletMapper.toEntity(wallet);
        await this.walletRepo.save(entity);
    }

    async findByClientId(clientId: string): Promise<Wallet | null> {
        const entity = await this.walletRepo.findOne({ where: { clientId } });
        return entity ? WalletMapper.toDomain(entity) : null;
    }

    async findById(id: string): Promise<Wallet | null> {
        const entity = await this.walletRepo.findOne({ where: { id } });
        return entity ? WalletMapper.toDomain(entity) : null;
    }

    async save(wallet: Wallet): Promise<void> {
        const entity = WalletMapper.toEntity(wallet);
        await this.walletRepo.save(entity);
    }

    async saveTransaction(transaction: Transaction): Promise<void> {
        const entity = WalletMapper.toTransactionEntity(transaction);
        await this.transactionRepo.save(entity);
    }

    async findTransactionBySessionId(sessionId: string): Promise<Transaction | null> {
        const entity = await this.transactionRepo.findOne({ where: { sessionId } });
        return entity ? WalletMapper.toTransactionDomain(entity) : null;
    }

    async findTransactionById(id: string): Promise<Transaction | null> {
        const entity = await this.transactionRepo.findOne({ where: { id } });
        return entity ? WalletMapper.toTransactionDomain(entity) : null;
    }
}
