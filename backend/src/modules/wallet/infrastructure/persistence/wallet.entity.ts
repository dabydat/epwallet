import { Entity, Column, PrimaryColumn, Index } from 'typeorm';

@Entity('wallets')
export class WalletEntity {
    @PrimaryColumn('uuid')
    id: string;

    @Index()
    @Column({ name: 'client_id' })
    clientId: string;

    @Column('decimal', { precision: 15, scale: 2, default: 0 })
    balance: number;
}
