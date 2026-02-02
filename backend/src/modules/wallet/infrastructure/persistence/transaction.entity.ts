import { Entity, Column, PrimaryColumn, CreateDateColumn } from 'typeorm';
import { TransactionType, TransactionStatus } from '../../domain/models/transaction';

@Entity('transactions')
export class TransactionEntity {
    @PrimaryColumn('uuid')
    id: string;

    @Column({ name: 'wallet_id' })
    walletId: string;

    @Column({
        type: 'enum',
        enum: TransactionType,
    })
    type: TransactionType;

    @Column('decimal', { precision: 15, scale: 2 })
    amount: number;

    @Column({
        type: 'enum',
        enum: TransactionStatus,
        default: TransactionStatus.PENDING,
    })
    status: TransactionStatus;

    @Column({ name: 'session_id', nullable: true })
    sessionId: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
